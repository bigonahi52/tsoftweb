/* ماژول مشترکِ خودکفا — لایه‌ی داده (Upstash Redis روی Vercel) + ابزارهای امنیتی + نشست‌ها
   ─ این فایل با پیشوند «_» در پوشه‌ی api قرار دارد تا Vercel آن را به‌عنوان
     «کد مشترک» بشناسد و همیشه همراه توابع API باندل کند؛ بنابراین هیچ‌گاه
     دچار ERR_MODULE_NOT_FOUND نمی‌شود.
   ─ همه‌ی داده‌ها در Upstash Redis ابری ذخیره می‌شوند؛ یعنی بین همه‌ی
     دستگاه‌ها و همه‌ی کاربران مشترک‌اند و با پاک‌شدن مرورگر از بین نمی‌روند.
   ─ هر دو مجموعه متغیر محیطی را پشتیبانی می‌کند:
       • KV_REST_API_URL / KV_REST_API_TOKEN        (اتصال از نوع Vercel KV)
        • UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (اتصال از نوع Upstash Redis)
   ─ از REST API خود Upstash استفاده می‌کند و به هیچ کتابخانه‌ی npm نیازی ندارد؛
     بنابراین بدون تغییر در package.json روی Vercel build و اجرا می‌شود. */
import { randomBytes, scryptSync } from "crypto";

/* ── کلاینت REST برای Upstash Redis (بدون نیاز به کتابخانه) ── */
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

type KvClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, opts?: { ex?: number }) => Promise<void>;
  del: (key: string) => Promise<void>;
};

/** اجرای یک دستور Redis از طریق REST APIِ آپ‌استش و برگرداندن نتیجه */
async function upstashCommand<T = unknown>(args: (string | number)[]): Promise<T | null> {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Upstash REST error: HTTP ${res.status}`);
  const data = (await res.json()) as { result: T | null };
  return data.result ?? null;
}

/* ── کلاینت Redis ابری — فقط اگر متغیرهای محیطی موجود باشند ساخته می‌شود ── */
export const kv: KvClient | null =
  REDIS_URL && REDIS_TOKEN
    ? {
        get: <T = unknown>(key: string) => upstashCommand<T>(["GET", key]),
        set: (key: string, value: unknown, opts?: { ex?: number }) =>
          upstashCommand(
            opts?.ex
              ? ["SET", key, String(value), "EX", String(opts.ex)]
              : ["SET", key, String(value)]
          ).then(() => undefined),
        del: (key: string) => upstashCommand(["DEL", key]).then(() => undefined),
      }
    : null;

/** کدام مجموعه متغیر پیدا شد (برای گزارش /api/status — بدون افشای مقدار) */
export const redisSource: "kv" | "upstash" | "none" = process.env.KV_REST_API_URL
  ? "kv"
  : process.env.UPSTASH_REDIS_REST_URL
    ? "upstash"
    : "none";

/* ── انواع ── */
export type DbUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  salt: string;
  passHash: string;
  role: "user" | "admin";
  createdAt: number;
};
export type PubUser = Omit<DbUser, "salt" | "passHash">;

export const pub = (u: DbUser): PubUser => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

/* ── پاسخ‌ها ── */
export const ok = (data: unknown) => Response.json(data);
export const err = (message: string, status = 400) => Response.json({ error: message }, { status });

/** بررسی فعال بودن دیتابیس ابری (Upstash Redis) */
export const kvOk = () => kv !== null;

/* ── ابزارهای امنیتی ── */
export const uid = () => randomBytes(6).toString("hex") + Date.now().toString(36);
export const hashPass = (pass: string, salt: string) => scryptSync(pass, salt, 32).toString("hex");
export const verifyPass = (pass: string, salt: string, stored: string) => {
  try {
    return hashPass(pass, salt) === stored;
  } catch {
    return false;
  }
};
/** یکدست‌سازی شماره/نام‌کاربری (ارقام فارسی ← لاتین، حذف فاصله و خط) */
export const normPhone = (p: string) =>
  String(p || "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s\-()]/g, "");

/* ── ابزارهای JSON روی Redis ──
   مقادیر به‌صورت صریح JSON.stringify/parse می‌شوند تا:
   ۱) با داده‌های ذخیره‌شده توسط نسخه‌های قبلی (@vercel/kv) سازگار بمانند
   ۲) رفتار در همه‌ی نسخه‌های کلاینت یکسان و قابل‌پیش‌بینی باشد */
export async function jget<T>(key: string, fallback: T): Promise<T> {
  if (!kv) return fallback;
  try {
    const raw = await kv.get<string>(key);
    if (raw === null || raw === undefined) return fallback;
    if (typeof raw !== "string") return raw as T; /* داده‌های قدیمی که از قبل آبجکت‌اند */
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}
export async function jset(key: string, value: unknown, ttlSec?: number) {
  if (!kv) return;
  try {
    const json = JSON.stringify(value);
    if (ttlSec) await kv.set(key, json, { ex: ttlSec });
    else await kv.set(key, json);
  } catch {
    /* ignore */
  }
}
export async function jdel(key: string) {
  if (!kv) return;
  try {
    await kv.del(key);
  } catch {
    /* ignore */
  }
}

/** تست واقعی اتصال — نوشتن/خواندن/حذف یک کلید موقت؛ نتیجه با پیام خطای واقعی
    (بدون افشای توکن) برمی‌گردد تا ریشه‌ی مشکلات اتصال قابل تشخیص باشد. */
export async function pingRedis(): Promise<{ ok: boolean; ms?: number; error?: string }> {
  if (!kv) return { ok: false, error: "کلاینت Redis ساخته نشده — متغیرهای محیطی (KV_REST_API_URL / KV_REST_API_TOKEN) در Runtime دیده نمی‌شوند." };
  const t0 = Date.now();
  try {
    const key = "tsoft:ping";
    const val = `ok-${Date.now()}`;
    await kv.set(key, val, { ex: 30 });
    const back = await kv.get<string>(key);
    await kv.del(key);
    if (back !== val) return { ok: false, error: "داده‌ی خوانده‌شده با داده‌ی نوشته‌شده متفاوت است." };
    return { ok: true, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/* ── کاربران ── */
export const allUserIds = () => jget<string[]>("users", []);
export const getUser = (id: string) => jget<DbUser | null>(`u:${id}`, null);
export async function userByPhone(phone: string): Promise<DbUser | null> {
  const ids = await allUserIds();
  for (const id of ids) {
    const u = await getUser(id);
    if (u && u.phone === phone) return u;
  }
  return null;
}
export async function saveUser(u: DbUser) {
  const ids = await allUserIds();
  if (!ids.includes(u.id)) await jset("users", [...ids, u.id]);
  await jset(`u:${u.id}`, u);
}

/* ── مدیر ثابت ──
   نام کاربری و رمز مدیر از متغیرهای محیطی خوانده می‌شود و اگر تنظیم نشده
   باشد، مقادیر پیش‌فرض زیر استفاده می‌شود. برای تغییر، در داشبورد Vercel
   متغیرهای ADMIN_PHONE و ADMIN_PASSWORD را تنظیم کنید. */
export const ADMIN_PHONE = process.env.ADMIN_PHONE || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tsoft20";
const ADMIN_SALT = "tsoft-admin-fixed-salt"; /* نمک ثابت تا هش مدیر پایدار بماند */

/** اگر حساب مدیر وجود نداشته باشد، آن را با نام کاربری و رمز ثابت می‌سازد */
export async function ensureAdmin() {
  const existing = await userByPhone(ADMIN_PHONE);
  if (existing) return;
  const admin: DbUser = {
    id: "admin",
    firstName: "مدیر",
    lastName: "سایت",
    phone: ADMIN_PHONE,
    salt: ADMIN_SALT,
    passHash: hashPass(ADMIN_PASSWORD, ADMIN_SALT),
    role: "admin",
    createdAt: Date.now(),
  };
  await saveUser(admin);
}

/* ── نشست‌ها (توکن) ── */
const SESSION_TTL = 60 * 60 * 24 * 30; /* ۳۰ روز */
export async function newSession(userId: string) {
  const token =
    Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("") +
    Date.now().toString(36);
  await jset(`s:${token}`, userId, SESSION_TTL);
  return token;
}
export function tokenOf(req: Request): string {
  const auth = req.headers.get("authorization") || "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}
export async function sessionUser(req: Request): Promise<DbUser | null> {
  const token = tokenOf(req);
  if (!token) return null;
  const userId = await jget<string | null>(`s:${token}`, null);
  if (!userId) return null;
  return getUser(userId);
}
export async function endSession(req: Request) {
  const token = tokenOf(req);
  if (token) await jdel(`s:${token}`);
}

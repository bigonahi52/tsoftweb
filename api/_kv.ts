/* ماژول مشترکِ خودکفا — لایه‌ی داده (Vercel KV) + ابزارهای امنیتی + نشست‌ها
   ─ این فایل با پیشوند «_» در پوشه‌ی api قرار دارد تا Vercel آن را به‌عنوان
     «کد مشترک» بشناسد و همیشه همراه توابع API باندل کند؛ بنابراین هیچ‌گاه
     دچار ERR_MODULE_NOT_FOUND نمی‌شود.
   ─ همه‌ی داده‌ها در Vercel KV (Redis ابری) ذخیره می‌شوند؛ یعنی بین همه‌ی
     دستگاه‌ها و همه‌ی کاربران مشترک‌اند و با پاک‌شدن مرورگر از بین نمی‌روند. */
import { kv } from "@vercel/kv";
import { randomBytes, scryptSync } from "crypto";

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

/** بررسی فعال بودن Vercel KV */
export const kvOk = () => Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

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

/* ── ابزارهای JSON روی KV ── */
export async function jget<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await kv.get<T>(key);
    return v === null || v === undefined ? fallback : v;
  } catch {
    return fallback;
  }
}
export async function jset(key: string, value: unknown, ttlSec?: number) {
  try {
    if (ttlSec) await kv.set(key, value, { ex: ttlSec });
    else await kv.set(key, value);
  } catch {
    /* ignore */
  }
}
export async function jdel(key: string) {
  try {
    await kv.del(key);
  } catch {
    /* ignore */
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

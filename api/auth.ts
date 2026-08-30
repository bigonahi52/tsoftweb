/* احراز هویت: ثبت‌نام، ورود، جلسه‌ی من، خروج، ویرایش، تغییر رمز
   ─ کاملاً self-contained: هیچ وابستگی به پوشه‌ی server/ ندارد تا دچار
     ERR_MODULE_NOT_FOUND نشود. فقط به Vercel KV و متغیرهای محیطی وابسته است. */
import { kv } from "@vercel/kv";
import { randomBytes, scryptSync } from "crypto";

type DbUser = {
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
type PubUser = Omit<DbUser, "salt" | "passHash">;

const pub = (u: DbUser): PubUser => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

/* ── پاسخ‌ها ── */
const ok = (data: unknown) => Response.json(data);
const err = (message: string, status = 400) => Response.json({ error: message }, { status });

/* ── ابزارها ── */
const uid = () => randomBytes(6).toString("hex") + Date.now().toString(36);
const hashPass = (pass: string, salt: string) => scryptSync(pass, salt, 32).toString("hex");
const verifyPass = (pass: string, salt: string, stored: string) => {
  try {
    return hashPass(pass, salt) === stored;
  } catch {
    return false;
  }
};
const normPhone = (p: string) =>
  String(p || "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s\-()]/g, "");

/* ── JSON روی KV ── */
async function jget<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await kv.get<T>(key);
    return v === null || v === undefined ? fallback : v;
  } catch {
    return fallback;
  }
}
async function jset(key: string, value: unknown, ttlSec?: number) {
  try {
    if (ttlSec) await kv.set(key, value, { ex: ttlSec });
    else await kv.set(key, value);
  } catch {
    /* ignore */
  }
}
async function jdel(key: string) {
  try {
    await kv.del(key);
  } catch {
    /* ignore */
  }
}

/* ── کاربران ── */
const allUserIds = () => jget<string[]>("users", []);
const getUser = (id: string) => jget<DbUser | null>(`u:${id}`, null);
async function userByPhone(phone: string): Promise<DbUser | null> {
  const ids = await allUserIds();
  for (const id of ids) {
    const u = await getUser(id);
    if (u && u.phone === phone) return u;
  }
  return null;
}
async function saveUser(u: DbUser) {
  const ids = await allUserIds();
  if (!ids.includes(u.id)) await jset("users", [...ids, u.id]);
  await jset(`u:${u.id}`, u);
}

/* ── نشست‌ها (توکن) ── */
const SESSION_TTL = 60 * 60 * 24 * 30; // ۳۰ روز
async function newSession(userId: string) {
  const token =
    Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("") +
    Date.now().toString(36);
  await jset(`s:${token}`, userId, SESSION_TTL);
  return token;
}
function tokenOf(req: Request): string {
  const auth = req.headers.get("authorization") || "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}
async function sessionUser(req: Request): Promise<DbUser | null> {
  const token = tokenOf(req);
  if (!token) return null;
  const userId = await jget<string | null>(`s:${token}`, null);
  if (!userId) return null;
  return getUser(userId);
}

export default async function handler(req: Request) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN)
    return err("بک‌اند فعال نیست — در داشبورد Vercel یک فروشگاه KV (Redis) اضافه کنید.", 503);

  /* جلسه‌ی فعلی */
  if (req.method === "GET") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    return ok({ user: pub(u) });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const action = body.action;

  if (action === "register") {
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const phone = normPhone(body.phone);
    const email = (body.email || "").trim().toLowerCase() || undefined;
    const password = String(body.password || "");
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    if (phone.length < 6) return err("شماره تماس معتبر نیست");
    if (password.length < 4) return err("رمز عبور باید حداقل ۴ حرف باشد");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("ایمیل معتبر نیست");
    if (await userByPhone(phone)) return err("این شماره قبلاً ثبت شده — وارد شوید");

    const ids = await allUserIds();
    const salt = uid().slice(0, 12);
    const isFirst = ids.length === 0;
    const user: DbUser = {
      id: uid(),
      firstName,
      lastName,
      phone,
      email,
      salt,
      passHash: hashPass(password, salt),
      /* اولین کاربر ثبت‌نام‌کننده، مدیر می‌شود */
      role: isFirst || phone === (process.env.ADMIN_PHONE || "") ? "admin" : "user",
      createdAt: Date.now(),
    };
    await saveUser(user);
    const token = await newSession(user.id);
    return ok({ token, user: pub(user), first: isFirst });
  }

  if (action === "login") {
    const phone = normPhone(body.phone);
    const u = await userByPhone(phone);
    if (!u || !verifyPass(String(body.password || ""), u.salt, u.passHash))
      return err("شماره تماس یا رمز عبور اشتباه است");
    const token = await newSession(u.id);
    return ok({ token, user: pub(u) });
  }

  if (action === "logout") {
    const token = tokenOf(req);
    if (token) await jdel(`s:${token}`);
    return ok({ ok: true });
  }

  if (action === "update") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase() || undefined;
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("ایمیل معتبر نیست");
    u.firstName = firstName;
    u.lastName = lastName;
    u.email = email;
    await saveUser(u);
    return ok({ user: pub(u) });
  }

  if (action === "password") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    if (!verifyPass(String(body.oldPass || ""), u.salt, u.passHash)) return err("رمز فعلی اشتباه است");
    const newPass = String(body.newPass || "");
    if (newPass.length < 4) return err("رمز جدید باید حداقل ۴ حرف باشد");
    u.salt = uid().slice(0, 12);
    u.passHash = hashPass(newPass, u.salt);
    await saveUser(u);
    return ok({ ok: true });
  }

  return err("درخواست نامعتبر");
}

export const config = { runtime: "nodejs" };

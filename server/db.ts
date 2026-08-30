/* لایه‌ی داده — Vercel KV (Redis)
   همه‌ی داده‌ها روی هاست Vercel ذخیره می‌شوند و بین همه‌ی دستگاه‌ها مشترک‌اند. */
import { kv } from "@vercel/kv";

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

/** بررسی فعال بودن Vercel KV */
export const kvOk = () =>
  Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

/* ── ابزارهای JSON ── */
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
export const userByPhone = async (phone: string): Promise<DbUser | null> => {
  const ids = await allUserIds();
  for (const id of ids) {
    const u = await getUser(id);
    if (u && u.phone === phone) return u;
  }
  return null;
};
export const saveUser = async (u: DbUser) => {
  const ids = await allUserIds();
  if (!ids.includes(u.id)) await jset("users", [...ids, u.id]);
  await jset(`u:${u.id}`, u);
};

/* ── نشست‌ها (توکن) ── */
const SESSION_TTL = 60 * 60 * 24 * 30; // ۳۰ روز
export const newSession = async (userId: string) => {
  const token = Array.from({ length: 32 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("") + Date.now().toString(36);
  await jset(`s:${token}`, userId, SESSION_TTL);
  return token;
};
export const sessionUser = async (req: Request): Promise<DbUser | null> => {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const userId = await jget<string | null>(`s:${token}`, null);
  if (!userId) return null;
  return getUser(userId);
};
export const endSession = async (req: Request) => {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (token) await jdel(`s:${token}`);
};

export const ok = (data: unknown) => Response.json(data);

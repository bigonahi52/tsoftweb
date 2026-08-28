/* لایه‌ی داده — Vercel KV (Upstash Redis) */
import { kv } from "@vercel/kv";

export const kvOk = () =>
  Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function jget<T>(key: string, fallback: T): Promise<T> {
  try {
    const v = await kv.get<T>(key);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export async function jset(key: string, val: unknown, exSeconds?: number) {
  try {
    if (exSeconds) await kv.set(key, val as never, { ex: exSeconds });
    else await kv.set(key, val as never);
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

export type DbUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
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
  role: u.role,
  createdAt: u.createdAt,
});

export async function userByPhone(phone: string): Promise<DbUser | null> {
  const id = await jget<string>(`phone:${phone}`, "");
  if (!id) return null;
  return jget<DbUser | null>(`u:${id}`, null);
}

export async function saveUser(u: DbUser) {
  await jset(`u:${u.id}`, u);
  await jset(`phone:${u.phone}`, u.id);
  const ids = await allUserIds();
  if (!ids.includes(u.id)) {
    ids.push(u.id);
    await jset("allusers", ids);
  }
}

export async function allUserIds(): Promise<string[]> {
  return jget<string[]>("allusers", []);
}

export async function allUsers(): Promise<DbUser[]> {
  const ids = await allUserIds();
  const out: DbUser[] = [];
  for (const id of ids) {
    const u = await jget<DbUser | null>(`u:${id}`, null);
    if (u) out.push(u);
  }
  return out;
}

/* ── نشست‌ها ── */

export async function newSession(userId: string): Promise<string> {
  const { randomBytes } = await import("crypto");
  const token = randomBytes(24).toString("hex");
  await jset(`s:${token}`, userId, 60 * 60 * 24 * 30);
  return token;
}

export async function sessionUser(req: Request): Promise<DbUser | null> {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const id = await jget<string>(`s:${token}`, "");
  if (!id) return null;
  return jget<DbUser | null>(`u:${id}`, null);
}

export async function endSession(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token) await jdel(`s:${token}`);
}

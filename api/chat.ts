/* چت آنلاین کاربر با پشتیبانی:
   GET  → پیام‌های کاربر (و علامت‌گذاری پیام‌های پشتیبانی به‌عنوان خوانده‌شده)
   POST → ارسال پیام {text} */
import { err, jget, jset, kvOk, ok, sessionUser, uid } from "./_kv";

export type ChatMsg = { id: string; from: "user" | "admin"; text: string; time: number; read: boolean };

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  const user = await sessionUser(req);
  if (!user) return err("ابتدا وارد شوید", 401);

  /* حضور آنلاین — هر ۹۰ ثانیه تمدید می‌شود */
  await jset(`p:${user.id}`, Date.now(), 90);

  if (req.method === "GET") {
    const msgs = await jget<ChatMsg[]>(`chat:${user.id}`, []);
    let dirty = false;
    for (const m of msgs)
      if (m.from === "admin" && !m.read) {
        m.read = true;
        dirty = true;
      }
    if (dirty) await jset(`chat:${user.id}`, msgs);
    return ok({ messages: msgs, online: true });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const text = String(body.text || "").trim();
  if (!text) return err("پیام را بنویسید");

  const msgs = await jget<ChatMsg[]>(`chat:${user.id}`, []);
  const m: ChatMsg = { id: uid(), from: "user", text: text.slice(0, 2000), time: Date.now(), read: false };
  msgs.push(m);
  await jset(`chat:${user.id}`, msgs.slice(-400));
  return ok({ message: m });
}

export const config = { runtime: "nodejs" };

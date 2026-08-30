/* پنل مدیریت (فقط نقش admin):
   GET ?what=stats   → آمار کلی
   GET ?what=users   → همه‌ی کاربران
   GET ?what=tickets → همه‌ی تیکت‌ها + اطلاعات کاربر
   GET ?what=chats   → گفتگوها با آخرین پیام، تعداد نخوانده و وضعیت آنلاین
   GET ?what=conv&user=ID → پیام‌های یک کاربر
   POST {action:"send", userId, text} → ارسال پاسخ به چت کاربر
   ─ فقط به ماژول مشترک ./_kv وابسته است (خودکفا) تا دچار ERR_MODULE_NOT_FOUND نشود. */
import { allUserIds, err, getUser, jget, jset, kvOk, ok, pub, sessionUser, uid } from "./_kv";

type ChatMsg = { id: string; from: "user" | "admin"; text: string; time: number; read: boolean };
type DbTicket = {
  id: string;
  userId: string;
  subject: string;
  priority: "low" | "normal" | "high";
  status: "open" | "answered" | "closed";
  createdAt: number;
  updatedAt: number;
  messages: { id: string; from: "user" | "admin"; text: string; time: number }[];
};

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  const me = await sessionUser(req);
  if (!me) return err("ابتدا وارد شوید", 401);
  if (me.role !== "admin") return err("دسترسی فقط برای مدیر", 403);

  const url = new URL(req.url);

  if (req.method === "GET") {
    const what = url.searchParams.get("what");
    const userIds = await allUserIds();
    const users = [];
    for (const id of userIds) {
      const u = await getUser(id);
      if (u) users.push(u);
    }

    if (what === "stats") {
      const ticketIds = await jget<string[]>("tickets", []);
      let openTickets = 0;
      for (const id of ticketIds) {
        const t = await jget<DbTicket | null>(`t:${id}`, null);
        if (t && t.status === "open") openTickets++;
      }
      return ok({ users: users.filter((u) => u.role === "user").length, tickets: ticketIds.length, openTickets });
    }

    if (what === "users") {
      return ok({ users: users.filter((u) => u.role === "user").map(pub) });
    }

    if (what === "tickets") {
      const ticketIds = await jget<string[]>("tickets", []);
      const tickets = [];
      for (const id of ticketIds) {
        const t = await jget<DbTicket | null>(`t:${id}`, null);
        if (!t) continue;
        const u = await getUser(t.userId);
        tickets.push({ ...t, user: u ? pub(u) : null });
      }
      return ok({ tickets });
    }

    if (what === "chats") {
      const now = Date.now();
      const chats = [];
      for (const u of users) {
        if (u.role !== "user") continue;
        const msgs = await jget<ChatMsg[]>(`chat:${u.id}`, []);
        if (msgs.length === 0) continue;
        const last = msgs[msgs.length - 1];
        const unread = msgs.filter((m) => m.from === "user" && !m.read).length;
        const lastSeen = await jget<number | null>(`p:${u.id}`, null);
        chats.push({ user: pub(u), last, unread, online: lastSeen !== null && now - lastSeen < 90_000 });
      }
      chats.sort((a, b) => (b.last?.time || 0) - (a.last?.time || 0));
      return ok({ chats });
    }

    if (what === "conv") {
      const targetId = url.searchParams.get("user") || "";
      const u = await getUser(targetId);
      const messages = await jget<ChatMsg[]>(`chat:${targetId}`, []);
      let dirty = false;
      for (const m of messages)
        if (m.from === "user" && !m.read) {
          m.read = true;
          dirty = true;
        }
      if (dirty) await jset(`chat:${targetId}`, messages);
      return ok({ messages, user: u ? pub(u) : null });
    }

    return err("پارامتر نامعتبر");
  }

  /* POST: ارسال پاسخ به چت کاربر */
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  if (body.action !== "send") return err("درخواست نامعتبر");
  const text = String(body.text || "").trim();
  if (!text) return err("پیام را بنویسید");
  const target = await getUser(body.userId);
  if (!target) return err("کاربر یافت نشد", 404);

  const msgs = await jget<ChatMsg[]>(`chat:${body.userId}`, []);
  const m: ChatMsg = { id: uid(), from: "admin", text: text.slice(0, 2000), time: Date.now(), read: false };
  msgs.push(m);
  await jset(`chat:${body.userId}`, msgs.slice(-400));
  return ok({ message: m });
}

export const config = { runtime: "nodejs" };

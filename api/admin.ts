/* پنل مدیریت: آمار، کاربران، گفتگوها، تیکت‌ها */
import { allUsers, jget, jset, kvOk, pub, sessionUser, type PubUser } from "../server/db";
import { err, ok, uid } from "../server/auth";
import type { ChatMsg } from "./chat";
import type { Ticket } from "./tickets";

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  const me = await sessionUser(req);
  if (!me) return err("ابتدا وارد شوید", 401);
  if (me.role !== "admin") return err("دسترسی فقط برای مدیر", 403);

  const url = new URL(req.url);
  const what = url.searchParams.get("what") || "stats";

  if (req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as Record<string, string>;
    if (body.action === "send") {
      const userId = body.userId;
      const text = String(body.text || "").trim();
      if (!userId || !text) return err("کاربر و متن پیام مشخص نیست");
      const msgs = await jget<ChatMsg[]>(`chat:${userId}`, []);
      msgs.push({ id: uid(), from: "admin", text: text.slice(0, 2000), time: Date.now(), read: false });
      await jset(`chat:${userId}`, msgs.slice(-400));
      return ok({ ok: true });
    }
    return err("درخواست نامعتبر");
  }

  if (what === "stats") {
    const users = await allUsers();
    const ticketIds = await jget<string[]>("tickets:all", []);
    let open = 0;
    for (const id of ticketIds) {
      const t = await jget<Ticket | null>(`t:${id}`, null);
      if (t && t.status !== "closed") open++;
    }
    return ok({ users: users.length, tickets: ticketIds.length, openTickets: open });
  }

  if (what === "users") {
    const users = (await allUsers()).map(pub);
    return ok({ users });
  }

  if (what === "tickets") {
    const ids = await jget<string[]>("tickets:all", []);
    const tickets: (Ticket & { user?: PubUser })[] = [];
    for (const id of ids) {
      const t = await jget<Ticket | null>(`t:${id}`, null);
      if (!t) continue;
      const owner = (await allUsers()).find((u) => u.id === t.userId);
      tickets.push({ ...t, user: owner ? pub(owner) : undefined });
    }
    tickets.sort((a, b) => b.updatedAt - a.updatedAt);
    return ok({ tickets });
  }

  if (what === "chats") {
    const users = await allUsers();
    const now = Date.now();
    const list: { user: PubUser; last?: ChatMsg; unread: number; online: boolean }[] = [];
    for (const u of users) {
      if (u.id === me.id) continue;
      const msgs = await jget<ChatMsg[]>(`chat:${u.id}`, []);
      if (msgs.length === 0) continue;
      const unread = msgs.filter((m) => m.from === "user" && !m.read).length;
      const seen = await jget<number>(`p:${u.id}`, 0);
      list.push({ user: pub(u), last: msgs[msgs.length - 1], unread, online: now - seen < 25000 });
    }
    list.sort((a, b) => (b.last?.time || 0) - (a.last?.time || 0));
    return ok({ chats: list });
  }

  if (what === "conv") {
    const userId = url.searchParams.get("user") || "";
    if (!userId) return err("کاربر مشخص نیست");
    const msgs = await jget<ChatMsg[]>(`chat:${userId}`, []);
    let dirty = false;
    for (const m of msgs) if (m.from === "user" && !m.read) (m.read = true), (dirty = true);
    if (dirty) await jset(`chat:${userId}`, msgs);
    const owner = (await allUsers()).find((u) => u.id === userId);
    return ok({ messages: msgs, user: owner ? pub(owner) : null });
  }

  return err("درخواست نامعتبر");
}

export const config = { runtime: "nodejs" };

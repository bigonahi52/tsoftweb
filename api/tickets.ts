/* سیستم تیکت:
   GET            → تیکت‌های کاربر جاری (یا یک تیکت با ?id=)
   POST create    → تیکت جدید {subject, priority, text}
   POST reply     → پاسخ {id, text}
   POST close     → بستن {id, close:true} */
import { jget, jset, kvOk, sessionUser } from "../server/db";
import { err, ok, uid } from "../server/auth";

export type TicketMsg = { id: string; from: "user" | "admin"; text: string; time: number };
export type DbTicket = {
  id: string;
  userId: string;
  subject: string;
  priority: "low" | "normal" | "high";
  status: "open" | "answered" | "closed";
  createdAt: number;
  updatedAt: number;
  messages: TicketMsg[];
};

const allTicketIds = () => jget<string[]>("tickets", []);
const getTicket = (id: string) => jget<DbTicket | null>(`t:${id}`, null);
const userTicketIds = (userId: string) => jget<string[]>(`utickets:${userId}`, []);

async function saveTicket(t: DbTicket, isNew = false) {
  if (isNew) {
    const all = await allTicketIds();
    await jset("tickets", [t.id, ...all]);
    const mine = await userTicketIds(t.userId);
    await jset(`utickets:${t.userId}`, [t.id, ...mine]);
  }
  await jset(`t:${t.id}`, t);
}

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  const user = await sessionUser(req);
  if (!user) return err("ابتدا وارد شوید", 401);

  const url = new URL(req.url);

  if (req.method === "GET") {
    const id = url.searchParams.get("id");
    if (id) {
      const t = await getTicket(id);
      if (!t || (t.userId !== user.id && user.role !== "admin")) return err("تیکت یافت نشد", 404);
      return ok({ ticket: t });
    }
    const ids = await userTicketIds(user.id);
    const tickets: DbTicket[] = [];
    for (const tid of ids) {
      const t = await getTicket(tid);
      if (t) tickets.push(t);
    }
    return ok({ tickets });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  /* بستن تیکت */
  if (body.close && typeof body.id === "string") {
    const t = await getTicket(body.id);
    if (!t || (t.userId !== user.id && user.role !== "admin")) return err("تیکت یافت نشد", 404);
    t.status = "closed";
    t.updatedAt = Date.now();
    await saveTicket(t);
    return ok({ ticket: t });
  }

  /* پاسخ به تیکت */
  if (typeof body.id === "string" && typeof body.text === "string") {
    const text = body.text.trim();
    if (!text) return err("پیام را بنویسید");
    const t = await getTicket(body.id);
    if (!t || (t.userId !== user.id && user.role !== "admin")) return err("تیکت یافت نشد", 404);
    if (t.status === "closed") return err("این تیکت بسته شده است");
    t.messages.push({ id: uid(), from: user.role === "admin" ? "admin" : "user", text: text.slice(0, 3000), time: Date.now() });
    t.status = user.role === "admin" ? "answered" : "open";
    t.updatedAt = Date.now();
    await saveTicket(t);
    return ok({ ticket: t });
  }

  /* ساخت تیکت جدید */
  const subject = String(body.subject || "").trim();
  const text = String(body.text || "").trim();
  if (!subject || !text) return err("موضوع و متن تیکت الزامی است");
  const priority = (["low", "normal", "high"].includes(String(body.priority)) ? String(body.priority) : "normal") as DbTicket["priority"];

  const now = Date.now();
  const t: DbTicket = {
    id: uid(),
    userId: user.id,
    subject: subject.slice(0, 120),
    priority,
    status: "open",
    createdAt: now,
    updatedAt: now,
    messages: [{ id: uid(), from: "user", text: text.slice(0, 3000), time: now }],
  };
  await saveTicket(t, true);
  return ok({ ticket: t });
}

export const config = { runtime: "nodejs" };

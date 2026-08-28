/* تیکت‌ها: ساخت، فهرست، پاسخ، بستن */
import { jget, jset, kvOk, pub, sessionUser } from "../server/db";
import { err, ok, uid } from "../server/auth";

export type TicketMsg = { id: string; from: "user" | "admin"; text: string; time: number };
export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  priority: "low" | "normal" | "high";
  status: "open" | "answered" | "closed";
  createdAt: number;
  updatedAt: number;
  messages: TicketMsg[];
};

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  const user = await sessionUser(req);
  if (!user) return err("ابتدا وارد شوید", 401);

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (req.method === "GET") {
    if (id) {
      const t = await jget<Ticket | null>(`t:${id}`, null);
      if (!t || (t.userId !== user.id && user.role !== "admin"))
        return err("تیکت یافت نشد", 404);
      return ok({ ticket: t });
    }
    const ids = await jget<string[]>("tickets:all", []);
    const all: Ticket[] = [];
    for (const tid of ids) {
      const t = await jget<Ticket | null>(`t:${tid}`, null);
      if (t) all.push(t);
    }
    const mine = user.role === "admin" ? all : all.filter((t) => t.userId === user.id);
    mine.sort((a, b) => b.updatedAt - a.updatedAt);
    return ok({ tickets: mine });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;

  /* پاسخ یا بستن یک تیکت */
  if (id) {
    const t = await jget<Ticket | null>(`t:${id}`, null);
    if (!t) return err("تیکت یافت نشد", 404);
    if (t.userId !== user.id && user.role !== "admin") return err("دسترسی ندارید", 403);

    if (body.close && user.role === "admin") {
      t.status = "closed";
      t.updatedAt = Date.now();
      await jset(`t:${id}`, t);
      return ok({ ticket: t });
    }
    const text = String(body.text || "").trim();
    if (!text) return err("متن پیام را بنویسید");
    t.messages.push({
      id: uid(),
      from: user.role === "admin" ? "admin" : "user",
      text: text.slice(0, 3000),
      time: Date.now(),
    });
    t.status = user.role === "admin" ? "answered" : "open";
    t.updatedAt = Date.now();
    await jset(`t:${id}`, t);
    return ok({ ticket: t });
  }

  /* ساخت تیکت جدید */
  const subject = String(body.subject || "").trim();
  const desc = String(body.text || "").trim();
  if (!subject) return err("موضوع تیکت را بنویسید");
  if (!desc) return err("شرح تیکت را بنویسید");
  const priority: Ticket["priority"] = ["low", "normal", "high"].includes(body.priority || "")
    ? (body.priority as Ticket["priority"])
    : "normal";

  const t: Ticket = {
    id: uid(),
    userId: user.id,
    subject: subject.slice(0, 120),
    priority,
    status: "open",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [{ id: uid(), from: "user", text: desc.slice(0, 3000), time: Date.now() }],
  };
  await jset(`t:${t.id}`, t);
  const ids = await jget<string[]>("tickets:all", []);
  ids.push(t.id);
  await jset("tickets:all", ids);
  return ok({ ticket: t });
}

export const config = { runtime: "nodejs" };

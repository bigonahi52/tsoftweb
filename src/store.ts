/*
  لایه‌ی داده — ذخیره در مرورگر (localStorage) + هماهنگ‌سازی زنده با ابر (Firebase)
  اگر Firebase در فایل firebase.ts پیکربندی شده باشد، اطلاعات پاک نمی‌شود و بین همه‌ی دستگاه‌ها هماهنگ است.
*/
import { useEffect, useState } from "react";
import { initCloudSync, pushCollection, CLOUD_MAP } from "./cloud";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  pass: string;
  role: "user" | "admin";
  createdAt: number;
};

export type ChatMsg = {
  id: string;
  userId: string;
  from: "user" | "admin";
  auto?: boolean;
  text: string;
  time: number;
  readByAdmin?: boolean;
  readByUser?: boolean;
};

export type SharedFile = { id: string; userId: string; name: string; href: string; time: number };

export type InvoiceItem = { title: string; amount: number };
export type Invoice = {
  id: string;
  no: string;
  userId: string;
  kind: "sale" | "support";
  items: InvoiceItem[];
  note?: string;
  status: "issued" | "paid";
  time: number;
  /** لینک درگاه پرداخت برای این فاکتور */
  payUrl?: string;
};

export type TicketReply = { id: string; from: "user" | "admin"; text: string; time: number };
export type Ticket = {
  id: string;
  no: string;
  userId: string;
  subject: string;
  topic: string;
  priority: "normal" | "high";
  status: "open" | "answered" | "closed";
  replies: TicketReply[];
  time: number;
};

const K = {
  users: "tsoft_users",
  msgs: "tsoft_msgs",
  files: "tsoft_files",
  inv: "tsoft_invoices",
  tix: "tsoft_tickets",
  ses: "tsoft_session",
};

export const AUTH_EVENT = "tsoft-auth";
export const DATA_EVENT = "tsoft-data";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
  /* اگر Firebase وصل باشد، آرایه‌ها به ابر هم فرستاده می‌شوند تا پاک نشوند */
  if (CLOUD_MAP[key] && Array.isArray(val)) {
    pushCollection(key, val as { id: string }[]);
  }
}
const fire = (name: string) => window.dispatchEvent(new Event(name));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
const hash = (s: string) => {
  try {
    return btoa(unescape(encodeURIComponent("tsoft@" + s)));
  } catch {
    return "x" + s.length;
  }
};
const normalizePhone = (p: string) =>
  p.trim().replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[\s-]/g, "");

/* اگر Firebase پیکربندی شده باشد، شنونده‌های زنده را فعال کن */
initCloudSync();

/** ساخت حساب مدیر در اولین اجرا */
export function seedAdmin() {
  const users = read<User[]>(K.users, []);
  if (!users.some((u) => u.role === "admin")) {
    users.push({
      id: "admin",
      firstName: "مدیر",
      lastName: "تیسافت",
      phone: "admin",
      pass: hash("tsoft20"),
      role: "admin",
      createdAt: Date.now(),
    });
    write(K.users, users);
  }
}

/** هوک: با هر تغییر داده/ورود، کامپوننت را تازه می‌کند */
export function useStoreTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(AUTH_EVENT, bump);
    window.addEventListener(DATA_EVENT, bump);
    return () => {
      window.removeEventListener(AUTH_EVENT, bump);
      window.removeEventListener(DATA_EVENT, bump);
    };
  }, []);
  return tick;
}

/* ── احراز هویت ── */

export function currentUser(): User | null {
  const id = read<string | null>(K.ses, null);
  if (!id) return null;
  return read<User[]>(K.users, []).find((u) => u.id === id) ?? null;
}

export function registerUser(
  firstName: string,
  lastName: string,
  phone: string,
  pass: string
): { ok: boolean; error?: string } {
  const users = read<User[]>(K.users, []);
  const p = normalizePhone(phone);
  if (!p || p.length < 4) return { ok: false, error: "شماره تماس معتبر نیست" };
  if (users.some((u) => u.phone === p)) return { ok: false, error: "این شماره قبلاً ثبت شده — وارد شوید" };
  const u: User = {
    id: uid(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: p,
    pass: hash(pass),
    role: "user",
    createdAt: Date.now(),
  };
  users.push(u);
  write(K.users, users);
  write(K.ses, u.id);
  fire(AUTH_EVENT);
  return { ok: true };
}

export function loginUser(phone: string, pass: string): { ok: boolean; error?: string; user?: User } {
  const users = read<User[]>(K.users, []);
  const p = normalizePhone(phone);
  const u = users.find((x) => x.phone === p || x.phone === phone.trim());
  if (!u || u.pass !== hash(pass)) return { ok: false, error: "شماره تماس یا رمز عبور اشتباه است" };
  write(K.ses, u.id);
  fire(AUTH_EVENT);
  return { ok: true, user: u };
}

export function logout() {
  write(K.ses, null);
  fire(AUTH_EVENT);
}

export function changePassword(userId: string, newPass: string) {
  const users = read<User[]>(K.users, []);
  const u = users.find((x) => x.id === userId);
  if (u) {
    u.pass = hash(newPass);
    write(K.users, users);
    fire(AUTH_EVENT);
  }
}

export function allUsers(): User[] {
  return read<User[]>(K.users, []);
}
export function customerUsers(): User[] {
  return allUsers().filter((u) => u.role === "user");
}
export function getUserById(id: string): User | null {
  return allUsers().find((u) => u.id === id) ?? null;
}

/* ── پیام‌ها ── */

export function getMessages(userId: string): ChatMsg[] {
  return read<ChatMsg[]>(K.msgs, [])
    .filter((m) => m.userId === userId)
    .sort((a, b) => a.time - b.time);
}

export function sendMessage(userId: string, from: "user" | "admin", text: string, auto = false) {
  const all = read<ChatMsg[]>(K.msgs, []);
  all.push({
    id: uid(),
    userId,
    from,
    auto,
    text,
    time: Date.now(),
    readByAdmin: from === "admin",
    readByUser: from === "user",
  });
  write(K.msgs, all);
  fire(DATA_EVENT);
}

export function markRead(userId: string, by: "admin" | "user") {
  const all = read<ChatMsg[]>(K.msgs, []);
  let changed = false;
  all.forEach((m) => {
    if (m.userId !== userId || m.from === by) return;
    if (by === "admin" && !m.readByAdmin) {
      m.readByAdmin = true;
      changed = true;
    }
    if (by === "user" && !m.readByUser) {
      m.readByUser = true;
      changed = true;
    }
  });
  if (changed) {
    write(K.msgs, all);
    fire(DATA_EVENT);
  }
}

export function conversations(): { user: User; last?: ChatMsg; unread: number }[] {
  const msgs = read<ChatMsg[]>(K.msgs, []);
  return customerUsers()
    .map((u) => {
      const um = msgs.filter((m) => m.userId === u.id).sort((a, b) => a.time - b.time);
      return { user: u, last: um[um.length - 1], unread: um.filter((m) => m.from === "user" && !m.readByAdmin).length };
    })
    .filter((c) => c.last)
    .sort((a, b) => b.last!.time - a.last!.time);
}

export function totalUnread(): number {
  return read<ChatMsg[]>(K.msgs, []).filter((m) => m.from === "user" && !m.readByAdmin).length;
}

/* ── فایل‌ها ── */

export function getFilesFor(userId: string): SharedFile[] {
  return read<SharedFile[]>(K.files, [])
    .filter((f) => f.userId === userId)
    .sort((a, b) => b.time - a.time);
}

export function sendFileToUser(userId: string, name: string, href: string): { ok: boolean; error?: string } {
  if (!href) return { ok: false, error: "فایل یا لینک را مشخص کنید" };
  const all = read<SharedFile[]>(K.files, []);
  all.push({ id: uid(), userId, name: name || "فایل ارسالی", href, time: Date.now() });
  write(K.files, all);
  fire(DATA_EVENT);
  return { ok: true };
}

/* ── فاکتورها ── */

export function getInvoices(): Invoice[] {
  return read<Invoice[]>(K.inv, []).sort((a, b) => b.time - a.time);
}
export function getInvoicesFor(userId: string): Invoice[] {
  return getInvoices().filter((i) => i.userId === userId);
}

export function createInvoice(
  userId: string,
  kind: "sale" | "support",
  items: InvoiceItem[],
  note?: string
): Invoice {
  const all = read<Invoice[]>(K.inv, []);
  const no = "TS-" + String(all.length + 1).padStart(3, "0");
  const inv: Invoice = { id: uid(), no, userId, kind, items, note, status: "issued", time: Date.now() };
  all.push(inv);
  write(K.inv, all);
  fire(DATA_EVENT);
  return inv;
}

export function setInvoiceStatus(id: string, status: "issued" | "paid") {
  const all = read<Invoice[]>(K.inv, []);
  const inv = all.find((i) => i.id === id);
  if (inv) {
    inv.status = status;
    write(K.inv, all);
    fire(DATA_EVENT);
  }
}

/** ثبت یا حذف لینک درگاه پرداخت برای یک فاکتور */
export function setInvoicePayUrl(id: string, payUrl?: string) {
  const all = read<Invoice[]>(K.inv, []);
  const inv = all.find((i) => i.id === id);
  if (inv) {
    inv.payUrl = payUrl && payUrl.trim() ? payUrl.trim() : undefined;
    write(K.inv, all);
    fire(DATA_EVENT);
  }
}

export const invoiceTotal = (inv: Invoice) => inv.items.reduce((s, it) => s + (Number(it.amount) || 0), 0);

/* ── تیکت‌ها ── */

export function getTickets(): Ticket[] {
  return read<Ticket[]>(K.tix, []).sort((a, b) => b.time - a.time);
}
export function getTicketsFor(userId: string): Ticket[] {
  return getTickets().filter((t) => t.userId === userId);
}

export function createTicket(userId: string, subject: string, topic: string, priority: "normal" | "high", text: string): Ticket {
  const all = read<Ticket[]>(K.tix, []);
  const no = "TK-" + String(all.length + 1).padStart(3, "0");
  const t: Ticket = {
    id: uid(),
    no,
    userId,
    subject: subject.trim(),
    topic,
    priority,
    status: "open",
    replies: [{ id: uid(), from: "user", text: text.trim(), time: Date.now() }],
    time: Date.now(),
  };
  all.push(t);
  write(K.tix, all);
  fire(DATA_EVENT);
  return t;
}

export function replyTicket(ticketId: string, from: "user" | "admin", text: string) {
  const all = read<Ticket[]>(K.tix, []);
  const t = all.find((x) => x.id === ticketId);
  if (!t || !text.trim()) return;
  t.replies.push({ id: uid(), from, text: text.trim(), time: Date.now() });
  t.status = from === "admin" ? "answered" : "open";
  t.time = Date.now();
  write(K.tix, all);
  fire(DATA_EVENT);
}

export function closeTicket(ticketId: string) {
  const all = read<Ticket[]>(K.tix, []);
  const t = all.find((x) => x.id === ticketId);
  if (!t) return;
  t.status = "closed";
  write(K.tix, all);
  fire(DATA_EVENT);
}

export function openTicketsCount(): number {
  return read<Ticket[]>(K.tix, []).filter((t) => t.status !== "closed").length;
}

/*
  کلاینت ارتباط با بک‌اند
  ─ اگر بک‌اند Vercel در دسترس باشد → داده‌ها در ابر (Vercel KV) ذخیره می‌شوند
  ─ اگر در دسترس نباشد (محیط پیش‌نمایش یا قبل از فعال‌سازی KV) → به‌صورت خودکار
    از حالت محلی (localStorage) استفاده می‌شود تا همه‌چیز کار کند
*/

const TOKEN_KEY = "tsoft_token";

export type PubUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  role: "user" | "admin";
  createdAt: number;
};
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
  user?: PubUser;
};
export type ChatMsg = { id: string; from: "user" | "admin"; text: string; time: number; read: boolean };

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
export const setToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export class ApiError extends Error {
  code: number;
  constructor(msg: string, code = 400) {
    super(msg);
    this.code = code;
  }
}

/** آیا بک‌اند پایین است (شبکه قطع / تابع وجود ندارد / KV فعال نیست)؟ */
let backendDown = false;
const DOWN_CODES = [0, 404, 502, 503, 508];

async function call<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("اتصال به سرور برقرار نشد", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new ApiError(data.error || "خطایی رخ داد", res.status);
  return data as T;
}

/** اجرا روی بک‌اند؛ اگر پایین بود، به‌صورت خودکار نسخه‌ی محلی */
async function fb<T>(remote: () => Promise<T>, local: () => T): Promise<T> {
  if (!backendDown) {
    try {
      return await remote();
    } catch (e) {
      if (e instanceof ApiError && DOWN_CODES.includes(e.code)) backendDown = true;
      else throw e;
    }
  }
  return local();
}

/* ─────────────────── حالت محلی (localStorage) ─────────────────── */

const LDB_KEY = "tsoft_local_db_v1";

type LUser = PubUser & { salt: string; hash: string };
type LDb = {
  users: LUser[];
  tokens: Record<string, string>;
  tickets: Ticket[];
  chats: Record<string, ChatMsg[]>;
  resets: Record<string, { code: string; exp: number }>;
};

const ldb = (): LDb => {
  try {
    const raw = localStorage.getItem(LDB_KEY);
    return raw ? (JSON.parse(raw) as LDb) : { users: [], tokens: {}, tickets: [], chats: {}, resets: {} };
  } catch {
    return { users: [], tokens: {}, tickets: [], chats: {}, resets: {} };
  }
};
const saveDb = (d: LDb) => {
  try {
    localStorage.setItem(LDB_KEY, JSON.stringify(d));
  } catch {
    /* ignore */
  }
};
const lhash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
};
const luid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
const lnorm = (p: string) =>
  String(p || "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s\-()]/g, "");
const lpub = (u: LUser): PubUser => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});
const lme = (): LUser => {
  const d = ldb();
  const id = d.tokens[getToken() || ""];
  const u = d.users.find((x) => x.id === id);
  if (!u) throw new ApiError("ابتدا وارد شوید", 401);
  return u;
};
const lrequireAdmin = () => {
  const u = lme();
  if (u.role !== "admin") throw new ApiError("دسترسی فقط برای مدیر", 403);
  return u;
};
const lticketUser = (t: Ticket, d: LDb): Ticket => {
  const u = d.users.find((x) => x.id === t.userId);
  return { ...t, user: u ? lpub(u) : t.user };
};

const local = {
  me: () => ({ user: lpub(lme()) }),

  register: (b: { firstName: string; lastName: string; phone: string; email?: string; password: string }) => {
    const phone = lnorm(b.phone);
    if (!b.firstName.trim() || !b.lastName.trim()) throw new ApiError("نام و نام خانوادگی را کامل وارد کنید");
    if (phone.length < 6) throw new ApiError("شماره تماس معتبر نیست");
    if (b.password.length < 4) throw new ApiError("رمز عبور باید حداقل ۴ حرف باشد");
    const d = ldb();
    if (d.users.some((u) => u.phone === phone)) throw new ApiError("این شماره قبلاً ثبت شده — وارد شوید");
    const salt = luid().slice(0, 8);
    const first = d.users.length === 0;
    const user: LUser = {
      id: luid(),
      firstName: b.firstName.trim(),
      lastName: b.lastName.trim(),
      phone,
      email: b.email?.trim() || undefined,
      salt,
      hash: lhash(salt + b.password),
      role: first ? "admin" : "user",
      createdAt: Date.now(),
    };
    d.users.push(user);
    const token = luid() + luid();
    d.tokens[token] = user.id;
    saveDb(d);
    return { token, user: lpub(user), first };
  },

  login: (b: { phone: string; password: string }) => {
    const d = ldb();
    const u = d.users.find((x) => x.phone === lnorm(b.phone));
    if (!u || u.hash !== lhash(u.salt + b.password)) throw new ApiError("شماره تماس یا رمز عبور اشتباه است");
    const token = luid() + luid();
    d.tokens[token] = u.id;
    saveDb(d);
    return { token, user: lpub(u) };
  },

  logout: () => {
    const d = ldb();
    delete d.tokens[getToken() || ""];
    saveDb(d);
    return { ok: true };
  },

  update: (b: { firstName: string; lastName: string; email?: string }) => {
    const d = ldb();
    const u = lme();
    if (!b.firstName.trim() || !b.lastName.trim()) throw new ApiError("نام و نام خانوادگی را کامل وارد کنید");
    u.firstName = b.firstName.trim();
    u.lastName = b.lastName.trim();
    u.email = b.email?.trim() || undefined;
    saveDb(d);
    return { user: lpub(u) };
  },

  changePassword: (b: { oldPass: string; newPass: string }) => {
    const d = ldb();
    const u = lme();
    if (u.hash !== lhash(u.salt + b.oldPass)) throw new ApiError("رمز فعلی اشتباه است");
    if (b.newPass.length < 4) throw new ApiError("رمز جدید باید حداقل ۴ حرف باشد");
    u.salt = luid().slice(0, 8);
    u.hash = lhash(u.salt + b.newPass);
    saveDb(d);
    return { ok: true };
  },

  forgot: (phone: string) => {
    const d = ldb();
    const u = d.users.find((x) => x.phone === lnorm(phone));
    if (!u) throw new ApiError("حسابی با این شماره پیدا نشد");
    const code = String(Math.floor(100000 + Math.random() * 900000));
    d.resets[u.id] = { code, exp: Date.now() + 10 * 60 * 1000 };
    saveDb(d);
    /* در حالت محلی، ایمیل ارسال نمی‌شود — کد برای نمایش برگردانده می‌شود */
    return { ok: true, demoCode: code };
  },

  reset: (b: { phone: string; code: string; newPass: string }) => {
    const d = ldb();
    const u = d.users.find((x) => x.phone === lnorm(b.phone));
    if (!u) throw new ApiError("حسابی با این شماره پیدا نشد");
    const r = d.resets[u.id];
    if (!r || r.exp < Date.now()) throw new ApiError("کد منقضی شده — دوباره درخواست دهید");
    if (r.code !== String(b.code).trim()) throw new ApiError("کد واردشده اشتباه است");
    if (b.newPass.length < 4) throw new ApiError("رمز جدید باید حداقل ۴ حرف باشد");
    u.salt = luid().slice(0, 8);
    u.hash = lhash(u.salt + b.newPass);
    delete d.resets[u.id];
    saveDb(d);
    return { ok: true };
  },

  contact: () => ({ ok: true, local: true }),

  tickets: () => {
    const d = ldb();
    const u = lme();
    const list = (u.role === "admin" ? d.tickets : d.tickets.filter((t) => t.userId === u.id))
      .map((t) => lticketUser(t, d))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return { tickets: list };
  },

  ticket: (id: string) => {
    const d = ldb();
    const u = lme();
    const t = d.tickets.find((x) => x.id === id);
    if (!t || (u.role !== "admin" && t.userId !== u.id)) throw new ApiError("تیکت پیدا نشد", 404);
    return { ticket: lticketUser(t, d) };
  },

  createTicket: (b: { subject: string; priority: string; text: string }) => {
    const d = ldb();
    const u = lme();
    if (!b.subject.trim() || !b.text.trim()) throw new ApiError("موضوع و متن تیکت را بنویسید");
    const now = Date.now();
    const t: Ticket = {
      id: luid(),
      userId: u.id,
      subject: b.subject.trim(),
      priority: (["low", "normal", "high"].includes(b.priority) ? b.priority : "normal") as Ticket["priority"],
      status: "open",
      createdAt: now,
      updatedAt: now,
      messages: [{ id: luid(), from: "user", text: b.text.trim(), time: now }],
      user: lpub(u),
    };
    d.tickets.push(t);
    saveDb(d);
    return { ticket: t };
  },

  replyTicket: (id: string, text: string) => {
    const d = ldb();
    const u = lme();
    const t = d.tickets.find((x) => x.id === id);
    if (!t) throw new ApiError("تیکت پیدا نشد", 404);
    if (u.role !== "admin" && t.userId !== u.id) throw new ApiError("دسترسی ندارید", 403);
    if (!text.trim()) throw new ApiError("متن پاسخ را بنویسید");
    const from = u.role === "admin" ? "admin" : "user";
    t.messages.push({ id: luid(), from, text: text.trim(), time: Date.now() });
    t.updatedAt = Date.now();
    t.status = from === "admin" ? "answered" : "open";
    saveDb(d);
    return { ticket: lticketUser(t, d) };
  },

  closeTicket: (id: string) => {
    const d = ldb();
    const u = lme();
    const t = d.tickets.find((x) => x.id === id);
    if (!t) throw new ApiError("تیکت پیدا نشد", 404);
    if (u.role !== "admin" && t.userId !== u.id) throw new ApiError("دسترسی ندارید", 403);
    t.status = "closed";
    t.updatedAt = Date.now();
    saveDb(d);
    return { ticket: lticketUser(t, d) };
  },

  chat: () => {
    const d = ldb();
    const u = lme();
    const msgs = d.chats[u.id] ?? [];
    msgs.forEach((m) => {
      if (m.from === "admin") m.read = true;
    });
    saveDb(d);
    return { messages: msgs };
  },

  sendChat: (text: string) => {
    if (!text.trim()) throw new ApiError("پیام را بنویسید");
    const d = ldb();
    const u = lme();
    const m: ChatMsg = { id: luid(), from: "user", text: text.trim().slice(0, 2000), time: Date.now(), read: false };
    d.chats[u.id] = [...(d.chats[u.id] ?? []), m].slice(-400);
    saveDb(d);
    return { message: m };
  },

  adminStats: () => {
    lrequireAdmin();
    const d = ldb();
    return {
      users: d.users.filter((u) => u.role === "user").length,
      tickets: d.tickets.length,
      openTickets: d.tickets.filter((t) => t.status === "open").length,
    };
  },

  adminUsers: () => {
    lrequireAdmin();
    const d = ldb();
    return { users: d.users.map(lpub) };
  },

  adminTickets: () => {
    lrequireAdmin();
    const d = ldb();
    return { tickets: d.tickets.map((t) => lticketUser(t, d)).sort((a, b) => b.updatedAt - a.updatedAt) };
  },

  adminChats: () => {
    lrequireAdmin();
    const d = ldb();
    const chats = d.users
      .filter((u) => u.role === "user" && (d.chats[u.id]?.length ?? 0) > 0)
      .map((u) => {
        const msgs = d.chats[u.id];
        return {
          user: lpub(u),
          last: msgs[msgs.length - 1],
          unread: msgs.filter((m) => m.from === "user" && !m.read).length,
          online: false,
        };
      })
      .sort((a, b) => (b.last?.time ?? 0) - (a.last?.time ?? 0));
    return { chats };
  },

  adminConv: (userId: string) => {
    lrequireAdmin();
    const d = ldb();
    const u = d.users.find((x) => x.id === userId);
    const msgs = d.chats[userId] ?? [];
    msgs.forEach((m) => {
      if (m.from === "user") m.read = true;
    });
    saveDb(d);
    return { messages: msgs, user: u ? lpub(u) : null };
  },

  adminSend: (userId: string, text: string) => {
    lrequireAdmin();
    if (!text.trim()) throw new ApiError("پیام را بنویسید");
    const d = ldb();
    const m: ChatMsg = { id: luid(), from: "admin", text: text.trim().slice(0, 2000), time: Date.now(), read: false };
    d.chats[userId] = [...(d.chats[userId] ?? []), m].slice(-400);
    saveDb(d);
    return { ok: true };
  },
};

/* ─────────────────── API عمومی ─────────────────── */

export const api = {
  me: () => fb(() => call<{ user: PubUser }>("/api/auth"), local.me),

  register: (b: { firstName: string; lastName: string; phone: string; email?: string; password: string }) =>
    fb(
      () =>
        call<{ token: string; user: PubUser; first: boolean }>("/api/auth", {
          method: "POST",
          body: JSON.stringify({ action: "register", ...b }),
        }),
      () => local.register(b)
    ),

  forgot: (phone: string) =>
    fb(
      () => call<{ ok: boolean; demoCode?: string }>("/api/forgot", { method: "POST", body: JSON.stringify({ action: "forgot", phone }) }),
      () => local.forgot(phone)
    ),

  reset: (b: { phone: string; code: string; newPass: string }) =>
    fb(
      () => call<{ ok: boolean }>("/api/forgot", { method: "POST", body: JSON.stringify({ action: "reset", ...b }) }),
      () => local.reset(b)
    ),

  contact: (b: { name: string; phone?: string; business?: string; product?: string; message: string }) =>
    fb(
      () => call<{ ok: boolean; local?: boolean }>("/api/contact", { method: "POST", body: JSON.stringify(b) }),
      () => local.contact()
    ),

  login: (b: { phone: string; password: string }) =>
    fb(
      () =>
        call<{ token: string; user: PubUser }>("/api/auth", {
          method: "POST",
          body: JSON.stringify({ action: "login", ...b }),
        }),
      () => local.login(b)
    ),

  logout: () => fb(() => call("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) }), local.logout),

  update: (b: { firstName: string; lastName: string; email?: string }) =>
    fb(
      () => call<{ user: PubUser }>("/api/auth", { method: "POST", body: JSON.stringify({ action: "update", ...b }) }),
      () => local.update(b)
    ),

  changePassword: (b: { oldPass: string; newPass: string }) =>
    fb(
      () => call("/api/auth", { method: "POST", body: JSON.stringify({ action: "password", ...b }) }),
      () => local.changePassword(b)
    ),

  tickets: () => fb(() => call<{ tickets: Ticket[] }>("/api/tickets"), local.tickets),
  ticket: (id: string) => fb(() => call<{ ticket: Ticket }>(`/api/tickets?id=${encodeURIComponent(id)}`), () => local.ticket(id)),
  createTicket: (b: { subject: string; priority: string; text: string }) =>
    fb(
      () => call<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify(b) }),
      () => local.createTicket(b)
    ),
  replyTicket: (id: string, text: string) =>
    fb(
      () => call<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify({ id, text }) }),
      () => local.replyTicket(id, text)
    ),
  closeTicket: (id: string) =>
    fb(
      () => call<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify({ id, close: true }) }),
      () => local.closeTicket(id)
    ),

  chat: () => fb(() => call<{ messages: ChatMsg[] }>("/api/chat"), local.chat),
  sendChat: (text: string) =>
    fb(() => call<{ message: ChatMsg }>("/api/chat", { method: "POST", body: JSON.stringify({ text }) }), () => local.sendChat(text)),

  adminStats: () => fb(() => call<{ users: number; tickets: number; openTickets: number }>("/api/admin?what=stats"), local.adminStats),
  adminUsers: () => fb(() => call<{ users: PubUser[] }>("/api/admin?what=users"), local.adminUsers),
  adminTickets: () => fb(() => call<{ tickets: Ticket[] }>("/api/admin?what=tickets"), local.adminTickets),
  adminChats: () =>
    fb(
      () =>
        call<{ chats: { user: PubUser; last?: ChatMsg; unread: number; online: boolean }[] }>("/api/admin?what=chats"),
      local.adminChats
    ),
  adminConv: (userId: string) =>
    fb(
      () => call<{ messages: ChatMsg[]; user: PubUser | null }>(`/api/admin?what=conv&user=${encodeURIComponent(userId)}`),
      () => local.adminConv(userId)
    ),
  adminSend: (userId: string, text: string) =>
    fb(
      () => call("/api/admin", { method: "POST", body: JSON.stringify({ action: "send", userId, text }) }),
      () => local.adminSend(userId, text)
    ),
};

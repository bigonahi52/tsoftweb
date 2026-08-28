/* کلاینت ارتباط با بک‌اند Vercel */

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
    throw new ApiError("اتصال به سرور برقرار نشد — بک‌اند فقط روی دامنه‌ی اصلی فعال است", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new ApiError(data.error || "خطایی رخ داد", res.status);
  return data as T;
}

export const api = {
  me: () => call<{ user: PubUser }>("/api/auth"),
  register: (b: { firstName: string; lastName: string; phone: string; email?: string; password: string }) =>
    call<{ token: string; user: PubUser; first: boolean }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "register", ...b }),
    }),
  forgot: (phone: string) =>
    call<{ ok: boolean }>("/api/forgot", { method: "POST", body: JSON.stringify({ action: "forgot", phone }) }),
  reset: (b: { phone: string; code: string; newPass: string }) =>
    call<{ ok: boolean }>("/api/forgot", { method: "POST", body: JSON.stringify({ action: "reset", ...b }) }),
  contact: (b: { name: string; phone?: string; business?: string; product?: string; message: string }) =>
    call<{ ok: boolean }>("/api/contact", { method: "POST", body: JSON.stringify(b) }),
  login: (b: { phone: string; password: string }) =>
    call<{ token: string; user: PubUser }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", ...b }),
    }),
  logout: () => call("/api/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) }),
  update: (b: { firstName: string; lastName: string; email?: string }) =>
    call<{ user: PubUser }>("/api/auth", { method: "POST", body: JSON.stringify({ action: "update", ...b }) }),
  changePassword: (b: { oldPass: string; newPass: string }) =>
    call("/api/auth", { method: "POST", body: JSON.stringify({ action: "password", ...b }) }),

  tickets: () => call<{ tickets: Ticket[] }>("/api/tickets"),
  ticket: (id: string) => call<{ ticket: Ticket }>(`/api/tickets?id=${encodeURIComponent(id)}`),
  createTicket: (b: { subject: string; priority: string; text: string }) =>
    call<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify(b) }),
  replyTicket: (id: string, text: string) =>
    call<{ ticket: Ticket }>("/api/tickets", {
      method: "POST",
      body: JSON.stringify({ id, text }),
    }),
  closeTicket: (id: string) =>
    call<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify({ id, close: true }) }),

  chat: () => call<{ messages: ChatMsg[] }>("/api/chat"),
  sendChat: (text: string) => call<{ message: ChatMsg }>("/api/chat", { method: "POST", body: JSON.stringify({ text }) }),

  adminStats: () => call<{ users: number; tickets: number; openTickets: number }>("/api/admin?what=stats"),
  adminUsers: () => call<{ users: PubUser[] }>("/api/admin?what=users"),
  adminTickets: () => call<{ tickets: Ticket[] }>("/api/admin?what=tickets"),
  adminChats: () =>
    call<{ chats: { user: PubUser; last?: ChatMsg; unread: number; online: boolean }[] }>("/api/admin?what=chats"),
  adminConv: (userId: string) =>
    call<{ messages: ChatMsg[]; user: PubUser | null }>(`/api/admin?what=conv&user=${encodeURIComponent(userId)}`),
  adminSend: (userId: string, text: string) =>
    call("/api/admin", { method: "POST", body: JSON.stringify({ action: "send", userId, text }) }),
};

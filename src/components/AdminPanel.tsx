import { useEffect, useState } from "react";
import { api, ApiError, type ChatMsg, type HealthReport, type PubUser, type Ticket } from "../api";
import { fa, usePolling, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const fmtDate = (t: number) =>
  fa(new Date(t).toLocaleDateString("fa-IR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }));

const STATUS_FA: Record<string, { label: string; cls: string }> = {
  open: { label: "باز", cls: "bg-teal-500/15 text-teal-600" },
  answered: { label: "پاسخ داده شد", cls: "bg-gold-500/15 text-gold-600" },
  closed: { label: "بسته", cls: "bg-ink-100/70 text-mist-500" },
};

/* ───────── گفتگوها ───────── */
function ChatsTab() {
  const [chats, setChats] = useState<{ user: PubUser; last?: ChatMsg; unread: number; online: boolean }[] | null>(null);
  const [sel, setSel] = useState<PubUser | null>(null);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  usePolling(() => {
    api.adminChats().then((d) => setChats(d.chats)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا"));
  }, 4000);

  usePolling(() => {
    if (sel) api.adminConv(sel.id).then((d) => setMsgs(d.messages)).catch(() => {});
  }, 3500, !!sel);

  const open = (u: PubUser) => {
    setSel(u);
    setErr("");
    api.adminConv(u.id).then((d) => setMsgs(d.messages)).catch(() => {});
  };

  const send = async () => {
    if (!sel || !text.trim() || sending) return;
    setSending(true);
    try {
      await api.adminSend(sel.id, text);
      const d = await api.adminConv(sel.id);
      setMsgs(d.messages);
      setText("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "ارسال نشد");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
      <div className="rounded-3xl border border-ink-100 bg-white p-4">
        <p className="px-2 pb-3 font-display text-xl text-ink-900">گفتگوها</p>
        {!chats && <p className="py-8 text-center text-sm text-mist-500">در حال دریافت…</p>}
        {chats && chats.length === 0 && (
          <div className="py-10 text-center">
            <Icon name="chat" className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-2 text-sm text-mist-500">هنوز گفتگویی شکل نگرفته</p>
          </div>
        )}
        <div className="space-y-2">
          {chats?.map((c) => (
            <button key={c.user.id} onClick={() => open(c.user)} className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-right transition-all ${sel?.id === c.user.id ? "border-teal-500/60 bg-teal-100/40" : "border-ink-100 bg-paper hover:border-teal-500/40"}`}>
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-950 font-display text-lg text-teal-400">
                {c.user.firstName[0]}
                {c.online && <span className="pulse-dot absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink-900">{c.user.firstName} {c.user.lastName}</span>
                <span className="block truncate text-xs text-mist-500">{c.last ? (c.last.from === "admin" ? "شما: " : "") + c.last.text : ""}</span>
              </span>
              {c.unread > 0 && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E14B4B] text-[10px] font-bold text-white">{fa(c.unread)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[540px] flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white">
        {!sel ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Icon name="headset" className="h-14 w-14 text-ink-300" />
            <p className="font-display text-2xl text-ink-700">یک گفتگو را انتخاب کنید</p>
            <p className="max-w-xs text-sm leading-7 text-mist-500">از فهرست راست، کاربر موردنظر را باز کنید و پاسخ دهید.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-ink-100 bg-paper px-6 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 font-display text-lg text-teal-400">{sel.firstName[0]}</span>
              <div>
                <p className="font-display text-xl text-ink-900">{sel.firstName} {sel.lastName}</p>
                <p dir="ltr" className="font-latin text-xs text-mist-500" style={{ textAlign: "right" }}>{sel.phone}</p>
              </div>
            </div>
            <div className="grid-lines flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-6">
              {msgs.map((m) => (
                <div key={m.id} className={`ticker-in flex ${m.from === "admin" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${m.from === "admin" ? "rounded-bl-md bg-teal-600 text-white" : "rounded-br-md border border-ink-100 bg-white text-ink-800"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={`mt-1 text-[10px] ${m.from === "admin" ? "text-white/70" : "text-mist-300"}`}>{fmtDate(m.time)}{m.from === "user" && m.read ? " · خوانده شد" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
            {err && <p className="border-t border-ink-100 bg-[#E14B4B]/10 px-6 py-2 text-xs font-bold text-[#E14B4B]">{err}</p>}
            <div className="flex items-center gap-3 border-t border-ink-100 bg-white p-4">
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`پاسخ به ${sel.firstName}…`} className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
              <button onClick={send} disabled={sending || !text.trim()} className="btn-shine flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-500 active:scale-95 disabled:opacity-50" aria-label="ارسال پاسخ">
                <Icon name="send" className="h-5 w-5 -scale-x-100" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────── تیکت‌ها ───────── */
function TicketsTab() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "answered" | "closed">("all");
  const [active, setActive] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = () => api.adminTickets().then((d) => setTickets(d.tickets)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا"));
  usePolling(load, 6000);
  usePolling(() => {
    if (active) api.ticket(active.id).then((d) => setActive(d.ticket)).catch(() => {});
  }, 4000, !!active);

  const send = async () => {
    if (!active || !reply.trim() || busy) return;
    setBusy(true);
    try {
      const d = await api.replyTicket(active.id, reply);
      setActive(d.ticket);
      setReply("");
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "ارسال نشد");
    } finally {
      setBusy(false);
    }
  };

  const close = async () => {
    if (!active || busy) return;
    setBusy(true);
    try {
      const d = await api.closeTicket(active.id);
      setActive(d.ticket);
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطا");
    } finally {
      setBusy(false);
    }
  };

  const shown = tickets?.filter((t) => filter === "all" || t.status === filter) ?? null;

  if (active) {
    const st = STATUS_FA[active.status];
    return (
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActive(null)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-800 transition-colors hover:border-teal-500 hover:text-teal-600" aria-label="بازگشت">
              <Icon name="arrow" className="h-4 w-4" />
            </button>
            <div>
              <p className="font-display text-xl text-ink-900">{active.subject}</p>
              <p className="text-xs text-mist-500">
                {active.user ? `${active.user.firstName} ${active.user.lastName} · ` : ""}
                <span dir="ltr" className="font-latin">{active.user?.phone}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${st.cls}`}>{st.label}</span>
            {active.status !== "closed" && (
              <button onClick={close} disabled={busy} className="rounded-full border border-[#E14B4B]/40 px-4 py-1.5 text-xs font-bold text-[#E14B4B] transition-colors hover:bg-[#E14B4B] hover:text-white disabled:opacity-50">بستن تیکت</button>
            )}
          </div>
        </div>
        <div className="max-h-[400px] space-y-3 overflow-y-auto p-6">
          {active.messages.map((m) => (
            <div key={m.id} className={`ticker-in flex ${m.from === "admin" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${m.from === "admin" ? "rounded-bl-md bg-teal-600 text-white" : "rounded-br-md border border-ink-100 bg-white text-ink-800"}`}>
                <p className="text-[10px] font-bold opacity-70">{m.from === "admin" ? "شما (پشتیبانی)" : "مشتری"}</p>
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className="mt-1 text-[10px] opacity-60">{fmtDate(m.time)}</p>
              </div>
            </div>
          ))}
        </div>
        {active.status !== "closed" ? (
          <div className="flex items-center gap-3 border-t border-ink-100 p-4">
            <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="پاسخ به مشتری…" className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
            <button onClick={send} disabled={busy || !reply.trim()} className="btn-shine flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-500 active:scale-95 disabled:opacity-50" aria-label="ارسال پاسخ">
              <Icon name="send" className="h-5 w-5 -scale-x-100" />
            </button>
          </div>
        ) : (
          <p className="border-t border-ink-100 bg-paper px-6 py-3 text-center text-xs font-bold text-mist-500">این تیکت بسته شده است.</p>
        )}
        {err && <p className="bg-[#E14B4B]/10 px-6 py-2 text-xs font-bold text-[#E14B4B]">{err}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {([["all", "همه"], ["open", "باز"], ["answered", "پاسخ داده"], ["closed", "بسته"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${filter === id ? "border-transparent bg-ink-950 text-white" : "border-ink-100 bg-white text-mist-500 hover:border-teal-500/50 hover:text-teal-600"}`}>{label}</button>
        ))}
      </div>
      {err && <p className="mb-4 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-xs font-bold text-[#E14B4B]">{err}</p>}
      {!shown && <p className="py-10 text-center text-sm text-mist-500">در حال دریافت…</p>}
      {shown && shown.length === 0 && (
        <div className="rounded-3xl border border-dashed border-ink-100 bg-white py-14 text-center">
          <Icon name="edit" className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-3 font-display text-xl text-ink-700">تیکتی در این وضعیت نیست</p>
        </div>
      )}
      <div className="space-y-3">
        {shown?.map((t) => {
          const st = STATUS_FA[t.status];
          const lastMsg = t.messages[t.messages.length - 1];
          return (
            <button key={t.id} onClick={() => { setActive(t); setErr(""); }} className="card-lift flex w-full items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 text-right">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-teal-400"><Icon name="edit" className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ink-900">{t.subject}</p>
                <p className="truncate text-xs text-mist-500">{t.user ? `${t.user.firstName} ${t.user.lastName} — ` : ""}{lastMsg?.text}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${st.cls}`}>{st.label}</span>
                <span className="text-[10px] text-mist-300">{fmtDate(t.updatedAt)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── کاربران ───────── */
function UsersTab() {
  const [users, setUsers] = useState<PubUser[] | null>(null);
  const [err, setErr] = useState("");
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = () => api.adminUsers().then((d) => setUsers(d.users)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا"));
  usePolling(load, 10000);

  const del = async (id: string) => {
    setBusy(true);
    try {
      await api.deleteUser(id);
      setConfirmDel(null);
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "حذف انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  const wipe = async () => {
    setBusy(true);
    try {
      await api.wipeUsers();
      setConfirmWipe(false);
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "حذف انجام نشد");
    } finally {
      setBusy(false);
    }
  };

  if (err)
    return (
      <div>
        <p className="rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-sm font-bold text-[#E14B4B]">{err}</p>
        <button onClick={() => setErr("")} className="mt-3 text-sm font-bold text-teal-600">بستن</button>
      </div>
    );
  if (!users) return <p className="py-10 text-center text-sm text-mist-500">در حال دریافت…</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist-500"><b className="font-display text-lg text-ink-900">{fa(users.length)}</b> کاربر ثبت‌نام‌کرده</p>
        {users.length > 0 && (
          <button onClick={() => (confirmWipe ? wipe() : setConfirmWipe(true))} disabled={busy} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-60 ${confirmWipe ? "bg-[#E14B4B] text-white" : "border border-[#E14B4B]/50 text-[#E14B4B] hover:bg-[#E14B4B]/10"}`}>
            <Icon name="trash" className="h-4 w-4" />
            {confirmWipe ? "مطمئنم — همه حذف شوند" : "حذف همه‌ی کاربران"}
          </button>
        )}
      </div>
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b-2 border-ink-100 bg-paper text-right">
                <th className="px-6 py-4 font-display text-base text-ink-900">کاربر</th>
                <th className="px-4 py-4 font-display text-base text-ink-900">شماره تماس</th>
                <th className="px-4 py-4 font-display text-base text-ink-900">ایمیل</th>
                <th className="px-4 py-4 font-display text-base text-ink-900">تاریخ ثبت‌نام</th>
                <th className="px-4 py-4 font-display text-base text-ink-900">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-mist-500">هنوز کاربری ثبت‌نام نکرده است.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-50 transition-colors last:border-0 hover:bg-ink-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 font-display text-base text-teal-400">{u.firstName[0]}</span>
                      <span className="font-bold text-ink-900">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-latin text-mist-500" dir="ltr" style={{ textAlign: "right" }}>{u.phone}</td>
                  <td className="px-4 py-4 text-xs text-mist-500">{u.email || "—"}</td>
                  <td className="px-4 py-4 text-xs text-mist-500">{fa(new Date(u.createdAt).toLocaleDateString("fa-IR"))}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => (confirmDel === u.id ? del(u.id) : setConfirmDel(u.id))} disabled={busy} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-60 ${confirmDel === u.id ? "bg-[#E14B4B] text-white" : "text-[#E14B4B] hover:bg-[#E14B4B]/10"}`}>
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      {confirmDel === u.id ? "تأیید حذف" : "حذف"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── بنر وضعیت دیتابیس ───────── */
function RecheckBtn({ onClick }: { onClick: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button onClick={() => { setBusy(true); onClick(); window.setTimeout(() => setBusy(false), 1500); }} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs font-bold text-mist-500 transition-all hover:border-teal-500/60 hover:text-teal-600">
      <Icon name="update" className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
      بررسی مجدد
    </button>
  );
}

function DbHealthBanner({ health, onRecheck }: { health: HealthReport | null; onRecheck: () => void }) {
  if (!health)
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-4">
        <span className="pulse-dot h-3 w-3 rounded-full bg-teal-500" />
        <p className="text-sm font-bold text-mist-500">در حال بررسی اتصال به دیتابیس ابری…</p>
      </div>
    );
  if (health.unreachable)
    return (
      <div className="mb-6 rounded-2xl border border-[#E14B4B]/40 bg-[#E14B4B]/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon name="server" className="mt-0.5 h-5 w-5 shrink-0 text-[#E14B4B]" />
            <div>
              <p className="text-sm font-bold text-[#E14B4B]">بک‌اند در دسترس نیست</p>
              <p className="mt-1 text-xs leading-6 text-mist-500">{health.reason} — در این حالت داده‌ها موقتاً در مرورگر خودتان ذخیره می‌شوند.</p>
            </div>
          </div>
          <RecheckBtn onClick={onRecheck} />
        </div>
      </div>
    );
  if (health.ok)
    return (
      <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-teal-500/40 bg-teal-500/10 px-5 py-4">
        <div className="flex items-start gap-3">
          <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-bold text-teal-600">دیتابیس ابری فعال است</p>
            <p className="mt-0.5 text-xs leading-6 text-mist-500">
              کاربران، تیکت‌ها و گفتگوها در Upstash Redis ذخیره می‌شوند و بین همه‌ی دستگاه‌ها مشترک‌اند.
              {health.ping?.ms !== undefined && <span className="font-latin" dir="ltr"> · ping: {health.ping.ms}ms</span>}
            </p>
          </div>
        </div>
        <RecheckBtn onClick={onRecheck} />
      </div>
    );
  const presentVars = health.env ? Object.entries(health.env).filter(([, on]) => on).map(([k]) => k) : [];
  const missingVars = health.env ? Object.entries(health.env).filter(([, on]) => !on).map(([k]) => k) : [];
  const detail = health.moduleError || health.ping?.error;
  const hasBase = !!(health.env?.KV_REST_API_URL && health.env?.KV_REST_API_TOKEN);
  return (
    <div className="mb-6 rounded-2xl border border-gold-500/50 bg-gold-500/10 px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gold-600">{hasBase ? "اتصال به دیتابیس برقرار نشد — دلیل واقعی:" : "دیتابیس ابری فعال نیست — داده‌ها فقط محلی ذخیره می‌شوند"}</p>
            {detail && <p dir="ltr" className="mt-1.5 overflow-x-auto rounded-lg bg-ink-950/5 px-3 py-2 font-latin text-[11px] leading-5 text-ink-800" style={{ textAlign: "left" }}>{detail}</p>}
            <p className="mt-1.5 text-xs leading-6 text-mist-500">
              {hasBase ? "متغیرها تنظیم‌اند ولی تست واقعی نوشتن/خواندن روی Redis ناموفق بود. جزئیات در کادر بالا آمده است." : "متغیرهای اتصال در Runtime دیده نمی‌شوند. در داشبورد Vercel مطمئن شوید KV_REST_API_URL و KV_REST_API_TOKEN برای Production فعال‌اند و سپس Redeploy بزنید."}
            </p>
            {health.env && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {presentVars.map((k) => <span key={k} dir="ltr" className="flex items-center gap-1 rounded-md bg-teal-500/15 px-2 py-1 font-latin text-[10px] text-teal-600"><Icon name="check" className="h-3 w-3" /> {k}</span>)}
                {missingVars.slice(0, 4).map((k) => <span key={k} dir="ltr" className="flex items-center gap-1 rounded-md bg-[#E14B4B]/10 px-2 py-1 font-latin text-[10px] text-[#E14B4B]"><Icon name="close" className="h-3 w-3" /> {k}</span>)}
              </div>
            )}
          </div>
        </div>
        <RecheckBtn onClick={onRecheck} />
      </div>
    </div>
  );
}

/* ───────── پنل اصلی ───────── */
export default function AdminPanel({ user, onLogout, nav }: { user: PubUser; onLogout: () => void; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<"chats" | "tickets" | "users">("chats");
  const [stats, setStats] = useState<{ users: number; tickets: number; openTickets: number } | null>(null);
  const [err, setErr] = useState("");
  const [health, setHealth] = useState<HealthReport | null>(null);

  const recheckHealth = () => {
    setHealth(null);
    api.health().then(setHealth);
  };
  useEffect(() => {
    recheckHealth();
  }, []);

  usePolling(() => {
    api.adminStats().then(setStats).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا در ارتباط با بک‌اند"));
  }, 8000);

  const tabs = [
    { id: "chats" as const, label: "گفتگوها", icon: "chat" },
    { id: "tickets" as const, label: "تیکت‌ها", icon: "edit" },
    { id: "users" as const, label: "کاربران", icon: "users" },
  ];

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-14 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[340px] w-[340px] rounded-full bg-gold-500/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="reveal font-latin text-xs tracking-[0.35em] text-gold-400">ADMIN PANEL</p>
              <h1 className="reveal mt-3"><span className="line-mask"><span className="font-display text-5xl leading-none text-white sm:text-6xl">پنل مدیریت</span></span></h1>
              <p className="reveal mt-3 text-sm text-mist-300">خوش آمدید، {user.firstName} — گفتگوها، تیکت‌ها و کاربران اینجاست.</p>
            </div>
            <div className="reveal flex items-center gap-3">
              <button onClick={() => nav({ page: "home" })} className="rounded-xl border border-ink-600 px-5 py-3 text-sm font-semibold text-ink-100 transition-colors hover:border-teal-500 hover:text-teal-400">بازگشت به سایت</button>
              <button onClick={onLogout} className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02]">
                <Icon name="close" className="h-4 w-4" />
                خروج
              </button>
            </div>
          </div>
          <div className="reveal mt-10 grid grid-cols-3 gap-4" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
            {[
              { label: "کاربران", v: stats?.users, icon: "users" },
              { label: "تیکت‌های باز", v: stats?.openTickets, icon: "edit" },
              { label: "کل تیکت‌ها", v: stats?.tickets, icon: "check" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-ink-700/60 bg-ink-900/50 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400"><Icon name={s.icon} className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-3xl leading-none text-white">{s.v === undefined || s.v === null ? "—" : fa(s.v)}</p>
                  <p className="mt-1 text-xs text-mist-300">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {err && (
            <div className="reveal mb-6 rounded-2xl border border-[#E14B4B]/40 bg-[#E14B4B]/10 px-5 py-4 text-sm font-bold text-[#E14B4B]">
              {err}
              <p className="mt-1 font-normal text-mist-500">اگر در محیط پیش‌نمایش هستید، بک‌اند فقط روی دامنه‌ی اصلی (بعد از فعال‌سازی KV در Vercel) کار می‌کند.</p>
            </div>
          )}

          <DbHealthBanner health={health} onRecheck={recheckHealth} />

          <div className="reveal mb-8 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${tab === t.id ? "border-transparent bg-ink-950 text-white shadow-lg" : "border-ink-100 bg-white text-mist-500 hover:border-gold-500/50 hover:text-gold-600"}`}>
                <Icon name={t.icon} className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "chats" && <ChatsTab />}
          {tab === "tickets" && <TicketsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </section>
    </div>
  );
}
/* ───────── بنر وضعیت واقعی دیتابیس ابری ───────── */
function DbHealthBanner({ health, onRecheck }: { health: HealthReport | null; onRecheck: () => void }) {
  if (!health) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-4">
        <span className="pulse-dot h-3 w-3 rounded-full bg-teal-500" />
        <p className="text-sm font-bold text-mist-500">در حال بررسی اتصال به دیتابیس ابری…</p>
      </div>
    );
  }
  if (health.unreachable) {
    return (
      <div className="mb-6 rounded-2xl border border-[#E14B4B]/40 bg-[#E14B4B]/10 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon name="server" className="mt-0.5 h-5 w-5 shrink-0 text-[#E14B4B]" />
            <div>
              <p className="text-sm font-bold text-[#E14B4B]">بک‌اند در دسترس نیست</p>
              <p className="mt-1 text-xs leading-6 text-mist-500">{health.reason} — در این حالت داده‌ها موقتاً در مرورگر خودتان ذخیره می‌شوند.</p>
            </div>
          </div>
          <RecheckBtn onClick={onRecheck} />
        </div>
      </div>
    );
  }
  if (health.ok) {
    return (
      <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-teal-500/40 bg-teal-500/10 px-5 py-4">
        <div className="flex items-start gap-3">
          <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <div>
            <p className="text-sm font-bold text-teal-600">دیتابیس ابری فعال است</p>
            <p className="mt-0.5 text-xs leading-6 text-mist-500">
              کاربران، تیکت‌ها و گفتگوها در Upstash Redis ذخیره می‌شوند و بین همه‌ی دستگاه‌ها مشترک‌اند.
              {health.ping?.ms !== undefined && <span className="font-latin" dir="ltr"> · ping: {health.ping.ms}ms</span>}
            </p>
          </div>
        </div>
        <RecheckBtn onClick={onRecheck} />
      </div>
    );
  }
  const presentVars = health.env ? Object.entries(health.env).filter(([, on]) => on).map(([k]) => k) : [];
  const missingVars = health.env ? Object.entries(health.env).filter(([, on]) => !on).map(([k]) => k) : [];
  const detail = health.moduleError || health.ping?.error;
  const hasBase = !!(health.env?.KV_REST_API_URL && health.env?.KV_REST_API_TOKEN);
  return (
    <div className="mb-6 rounded-2xl border border-gold-500/50 bg-gold-500/10 px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gold-600">
              {hasBase ? "اتصال به دیتابیس برقرار نشد — دلیل واقعی:" : "دیتابیس ابری فعال نیست — داده‌ها فقط محلی ذخیره می‌شوند"}
            </p>
            {detail && (
              <p dir="ltr" className="mt-1.5 overflow-x-auto rounded-lg bg-ink-950/5 px-3 py-2 font-latin text-[11px] leading-5 text-ink-800" style={{ textAlign: "left" }}>
                {detail}
              </p>
            )}
            <p className="mt-1.5 text-xs leading-6 text-mist-500">
              {hasBase
                ? "متغیرها تنظیم‌اند ولی تست واقعی نوشتن/خواندن روی Redis ناموفق بود. جزئیات در کادر بالا آمده است."
                : "متغیرهای اتصال در Runtime دیده نمی‌شوند. در داشبورد Vercel مطمئن شوید KV_REST_API_URL و KV_REST_API_TOKEN برای Production فعال‌اند و سپس Redeploy بزنید."}
            </p>
            {health.env && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {presentVars.map((k) => (
                  <span key={k} dir="ltr" className="flex items-center gap-1 rounded-md bg-teal-500/15 px-2 py-1 font-latin text-[10px] text-teal-600">
                    <Icon name="check" className="h-3 w-3" /> {k}
                  </span>
                ))}
                {missingVars.slice(0, 4).map((k) => (
                  <span key={k} dir="ltr" className="flex items-center gap-1 rounded-md bg-[#E14B4B]/10 px-2 py-1 font-latin text-[10px] text-[#E14B4B]">
                    <Icon name="close" className="h-3 w-3" /> {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <RecheckBtn onClick={onRecheck} />
      </div>
    </div>
  );
}

function RecheckBtn({ onClick }: { onClick: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={() => {
        setBusy(true);
        onClick();
        window.setTimeout(() => setBusy(false), 1500);
      }}
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs font-bold text-mist-500 transition-all hover:border-teal-500/60 hover:text-teal-600"
    >
      <Icon name="update" className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} />
      بررسی مجدد
    </button>
  );
}

import { useEffect, useRef, useState } from "react";
import { api, ApiError, type ChatMsg, type PubUser, type Ticket } from "../api";
import { fa, usePolling, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const fmtTime = (t: number) =>
  fa(new Date(t).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }));
const fmtDate = (t: number) => fa(new Date(t).toLocaleDateString("fa-IR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }));

const PRIORITY_FA: Record<string, string> = { low: "کم", normal: "عادی", high: "فوری" };
const STATUS_FA: Record<string, { label: string; cls: string }> = {
  open: { label: "باز", cls: "bg-teal-500/15 text-teal-600" },
  answered: { label: "پاسخ داده شد", cls: "bg-gold-500/15 text-gold-600" },
  closed: { label: "بسته", cls: "bg-ink-100/70 text-mist-500" },
};

/** فیلد رمز با دکمه‌ی چشم */
function PassField({ value, onChange, placeholder, cls }: { value: string; onChange: (v: string) => void; placeholder: string; cls: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cls + " text-left pl-11"}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
        title={show ? "پنهان کردن رمز" : "نمایش رمز"}
        className={`absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-200 ${
          show ? "bg-teal-500/12 text-teal-600" : "text-mist-500 hover:bg-ink-50 hover:text-teal-600"
        }`}
      >
        <Icon name={show ? "eyeoff" : "eye"} className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}

/* ───────── چت با پشتیبانی ───────── */
function ChatPane() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  usePolling(() => {
    api.chat().then((d) => setMsgs(d.messages)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا در دریافت"));
  }, 4000);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setErr("");
    try {
      const d = await api.sendChat(text);
      setMsgs((m) => [...m, d.message]);
      setText("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "ارسال نشد");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[540px] flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-paper px-6 py-4">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-teal-400">
          <Icon name="headset" className="h-5.5 w-5.5" />
          <span className="pulse-dot absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />
        </span>
        <div>
          <p className="font-display text-xl text-ink-900">پشتیبانی تیسافت</p>
          <p className="text-xs text-mist-500">پیام‌ها هر چند ثانیه به‌روز می‌شوند</p>
        </div>
      </div>

      <div ref={boxRef} className="grid-lines flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-6">
        {msgs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Icon name="chat" className="h-12 w-12 text-ink-300" />
            <p className="font-display text-xl text-ink-700">اولین پیام را بنویسید</p>
            <p className="max-w-xs text-sm leading-7 text-mist-500">سوال، مشکل یا درخواست‌تان را بنویسید — پشتیبانی همین‌جا پاسخ می‌دهد.</p>
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={`ticker-in flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4.5 py-3 text-sm leading-7 shadow-sm ${
              m.from === "user" ? "rounded-bl-md bg-teal-600 text-white" : "rounded-br-md border border-ink-100 bg-white text-ink-800"
            }`} style={{ paddingLeft: 18, paddingRight: 18 }}>
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
              <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-white/70" : "text-mist-300"}`}>{fmtTime(m.time)}</p>
            </div>
          </div>
        ))}
      </div>

      {err && <p className="border-t border-ink-100 bg-[#E14B4B]/10 px-6 py-2 text-xs font-bold text-[#E14B4B]">{err}</p>}

      <div className="flex items-center gap-3 border-t border-ink-100 bg-white p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="پیام خود را بنویسید…"
          className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="btn-shine flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-500 active:scale-95 disabled:opacity-50"
          aria-label="ارسال پیام"
        >
          <Icon name="send" className="h-5 w-5 -scale-x-100" />
        </button>
      </div>
    </div>
  );
}

/* ───────── تیکت‌ها ───────── */
function TicketsPane() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [active, setActive] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [desc, setDesc] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = () => api.tickets().then((d) => setTickets(d.tickets)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا"));
  usePolling(load, 6000);
  usePolling(() => {
    if (active) api.ticket(active.id).then((d) => setActive(d.ticket)).catch(() => {});
  }, 5000, !!active);

  const create = async () => {
    if (!subject.trim() || !desc.trim()) {
      setErr("موضوع و شرح تیکت را بنویسید");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const d = await api.createTicket({ subject, priority, text: desc });
      setShowNew(false);
      setSubject("");
      setDesc("");
      setActive(d.ticket);
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطا در ساخت تیکت");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    if (!active || !reply.trim()) return;
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

  /* نمای جزئیات یک تیکت */
  if (active) {
    const st = STATUS_FA[active.status];
    return (
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActive(null)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-800 transition-colors hover:border-teal-500 hover:text-teal-600" aria-label="بازگشت">
              <Icon name="arrow" className="h-4.5 w-4.5 rotate-180" />
            </button>
            <div>
              <p className="font-display text-xl text-ink-900">{active.subject}</p>
              <p className="text-xs text-mist-500">اولویت: {PRIORITY_FA[active.priority]} · {fmtDate(active.createdAt)}</p>
            </div>
          </div>
          <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${st.cls}`}>{st.label}</span>
        </div>

        <div className="max-h-[380px] space-y-3 overflow-y-auto p-6">
          {active.messages.map((m) => (
            <div key={m.id} className={`ticker-in flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4.5 py-3 text-sm leading-7 ${
                m.from === "user" ? "rounded-bl-md bg-teal-600 text-white" : "rounded-br-md border border-gold-500/40 bg-gold-100/40 text-ink-800"
              }`} style={{ paddingLeft: 18, paddingRight: 18 }}>
                <p className="text-[10px] font-bold opacity-70">{m.from === "user" ? "شما" : "پشتیبانی تیسافت"}</p>
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className="mt-1 text-[10px] opacity-60">{fmtDate(m.time)}</p>
              </div>
            </div>
          ))}
        </div>

        {active.status !== "closed" && (
          <div className="flex items-center gap-3 border-t border-ink-100 p-4">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
              placeholder="پاسخ خود را بنویسید…"
              className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
            <button onClick={sendReply} disabled={busy || !reply.trim()} className="btn-shine flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-500 active:scale-95 disabled:opacity-50" aria-label="ارسال پاسخ">
              <Icon name="send" className="h-5 w-5 -scale-x-100" />
            </button>
          </div>
        )}
        {active.status === "closed" && (
          <p className="border-t border-ink-100 bg-paper px-6 py-3 text-center text-xs font-bold text-mist-500">این تیکت بسته شده است — برای ادامه، تیکت جدید بسازید.</p>
        )}
        {err && <p className="bg-[#E14B4B]/10 px-6 py-2 text-xs font-bold text-[#E14B4B]">{err}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-display text-2xl text-ink-900">تیکت‌های من {tickets && <span className="text-mist-300">({fa(tickets.length)})</span>}</p>
        <button onClick={() => { setShowNew(!showNew); setErr(""); }} className="btn-shine flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-500">
          <Icon name="plus" className="h-4 w-4" />
          تیکت جدید
        </button>
      </div>

      {showNew && (
        <div className="ticker-in mb-6 space-y-4 rounded-3xl border-2 border-teal-500/40 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-ink-900">موضوع تیکت *</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="مثلاً: مشکل در نصب کپیتال" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-ink-900">اولویت</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15">
                <option value="low">کم</option>
                <option value="normal">عادی</option>
                <option value="high">فوری</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-900">شرح مشکل *</span>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="مشکل را با جزئیات توضیح دهید…" className="w-full resize-none rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
          </label>
          <div className="flex gap-3">
            <button onClick={create} disabled={busy} className="btn-shine flex-1 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500 disabled:opacity-60">
              {busy ? "در حال ثبت…" : "ثبت تیکت"}
            </button>
            <button onClick={() => setShowNew(false)} className="rounded-xl border border-ink-100 px-6 py-3.5 text-sm font-bold text-mist-500 transition-colors hover:border-[#E14B4B]/50 hover:text-[#E14B4B]">انصراف</button>
          </div>
        </div>
      )}

      {err && <p className="mb-4 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-xs font-bold text-[#E14B4B]">{err}</p>}

      {tickets === null && <p className="py-10 text-center text-sm text-mist-500">در حال دریافت…</p>}
      {tickets && tickets.length === 0 && (
        <div className="rounded-3xl border border-dashed border-ink-100 bg-white py-14 text-center">
          <Icon name="edit" className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-3 font-display text-xl text-ink-700">هنوز تیکتی نساخته‌اید</p>
          <p className="mt-1 text-sm text-mist-500">اولین تیکت را بسازید تا پشتیبانی پیگیری کند.</p>
        </div>
      )}

      <div className="space-y-3">
        {tickets?.map((t) => {
          const st = STATUS_FA[t.status];
          const lastMsg = t.messages[t.messages.length - 1];
          return (
            <button key={t.id} onClick={() => { setActive(t); setErr(""); }} className="card-lift flex w-full items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 text-right">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-teal-400">
                <Icon name="edit" className="h-5.5 w-5.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ink-900">{t.subject}</p>
                <p className="truncate text-xs text-mist-500">{lastMsg?.from === "admin" ? "پشتیبانی: " : ""}{lastMsg?.text}</p>
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

/* ───────── حساب کاربری ───────── */
function AccountPane({ user, onUser }: { user: PubUser; onUser: (u: PubUser) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const saveName = async () => {
    setBusy(true); setMsg(""); setErr("");
    try {
      const d = await api.update({ firstName, lastName });
      onUser(d.user);
      setMsg("مشخصات ذخیره شد");
    } catch (e) { setErr(e instanceof ApiError ? e.message : "خطا"); }
    finally { setBusy(false); }
  };
  const savePass = async () => {
    setBusy(true); setMsg(""); setErr("");
    try {
      await api.changePassword({ oldPass, newPass });
      setOldPass(""); setNewPass("");
      setMsg("رمز عبور تغییر کرد");
    } catch (e) { setErr(e instanceof ApiError ? e.message : "خطا"); }
    finally { setBusy(false); }
  };

  const cls = "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-ink-100 bg-white p-7">
        <p className="font-display text-2xl text-ink-900">مشخصات</p>
        <p className="mt-1 text-xs text-mist-500">شماره موبایل: <span dir="ltr" className="font-latin">{user.phone}</span></p>
        <div className="mt-5 space-y-4">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="نام" className={cls} />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="نام خانوادگی" className={cls} />
          <button onClick={saveName} disabled={busy} className="btn-shine w-full rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500 disabled:opacity-60">ذخیره مشخصات</button>
        </div>
      </div>
      <div className="rounded-3xl border border-ink-100 bg-white p-7">
        <p className="font-display text-2xl text-ink-900">تغییر رمز عبور</p>
        <div className="mt-5 space-y-4">
          <PassField value={oldPass} onChange={setOldPass} placeholder="رمز فعلی" cls={cls} />
          <PassField value={newPass} onChange={setNewPass} placeholder="رمز جدید (حداقل ۴ حرف)" cls={cls} />
          <button onClick={savePass} disabled={busy} className="btn-shine w-full rounded-xl bg-ink-900 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-600 disabled:opacity-60">تغییر رمز</button>
        </div>
      </div>
      {(msg || err) && (
        <p className={`lg:col-span-2 rounded-xl px-4 py-3 text-sm font-bold ${err ? "bg-[#E14B4B]/10 text-[#E14B4B]" : "bg-teal-100 text-teal-600"}`}>{err || msg}</p>
      )}
    </div>
  );
}

/* ───────── پنل اصلی ───────── */
export default function UserPanel({ user, onUser, onLogout, nav }: { user: PubUser; onUser: (u: PubUser) => void; onLogout: () => void; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<"chat" | "tickets" | "account">("chat");

  const tabs = [
    { id: "chat" as const, label: "چت با پشتیبانی", icon: "chat" },
    { id: "tickets" as const, label: "تیکت‌های من", icon: "edit" },
    { id: "account" as const, label: "حساب کاربری", icon: "users" },
  ];

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-14 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[340px] w-[340px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">MY PANEL</p>
            <h1 className="reveal mt-3">
              <span className="line-mask"><span className="font-display text-5xl leading-none text-white sm:text-6xl">سلام، {user.firstName} {user.lastName}</span></span>
            </h1>
            <p className="reveal mt-3 text-sm text-mist-300">خوش آمدید — چت، تیکت و حساب کاربری شما اینجاست.</p>
          </div>
          <div className="reveal flex items-center gap-3">
            <button onClick={() => nav({ page: "home" })} className="rounded-xl border border-ink-600 px-5 py-3 text-sm font-semibold text-ink-100 transition-colors hover:border-teal-500 hover:text-teal-400">
              بازگشت به سایت
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-[#0c1f19] transition-transform hover:scale-[1.02]">
              <Icon name="close" className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="reveal mb-8 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                  tab === t.id ? "border-transparent bg-ink-950 text-white shadow-lg" : "border-ink-100 bg-white text-mist-500 hover:border-teal-500/50 hover:text-teal-600"
                }`}
              >
                <Icon name={t.icon} className="h-4.5 w-4.5" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "chat" && <ChatPane />}
          {tab === "tickets" && <TicketsPane />}
          {tab === "account" && <AccountPane user={user} onUser={onUser} />}
        </div>
      </section>
    </div>
  );
}

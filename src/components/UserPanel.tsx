import { useState } from "react";
import { api, ApiError, type ChatMsg, type PubUser, type Ticket } from "../api";
import { fa, usePolling, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const fmtDate = (t: number) => fa(new Date(t).toLocaleDateString("fa-IR", { day: "numeric", month: "long" }));

export default function UserPanel({ user, onLogout, nav }: { user: PubUser; onLogout: () => void; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<"tickets" | "chat" | "account">("tickets");
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  usePolling(() => {
    api.tickets().then((d) => setTickets(d.tickets)).catch((e) => setErr(e instanceof ApiError ? e.message : "خطا"));
  }, 6000);
  usePolling(() => {
    api.chat().then((d) => setMsgs(d.messages)).catch(() => {});
  }, 4000, tab === "chat");

  const sendTicket = async () => {
    if (!subject.trim() || !body.trim() || busy) return;
    setBusy(true);
    try {
      await api.createTicket({ subject, priority: "normal", text: body });
      setSubject("");
      setBody("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطا");
    } finally {
      setBusy(false);
    }
  };

  const sendChat = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await api.sendChat(text);
      setText("");
      const d = await api.chat();
      setMsgs(d.messages);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطا");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-14">
        <div className="pointer-events-none absolute -left-32 top-0 h-[300px] w-[300px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">USER PANEL</p>
              <h1 className="reveal mt-3"><span className="line-mask"><span className="font-display text-5xl leading-none text-white sm:text-6xl">پنل کاربری</span></span></h1>
              <p className="reveal mt-3 text-sm text-mist-300">خوش آمدید، {user.firstName} {user.lastName} — تیکت‌ها و چت پشتیبانی اینجاست.</p>
            </div>
            <button onClick={onLogout} className="reveal flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02]">
              <Icon name="close" className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {err && <p className="mb-4 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-sm font-bold text-[#E14B4B]">{err}</p>}
          <div className="reveal mb-8 flex flex-wrap gap-2">
            {([["tickets", "تیکت‌ها", "edit"], ["chat", "چت پشتیبانی", "chat"], ["account", "حساب کاربری", "users"]] as const).map(([id, label, icon]) => (
              <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${tab === id ? "border-transparent bg-ink-950 text-white shadow-lg" : "border-ink-100 bg-white text-mist-500 hover:border-teal-500/50 hover:text-teal-600"}`}>
                <Icon name={icon} className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === "tickets" && (
            <div className="space-y-6">
              <div className="reveal card-pro p-6">
                <h2 className="font-display text-xl text-ink-900">تیکت جدید</h2>
                <div className="mt-4 space-y-3">
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع تیکت…" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                  <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="شرح مشکل یا سوال…" className="w-full resize-none rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                  <button onClick={sendTicket} disabled={busy || !subject.trim() || !body.trim()} className="btn-shine rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-50">ارسال تیکت</button>
                </div>
              </div>
              {!tickets && <p className="py-8 text-center text-sm text-mist-500">در حال دریافت…</p>}
              {tickets && tickets.length === 0 && <p className="reveal card-pro py-10 text-center text-sm text-mist-500">هنوز تیکتی نساخته‌اید.</p>}
              {tickets?.map((t) => (
                <div key={t.id} className="reveal card-pro p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-lg text-ink-900">{t.subject}</p>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${t.status === "open" ? "bg-teal-500/15 text-teal-600" : t.status === "answered" ? "bg-gold-500/15 text-gold-600" : "bg-ink-100/70 text-mist-500"}`}>
                      {t.status === "open" ? "باز" : t.status === "answered" ? "پاسخ داده شد" : "بسته"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mist-300">{fmtDate(t.updatedAt)}</p>
                  <div className="mt-3 space-y-2">
                    {t.messages.map((m) => (
                      <p key={m.id} className={`rounded-xl px-4 py-2.5 text-sm leading-7 ${m.from === "admin" ? "bg-teal-500/10 text-ink-800" : "bg-ink-50 text-mist-500"}`}>
                        <b className="text-[11px]">{m.from === "admin" ? "پشتیبانی: " : "شما: "}</b>{m.text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "chat" && (
            <div className="reveal flex h-[480px] flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white">
              <div className="border-b border-ink-100 bg-paper px-6 py-4"><p className="font-display text-xl text-ink-900">چت با پشتیبانی</p></div>
              <div className="grid-lines flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-6">
                {msgs.length === 0 && <p className="py-10 text-center text-sm text-mist-500">پیامی نیست — اولین پیام را بنویسید.</p>}
                {msgs.map((m) => (
                  <div key={m.id} className={`ticker-in flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${m.from === "user" ? "rounded-br-md bg-teal-600 text-white" : "rounded-bl-md border border-ink-100 bg-white text-ink-800"}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-ink-100 bg-white p-4">
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="پیام خود را بنویسید…" className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                <button onClick={sendChat} disabled={busy || !text.trim()} className="btn-shine flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-500 disabled:opacity-50" aria-label="ارسال">
                  <Icon name="send" className="h-5 w-5 -scale-x-100" />
                </button>
              </div>
            </div>
          )}

          {tab === "account" && (
            <div className="reveal card-pro p-8">
              <h2 className="font-display text-2xl text-ink-900">حساب کاربری</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-ink-50 pb-3"><dt className="font-bold text-ink-900">نام و نام خانوادگی</dt><dd className="text-mist-500">{user.firstName} {user.lastName}</dd></div>
                <div className="flex justify-between border-b border-ink-50 pb-3"><dt className="font-bold text-ink-900">شماره تماس</dt><dd dir="ltr" className="font-latin text-mist-500">{user.phone}</dd></div>
                <div className="flex justify-between border-b border-ink-50 pb-3"><dt className="font-bold text-ink-900">ایمیل</dt><dd className="text-mist-500">{user.email || "—"}</dd></div>
                <div className="flex justify-between"><dt className="font-bold text-ink-900">تاریخ ثبت‌نام</dt><dd className="text-mist-500">{fmtDate(user.createdAt)}</dd></div>
              </dl>
              <button onClick={() => nav({ page: "home" })} className="mt-8 text-sm font-bold text-teal-600">بازگشت به سایت</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

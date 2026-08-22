import { useEffect, useRef, useState } from "react";
import { currentUser, getMessages, loginUser, markRead, registerUser, sendMessage, useStoreTick } from "../store";
import { PHONE_FA, PHONE_TEL } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const WORK_HOURS: [number, number][] = [
  [9, 14],
  [17, 22],
];

function isWorkingNow(): boolean {
  try {
    const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tehran" }).format(new Date()));
    return WORK_HOURS.some(([a, b]) => h >= a && h < b);
  } catch {
    return true;
  }
}

function nowTime(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-nu-fa", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date());
  } catch {
    return "";
  }
}

function smartReply(text: string, online: boolean): string {
  if (!online)
    return "الان خارج از ساعت کاری هستیم (۹ تا ۱۴ و ۱۷ تا ۲۲). پیام‌تان ثبت شد و در پنل مدیریت دیده می‌شود؛ اولین ساعت کاری با شما تماس می‌گیریم.";
  if (/(قیمت|هزینه|چند|تومان|خرید)/.test(text))
    return "برای استعلام قیمت، نام محصول و نوع کسب‌وکارتان را بنویسید؛ همین‌جا یا تلفنی، همان امروز قیمت دقیق را می‌گوییم.";
  if (/(دانلود|نصب|لینک|فایل)/.test(text))
    return "همه‌ی فایل‌های نصب و آپدیت در صفحه‌ی «دانلودها» هست. اگر فایلی پیدا نکردید، بگویید تا لینک مستقیمش را برایتان بفرستیم.";
  if (/(کپیتال|ارز|دلار|افغانی|درهم|یورو)/.test(text))
    return "کپیتال نرم‌افزار حسابداری چندارزی ماست: ارز پایه، نرخ روزانه و تبدیل مانده به هر ارز. می‌توانید دمو رایگان بگیرید — چه روزی مناسب‌تان است؟";
  if (/(تیسافت|فروشگاه|صندوق|فاکتور|بارکد)/.test(text))
    return "تیسافت حسابداری فروشگاهی ماست — تک‌کاربره و تحت شبکه، با ماژول نقره‌ای و طلایی. نسخه آزمایشی رایگان را می‌توانید از صفحه دانلودها بگیرید.";
  if (/(پشتیبان|مشکل|خطا|خراب|کار نمی|بکاپ)/.test(text))
    return "متأسفم که به مشکل خوردید. لطفاً متن دقیق خطا را بنویسید؛ اگر لازم باشد با اتصال امن صفحه‌تان را می‌بینیم و همان‌جا حلش می‌کنیم.";
  if (/(سلام|درود|هی|وقت بخیر)/.test(text))
    return "سلام! خوش آمدید. چطور می‌توانم کمکتان کنم؟ سوال درباره محصولات، قیمت یا پشتیبانی؟";
  return "پیام‌تان رسید و برای تیم پشتیبانی ارسال شد. اگر عجله دارید با تلفن مستقیم تماس بگیرید.";
}

/** فرم مشخصات — داخل ویجت، برای کاربر واردنشده */
function IdentityGate({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [f, setF] = useState({ firstName: "", lastName: "", phone: "", pass: "" });
  const [err, setErr] = useState("");
  const isLogin = mode === "login";
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!f.phone.trim() || !f.pass.trim()) return setErr("شماره تماس و رمز عبور لازم است");
    if (!isLogin && (!f.firstName.trim() || !f.lastName.trim())) return setErr("نام و نام خانوادگی را بنویسید تا بدانیم با چه کسی صحبت می‌کنیم");
    const res = isLogin ? loginUser(f.phone, f.pass) : registerUser(f.firstName, f.lastName, f.phone, f.pass);
    if (!res.ok) return setErr(res.error ?? "خطایی رخ داد");
    onDone();
  };

  const cls = "w-full rounded-xl border border-ink-600/60 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-mist-300/60 focus:border-teal-500 focus:outline-none";

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-teal-500/10 px-3.5 py-2.5 text-[11px] leading-5 text-teal-300">
        <Icon name="lock" className="h-4 w-4 shrink-0" />
        برای شروع گفتگو، مشخصات‌تان را وارد کنید تا تیم پشتیبانی بداند با چه کسی صحبت می‌کند.
      </div>
      <div className="mb-3 flex rounded-lg border border-ink-600/60 bg-ink-950 p-1">
        {[
          { id: "register" as const, label: "ثبت‌نام سریع" },
          { id: "login" as const, label: "ورود" },
        ].map((t) => (
          <button key={t.id} onClick={() => setMode(t.id)} className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all ${mode === t.id ? "bg-teal-500 text-ink-950" : "text-mist-300"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-2.5">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-2.5">
            <input value={f.firstName} onChange={set("firstName")} placeholder="نام" className={cls} />
            <input value={f.lastName} onChange={set("lastName")} placeholder="نام خانوادگی" className={cls} />
          </div>
        )}
        <input value={f.phone} onChange={set("phone")} placeholder="شماره تماس" className={cls} dir="ltr" style={{ textAlign: "right" }} />
        <input type="password" value={f.pass} onChange={set("pass")} placeholder={isLogin ? "رمز عبور" : "رمز عبور (حداقل ۴ حرف)"} className={cls} dir="ltr" style={{ textAlign: "right" }} />
        {err && <p className="ticker-in text-[11px] font-bold text-[#ff9d94]">{err}</p>}
        <button type="submit" className="btn-shine w-full rounded-xl bg-teal-500 py-2.5 text-sm font-bold text-ink-950 transition-colors hover:bg-teal-400">
          {isLogin ? "ورود و شروع گفتگو" : "ساخت حساب و شروع گفتگو"}
        </button>
      </form>
    </div>
  );
}

export default function ChatWidget({ nav }: { nav: NavFn }) {
  useStoreTick();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const user = currentUser();
  const online = isWorkingNow();
  const msgs = user ? getMessages(user.id) : [];

  useEffect(() => {
    if (open && user) markRead(user.id, "user");
  }, [open, user, msgs.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length, typing, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !user || typing) return;
    setDraft("");
    sendMessage(user.id, "user", text);
    setTyping(true);
    window.setTimeout(() => {
      sendMessage(user.id, "admin", smartReply(text, online), true);
      setTyping(false);
    }, 1000 + Math.random() * 700);
  };

  return (
    <>
      {/* دکمه‌ی شناور */}
      <button
        onClick={() => setOpen(true)}
        aria-label="چت آنلاین با پشتیبانی"
        title="چت آنلاین"
        className={`group fixed bottom-6 right-6 z-[75] flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-ink-950 shadow-[0_14px_34px_-10px_rgba(23,176,166,0.65)] transition-all duration-300 hover:scale-110 hover:bg-teal-400 ${open ? "pointer-events-none scale-0 opacity-0" : ""}`}
      >
        <span className="chat-ping absolute inset-0 rounded-full bg-teal-500/50" aria-hidden />
        <Icon name="chat" className="h-7 w-7" />
        <span className={`absolute -left-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-paper ${online ? "bg-teal-500" : "bg-gold-500"}`} aria-hidden />
      </button>

      {/* پنجره‌ی چت */}
      {open && (
        <div className="chat-pop fixed bottom-24 right-4 z-[75] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.9)] sm:right-6" role="dialog" aria-label="چت آنلاین پشتیبانی">
          <div className="flex items-center gap-3 border-b border-ink-700/70 bg-ink-900/95 px-4 py-3.5">
            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15 text-teal-400"><Icon name="headset" className="h-5 w-5" /></span>
              <span className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-ink-900 ${online ? "bg-teal-500" : "bg-gold-500"}`} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-5 text-white">پشتیبانی تیسافت</p>
              <p className={`flex items-center gap-1.5 text-[11px] ${online ? "text-teal-400" : "text-gold-400"}`}>
                <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${online ? "bg-teal-500" : "bg-gold-500"}`} />
                {user ? (online ? "آنلاین — پاسخ‌گو" : "آفلاین — پیام بگذارید") : "اول مشخصات‌تان را وارد کنید"}
              </p>
            </div>
            <a href={`tel:${PHONE_TEL}`} title={`تماس: ${PHONE_FA}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/70 text-teal-400 transition-colors hover:border-teal-500 hover:text-teal-300">
              <Icon name="phone" className="h-4 w-4" />
            </a>
            <button onClick={() => setOpen(false)} title="بستن" className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/70 text-mist-300 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {!user ? (
            <IdentityGate onDone={() => undefined} />
          ) : (
            <>
              <div className="relative flex-1 overflow-y-auto bg-ink-950 px-4 py-4" style={{ minHeight: 230, maxHeight: 310 }}>
                <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
                <div className="relative flex flex-col gap-3">
                  {msgs.length === 0 && !typing && (
                    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-400"><Icon name="chat" className="h-7 w-7" /></span>
                      <p className="font-display text-lg text-white">{user.firstName} عزیز، خوش آمدید!</p>
                      <p className="max-w-[220px] text-xs leading-6 text-mist-300">سوالتان را بنویسید؛ تیم پشتیبانی همین‌جا پاسخ می‌دهد.</p>
                    </div>
                  )}
                  {msgs.map((m) => (
                    <div key={m.id} className={`chat-msg flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-7 shadow-sm ${m.from === "user" ? "rounded-tr-sm bg-teal-600 text-white" : "rounded-tl-sm bg-ink-800 text-ink-100"}`}>
                        {m.auto && <p className="mb-1 text-[10px] font-bold text-gold-400">دستیار خودکار</p>}
                        <p>{m.text}</p>
                        <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-teal-400/60" : "text-mist-300/50"}`}>{nowTime()}</p>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="chat-msg flex justify-end">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-ink-800 px-4 py-3">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-400" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-400" style={{ animationDelay: "0.15s" }} />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal-400" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>
              <form onSubmit={send} className="flex items-center gap-2 border-t border-ink-700/70 bg-ink-900/95 p-3">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="پیام‌تان را بنویسید…" className="min-w-0 flex-1 rounded-xl border border-ink-600/60 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-mist-300/60 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                <button type="submit" disabled={!draft.trim()} aria-label="ارسال پیام" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-ink-950 transition-all hover:bg-teal-400 disabled:opacity-40">
                  <Icon name="send" className="h-4.5 w-4.5 -scale-x-100" />
                </button>
              </form>
            </>
          )}

          {user && (
            <button onClick={() => nav({ page: "panel" })} className="border-t border-ink-700/60 bg-ink-950/60 py-2 text-[11px] font-bold text-teal-400 transition-colors hover:text-teal-300">
              مشاهده‌ی کامل در پنل کاربری ←
            </button>
          )}
        </div>
      )}
    </>
  );
}

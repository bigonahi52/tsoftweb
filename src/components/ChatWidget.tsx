import { useEffect, useRef, useState } from "react";
import { PHONE_FA, PHONE_TEL } from "../lib";
import { Icon } from "./Icons";

type Msg = {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
  link?: { label: string; href: string };
};

const WORK_HOURS: [number, number][] = [
  [9, 14],
  [17, 22],
];

function isWorkingNow(): boolean {
  try {
    const h = Number(
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tehran" }).format(new Date())
    );
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

const STORAGE_KEY = "tsoft-chat";

function smartReply(text: string, online: boolean): { text: string; link?: Msg["link"] } {
  const phoneLink = { label: `تماس: ${PHONE_FA}`, href: `tel:${PHONE_TEL}` };
  if (!online) {
    return {
      text: "الان خارج از ساعت کاری هستیم (۹ تا ۱۴ و ۱۷ تا ۲۲). پیام‌تان ثبت شد و اولین ساعت کاری با شما تماس می‌گیریم. اگر عجله دارید:",
      link: phoneLink,
    };
  }
  if (/(قیمت|هزینه|چند|تومان|خرید)/.test(text))
    return {
      text: "برای استعلام قیمت، نام محصول و نوع کسب‌وکارتان را بنویسید؛ همین‌جا یا تلفنی، همان امروز قیمت دقیق را می‌گوییم.",
      link: phoneLink,
    };
  if (/(دانلود|نصب|لینک|فایل)/.test(text))
    return { text: "همه‌ی فایل‌های نصب و آپدیت در صفحه‌ی «دانلودها» هست. اگر فایلی پیدا نکردید، بگویید تا لینک مستقیمش را برایتان بفرستیم." };
  if (/(کپیتال|ارز|دلار|افغانی|درهم|یورو)/.test(text))
    return { text: "کپیتال نرم‌افزار حسابداری چندارزی ماست: ارز پایه، نرخ روزانه و تبدیل مانده به هر ارز. می‌توانید دمو رایگان بگیرید — چه روزی مناسب‌تان است؟" };
  if (/(تیسافت|فروشگاه|صندوق|فاکتور|بارکد)/.test(text))
    return { text: "تیسافت حسابداری فروشگاهی ماست — تک‌کاربره و تحت شبکه، با ماژول نقره‌ای و طلایی. نسخه آزمایشی رایگان را می‌توانید از صفحه دانلودها بگیرید." };
  if (/(پشتیبان|مشکل|خطا|خراب|کار نمی|بکاپ)/.test(text))
    return { text: "متأسفم که به مشکل خوردید. لطفاً متن دقیق خطا را بنویسید؛ اگر لازم باشد با اتصال امن صفحه‌تان را می‌بینیم و همان‌جا حلش می‌کنیم." };
  if (/(سلام|درود|هی|وقت بخیر)/.test(text))
    return { text: "سلام! خوش آمدید. چطور می‌توانم کمکتان کنم؟ سوال درباره محصولات، قیمت یا پشتیبانی؟" };
  return { text: "پیام‌تان رسید. همکارم همین حالا پاسخ می‌دهد — اگر سوال فوری دارید:", link: phoneLink };
}

const QUICK_REPLIES = ["قیمت محصولات", "دانلود نرم‌افزار", "کپیتال چندارزی", "مشکل فنی دارم"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Msg[];
    } catch {
      /* ignore */
    }
    return [];
  });
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const online = isWorkingNow();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {
      /* ignore */
    }
  }, [msgs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (e?: React.FormEvent, forced?: string) => {
    e?.preventDefault();
    const text = (forced ?? draft).trim();
    if (!text || typing) return;
    setDraft("");
    setMsgs((m) => [...m, { id: Date.now(), from: "user", text, time: nowTime() }]);
    setTyping(true);
    window.setTimeout(() => {
      const r = smartReply(text, online);
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "bot", text: r.text, time: nowTime(), link: r.link }]);
      setTyping(false);
    }, 1000 + Math.random() * 700);
  };

  const clearHistory = () => setMsgs([]);

  return (
    <>
      {/* ── دکمه‌ی شناور ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="چت آنلاین با پشتیبانی"
        title="چت آنلاین"
        className={`group fixed bottom-6 right-6 z-[75] flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-ink-950 shadow-[0_14px_34px_-10px_rgba(23,176,166,0.65)] transition-all duration-300 hover:scale-110 hover:bg-teal-400 ${
          open ? "pointer-events-none scale-0 opacity-0" : ""
        }`}
      >
        <span className="chat-ping absolute inset-0 rounded-full bg-teal-500/50" aria-hidden />
        <Icon name="chat" className="h-7 w-7" />
        <span
          className={`absolute -left-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-paper ${online ? "bg-teal-500" : "bg-gold-500"}`}
          aria-hidden
        />
      </button>

      {/* ── پنجره‌ی چت ── */}
      {open && (
        <div className="chat-pop fixed bottom-24 right-4 z-[75] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.9)] sm:right-6" role="dialog" aria-label="چت آنلاین پشتیبانی">
          {/* هدر */}
          <div className="flex items-center gap-3 border-b border-ink-700/70 bg-ink-900/95 px-4 py-3.5">
            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
                <Icon name="headset" className="h-5 w-5" />
              </span>
              <span className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-ink-900 ${online ? "bg-teal-500" : "bg-gold-500"}`} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-5 text-white">پشتیبانی تیسافت</p>
              <p className={`flex items-center gap-1.5 text-[11px] ${online ? "text-teal-400" : "text-gold-400"}`}>
                <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${online ? "bg-teal-500" : "bg-gold-500"}`} />
                {online ? "آنلاین — پاسخ‌گو" : "آفلاین — پیام بگذارید"}
              </p>
            </div>
            <a
              href={`tel:${PHONE_TEL}`}
              title="تماس مستقیم"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/70 text-teal-400 transition-colors hover:border-teal-500 hover:text-teal-300"
            >
              <Icon name="phone" className="h-4 w-4" />
            </a>
            <button onClick={clearHistory} title="پاک کردن تاریخچه" className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/70 text-mist-300 transition-colors hover:border-gold-500 hover:text-gold-400">
              <Icon name="update" className="h-4 w-4" />
            </button>
            <button onClick={() => setOpen(false)} title="بستن" className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/70 text-mist-300 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {/* بدنه‌ی پیام‌ها */}
          <div className="relative flex-1 overflow-y-auto bg-ink-950 px-4 py-4" style={{ minHeight: 250, maxHeight: 330 }}>
            <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
            <div className="relative flex flex-col gap-3">
              {msgs.length === 0 && !typing && (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                    <Icon name="chat" className="h-7 w-7" />
                  </span>
                  <p className="font-display text-lg text-white">گفت‌وگو را شروع کنید</p>
                  <p className="max-w-[220px] text-xs leading-6 text-mist-300">سوال درباره محصولات، قیمت یا پشتیبانی — همین‌جا بنویسید.</p>
                </div>
              )}

              {msgs.map((m) => (
                <div key={m.id} className={`chat-msg flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-7 shadow-sm ${
                    m.from === "user" ? "rounded-tr-sm bg-teal-600 text-white" : "rounded-tl-sm bg-ink-800 text-ink-100"
                  }`}>
                    <p>{m.text}</p>
                    {m.link && (
                      <a
                        href={m.link.href}
                        dir="ltr"
                        className="phone-number mt-2 flex items-center justify-center gap-2 rounded-xl bg-gold-500/15 px-3 py-2 text-sm font-bold text-gold-400 transition-colors hover:bg-gold-500/25"
                      >
                        <Icon name="phone" className="h-4 w-4" />
                        {m.link.label}
                      </a>
                    )}
                    <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-teal-400/60" : "text-mist-300/50"}`}>{m.time}</p>
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

          {/* پاسخ‌های سریع */}
          {msgs.length === 0 && (
            <div className="relative flex flex-wrap gap-2 border-t border-ink-700/60 bg-ink-900/80 px-4 py-2.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(undefined, q)}
                  className="rounded-full border border-ink-600/70 px-3 py-1.5 text-xs text-mist-300 transition-colors hover:border-teal-500 hover:text-teal-400"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* فرم ارسال */}
          <form onSubmit={send} className="flex items-center gap-2 border-t border-ink-700/70 bg-ink-900/95 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="پیام‌تان را بنویسید…"
              className="min-w-0 flex-1 rounded-xl border border-ink-600/60 bg-ink-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-mist-300/60 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="ارسال پیام"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-ink-950 transition-all hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500"
            >
              <Icon name="send" className="h-4.5 w-4.5 -scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

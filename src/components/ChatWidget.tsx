import { useEffect, useRef, useState } from "react";
import { api, ApiError, getToken, type ChatMsg, type PubUser } from "../api";
import { fa, usePolling } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

/** آیا الان در ساعت کاری پشتیبانی هستیم؟ */
function isOpenNow() {
  try {
    const h = Number(
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tehran" }).format(new Date())
    );
    return (h >= 9 && h < 14) || (h >= 17 && h < 22);
  } catch {
    return false;
  }
}

const QUICK = ["قیمت محصولات", "دانلود نرم‌افزار", "کپیتال چندارزی", "مشکل فنی دارم"];

/* پاسخ خودکار هوشمند برای مهمان‌ها */
function botReply(text: string): string {
  const t = text.toLowerCase();
  if (/(قیمت|هزینه|تعرفه|چند)/.test(t))
    return "برای دریافت قیمت دقیق، بهترین راه تماس مستقیم با ماست؛ چون قیمت بسته به نسخه‌ی تک‌کاربره یا تحت شبکه متفاوت است. می‌توانید از تب «تماس» فرم بفرستید یا همین‌جا شماره‌تان را بگذارید تا تماس بگیریم. 📞";
  if (/(دانلود|نصب|لینک)/.test(t))
    return "همه‌ی فایل‌های نصب و ابزارهای لازم در صفحه‌ی «دانلودها» قرار دارد. از منوی بالای سایت روی «دانلودها» بزنید. اگر فایلی را پیدا نکردید، بگویید تا راهنمایی کنم.";
  if (/(کپیتال|ارز|دلار|افغانی)/.test(t))
    return "کپیتال نسخه‌ی چندارزی ماست؛ ارز پایه را مشخص می‌کنید و بقیه‌ی ارزها هر روز با نرخ روز قیمت می‌گیرند — مناسب بازرگانی و واردات. در صفحه‌ی «کپیتال» جزئیات کامل هست.";
  if (/(تیسافت|فروشگاه|صندوق)/.test(t))
    return "تیسافت نرم‌افزار حسابداری فروشگاهی ماست؛ با ماژول نقره‌ای برای کارهای روزمره و ماژول طلایی برای حسابداری کامل با کدینگ دلخواه. در صفحه‌ی «تیسافت» بیشتر ببینید.";
  if (/(مشکل|خطا|ارور|کار نمی|خراب)/.test(t))
    return "متأسفم که با مشکل مواجه شدید. لطفاً متن دقیق خطا یا اتفاقی که افتاده را بنویسید؛ اگر لازم باشد با اتصال از راه دور، همان لحظه حلش می‌کنیم.";
  if (/(سلام|درود|hi|hello)/.test(t))
    return "سلام! به پشتیبانی تیسافت خوش آمدید. 😊 چطور می‌توانم کمکتان کنم؟ درباره‌ی قیمت، دانلود، محصولات یا مشکل فنی بپرسید.";
  return "پیام‌تان رسید. اگر وارد حساب کاربری‌تان شوید، پاسخ‌ها را هم در پنل خودتان می‌بینید و هم می‌توانید تیکت ثبت کنید. در اولین فرصت پاسخ می‌دهیم. 🙏";
}

type Local = { from: "user" | "bot"; text: string; time: number };

export default function ChatWidget({ user, nav }: { user: PubUser | null; nav: NavFn }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [guestMsgs, setGuestMsgs] = useState<Local[]>([
    { from: "bot", text: "سلام! 👋 من دستیار پشتیبانی تیسافت هستم. سوالتان را بنویسید؛ اگر آنلاین باشیم، خودِ بچه‌ها جواب می‌دهند.", time: Date.now() },
  ]);
  const [liveMsgs, setLiveMsgs] = useState<ChatMsg[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const online = isOpenNow();

  const isGuest = !user;

  usePolling(
    () => {
      if (!isGuest) api.chat().then((d) => setLiveMsgs(d.messages)).catch(() => {});
    },
    4000,
    open && !isGuest && !!getToken()
  );

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [open, guestMsgs.length, liveMsgs.length, typing]);

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setText("");

    if (isGuest) {
      setGuestMsgs((m) => [...m, { from: "user", text: t, time: Date.now() }]);
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setGuestMsgs((m) => [...m, { from: "bot", text: botReply(t), time: Date.now() }]);
      }, 900 + Math.random() * 600);
    } else {
      try {
        await api.sendChat(t);
        const d = await api.chat();
        setLiveMsgs(d.messages);
      } catch (e) {
        setGuestMsgs((m) => [
          ...m,
          { from: "bot", text: e instanceof ApiError ? e.message : "ارسال نشد؛ دوباره تلاش کنید.", time: Date.now() },
        ]);
      }
    }
    setSending(false);
  };

  const fmt = (t: number) => fa(new Date(t).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }));

  return (
    <>
      {/* دکمه‌ی شناور */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "بستن چت" : "چت با پشتیبانی"}
        title="چت با پشتیبانی"
        className={`group fixed bottom-6 right-6 z-[65] flex h-15 w-15 items-center justify-center rounded-full shadow-[0_16px_40px_-10px_rgba(10,27,33,0.7)] transition-all duration-300 hover:scale-105 ${
          open ? "bg-ink-950 text-gold-400" : "bg-teal-500 text-ink-950"
        }`}
        style={{ height: 60, width: 60 }}
      >
        {!open && <span className="phone-ring-pulse absolute inset-0 rounded-full border-2 border-teal-500/60" aria-hidden />}
        <Icon name={open ? "close" : "chat"} className="h-7 w-7 transition-transform duration-300 group-hover:rotate-6" />
        {!open && (
          <span className={`absolute -left-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white ${online ? "bg-teal-500" : "bg-gold-500"}`} />
        )}
      </button>

      {/* پنجره‌ی چت */}
      {open && (
        <div className="ticker-in fixed bottom-24 right-4 z-[66] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-[0_30px_80px_-20px_rgba(10,27,33,0.45)] sm:right-6" style={{ height: 520 }}>
          {/* هدر */}
          <div className="flex items-center gap-3 bg-ink-950 px-5 py-4">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400">
              <Icon name="headset" className="h-5 w-5" />
              <span className={`pulse-dot absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-950 ${online ? "bg-teal-500" : "bg-gold-500"}`} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-6 text-white">پشتیبانی تیسافت</p>
              <p className={`text-[11px] ${online ? "text-teal-400" : "text-gold-400"}`}>
                {online ? "آنلاین — پاسخ می‌دهیم" : "الان آفلاینیم — پیام بگذارید"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="بستن" className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-white/10 hover:text-white">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {/* بدنه */}
          <div ref={boxRef} className="grid-lines flex-1 space-y-3 overflow-y-auto bg-paper px-4 py-4">
            {isGuest
              ? guestMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 ${
                      m.from === "user" ? "rounded-bl-sm bg-teal-500 text-ink-950" : "rounded-br-sm border border-ink-100 bg-white text-ink-800"
                    }`}>
                      {m.text}
                      <span className={`mt-1 block text-[10px] ${m.from === "user" ? "text-ink-950/60" : "text-mist-300"}`}>{fmt(m.time)}</span>
                    </div>
                  </div>
                ))
              : liveMsgs.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-6 ${
                      m.from === "user" ? "rounded-bl-sm bg-teal-500 text-ink-950" : "rounded-br-sm border border-ink-100 bg-white text-ink-800"
                    }`}>
                      {m.text}
                      <span className={`mt-1 block text-[10px] ${m.from === "user" ? "text-ink-950/60" : "text-mist-300"}`}>{fmt(m.time)}</span>
                    </div>
                  </div>
                ))}

            {typing && (
              <div className="flex justify-end">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-br-sm border border-ink-100 bg-white px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {isGuest && (
              <div className="rounded-2xl border border-dashed border-teal-500/40 bg-teal-100/40 px-4 py-3 text-center">
                <p className="text-[12px] leading-6 text-ink-800">
                  برای چت مستقیم با پشتیبانی و پیگیری پاسخ‌ها، وارد حساب‌تان شوید.
                </p>
                <button onClick={() => nav({ page: "login" })} className="mt-1.5 text-[13px] font-bold text-teal-600 underline-offset-4 hover:underline">
                  ورود / ثبت‌نام ←
                </button>
              </div>
            )}
          </div>

          {/* پاسخ‌های سریع */}
          {isGuest && guestMsgs.length <= 2 && (
            <div className="flex flex-wrap gap-2 border-t border-ink-100 bg-white px-4 py-3">
              {QUICK.map((q) => (
                <button key={q} onClick={() => { setText(q); }} className="rounded-full border border-ink-100 bg-paper px-3 py-1.5 text-[11px] font-medium text-ink-800 transition-colors hover:border-teal-500 hover:text-teal-600">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ورودی */}
          <div className="flex items-center gap-2 border-t border-ink-100 bg-white px-4 py-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="پیام‌تان را بنویسید…"
              className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-2.5 text-[13px] focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              aria-label="ارسال"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-teal-400 transition-all hover:bg-teal-600 hover:text-ink-950 disabled:opacity-40"
            >
              <Icon name="send" className="h-5 w-5 -scale-x-100" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

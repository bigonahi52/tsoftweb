import { useEffect, useState } from "react";
import { PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

/** وضعیت زنده پشتیبانی بر اساس ساعت تهران */
function useSupportStatus() {
  const calc = () => {
    const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tehran" }).format(new Date()));
    const day = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "Asia/Tehran" }).format(new Date());
    const holiday = day === "Fri";
    const worktime = (h >= 9 && h < 14) || (h >= 17 && h < 22);
    return { online: !holiday && worktime, holiday };
  };
  const [s, setS] = useState(calc);
  useEffect(() => {
    const id = window.setInterval(() => setS(calc()), 60000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

const promises = [
  { icon: "headset", title: "مستقیم با خود توسعه‌دهنده", desc: "پشت خط، منوی تلفن گویا و صف انتظار نیست — همان کسی که نرم‌افزار را ساخته، مشکل‌تان را حل می‌کند." },
  { icon: "globe", title: "در هر استان که باشید", desc: "تماس می‌گیرید، با اتصال امن صفحه‌ی شما را می‌بینیم و مشکل را در همان تماس برطرف می‌کنیم — سراسر ایران و افغانستان." },
  { icon: "shield", title: "داده‌های شما امن می‌ماند", desc: "اتصال فقط با اجازه‌ی شما و برای رفع همان مشکل؛ پشتیبان‌گیری ابری و ایمیلی هم همیشه فعال است." },
];

export default function SupportBand({ compact = false }: { compact?: boolean }) {
  const ref = useRevealAll<HTMLElement>();
  const status = useSupportStatus();

  return (
    <section ref={ref} className={`grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 ${compact ? "py-20" : "py-32"} sm:${compact ? "py-24" : "py-40"}`}>
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-teal-600/12 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="reveal flex items-center gap-3">
              <span className="font-latin text-xs tracking-[0.3em] text-teal-400">REAL SUPPORT</span>
              <span className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold ${status.online ? "border-teal-500/40 bg-teal-500/10 text-teal-400" : "border-gold-500/40 bg-gold-500/10 text-gold-400"}`}>
                <span className={`pulse-dot h-2 w-2 rounded-full ${status.online ? "bg-teal-500" : "bg-gold-500"}`} />
                {status.online ? "الان پاسخ‌گو هستیم" : status.holiday ? "تعطیلات — پاسخ اضطراری" : "خارج از ساعت کاری — پیام بگذارید"}
              </span>
            </div>
            <h2 className="mt-5">
              <span className="line-mask"><span className="font-display text-5xl leading-[1.2] text-white sm:text-6xl">پشتیبانی‌ای که</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-5xl leading-[1.2] text-gold-400 sm:text-6xl">خیال‌تان را راحت می‌کند</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-xl text-lg leading-10 text-mist-300">
              نرم‌افزار را می‌خرید و تنها نمی‌مانید؛ <b className="text-white">یک سال کامل، پشتیبانی رایگان</b> دارید —
              و بعد از آن هم ما همان تیمی هستیم که همیشه تلفن را خودش جواب می‌دهد.
            </p>

            <div className="reveal mt-9 flex flex-wrap items-center gap-5 rounded-2xl border border-ink-700/70 bg-ink-900/60 px-6 py-5">
              <a href={`tel:${PHONE_TEL}`} className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-ink-950 transition-transform hover:scale-105">
                <Icon name="phone" className="phone-ring h-7 w-7" />
              </a>
              <a href={`tel:${PHONE_TEL}`} className="group">
                <span className="block text-xs font-bold text-ink-100/70">تلفن مستقیم توسعه‌دهنده</span>
                <span dir="ltr" className="phone-number mt-1 block text-2xl text-gold-400 transition-colors group-hover:text-white">{PHONE_FA}</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {promises.map((pr, i) => (
              <div key={pr.title} className="reveal card-lift flex gap-5 rounded-3xl border border-ink-700/60 bg-ink-900/50 p-6 hover:border-teal-500/50" style={{ "--rv-delay": `${i * 110}ms` } as React.CSSProperties}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400">
                  <Icon name={pr.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="mt-1 font-display text-xl text-[#ffffff]">{pr.title}</h3>
                  <p className="mt-1.5 text-sm leading-7 text-mist-300">{pr.desc}</p>
                </div>
              </div>
            ))}

            <div className="reveal rounded-3xl border border-ink-700/60 bg-ink-900/50 p-6" style={{ "--rv-delay": "330ms" } as React.CSSProperties}>
              <p className="mt-1.5 font-display text-2xl text-[#ffffff]">ساعات پاسخ‌گویی</p>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between border-b border-ink-700/50 pb-2.5">
                  <dt className="flex items-center gap-2 text-mist-300"><Icon name="sun" className="h-4 w-4 text-gold-400" /> صبح — شنبه تا پنجشنبه</dt>
                  <dd className="font-latin text-sm font-bold text-[#ffffff]" dir="ltr">09:00 – 14:00</dd>
                </div>
                <div className="flex items-center justify-between border-b border-ink-700/50 pb-2.5">
                  <dt className="flex items-center gap-2 text-mist-300"><Icon name="clock" className="h-4 w-4 text-teal-400" /> عصر — شنبه تا پنجشنبه</dt>
                  <dd className="font-latin text-sm font-bold text-[#ffffff]" dir="ltr">17:00 – 22:00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-mist-300"><Icon name="bell" className="h-4 w-4 text-gold-400" /> روزهای تعطیل</dt>
                  <dd className="text-sm font-bold text-gold-400">تلفنی و اضطراری</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

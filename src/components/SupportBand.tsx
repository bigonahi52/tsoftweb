import { useEffect, useState } from "react";
import { PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const promises = [
  { icon: "award", title: "یک سال پشتیبانی رایگان", desc: "با هر خرید، یک سال کامل پشتیبانی تلفنی و ریموت دارید — بدون هزینه‌ی اضافه." },
  { icon: "headset", title: "مستقیم با خود توسعه‌دهنده", desc: "پشت خط، منوی تلفن گویا و صف انتظار نیست — همان کسی که نرم‌افزار را ساخته، مشکل‌تان را حل می‌کند." },
  { icon: "globe", title: "در هر استان که باشید", desc: "تماس می‌گیرید، با اتصال امن صفحه‌ی شما را می‌بینیم و مشکل را در همان تماس برطرف می‌کنیم — سراسر ایران و افغانستان." },
];

/** وضعیت لحظه‌ای پشتیبانی بر اساس ساعت تهران */
function useSupportStatus() {
  const calc = () => {
    try {
      const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tehran" }).format(new Date()));
      return (h >= 9 && h < 14) || (h >= 17 && h < 22);
    } catch {
      return false;
    }
  };
  const [open, setOpen] = useState(calc);
  useEffect(() => {
    const id = window.setInterval(() => setOpen(calc()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return open;
}

export default function SupportBand({ compact = false }: { compact?: boolean }) {
  const ref = useRevealAll<HTMLDivElement>();
  const isOpen = useSupportStatus();

  return (
    <section ref={ref} className={`grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 ${compact ? "py-20 sm:py-24" : "py-32 sm:py-40"}`}>
      <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-teal-600/12 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-400">REAL SUPPORT</p>
            <h2 className="mt-4">
              <span className="line-mask"><span className="font-display text-5xl leading-[1.15] text-white sm:text-6xl">پشتیبانی‌ای که</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-5xl leading-[1.15] text-gold-400 sm:text-6xl">خیال‌تان را راحت می‌کند</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-xl leading-9 text-mist-300">
              نرم‌افزار را می‌خرید و تنها نمی‌مانید؛ <b className="text-white">یک سال کامل، پشتیبانی رایگان</b> دارید —
              و بعد از آن هم ما همان تیمی هستیم که همیشه تلفن را خودش جواب می‌دهد.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {promises.map((pr, i) => (
                <div key={pr.title} className="reveal rounded-2xl border border-ink-700/60 bg-ink-900/50 p-6 transition-colors hover:border-teal-500/50" style={{ "--rv-delay": `${i * 100}ms` } as React.CSSProperties}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
                    <Icon name={pr.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-[#ffffff]">{pr.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-mist-300">{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal rv-left">
            <div className="rounded-3xl border border-ink-700/60 bg-ink-900/70 p-8 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl text-white">تماس مستقیم</p>
                <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${isOpen ? "bg-teal-500/15 text-teal-400" : "bg-gold-500/15 text-gold-400"}`}>
                  <span className={`pulse-dot h-2 w-2 rounded-full ${isOpen ? "bg-teal-500" : "bg-gold-500"}`} />
                  {isOpen ? "الان پاسخ‌گو هستیم" : "الان خارج از ساعت کاری‌ایم"}
                </span>
              </div>

              <a href={`tel:${PHONE_TEL}`} className="btn-shine group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gold-500 px-6 py-5 text-ink-950 transition-all hover:scale-[1.01] hover:bg-gold-400">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-gold-400">
                  <span className="phone-ring-pulse absolute inset-0 rounded-xl border border-gold-500/50" aria-hidden />
                  <Icon name="phone" className="phone-ring h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-ink-950/70">تلفن مستقیم توسعه‌دهنده</span>
                  <span dir="ltr" className="phone-number mt-0.5 block text-2xl text-ink-950">{PHONE_FA}</span>
                </span>
              </a>

              <div className="mt-6 rounded-2xl border border-ink-700/60 bg-ink-950/60 p-5">
                <p className="mt-1.5 font-display text-2xl text-[#ffffff]">ساعات پاسخ‌گویی</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-2 text-mist-300"><Icon name="sun" className="h-4 w-4 text-gold-400" /> صبح</dt>
                    <dd className="font-latin text-sm font-bold text-[#ffffff]" dir="ltr">09:00 – 14:00</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-2 text-mist-300"><Icon name="moon" className="h-4 w-4 text-teal-400" /> عصر</dt>
                    <dd className="font-latin text-sm font-bold text-[#ffffff]" dir="ltr">17:00 – 22:00</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-ink-700/60 pt-3">
                    <dt className="text-mist-300">روزهای تعطیل</dt>
                    <dd className="text-xs font-bold text-gold-400">پشتیبانی تلفنی اضطراری</dd>
                  </div>
                </dl>
                <p className="mt-4 text-center text-xs leading-6 text-mist-300">
                  نصب، آموزش و پشتیبانی در <b className="text-[#ffffff]">سراسر ایران و افغانستان</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

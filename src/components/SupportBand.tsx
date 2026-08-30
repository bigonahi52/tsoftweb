import { useEffect, useState } from "react";
import { PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

/** وضعیت لحظه‌ای پشتیبانی بر اساس ساعت تهران */
export function useSupportStatus() {
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

const PROMISES = [
  { icon: "award", title: "یک سال پشتیبانی رایگان", desc: "با هر خرید، یک سال کامل پشتیبانی تلفنی و با اتصال امن — بدون هزینه‌ی اضافه." },
  { icon: "globe", title: "در هر استان که باشید", desc: "تماس می‌گیرید؛ با اتصال امن صفحه‌ی شما را می‌بینیم و مشکل را در همان تماس برطرف می‌کنیم." },
  { icon: "spark", title: "بدون صف و بدون واسطه", desc: "نه تلفن گویا، نه نماینده؛ مستقیم با کسی که نرم‌افزار را ساخته صحبت می‌کنید." },
];

export default function SupportBand({ compact = false }: { compact?: boolean }) {
  const ref = useRevealAll<HTMLDivElement>();
  const isOpen = useSupportStatus();

  return (
    <section ref={ref} className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-teal-600/12 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-gold-500/8 blur-[110px]" aria-hidden />

      <div className={`relative mx-auto max-w-7xl px-4 sm:px-6 ${compact ? "" : ""}`}>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="reveal eyebrow text-teal-400">REAL SUPPORT</p>
            <h2 className="mt-4">
              <span className="line-mask"><span className="font-display block text-4xl leading-tight text-white sm:text-6xl">پشتیبانی‌ای که</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-4xl leading-tight sm:text-6xl"><span className="text-gold-400">خیال‌تان</span> را راحت می‌کند</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-xl leading-9 text-mist-300">
              نرم‌افزار را می‌خرید و تنها نمی‌مانید؛ <b className="text-white">یک سال کامل، پشتیبانی رایگان</b> دارید —
              و بعد از آن هم ما همان تیمی هستیم که همیشه تلفن را خودش جواب می‌دهد.
            </p>

            <div className="mt-9 space-y-4">
              {PROMISES.map((pr, i) => (
                <div key={pr.title} className="reveal group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-5 transition-all duration-300 hover:border-teal-500/40 hover:bg-white/[0.07]" style={{ "--rv-delay": `${i * 100}ms` } as React.CSSProperties}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/12 text-teal-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon name={pr.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-white">{pr.title}</h3>
                    <p className="mt-1 text-[13px] leading-7 text-mist-300">{pr.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal rv-left" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900/80 p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-500/12 blur-[70px]" aria-hidden />

              <div className="relative flex items-center justify-between">
                <p className="font-display text-2xl text-white">تماس مستقیم</p>
                <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${isOpen ? "bg-teal-500/15 text-teal-400" : "bg-gold-500/15 text-gold-400"}`}>
                  <span className={`pulse-dot h-2 w-2 rounded-full ${isOpen ? "bg-teal-500" : "bg-gold-500"}`} />
                  {isOpen ? "الان پاسخ‌گو هستیم" : "خارج از ساعت کاری"}
                </span>
              </div>

              <a href={`tel:${PHONE_TEL}`} className="btn-primary group relative mt-7 flex w-full justify-center !bg-gold-500 !px-6 !py-5 hover:!bg-gold-400" style={{ boxShadow: "0 14px 36px -14px rgba(234,166,59,0.6)" }}>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-gold-400">
                  <span className="phone-ring-pulse absolute inset-0 rounded-xl border border-gold-500/50" aria-hidden />
                  <Icon name="phone" className="phone-ring h-5 w-5" />
                </span>
                <span className="text-right">
                  <span className="block text-xs font-bold text-ink-950/70">تلفن مستقیم توسعه‌دهنده</span>
                  <span dir="ltr" className="phone-number block text-2xl text-ink-950">{PHONE_FA}</span>
                </span>
              </a>

              <div className="relative mt-7 rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                <p className="font-display text-lg text-white">ساعات پاسخ‌گویی</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-2 text-mist-300"><Icon name="sun" className="h-4 w-4 text-gold-400" /> صبح</dt>
                    <dd className="font-latin text-sm font-bold text-white" dir="ltr">09:00 – 14:00</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-2 text-mist-300"><Icon name="moon" className="h-4 w-4 text-teal-400" /> عصر</dt>
                    <dd className="font-latin text-sm font-bold text-white" dir="ltr">17:00 – 22:00</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                    <dt className="text-mist-300">روزهای تعطیل</dt>
                    <dd className="text-xs font-bold text-gold-400">پشتیبانی تلفنی اضطراری</dd>
                  </div>
                </dl>
                <p className="mt-4 text-center text-xs leading-6 text-mist-300">
                  نصب، آموزش و پشتیبانی در <b className="text-white">سراسر ایران و افغانستان</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

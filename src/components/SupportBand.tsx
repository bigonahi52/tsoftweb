import { useEffect, useState } from "react";
import { PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

/** آیا الان در ساعات پاسخ‌گویی هستیم؟ (به وقت تهران) */
function useSupportStatus() {
  const calc = () => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tehran", hour: "numeric", minute: "numeric", hour12: false, weekday: "short" }).formatToParts(now);
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
      const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
      const friday = wd === "Fri";
      const t = h * 60 + m;
      const morning = t >= 9 * 60 && t < 14 * 60;
      const evening = t >= 17 * 60 && t < 22 * 60;
      const open = !friday && (morning || evening);
      return { open, friday };
    } catch {
      return { open: true, friday: false };
    }
  };
  const [s, setS] = useState(calc);
  useEffect(() => {
    const id = window.setInterval(() => setS(calc()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

const promises = [
  { icon: "headset", title: "مستقیم با خود توسعه‌دهنده", desc: "پشت خط، منوی تلفن گویا و صف انتظار نیست؛ همان کسی که نرم‌افزار را ساخته، مشکل‌تان را حل می‌کند." },
  { icon: "globe", title: "در هر استان که باشید", desc: "تماس می‌گیرید، با اتصال امن صفحه‌ی شما را می‌بینیم و مشکل را در همان تماس برطرف می‌کنیم؛ سراسر ایران و افغانستان." },
  { icon: "clock", title: "ساعات مشخص، خیالِ راحت", desc: "صبح‌ها ۹ تا ۱۴ و عصرها ۱۷ تا ۲۲ پاسخ‌گوییم؛ روزهای تعطیل هم پشتیبانی تلفنی اضطراری داریم." },
];

export default function SupportBand({ compact = false }: { compact?: boolean }) {
  const ref = useRevealAll<HTMLElement>();
  const { open, friday } = useSupportStatus();

  return (
    <section ref={ref} className={`grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 ${compact ? "py-20" : "py-32"} sm:${compact ? "py-24" : "py-40"}`}>
      <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-400">REAL SUPPORT</p>
            <h2 className="mt-3">
              <span className="line-mask"><span className="font-display text-5xl leading-tight text-white sm:text-6xl">پشتیبانی‌ای که</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-5xl leading-tight text-gold-400 sm:text-6xl">خیال‌تان را راحت می‌کند</span>
              </span>
            </h2>
          </div>
          <div className={`reveal flex items-center gap-3 rounded-2xl border px-6 py-4 ${open ? "border-teal-500/50 bg-teal-500/10" : "border-gold-500/50 bg-gold-500/10"}`}>
            <span className={`pulse-dot h-2.5 w-2.5 rounded-full ${open ? "bg-teal-400" : "bg-gold-400"}`} />
            <span className={`font-display text-xl ${open ? "text-teal-300" : "text-gold-400"}`}>
              {friday ? "امروز تعطیل — پشتیبانی اضطراری فعال است" : open ? "الان پاسخ‌گو هستیم" : "الان خارج از ساعت کاری هستیم"}
            </span>
          </div>
        </div>

        <p className="reveal mt-6 max-w-3xl text-lg leading-10 text-mist-300">
          نرم‌افزار را می‌خرید و تنها نمی‌مانید؛ <b className="text-white">یک سال کامل، پشتیبانی رایگان</b> دارید —
          و بعد از آن هم ما همان تیمی هستیم که همیشه تلفن را خودش جواب می‌دهد.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {promises.map((p, i) => (
            <div key={p.title} className="reveal group rounded-3xl border border-ink-700/60 bg-ink-900/60 p-8 transition-colors hover:border-teal-500/50" style={{ "--rv-delay": `${i * 110}ms` } as React.CSSProperties}>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <Icon name={p.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-2xl text-[#ffffff]">{p.title}</h3>
              <p className="mt-2.5 text-sm leading-8 text-mist-300">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col items-center justify-between gap-8 rounded-3xl border border-ink-700/60 bg-ink-900/70 p-8 sm:p-10 lg:flex-row">
          <div className="text-center lg:text-right">
            <p className="font-latin text-[10px] tracking-[0.3em] text-teal-400">SUPPORT LINE — 9:00–14:00 · 17:00–22:00</p>
            <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number mt-2 inline-block text-3xl text-gold-400 drop-shadow-[0_0_14px_rgba(229,169,61,0.3)] transition-colors hover:text-white sm:text-4xl">
              {PHONE_FA}
            </a>
            <p className="mt-2 text-sm text-mist-300">
              نصب، آموزش و پشتیبانی در <b className="text-[#ffffff]">سراسر ایران و افغانستان</b>
            </p>
          </div>
          <a
            href={`tel:${PHONE_TEL}`}
            className="btn-shine group relative flex items-center gap-3 rounded-2xl bg-teal-500 px-8 py-4 text-lg font-bold text-ink-950 transition-colors hover:bg-teal-400"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950/10">
              <span className="phone-ring-pulse absolute inset-0 rounded-xl border border-ink-950/30" aria-hidden />
              <Icon name="phone" className="phone-ring h-5 w-5" />
            </span>
            همین حالا زنگ بزنید
          </a>
        </div>
      </div>
    </section>
  );
}

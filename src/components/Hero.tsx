import { useEffect, useState } from "react";
import { products } from "../data";
import { fa, prefersReducedMotion, useCountUp, useGentleWord, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

function Stat({ value, label }: { value: number; label: string }) {
  const { ref, text } = useCountUp(value);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-display text-4xl leading-none text-white">
        <span ref={ref}>{text}</span>
      </p>
      <p className="text-xs leading-5 text-mist-300">{label}</p>
    </div>
  );
}

const fmt = (n: number) => fa(n.toLocaleString("en-US"));

/** اقلام نمونه‌ی رسید — هر چند ثانیه یکی اضافه می‌شود */
const ITEMS = [
  { t: "شیر کم‌چرب یک لیتری", p: 48500 },
  { t: "نان بربری تازه", p: 25000 },
  { t: "ماست ۹۰۰ گرمی", p: 62000 },
  { t: "روغن آفتابگردان", p: 185000 },
  { t: "برنج ایرانی پنج کیلویی", p: 950000 },
  { t: "چای لاهیجان", p: 320000 },
  { t: "رب گوجه ۸۰۰ گرمی", p: 88000 },
  { t: "تن ماهی", p: 145000 },
  { t: "بیسکویت ساقه طلایی", p: 38000 },
  { t: "آب معدنی", p: 18000 },
];

/** رسید فروش زنده — المان اصلی بصری هیرو */
function LiveReceipt({ latin }: { latin: string }) {
  const [tick, setTick] = useState(4);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2300);
    return () => window.clearInterval(id);
  }, [reduced]);

  const rows: { t: string; p: number }[] = [];
  for (let i = 0; i < 4; i++) {
    rows.push(ITEMS[((tick - 1 - i) % ITEMS.length + ITEMS.length) % ITEMS.length]);
  }
  const total = rows.reduce((s, it) => s + it.p, 0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <div className="[perspective:1100px]" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div
        className="float-soft relative mx-auto w-full max-w-[360px] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateY(${tilt.x * 5}deg) rotateX(${-tilt.y * 5}deg)` }}
      >
        {/* هاله‌ی رنگی نرم */}
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-teal-600/15 blur-[90px]" aria-hidden />

        <div className="relative rounded-[22px] border border-ink-100/10 bg-paper text-ink-900 shadow-[0_45px_90px_-30px_rgba(0,0,0,0.75)]">
          {/* سربرگ رسید */}
          <div className="flex items-center justify-between border-b border-dashed border-ink-100 px-6 pb-4 pt-6">
            <div>
              <p className="font-display text-xl leading-6">فروشگاه آفتاب</p>
              <p className="font-latin text-[10px] tracking-[0.25em] text-mist-500" dir="ltr">
                {latin} · POS
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-teal-500/12 px-3 py-1.5 text-[11px] font-bold text-teal-600">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" />
              صندوق فعال
            </span>
          </div>

          {/* اقلام */}
          <div className="space-y-3 px-6 py-5">
            {rows.map((it, i) => (
              <div
                key={`${it.t}-${tick}-${i}`}
                className={`flex items-baseline justify-between gap-3 ${i === 0 ? "ticker-in" : ""}`}
              >
                <span className={`text-sm ${i === 0 ? "font-bold" : "text-mist-500"}`}>{it.t}</span>
                <span className={`font-latin text-sm ${i === 0 ? "font-bold text-ink-900" : "text-mist-500"}`} dir="ltr">
                  {fmt(it.p)}
                </span>
              </div>
            ))}
          </div>

          {/* جمع کل */}
          <div className="border-t border-dashed border-ink-100 px-6 py-4">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg">جمع قابل پرداخت</span>
              <span key={total} className="ticker-in font-latin text-xl font-bold text-teal-600" dir="ltr">
                {fmt(total)} <span className="text-[11px] font-medium text-mist-500">ریال</span>
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gold-600">
                <Icon name="check" className="h-3.5 w-3.5" />
                پرداخت شد
              </span>
              <span className="text-[11px] text-mist-500">یک سال پشتیبانی رایگان</span>
            </div>
          </div>

          {/* بارکد */}
          <div className="flex items-end justify-center gap-[3px] border-t border-dashed border-ink-100 px-6 pb-6 pt-4" aria-hidden>
            {[3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 3, 2, 1, 3, 2].map((w, i) => (
              <span key={i} className="bg-ink-900" style={{ width: `${w}px`, height: i % 3 === 0 ? "26px" : "18px" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();
  const words = products.map((p) => p.name);
  const { word, index, visible } = useGentleWord(words);
  const active = products[index] ?? products[0];

  return (
    <section ref={ref} className="grid-lines noise relative overflow-hidden bg-ink-950 pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* متن */}
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/35 bg-teal-500/10 px-5 py-2 text-xs font-medium tracking-wide text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            نرم‌افزارهای حسابداری و مدیریت کسب‌وکار — از ۱۳۸۵
          </p>

          <h1 className="mt-7">
            <span className="line-mask">
              <span className="font-display text-[52px] leading-[1.08] text-white sm:text-[70px] lg:text-[78px]">
                <span className={`inline-block text-teal-400 transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                  {word}
                </span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <span className="font-display text-[36px] leading-[1.2] text-ink-100 sm:text-[48px] lg:text-[54px]">
                حسابِ <span className="text-gold-400">بیست‌ساله</span>، اعتمادِ همیشگی
              </span>
            </span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-base leading-8 text-mist-300 sm:text-lg sm:leading-9" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
            از صندوق فروشگاه تا حسابداری چندارزی؛ حساب کسب‌وکار شما، در هر لحظه روشن است.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-4" style={{ "--rv-delay": "350ms" } as React.CSSProperties}>
            <button
              onClick={() => nav({ page: "downloads" })}
              className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-7 py-3.5 text-base font-bold text-ink-950 transition-all hover:bg-teal-400 hover:shadow-[0_12px_35px_-8px_rgba(23,176,166,0.55)]"
            >
              <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              دانلود نرم‌افزارها
            </button>
            <button
              onClick={() => nav({ page: "product", id: active.id })}
              className="group flex items-center gap-2 rounded-xl border border-ink-600 px-7 py-3.5 text-base font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              آشنایی با {active.name}
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* آمار مینیمال */}
          <div className="reveal mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <Stat value={20} label="سال سابقه" />
            <Stat value={2} label="محصول تخصصی" />
            <Stat value={35} label="استان و شهر" />
          </div>
        </div>

        {/* رسید زنده */}
        <div className="reveal rv-scale hidden md:block" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <LiveReceipt latin={active.latin} />
        </div>
      </div>
    </section>
  );
}

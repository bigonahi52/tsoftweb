import { useState } from "react";
import { products } from "../data";
import { prefersReducedMotion, useCountUp, useGentleWord, useRevealAll } from "../lib";
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

/* ── برچسب‌های شناورِ مرتبط با هر محصول — ظریف و بدون شلوغی ── */
const CHIPS: Record<string, { icon: string; label: string; pos: string; delay?: string }[]> = {
  tisaft: [
    { icon: "receipt", label: "فاکتور ثبت شد", pos: "top-6 -left-4 sm:-left-10" },
    { icon: "coins", label: "۱۲٬۵۰۰٬۰۰۰ ریال", pos: "top-1/3 -right-4 sm:-right-12", delay: "1.1s" },
    { icon: "barcode", label: "کالا اسکن شد", pos: "bottom-14 -left-3 sm:-left-8", delay: "2s" },
  ],
  capital: [
    { icon: "update", label: "نرخ ارز به‌روز شد", pos: "top-6 -right-4 sm:-right-10" },
    { icon: "coins", label: "USD · ۶۳٬۰۰۰", pos: "top-1/3 -left-4 sm:-left-12", delay: "1.1s" },
    { icon: "globe", label: "۷ ارز فعال", pos: "bottom-14 -right-3 sm:-right-8", delay: "2s" },
  ],
};

function FloatChip({ icon, label, pos, delay }: { icon: string; label: string; pos: string; delay?: string }) {
  return (
    <div className={`float-soft absolute ${pos}`} style={delay ? { animationDelay: delay } : undefined}>
      <span className="ticker-in flex items-center gap-2 whitespace-nowrap rounded-full border border-white/12 bg-ink-900/85 py-2 pl-4 pr-3 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md">
        <Icon name={icon} className="h-3.5 w-3.5 text-teal-400" />
        <span className="text-[11px] font-medium text-ink-100">{label}</span>
      </span>
    </div>
  );
}

/* ── تصویر گردِ محصول با مدارِ خورشید و ماه ── */
function OrbVisual({ index }: { index: number }) {
  const active = products[index] ?? products[0];
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = prefersReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <div className="[perspective:1200px]" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div
        className="float-soft relative mx-auto aspect-square w-full max-w-[420px] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 5}deg)` }}
      >
        {/* هاله‌ی رنگی هم‌رنگ محصول فعال */}
        <div
          className="pointer-events-none absolute -inset-14 rounded-full opacity-25 blur-[110px] transition-colors duration-1000"
          style={{ background: active.accent }}
          aria-hidden
        />

        {/* حلقه‌ی خط‌چینِ چرخان */}
        <div className="ring-spin pointer-events-none absolute -inset-5 rounded-full border-2 border-dashed border-white/12" aria-hidden />
        <div className="pointer-events-none absolute -inset-10 rounded-full border border-white/5" aria-hidden />

        {/* برچسب‌های شناورِ مرتبط با محصول فعال */}
        <div key={active.id} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {(CHIPS[active.id] ?? CHIPS.tisaft).map((c) => (
            <FloatChip key={c.label} {...c} />
          ))}
        </div>

        {/* تصویر گرد */}
        <div className="absolute inset-0 overflow-hidden rounded-full border border-white/15 bg-ink-900 shadow-[0_50px_110px_-35px_rgba(0,0,0,0.85)]">
          {products.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.name}
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                i === index ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
              }`}
            />
          ))}
          {/* وینیت نرم برای خوانایی و عمق بصری */}
          <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 80px rgba(10,27,33,0.5)" }} aria-hidden />
        </div>

        {/* برچسب محصول فعال — شناور روی لبه‌ی پایینی */}
        <div className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2">
          <p
            key={active.id}
            className="ticker-in flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/12 bg-ink-900/85 px-6 py-2.5 backdrop-blur-md"
          >
            <span className="font-latin text-lg font-bold tracking-[0.2em] text-teal-400 drop-shadow-[0_0_12px_rgba(22,184,127,0.45)]" dir="ltr">
              {active.latin}
            </span>
            <span className="h-3.5 w-px bg-ink-600" aria-hidden />
            <span className="text-xs leading-5 text-mist-300">{active.tagline}</span>
          </p>
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
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
              className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-7 py-3.5 text-base font-bold text-ink-950 transition-all hover:bg-teal-400 hover:shadow-[0_12px_35px_-8px_rgba(22,184,127,0.55)]"
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

          {/* آمار */}
          <div className="reveal mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <Stat value={20} label="سال سابقه" />
            <Stat value={2} label="محصول تخصصی" />
            <Stat value={35} label="استان و شهر" />
          </div>
        </div>

        {/* کره‌ی تصویر با مدارِ خورشید و ماه */}
        <div className="reveal rv-scale pb-6" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <OrbVisual index={index} />

          {/* نشانگر محصولات */}
          <div className="mt-10 flex items-center justify-center gap-2.5">
            {products.map((p, i) => (
              <span
                key={p.id}
                className="h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: i === index ? 30 : 6, background: i === index ? p.accent : "rgba(91,139,153,0.45)" }}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

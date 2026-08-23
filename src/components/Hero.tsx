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

/** تصویر محصول داخل قاب مینیمال با حرکت نرم — همگام با چرخش نام‌ها */
function ProductVisual({ index, onPick }: { index: number; onPick: (i: number) => void }) {
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
    <div className="[perspective:1100px]" onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div
        className="float-soft relative mx-auto w-full max-w-[420px] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 4}deg)` }}
      >
        {/* هاله‌ی رنگی هم‌رنگ محصول */}
        <div
          className="pointer-events-none absolute -inset-12 rounded-full opacity-25 blur-[100px] transition-colors duration-1000"
          style={{ background: active.accent }}
          aria-hidden
        />

        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-ink-900 shadow-[0_50px_100px_-35px_rgba(0,0,0,0.85)]">
          <div className="relative aspect-square">
            {products.map((p, i) => (
              <img
                key={p.id}
                src={p.image}
                alt={p.name}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                  i === index ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"
                }`}
              />
            ))}
            {/* ته‌رنگ ملایم برای خوانایی کپشن */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ink-950/90 to-transparent" aria-hidden />
          </div>

          {/* کپشن محصول */}
          <div className="absolute inset-x-0 bottom-0 px-7 pb-6">
            <p key={active.id} className="ticker-in flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span
                className="font-latin text-3xl font-bold tracking-[0.18em] drop-shadow-[0_0_16px_rgba(23,176,166,0.4)]"
                style={{ color: active.accent }}
                dir="ltr"
              >
                {active.latin}
              </span>
              <span className="text-sm leading-6 text-mist-300">{active.tagline}</span>
            </p>
          </div>
        </div>

        {/* نشانگرهای محصول — قابل کلیک */}
        <div className="mt-7 flex items-center justify-center gap-3">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onPick(i)}
              aria-label={p.name}
              title={p.name}
              className="group flex h-6 items-center"
            >
              <span
                className="h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: i === index ? 32 : 7, background: i === index ? p.accent : "rgba(91,139,153,0.45)" }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();
  const words = products.map((p) => p.name);
  const { word, index, visible, setIndex } = useGentleWord(words);
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

        {/* تصویر محصول */}
        <div className="reveal rv-scale hidden md:block" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <ProductVisual index={index} onPick={setIndex} />
        </div>
      </div>
    </section>
  );
}

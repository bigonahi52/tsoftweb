import { useState } from "react";
import { products } from "../data";
import { useCountUp, useGentleWord, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const { ref, text } = useCountUp(value);
  return (
    <div>
      <p className="flex items-baseline gap-1">
        <span ref={ref} className="font-display text-4xl leading-none text-white">{text}</span>
        {suffix && <span className="font-display text-2xl text-gold-400">{suffix}</span>}
      </p>
      <p className="mt-1.5 text-xs text-mist-300 sm:text-sm">{label}</p>
    </div>
  );
}

/** مُهر سالگرد — عدد ۲۰ با قابِ خط‌چین و برچسب خوانا */
function YearSeal() {
  const { ref, text } = useCountUp(20);
  return (
    <div className="seal-pulse relative flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-gold-500/90 bg-ink-900/70">
      <span ref={ref} className="font-display text-5xl leading-none text-gold-400">{text}</span>
      <span className="mt-1.5 text-sm font-bold tracking-[0.2em] text-ink-100">سال</span>
    </div>
  );
}

/** تصویر شناور محصول داخل فرم نرم ارگانیک */
function ProductVisual({ index }: { index: number }) {
  const active = products[index] ?? products[0];
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="pointer-events-none absolute -inset-16 rounded-full opacity-30 blur-[120px] transition-colors duration-1000" style={{ background: active.accent }} aria-hidden />
      <div className="relative aspect-square">
        <div className="blob-outline absolute -inset-4 border-2 border-dashed opacity-50 transition-colors duration-1000" style={{ borderColor: active.accent }} aria-hidden />
        <div className="blob-shape absolute inset-0 overflow-hidden border border-white/10 bg-ink-900 shadow-[0_45px_90px_-35px_rgba(0,0,0,0.85)]">
          {products.map((p, i) =>
            broken[p.id] ? (
              <div
                key={p.id}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-1000 ease-out ${i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
                style={{ background: `radial-gradient(circle at 35% 30%, ${p.accent}30, transparent 70%)` }}
              >
                <Icon name={p.features[0]?.icon ?? "box"} className="h-28 w-28" />
                <span className="font-latin text-2xl font-bold tracking-[0.3em] text-white/80">{p.latin}</span>
              </div>
            ) : (
              <img
                key={p.id}
                src={p.image}
                alt={p.name}
                loading={i === 0 ? "eager" : "lazy"}
                onError={() => setBroken((b) => ({ ...b, [p.id]: true }))}
                style={{ objectPosition: (p as any).imgPos ?? "50% 50%" }}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${i === index ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-105 opacity-0"}`}
              />
            )
          )}
          <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(circle at 50% 120%, rgba(23,176,166,0.28), transparent 65%)" }} />
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 62%, rgba(10,27,33,0.35) 100%)" }} />
        </div>
        <span className="absolute -right-3 top-10 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink-900/90 shadow-xl backdrop-blur transition-colors duration-700" style={{ color: active.accent }}>
          <Icon name={active.features[0]?.icon ?? "box"} className="h-6 w-6" />
        </span>
      </div>

      <div className="relative z-10 -mt-12 text-center">
        <p key={active.id} className="ticker-in mx-auto inline-flex max-w-full flex-col items-center gap-1 rounded-3xl border border-white/10 bg-ink-900/80 px-8 py-4 backdrop-blur-md">
          <span className="font-latin text-3xl font-bold tracking-[0.35em] text-white" dir="ltr">{active.latin}</span>
          <span className="text-sm leading-6 text-mist-300">{active.tagline}</span>
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {products.map((p, i) => (
            <span key={p.id} className="h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: i === index ? 30 : 6, background: i === index ? p.accent : "rgba(91,139,153,0.45)" }} aria-hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();
  const names = products.map((p) => p.name);
  const { index, visible } = useGentleWord(names);
  const word = names[index] ?? names[0];

  return (
    <section ref={ref} className="grid-lines noise relative overflow-hidden bg-ink-950 pb-24 pt-14 sm:pt-20">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/35 bg-teal-500/10 px-5 py-2 text-xs font-medium tracking-wide text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            نرم‌افزارهای حسابداری و مدیریت کسب‌وکار — از ۱۳۸۵
          </p>

          <h1 className="mt-6">
            <span className="line-mask">
              <span className="font-display text-[54px] leading-[1.08] text-white sm:text-[72px] lg:text-[80px]">
                <span className={`inline-block text-teal-400 transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{word}</span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <span className="font-display text-[38px] leading-[1.2] text-ink-100 sm:text-[50px] lg:text-[56px]">
                حسابِ <span className="text-gold-400">بیست‌ساله</span>، اعتمادِ همیشگی
              </span>
            </span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-base leading-8 text-mist-300 sm:text-lg sm:leading-9" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
            از فروشگاهِ محله تا خط تولید کارخانه؛ پنج محصول، یک استاندارد —
            ساخته‌شده برای اینکه حسابِ کسب‌وکار شما در هر لحظه روشن باشد.
          </p>

          <div className="reveal mt-8 flex flex-wrap items-center gap-4" style={{ "--rv-delay": "350ms" } as React.CSSProperties}>
            <button onClick={() => nav({ page: "downloads" })} className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-7 py-3.5 text-base font-bold text-ink-950 transition-all hover:bg-teal-400">
              <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              دانلود نرم‌افزارها
            </button>
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ block: "start" })} className="group flex items-center gap-2 rounded-xl border border-ink-600 px-7 py-3.5 text-base font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400">
              آشنایی با محصولات
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center gap-8 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <YearSeal />
            <div className="grid min-w-[220px] flex-1 grid-cols-2 gap-x-6 gap-y-6">
              <Stat value={5} label="محصول تخصصی" />
              <Stat value={35} label="استان و شهر — ایران و افغانستان" />
            </div>
          </div>
        </div>

        <div className="reveal rv-scale relative hidden md:block" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <ProductVisual index={index} />
        </div>
      </div>
    </section>
  );
}

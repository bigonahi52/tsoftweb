import { useState } from "react";
import { products } from "../data";
import { fa, useCountUp, useGentleWord, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

function Stat({ value, label }: { value: number; label: string }) {
  const { ref, text } = useCountUp(value);
  return (
    <div>
      <p className="font-display text-4xl leading-none text-white sm:text-[44px]">
        <span ref={ref}>{text}</span>
      </p>
      <p className="mt-1.5 text-xs text-mist-300 sm:text-sm">{label}</p>
    </div>
  );
}

/** مُهر بیست‌سالگی با قاب خط‌چین */
function AnniversarySeal() {
  return (
    <div className="seal-pulse flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full border-2 border-dashed border-gold-500/80 bg-gold-500/10">
      <span className="font-display text-[42px] leading-none text-gold-400">{fa(20)}</span>
      <span className="mt-0.5 text-[11px] font-bold tracking-widest text-gold-400">سال</span>
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
              <div key={p.id} className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-1000 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}>
                <span className="flex h-24 w-24 items-center justify-center rounded-3xl text-white" style={{ background: p.accent }}>
                  <Icon name={p.features[0]?.icon ?? "box"} className="h-12 w-12" />
                </span>
                <span className="font-latin text-lg font-bold tracking-[0.35em] text-white/70">{p.latin}</span>
              </div>
            ) : (
              <img
                key={p.id}
                src={p.image}
                alt={p.name}
                loading={i === 0 ? "eager" : "lazy"}
                onError={() => setBroken((b) => ({ ...b, [p.id]: true }))}
                style={{ objectPosition: p.imgPos ?? "50% 50%" }}
                className={`img-key absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${i === index ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[1.04] opacity-0"}`}
              />
            )
          )}
          <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: "linear-gradient(180deg, rgba(23,176,166,0.10), rgba(10,27,33,0.28))" }} aria-hidden />
        </div>
      </div>

      {/* کپشن — اسم انگلیسی برنامه */}
      <div className="relative z-10 -mt-16 text-center">
        <p key={active.id} className="ticker-in mx-auto inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-ink-900/80 px-8 py-3.5 backdrop-blur-md">
          <span className="font-latin text-2xl font-bold tracking-[0.22em] text-teal-400 drop-shadow-[0_0_14px_rgba(23,176,166,0.45)]" dir="ltr">{active.latin}</span>
          <span className="inline-block h-4 w-px self-center bg-ink-600" aria-hidden />
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
  const words = products.map((p) => p.name);
  const { word, index, visible } = useGentleWord(words);

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
            از صندوقِ فروشگاه تا حسابداری چندارزیِ بازرگانی؛ دو محصول تخصصی، یک استاندارد —
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

          <div className="reveal mt-12 flex items-center gap-8 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <AnniversarySeal />
            <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-6">
              <Stat value={2} label="محصول تخصصی" />
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

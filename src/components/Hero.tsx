import { useState } from "react";
import { products } from "../data";
import { fa, useCountUp, useGentleWord, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

/* ── آمار کوچک و کم‌صدا ── */
function MiniStat({ value, label, delay }: { value: number; label: string; delay: number }) {
  const { ref, text } = useCountUp(value, 1300);
  return (
    <div className="reveal flex flex-col" style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}>
      <span ref={ref} className="font-display text-3xl leading-none text-white sm:text-[34px]">{text}</span>
      <span className="mt-1.5 text-[11px] tracking-wide text-mist-300 sm:text-xs">{label}</span>
    </div>
  );
}

/* ── ریزکارت‌های شناور اطراف تصویر ── */
function FloatingCards({ accent }: { accent: string }) {
  return (
    <>
      {/* نرخ روز — اشاره به کپیتال */}
      <div className="float-soft absolute -right-4 top-6 z-20 hidden w-44 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:block lg:-right-10">
        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-mist-300">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          نرخ لحظه‌ای ارز
        </p>
        <p className="mt-2 flex items-baseline justify-between">
          <span className="text-xs text-mist-300">هر دلار</span>
          <span className="font-latin text-lg font-bold text-white" dir="ltr">63,000</span>
        </p>
        <p className="mt-1 text-left font-latin text-[9px] tracking-[0.2em] text-teal-400" dir="ltr">CAPITAL · LIVE</p>
      </div>

      {/* فاکتور ثبت‌شده — اشاره به تیسافت */}
      <div className="float-soft-late absolute -left-4 bottom-24 z-20 hidden w-48 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md sm:block lg:-left-12">
        <p className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
            <Icon name="check" className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-white">فاکتور ثبت شد</span>
        </p>
        <p className="mt-2 flex items-baseline justify-between text-[11px]">
          <span className="font-latin text-mist-300" dir="ltr">TS-1402</span>
          <span className="font-latin font-bold text-gold-400" dir="ltr">2,450,000</span>
        </p>
      </div>
    </>
  );
}

/* ── تصویر شناور محصول داخل فرم نرم ── */
function ProductVisual({ index, goTo }: { index: number; goTo: (n: number) => void }) {
  const active = products[index] ?? products[0];
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* هاله‌ی رنگی هم‌رنگ محصول فعال */}
      <div
        className="pointer-events-none absolute -inset-14 rounded-full opacity-25 blur-[110px] transition-colors duration-1000"
        style={{ background: active.accent }}
        aria-hidden
      />

      {/* حلقه‌های مداری با نقطه‌های چرخان */}
      <div className="orbit-ring pointer-events-none absolute -inset-7 rounded-full border border-white/[0.06]" aria-hidden>
        <span className="absolute -top-1 right-1/2 h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(67,201,191,0.8)]" />
      </div>
      <div className="orbit-ring-reverse pointer-events-none absolute -inset-16 hidden rounded-full border border-dashed border-white/[0.05] sm:block" aria-hidden>
        <span className="absolute -bottom-1 right-1/3 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(240,192,102,0.8)]" />
      </div>

      <div className="relative aspect-square">
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

      <FloatingCards accent={active.accent} />

      {/* کپشن — اسم انگلیسی برنامه */}
      <div className="relative z-10 -mt-14 text-center">
        <p key={active.id} className="ticker-in mx-auto inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-ink-900/80 px-8 py-3.5 backdrop-blur-md">
          <span className="font-latin text-2xl font-bold tracking-[0.22em] text-teal-400 drop-shadow-[0_0_14px_rgba(23,176,166,0.45)]" dir="ltr">{active.latin}</span>
          <span className="inline-block h-4 w-px self-center bg-ink-600" aria-hidden />
          <span className="text-sm leading-6 text-mist-300">{active.tagline}</span>
        </p>

        {/* نشانگرهای قابل کلیک */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              aria-label={`نمایش ${p.name}`}
              title={p.name}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className="h-1.5 rounded-full transition-all duration-500 ease-out group-hover:scale-y-150"
                style={{ width: i === index ? 34 : 8, background: i === index ? p.accent : "rgba(91,139,153,0.45)" }}
              />
              <span className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${i === index ? "text-white" : "text-mist-300/0 group-hover:text-mist-300"}`}>
                {p.name}
              </span>
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
  const { word, index, visible, goTo } = useGentleWord(words);

  return (
    <section ref={ref} className="hero-sheen grid-lines noise relative overflow-hidden bg-ink-950 pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        {/* ستون متن */}
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/35 bg-teal-500/10 px-5 py-2 text-xs font-medium tracking-wide text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            نرم‌افزارهای حسابداری و مدیریت کسب‌وکار — از ۱۳۸۵
          </p>

          <h1 className="mt-7">
            <span className="line-mask">
              <span className="font-display text-[56px] leading-[1.06] text-white sm:text-[76px] lg:text-[84px]">
                <span className={`inline-block text-teal-400 transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{word}</span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <span className="font-display text-[38px] leading-[1.22] text-ink-100 sm:text-[52px] lg:text-[58px]">
                حسابِ <span className="text-gold-400">بیست‌ساله</span>،
                <br className="hidden sm:block" /> اعتمادِ همیشگی
              </span>
            </span>
          </h1>

          <p className="reveal mt-7 max-w-lg text-base leading-9 text-mist-300 sm:text-lg" style={{ "--rv-delay": "260ms" } as React.CSSProperties}>
            از صندوقِ فروشگاه تا حسابداری چندارزیِ بازرگانی — حسابِ کسب‌وکار شما، در هر لحظه روشن.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-4" style={{ "--rv-delay": "360ms" } as React.CSSProperties}>
            <button
              onClick={() => nav({ page: "downloads" })}
              className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-7 py-3.5 text-base font-bold text-ink-950 transition-all duration-300 hover:bg-teal-400 hover:shadow-[0_14px_38px_-10px_rgba(23,176,166,0.6)]"
            >
              <Icon name="download" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              دانلود نرم‌افزارها
            </button>
            <button
              onClick={() => document.getElementById("products")?.scrollIntoView({ block: "start" })}
              className="group flex items-center gap-2 rounded-xl border border-ink-600 px-7 py-3.5 text-base font-semibold text-ink-100 transition-colors duration-300 hover:border-gold-500 hover:text-gold-400"
            >
              آشنایی با محصولات
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </div>

          {/* آمار ظریف */}
          <div className="reveal mt-12 flex items-center gap-8 border-t border-ink-700/60 pt-7 sm:gap-12" style={{ "--rv-delay": "460ms" } as React.CSSProperties}>
            <MiniStat value={20} label="سال تجربه" delay={480} />
            <span className="h-9 w-px bg-ink-700/70" aria-hidden />
            <MiniStat value={2} label="محصول تخصصی" delay={560} />
            <span className="h-9 w-px bg-ink-700/70" aria-hidden />
            <MiniStat value={35} label="استان و شهر" delay={640} />
          </div>
        </div>

        {/* ستون تصویر */}
        <div className="reveal rv-scale relative hidden md:block" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
          <ProductVisual index={index} goTo={goTo} />
        </div>
      </div>
    </section>
  );
}

import { products } from "../data";
import { fa, useCountUp, useGentleWord, useRevealAll, prefersReducedMotion } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const PRODUCT_WORDS = products.map((p) => p.name);

function Stat({ value, suffix, label, plain = false }: { value: number; suffix?: string; label: string; plain?: boolean }) {
  const { ref, text } = useCountUp(value, 1400, plain);
  return (
    <div>
      <p className="flex items-baseline gap-1">
        <span ref={ref} className="font-display text-4xl leading-none text-white sm:text-[44px]">{text}</span>
        {suffix && <span className="font-display text-2xl text-gold-400">{suffix}</span>}
      </p>
      <p className="mt-1.5 text-xs text-mist-300 sm:text-sm">{label}</p>
    </div>
  );
}

/** تصویر شناور محصول داخل فرم ارگانیک، همگام با چرخش نام‌ها */
function ProductVisual({ index }: { index: number }) {
  const active = products[index] ?? products[0];
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div
        className="pointer-events-none absolute -inset-16 rounded-full opacity-30 blur-[120px] transition-colors duration-1000"
        style={{ background: active.accent }}
        aria-hidden
      />
      <div className="relative aspect-square">
        <div
          className="blob-outline absolute -inset-4 border-2 border-dashed opacity-40 transition-colors duration-1000"
          style={{ borderColor: active.accent }}
          aria-hidden
        />
        <div className="blob-shape absolute inset-0 overflow-hidden border border-white/10 shadow-[0_45px_90px_-35px_rgba(0,0,0,0.85)]">
          {products.map((p, i) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.name}
              loading={i === 0 ? "eager" : "lazy"}
              style={{ objectPosition: (p as { imgPos?: string }).imgPos ?? "50% 45%" }}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                i === index ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[1.06] opacity-0"
              }`}
            />
          ))}
          {/* هارمونی با تم نفتی سایت */}
          <div className="pointer-events-none absolute inset-0 bg-[#0a1b21] opacity-25 mix-blend-screen" aria-hidden />
          <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 62%, ${active.accent}26 100%)` }} aria-hidden />
        </div>
        <span
          className="absolute -left-3 top-10 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-ink-900/90 shadow-xl backdrop-blur transition-colors duration-700"
          style={{ color: active.accent }}
        >
          <Icon name={active.features[0]?.icon ?? "box"} className="h-6 w-6" />
        </span>
      </div>

      <div className="relative z-10 -mt-12 text-center">
        <p className="font-latin text-3xl font-bold tracking-[0.35em] text-white drop-shadow-[0_0_18px_rgba(23,176,166,0.35)] transition-all duration-700" key={`latin-${active.id}`}>
          {active.latin}
        </p>
        <p key={active.id} className="ticker-in mx-auto mt-2 inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-ink-900/80 px-7 py-3 backdrop-blur-md">
          <span className="font-display text-xl text-white">{active.name}</span>
          <span className="inline-block h-4 w-px self-center bg-ink-600" aria-hidden />
          <span className="text-sm leading-6 text-mist-300">{active.tagline}</span>
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5">
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
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();
  const { word, index, visible } = useGentleWord(PRODUCT_WORDS);

  return (
    <section ref={ref} className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-20 pt-14 sm:pt-20">
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/35 bg-teal-500/10 px-5 py-2 text-xs font-medium tracking-wide text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            نرم‌افزارهای حسابداری و مدیریت کسب‌وکار — از ۱۳۸۵
          </p>

          <h1 className="mt-7">
            <span className="line-mask">
              <span className="font-display text-[56px] leading-[1.05] text-white sm:text-[76px] lg:text-[84px]">
                <span className={`inline-block text-teal-400 transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                  {word}
                </span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <span className="font-display text-[38px] leading-[1.2] text-ink-100 sm:text-[52px] lg:text-[56px]">
                حسابِ <span className="text-gold-400">بیست‌ساله</span>، اعتمادِ همیشگی
              </span>
            </span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-base leading-8 text-mist-300 sm:text-lg sm:leading-9" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
            از فروشگاهِ محله تا خط تولید کارخانه؛ پنج محصول، یک استاندارد —
            ساخته‌شده برای اینکه حسابِ کسب‌وکار شما در هر لحظه روشن باشد.
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
              onClick={() => document.getElementById("products")?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" })}
              className="group flex items-center gap-2 rounded-xl border border-ink-600 px-7 py-3.5 text-base font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              آشنایی با محصولات
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          <div className="reveal mt-12 grid grid-cols-3 gap-x-6 gap-y-8 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <Stat value={20} label="سال سابقه تخصصی" />
            <Stat value={5} label="محصول تخصصی" />
            <Stat value={35} label="استان و شهر تحت پوشش" />
          </div>
        </div>

        <div className="reveal rv-scale relative hidden md:block" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <ProductVisual index={index} />
        </div>
      </div>

      <div className="relative mt-16 border-y border-ink-700/60 bg-ink-900/60 py-4">
        <div className="marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 items-center" aria-hidden={rep === 1}>
              {["سوپرمارکت و هایپر", "پوشاک و کیف‌وکفش", "موبایل و دیجیتال", "داروخانه", "لوازم خانگی", "قطعات خودرو", "بازرگانی ارزی", "کارگاه شیشه و پنجره", "مجتمع مسکونی", "شرکت‌های پخش", "کارخانجات تولیدی", "خدمات فنی"].map((t) => (
                <span key={t + rep} className="flex items-center gap-3 whitespace-nowrap px-5 text-sm text-mist-300">
                  <Icon name="store" className="h-4 w-4 text-teal-500/70" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

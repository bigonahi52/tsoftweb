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

/** تصویرسازی درون‌خطیِ هر محصول — سبک، فوری و هماهنگ با رنگ سایت */
function ProductArt({ id, accent }: { id: string; accent: string }) {
  if (id === "tisaft") {
    return (
      <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="tisaft-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14313a" />
            <stop offset="100%" stopColor="#0a1b21" />
          </linearGradient>
        </defs>
        <rect width="320" height="320" fill="url(#tisaft-bg)" />
        {/* پیشخوان فروشگاه */}
        <rect x="48" y="176" width="224" height="14" rx="7" fill="#1d424e" />
        <rect x="60" y="190" width="200" height="74" rx="10" fill="#14313a" />
        {/* مانیتور صندوق */}
        <rect x="70" y="96" width="110" height="72" rx="8" fill="#0f262e" stroke="#2b5663" strokeWidth="2" />
        <rect x="80" y="106" width="90" height="8" rx="4" fill={accent} opacity="0.9" />
        <rect x="80" y="122" width="62" height="6" rx="3" fill="#3d6d7b" />
        <rect x="80" y="134" width="74" height="6" rx="3" fill="#3d6d7b" />
        <rect x="80" y="146" width="50" height="6" rx="3" fill="#3d6d7b" />
        <rect x="116" y="168" width="18" height="10" fill="#1d424e" />
        {/* قفسه‌ی کالاها */}
        <rect x="204" y="104" width="66" height="8" rx="4" fill="#2b5663" />
        <rect x="204" y="134" width="66" height="8" rx="4" fill="#2b5663" />
        <rect x="210" y="88" width="14" height="16" rx="3" fill="#e5a93d" />
        <rect x="230" y="88" width="14" height="16" rx="3" fill="#43c9bf" />
        <rect x="250" y="88" width="14" height="16" rx="3" fill="#7fa9b5" />
        <rect x="214" y="118" width="14" height="16" rx="3" fill="#43c9bf" />
        <rect x="234" y="118" width="14" height="16" rx="3" fill="#e5a93d" />
        {/* بارکد و رسید */}
        <rect x="86" y="206" width="70" height="44" rx="6" fill="#f6fbfb" />
        <g fill="#0a1b21">
          <rect x="94" y="214" width="2" height="22" /><rect x="99" y="214" width="4" height="22" />
          <rect x="106" y="214" width="2" height="22" /><rect x="111" y="214" width="3" height="22" />
          <rect x="117" y="214" width="2" height="22" /><rect x="122" y="214" width="4" height="22" />
          <rect x="129" y="214" width="2" height="22" /><rect x="134" y="214" width="3" height="22" />
          <rect x="140" y="214" width="2" height="22" /><rect x="145" y="214" width="3" height="22" />
        </g>
        {/* سکه‌ها */}
        <circle cx="216" cy="226" r="20" fill="#e5a93d" />
        <circle cx="216" cy="226" r="14" fill="none" stroke="#0a1b21" strokeWidth="2" opacity="0.5" />
        <circle cx="244" cy="238" r="15" fill="#f0c066" />
        {/* اسکناس شناور */}
        <g className="float-soft">
          <rect x="176" y="44" width="86" height="40" rx="6" fill="#17b0a6" />
          <circle cx="219" cy="64" r="11" fill="#0f948b" />
          <rect x="186" y="56" width="14" height="16" rx="2" fill="#c9efec" opacity="0.7" />
        </g>
        {/* ذرات نور */}
        <circle cx="52" cy="70" r="3" fill="#43c9bf" opacity="0.6" className="pulse-dot" />
        <circle cx="284" cy="64" r="4" fill="#e5a93d" opacity="0.5" />
        <circle cx="296" cy="160" r="3" fill="#43c9bf" opacity="0.4" />
      </svg>
    );
  }
  /* capital — چندارزی */
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cap-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14313a" />
          <stop offset="100%" stopColor="#0a1b21" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#cap-bg)" />
      {/* کره‌ی زمین */}
      <circle cx="160" cy="150" r="86" fill="#0f262e" stroke="#2b5663" strokeWidth="2" />
      <ellipse cx="160" cy="150" rx="86" ry="34" fill="none" stroke="#2b5663" strokeWidth="1.5" />
      <ellipse cx="160" cy="150" rx="34" ry="86" fill="none" stroke="#2b5663" strokeWidth="1.5" />
      <path d="M74 150h172" stroke="#2b5663" strokeWidth="1.5" />
      <circle cx="160" cy="150" r="86" fill="none" stroke={accent} strokeWidth="2" opacity="0.35" />
      {/* دلار */}
      <g className="float-soft">
        <circle cx="92" cy="92" r="30" fill="#17b0a6" />
        <circle cx="92" cy="92" r="23" fill="none" stroke="#0a1b21" strokeWidth="2" opacity="0.4" />
        <text x="92" y="103" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="30" fill="#0a1b21">$</text>
      </g>
      {/* یورو */}
      <g className="float-soft-late">
        <circle cx="238" cy="84" r="26" fill="#e5a93d" />
        <text x="238" y="94" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="26" fill="#0a1b21">€</text>
      </g>
      {/* افغانی */}
      <g className="float-soft-late">
        <circle cx="252" cy="200" r="24" fill="#43c9bf" />
        <text x="252" y="209" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="22" fill="#0a1b21">؋</text>
      </g>
      {/* درهم */}
      <g className="float-soft">
        <circle cx="72" cy="212" r="22" fill="#f0c066" />
        <text x="72" y="220" textAnchor="middle" fontFamily="Vazirmatn" fontWeight="700" fontSize="16" fill="#0a1b21">د.إ</text>
      </g>
      {/* نمودار نرخ */}
      <g>
        <path d="M84 258 L124 244 L160 252 L200 230 L238 236" fill="none" stroke="#43c9bf" strokeWidth="3" strokeLinecap="round" />
        <circle cx="238" cy="236" r="5" fill="#e5a93d" />
      </g>
      <circle cx="44" cy="140" r="3" fill="#43c9bf" opacity="0.5" className="pulse-dot" />
      <circle cx="286" cy="140" r="3" fill="#e5a93d" opacity="0.5" />
    </svg>
  );
}

/** تصویر شناور محصول داخل فرم نرمِ ارگانیک با حلقه‌های مداری */
function ProductVisual({ index }: { index: number }) {
  const active = products[index] ?? products[0];
  return (
    <div className="relative mx-auto w-full max-w-[470px]">
      {/* هاله‌ی رنگی */}
      <div
        className="pointer-events-none absolute -inset-16 rounded-full opacity-30 blur-[120px] transition-colors duration-1000"
        style={{ background: active.accent }}
        aria-hidden
      />
      {/* حلقه‌های مداری */}
      <div className="pointer-events-none absolute -inset-10" aria-hidden>
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] rounded-full border border-white/8">
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(67,201,191,0.8)]" />
        </div>
        <div className="absolute inset-6 animate-[spin_28s_linear_infinite_reverse] rounded-full border border-dashed border-white/10">
          <span className="absolute top-1/2 -right-1 h-2.5 w-2.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(240,192,102,0.8)]" />
        </div>
      </div>

      <div className="relative aspect-square">
        <div
          className="blob-outline absolute -inset-4 border-2 border-dashed opacity-40 transition-colors duration-1000"
          style={{ borderColor: active.accent }}
          aria-hidden
        />
        <div className="blob-shape absolute inset-0 overflow-hidden border border-white/10 bg-ink-900 shadow-[0_45px_90px_-35px_rgba(0,0,0,0.85)]">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${i === index ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"}`}
            >
              <ProductArt id={p.id} accent={p.accent} />
            </div>
          ))}
        </div>
      </div>

      {/* کپشن */}
      <div className="relative z-10 -mt-14 text-center">
        <p key={active.id} className="ticker-in mx-auto inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-ink-900/85 px-8 py-3.5 backdrop-blur-md">
          <span className="font-latin text-2xl font-bold tracking-[0.22em] text-teal-400 drop-shadow-[0_0_14px_rgba(23,176,166,0.45)]" dir="ltr">{active.latin}</span>
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
  const words = products.map((p) => p.name);
  const { word, index, visible } = useGentleWord(words);

  return (
    <section ref={ref} className="grid-lines noise relative overflow-hidden bg-ink-950 pb-24 pt-14 sm:pt-20">
      {/* جاروب نور آهسته */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -inset-y-20 w-1/3 -skew-x-12 bg-white/[0.045] blur-2xl animate-[sweep_9s_ease-in-out_infinite]" />
      </div>
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-teal-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/35 bg-teal-500/10 px-5 py-2 text-xs font-medium tracking-wide text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            نرم‌افزارهای حسابداری و مدیریت کسب‌وکار — از ۱۳۸۵
          </p>

          <h1 className="mt-7">
            <span className="line-mask">
              <span className="font-display text-[52px] leading-[1.08] text-white sm:text-[72px] lg:text-[82px]">
                <span className={`inline-block text-teal-400 transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{word}</span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <span className="font-display text-[36px] leading-[1.2] text-ink-100 sm:text-[48px] lg:text-[54px]">
                حسابِ <span className="text-gold-400">بیست‌ساله</span>، اعتمادِ همیشگی
              </span>
            </span>
          </h1>

          <p className="reveal mt-7 max-w-xl text-base leading-8 text-mist-300 sm:text-lg sm:leading-9" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
            از صندوقِ فروشگاه تا حسابداری چندارزیِ بازرگانی؛ حسابِ کسب‌وکار شما، همیشه روشن.
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
              onClick={() => document.getElementById("products")?.scrollIntoView({ block: "start" })}
              className="group flex items-center gap-2 rounded-xl border border-ink-600 px-7 py-3.5 text-base font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              آشنایی با محصولات
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* نوار آمار ظریف */}
          <div className="reveal mt-12 flex items-center gap-8 border-t border-ink-700/70 pt-8" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
            <Stat value={20} label="سال سابقه" />
            <span className="h-10 w-px bg-ink-700/70" aria-hidden />
            <Stat value={2} label="محصول تخصصی" />
            <span className="h-10 w-px bg-ink-700/70" aria-hidden />
            <Stat value={35} label="استان و شهر" />
          </div>
        </div>

        <div className="reveal rv-scale relative hidden md:block" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
          <ProductVisual index={index} />
        </div>
      </div>

      <style>{`@keyframes sweep { 0% { transform: translateX(-120%) skewX(-12deg); } 55%, 100% { transform: translateX(320%) skewX(-12deg); } }`}</style>
    </section>
  );
}

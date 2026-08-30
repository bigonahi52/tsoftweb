import { useEffect, useState } from "react";
import { currencies } from "../data";
import { fa, prefersReducedMotion, useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Flag, Icon } from "./Icons";

/* اسناد زنده‌ی دفتر — هر چند ثانیه یک ردیف تازه وارد می‌شود */
const FEED = [
  { doc: "فاکتور فروش ۲۴۵۱", party: "فروشگاه آفتاب", amount: "۱۲٬۴۰۰٬۰۰۰", bed: false },
  { doc: "سند دستی ۰۸۹۳", party: "هزینه اجاره — شعبه ۲", amount: "۸٬۰۰۰٬۰۰۰", bed: true },
  { doc: "فاکتور خرید ۱۱۷۶", party: "پخش البرز", amount: "۴۵٬۶۰۰٬۰۰۰", bed: true },
  { doc: "دریافت چک ۰۵۵۲", party: "بازرگانی کیانی", amount: "۲۳۰٬۰۰۰٬۰۰۰", bed: true },
  { doc: "فاکتور ارزی ۰۰۹۲", party: "واردات — ۳٬۲۰۰ دلار", amount: "۲۰۱٬۶۰۰٬۰۰۰", bed: true },
  { doc: "فاکتور فروش ۲۴۵۲", party: "سوپر نیکو", amount: "۶٬۸۵۰٬۰۰۰", bed: false },
  { doc: "پرداخت اقساط ۱۱۴", party: "تسویه‌ی حساب", amount: "۱۸٬۲۰۰٬۰۰۰", bed: true },
];

const BARS = [34, 52, 40, 66, 55, 78, 60, 88, 70, 96, 82, 74, 90, 100];

function LedgerDashboard() {
  const [rows, setRows] = useState(() => FEED.slice(0, 5));
  const sales = useCountUp(842500000, 2400);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 5;
    const id = window.setInterval(() => {
      const next = FEED[i % FEED.length];
      i += 1;
      setRows((prev) => [next, ...prev].slice(0, 5));
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative">
      {/* هاله‌ی زمردی پشت داشبورد */}
      <div className="pointer-events-none absolute -inset-14 rounded-full bg-teal-600/18 blur-[110px]" aria-hidden />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900/85 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
        {/* نوار عنوان پنجره */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5695e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
          </div>
          <p className="font-latin text-[10px] font-bold tracking-[0.22em] text-mist-300" dir="ltr">TSOFT · ACCOUNTING SUITE</p>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" />
            در حال ثبت
          </span>
        </div>

        {/* آمارهای لحظه‌ای */}
        <div className="grid grid-cols-3 gap-3 px-5 pt-5">
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-4">
            <p className="text-[10px] text-mist-300">فروش امروز</p>
            <p className="mt-1.5 font-display text-lg leading-6 text-teal-400 sm:text-xl">
              <span ref={sales.ref}>{sales.text}</span>
            </p>
            <p className="text-[9px] text-mist-300">ریال</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-4">
            <p className="text-[10px] text-mist-300">اسناد باز</p>
            <p className="mt-1.5 font-display text-lg text-gold-400 sm:text-xl">{fa(23)}</p>
            <p className="text-[9px] text-mist-300">در انتظار ثبت</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.045] p-4">
            <p className="text-[10px] text-mist-300">مغایرت</p>
            <p className="mt-1.5 font-display text-lg text-white sm:text-xl">{fa(0)}</p>
            <p className="text-[9px] text-teal-400">ترازِ کامل</p>
          </div>
        </div>

        {/* دفتر اسناد زنده */}
        <div className="px-5 pb-1 pt-4">
          <p className="pb-2 text-[10px] font-bold text-mist-300">دفتر روزانه — {fa("1405/06")} </p>
          <ul className="space-y-1">
            {rows.map((r, idx) => (
              <li
                key={`${r.doc}-${idx}`}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[11.5px] ${
                  idx === 0 ? "ticker-in bg-teal-500/10 text-teal-300" : "text-mist-300"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.bed ? "bg-gold-500" : "bg-teal-500"}`} />
                  <span className="truncate font-bold">{r.doc}</span>
                  <span className="hidden truncate text-[10px] opacity-70 sm:inline">— {r.party}</span>
                </span>
                <span className="shrink-0 text-[10.5px]">
                  {r.amount} <span className="opacity-60">ریال · {r.bed ? "بدهکار" : "بستانکار"}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* نمودار میله‌ای فروش هفته */}
        <div className="flex items-end gap-1.5 px-5 pb-5 pt-3">
          {BARS.map((h, i) => (
            <div
              key={i}
              className={`bar-grow flex-1 rounded-t-md ${i === BARS.length - 1 ? "bg-gold-500" : "bg-teal-500/65"}`}
              style={{ height: `${h * 0.42}px`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        {/* نوار ارزها */}
        <div className="flex items-center justify-between gap-2 border-t border-white/8 px-5 py-3.5">
          <p className="font-latin text-[9px] font-bold tracking-[0.2em] text-mist-300" dir="ltr">LIVE RATES</p>
          <div className="flex items-center gap-2.5">
            {currencies.slice(0, 5).map((c) => (
              <span key={c.code} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 transition-colors hover:border-teal-500/50">
                <Flag code={c.code} className="h-3 w-[18px]" />
                <span className="text-[10px] text-mist-300">{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* نشان‌های شناور */}
      <div className="float-soft absolute -left-4 top-10 z-10 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-900/95 px-4 py-3 shadow-2xl backdrop-blur sm:flex lg:-left-9">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
          <Icon name="check" className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[11px] font-bold text-white">سند ثبت شد</span>
          <span className="block text-[9px] text-mist-300">همگام با صندوق و انبار</span>
        </span>
      </div>
      <div className="float-soft-late absolute -bottom-5 right-5 z-10 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-900/95 px-4 py-3 shadow-2xl backdrop-blur sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
          <Icon name="coins" className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[11px] font-bold text-white">نرخ روز ارز</span>
          <span className="block text-[9px] text-mist-300">دلار · درهم · افغانی</span>
        </span>
      </div>
    </div>
  );
}

const TRUST = [
  { v: "20+", l: "سال تجربه" },
  { v: "2", l: "محصول تخصصی" },
  { v: "35", l: "استان و شهر" },
  { v: "1", l: "سال پشتیبانی رایگان" },
];

/* دو محصول اصلی TSOFT — با رنگ اختصاصی هرکدام */
const HERO_PRODUCTS = [
  {
    id: "tisaft",
    name: "تیسافت",
    latin: "TSOFT RETAIL",
    desc: "نرم‌افزار حسابداری و مدیریت فروشگاه و کسب‌وکار",
    icon: "receipt",
    accent: "#16b87f",
  },
  {
    id: "capital",
    name: "تیسافت کپیتال",
    latin: "TSOFT CAPITAL",
    desc: "نرم‌افزار حسابداری و مدیریت سرمایه",
    icon: "coins",
    accent: "#eaa63b",
  },
];

function ProductCard({ p, onOpen, delay }: { p: (typeof HERO_PRODUCTS)[number]; onOpen: () => void; delay: number }) {
  return (
    <button
      onClick={onOpen}
      style={{ "--acc": p.accent, "--rv-delay": `${delay}ms` } as React.CSSProperties}
      className="product-card reveal group flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-right backdrop-blur transition-transform duration-300 hover:-translate-y-1 sm:gap-5 sm:p-5"
    >
      {/* آیکون محصول */}
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-ink-950 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
        style={{ background: p.accent }}
      >
        <Icon name={p.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>

      {/* نام و توضیح */}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="font-display text-2xl leading-7 text-white sm:text-[26px]">{p.name}</span>
          <span className="font-latin text-[9px] font-bold tracking-[0.28em] text-mist-300" dir="ltr">{p.latin}</span>
        </span>
        <span className="mt-1 block truncate text-[13px] leading-6 text-mist-300 sm:text-sm">{p.desc}</span>
      </span>

      {/* دکمه‌ی مشاهده محصول */}
      <span className="pc-arrow flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white sm:h-12 sm:w-12" aria-label={`مشاهده محصول ${p.name}`}>
        <Icon name="arrow" className="h-5 w-5" />
      </span>
    </button>
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();

  return (
    <section ref={ref} className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-12 sm:pt-16">
      {/* نورهای محیطی */}
      <div className="pointer-events-none absolute -left-40 top-16 h-[460px] w-[460px] rounded-full bg-teal-600/14 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-[360px] w-[360px] rounded-full bg-gold-500/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        {/* ستون برند و محصولات */}
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-5 py-2 text-xs font-bold text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            گروه نرم‌افزاری سرمایه · از {fa(1385)}
          </p>

          {/* برند اصلی */}
          <h1 className="mt-6">
            <span className="line-mask">
              <span className="font-latin block text-6xl font-bold leading-none tracking-tight text-white sm:text-7xl lg:text-[80px]">
                TSOFT<span className="text-gold-400">.</span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display mt-4 block text-2xl leading-snug text-teal-400 sm:text-3xl">
                نرم‌افزارهای حسابداری و مدیریت کسب‌وکار
              </span>
            </span>
          </h1>

          {/* جداکننده‌ی دو محصول */}
          <div className="reveal mt-8 flex items-center gap-3" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
            <span className="h-px w-9 bg-teal-500/60" aria-hidden />
            <p className="text-xs font-bold tracking-wide text-mist-300">دو محصول اصلیِ ما</p>
          </div>

          {/* دو کارت محصول */}
          <div className="mt-4 space-y-3.5">
            {HERO_PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={280 + i * 110} onOpen={() => nav({ page: "product", id: p.id })} />
            ))}
          </div>

          <p className="reveal mt-5 text-[13px] text-mist-300" style={{ "--rv-delay": "500ms" } as React.CSSProperties}>
            نسخه‌ی آزمایشی هر دو محصول رایگان است ·{" "}
            <button onClick={() => nav({ page: "downloads" })} className="link-underline font-bold text-teal-400">
              دانلود رایگان
            </button>
          </p>

          {/* نوار اعتماد */}
          <div className="reveal mt-8 grid grid-cols-2 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4" style={{ "--rv-delay": "560ms" } as React.CSSProperties}>
            {TRUST.map((t) => (
              <div key={t.l} className="sm:border-l sm:border-white/10 sm:pl-5 sm:last:border-0">
                <p className="font-display text-[26px] leading-none text-gold-400">{fa(t.v)}</p>
                <p className="mt-1.5 text-[11px] text-mist-300">{t.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* داشبورد زنده */}
        <div className="reveal rv-scale" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
          <LedgerDashboard />
        </div>
      </div>
    </section>
  );
}

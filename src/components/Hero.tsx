import { useEffect, useState } from "react";
import { products } from "../data";
import { fa, useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const POSTINGS = [
  { doc: "فاکتور فروش ۲۴۵۲", party: "سوپر نیکو", amount: "۶٬۸۵۰٬۰۰۰", type: "بستانکار" },
  { doc: "فاکتور فروش ۲۴۵۱", party: "فروشگاه آفتاب", amount: "۱۲٬۴۰۰٬۰۰۰", type: "بستانکار" },
  { doc: "سند دستی ۰۸۹۳", party: "هزینه اجاره — شعبه ۲", amount: "۸٬۰۰۰٬۰۰۰", type: "بدهکار" },
  { doc: "فاکتور خرید ۱۱۷۶", party: "پخش البرز", amount: "۴۵٬۶۰۰٬۰۰۰", type: "بدهکار" },
  { doc: "پرداخت اقساط ۱۱۴", party: "تسویه‌ی حساب", amount: "۱۸٬۲۰۰٬۰۰۰", type: "بدهکار" },
];

function SalesTicker() {
  const [sales, setSales] = useState(2148922226);
  useEffect(() => {
    const id = window.setInterval(() => setSales((s) => s + Math.floor(Math.random() * 900000) + 100000), 3600);
    return () => window.clearInterval(id);
  }, []);
  return <span>{fa(sales.toLocaleString("en-US"))}</span>;
}

/** داشبورد حسابداری زنده */
function LiveDashboard() {
  const [items, setItems] = useState(POSTINGS.slice(0, 4));
  useEffect(() => {
    let i = 4;
    const id = window.setInterval(() => {
      const next = POSTINGS[i % POSTINGS.length];
      i += 1;
      setItems((prev) => [next, ...prev].slice(0, 4));
    }, 3600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900/85 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
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

      <div className="grid grid-cols-3 gap-3 px-5 pt-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-[10px] text-mist-300">فروش امروز</p>
          <p className="mt-1.5 font-display text-lg leading-6 text-teal-400 sm:text-xl"><SalesTicker /></p>
          <p className="text-[9px] text-mist-300">ریال</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-[10px] text-mist-300">اسناد باز</p>
          <p className="mt-1.5 font-display text-lg text-gold-400 sm:text-xl">{fa(23)}</p>
          <p className="text-[9px] text-mist-300">در انتظار ثبت</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-[10px] text-mist-300">مغایرت</p>
          <p className="mt-1.5 font-display text-lg text-white sm:text-xl">{fa(0)}</p>
          <p className="text-[9px] text-teal-400">ترازِ کامل</p>
        </div>
      </div>

      <div className="px-5 pb-1 pt-4">
        <p className="pb-2 text-[10px] font-bold text-mist-300">دفتر روزانه — {fa("1405/06")}</p>
        <ul className="space-y-1">
          {items.map((it, idx) => (
            <li key={`${it.doc}-${idx}`} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[11.5px] ${idx === 0 ? "ticker-in bg-teal-500/10 text-teal-300" : "text-mist-300"}`}>
              <span className="flex min-w-0 items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${it.type === "بدهکار" ? "bg-gold-500" : "bg-teal-500"}`} />
                <span className="truncate font-bold">{it.doc}</span>
                <span className="hidden truncate text-[10px] opacity-70 sm:inline">— {it.party}</span>
              </span>
              <span className="shrink-0 text-[10.5px]">
                {it.amount} <span className="opacity-60">ریال · {it.type}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-end gap-1.5 border-t border-white/10 px-5 pb-4 pt-4">
        {[38, 55, 42, 70, 58, 86, 64, 92, 74, 100, 82, 90].map((h, i) => (
          <div key={i} className={`bar-grow flex-1 rounded-t ${i === 9 ? "bg-gold-500" : "bg-teal-500/70"}`} style={{ height: `${h * 0.5}px`, animationDelay: `${i * 70}ms` }} />
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const { ref, text } = useCountUp(value, 1400);
  return (
    <div>
      <p className="font-display text-[26px] leading-none text-gold-400">
        <span ref={ref}>{text}</span>
        {suffix && <span className="text-lg">{suffix}</span>}
      </p>
      <p className="mt-1.5 text-[11px] text-mist-300">{label}</p>
    </div>
  );
}

export default function Hero({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLElement>();

  return (
    <section ref={ref} className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-12 sm:pt-16">
      <div className="pointer-events-none absolute -left-40 top-16 h-[460px] w-[460px] rounded-full bg-teal-600/14 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-[360px] w-[360px] rounded-full bg-gold-500/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        <div>
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-5 py-2 text-xs font-bold text-teal-400">
            <Icon name="spark" className="h-3.5 w-3.5 text-gold-400" />
            گروه نرم‌افزاری سرمایه · از {fa(1385)}
          </p>

          <h1 className="mt-6">
            <span className="line-mask">
              <span className="font-latin block text-6xl font-bold leading-none tracking-tight text-white sm:text-7xl lg:text-[80px]">
                TSOFT<span className="text-gold-400">.</span>
              </span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display mt-4 block text-2xl leading-snug text-teal-400 sm:text-3xl">نرم‌افزارهای حسابداری و مدیریت کسب‌وکار</span>
            </span>
          </h1>

          <div className="reveal mt-8 flex items-center gap-3" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
            <span className="h-px w-9 bg-teal-500/60" aria-hidden />
            <p className="text-xs font-bold tracking-wide text-mist-300">دو محصول اصلیِ ما</p>
          </div>

          <div className="mt-4 space-y-3.5">
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => nav({ page: "product", id: p.id })}
                className="product-card reveal group flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-right backdrop-blur transition-transform duration-300 hover:-translate-y-1 sm:gap-5 sm:p-5"
                style={{ "--acc": p.accent, "--rv-delay": `${280 + i * 110}ms` } as React.CSSProperties}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-ink-950 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16" style={{ background: p.accent }}>
                  <Icon name={p.features[0]?.icon ?? "box"} className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="font-display text-2xl leading-7 text-white sm:text-[26px]">{p.name}</span>
                    <span className="font-latin text-[9px] font-bold tracking-[0.28em] text-mist-300" dir="ltr">{p.latin}</span>
                  </span>
                  <span className="mt-1 block truncate text-[13px] leading-6 text-mist-300 sm:text-sm">{p.tagline}</span>
                </span>
                <span className="pc-arrow flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white sm:h-12 sm:w-12" aria-label={`مشاهده محصول ${p.name}`}>
                  <Icon name="arrow" className="h-5 w-5" />
                </span>
              </button>
            ))}
          </div>

          <p className="reveal mt-5 text-[13px] text-mist-300" style={{ "--rv-delay": "500ms" } as React.CSSProperties}>
            نسخه‌ی آزمایشی هر دو محصول رایگان است ·{" "}
            <button onClick={() => nav({ page: "downloads" })} className="link-underline font-bold text-teal-400">دانلود رایگان</button>
          </p>

          <div className="reveal mt-8 grid grid-cols-2 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4" style={{ "--rv-delay": "560ms" } as React.CSSProperties}>
            <Stat value={20} suffix="+" label="سال تجربه" />
            <div className="sm:border-s sm:border-white/10 sm:ps-6"><Stat value={2} label="محصول تخصصی" /></div>
            <div className="sm:border-s sm:border-white/10 sm:ps-6"><Stat value={35} label="استان و شهر" /></div>
            <div className="sm:border-s sm:border-white/10 sm:ps-6"><Stat value={1} label="سال پشتیبانی رایگان" /></div>
          </div>
        </div>

        <div className="reveal rv-scale" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
          <LiveDashboard />
        </div>
      </div>
    </section>
  );
}

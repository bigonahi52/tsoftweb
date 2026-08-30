import { useEffect, useRef, useState } from "react";
import { currencies, products } from "../data";
import { fa, prefersReducedMotion, useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Flag, Icon } from "./Icons";
import SupportBand, { useSupportStatus } from "./SupportBand";

/* ───────── ویترین محصولات — ستون چسبان + اسکرول‌اسپای ───────── */
function ProductsShowcase({ nav }: { nav: NavFn }) {
  const [active, setActive] = useState(products[0].id);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace("panel-", "")); }),
      { rootMargin: "-42% 0px -42% 0px" }
    );
    Object.values(panels.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    panels.current[id]?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setActive(id);
  };

  return (
    <section id="products" className="relative scroll-mt-24 bg-paper py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="reveal eyebrow">TSOFT FAMILY</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display block text-5xl leading-tight text-ink-900 sm:text-6xl">دو محصول،</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-5xl leading-tight text-teal-600 sm:text-6xl">یک استاندارد</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-md leading-9 text-mist-500">
              یکی برای صندوق فروشگاه، یکی برای بازرگانیِ چندارزی. اسکرول کنید تا هر دو را از نزدیک ببینید.
            </p>
            <div className="reveal mt-10 space-y-2.5" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(p.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-right transition-all duration-300 ${
                    active === p.id
                      ? "border-transparent bg-ink-950 text-white shadow-[0_18px_40px_-20px_rgba(12,31,25,0.55)]"
                      : "border-ink-100 bg-white text-ink-800 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-[0_14px_30px_-20px_rgba(12,31,25,0.35)]"
                  }`}
                >
                  <span className={`font-latin text-sm font-bold ${active === p.id ? "text-gold-400" : "text-mist-300"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-2xl transition-colors ${active === p.id ? "text-white" : "text-mist-500/70"}`}>{p.name}</span>
                  <span className={`mr-auto font-latin text-[10px] tracking-[0.25em] ${active === p.id ? "text-teal-400" : "text-mist-300"}`}>{p.latin}</span>
                </button>
              ))}
            </div>
            <p className="reveal mt-8 flex items-center gap-2.5 text-xs text-mist-500" style={{ "--rv-delay": "300ms" } as React.CSSProperties}>
              <Icon name="spark" className="h-4 w-4 text-gold-500" />
              هر دو: ویندوزی، تک‌کاربره و تحت شبکه، با پین‌کد نرم‌افزاری
            </p>
          </div>

          <div className="space-y-14">
            {products.map((p) => (
              <div key={p.id} id={`panel-${p.id}`} ref={(el) => { panels.current[p.id] = el; }} className="reveal card-pro relative overflow-hidden p-7 sm:p-10">
                <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: p.accent }} aria-hidden />

                {p.image && (
                  <div className="group/img relative mb-8 h-56 overflow-hidden rounded-2xl sm:h-64">
                    <img src={p.image} alt={`${p.name} — ${p.tagline}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105" />
                    <div className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 55%, ${p.accent}33 100%)` }} aria-hidden />
                    <span className="absolute bottom-4 right-4 rounded-full bg-ink-950/80 px-4 py-1.5 font-latin text-[10px] font-bold tracking-[0.25em] text-gold-400 backdrop-blur" dir="ltr">{p.latin}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-[#ffffff] shadow-lg transition-transform duration-300 hover:rotate-6" style={{ background: p.accent }}>
                    <Icon name={p.features[0]?.icon ?? "box"} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-display text-3xl text-ink-900">{p.name}</p>
                    <p className="font-latin text-[11px] tracking-[0.3em] text-mist-300">{p.latin} · {p.en}</p>
                  </div>
                  <span className="mr-auto hidden rounded-full px-4 py-2 text-xs font-bold sm:block" style={{ background: `${p.accent}1a`, color: p.accent }}>{p.tagline}</span>
                </div>

                <p className="mt-6 max-w-2xl leading-9 text-mist-500">{p.short}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.features.slice(0, 4).map((f) => (
                    <span key={f.title} className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-ink-50/60 px-3.5 py-1.5 text-xs font-medium text-ink-800 transition-colors hover:border-teal-500/50 hover:text-teal-600">
                      <Icon name={f.icon} className="h-3.5 w-3.5" />
                      {f.title}
                    </span>
                  ))}
                </div>

                {p.id === "capital" && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-ink-100 bg-ink-50/40 p-3.5">
                    <span className="text-[11px] font-bold text-mist-500">ارزهای پیش‌فرض:</span>
                    {currencies.map((c) => (
                      <span key={c.code} className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/60 hover:shadow-sm">
                        <Flag code={c.code} className="h-3.5 w-5" />
                        <span className="font-medium text-ink-800">{c.name}</span>
                        <span className="text-[10px] text-mist-300">{c.country}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button onClick={() => nav({ page: "product", id: p.id })} className="btn-dark group !py-3">
                    آشنایی با {p.name}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                  <button onClick={() => nav({ page: "downloads" })} className="link-underline text-sm font-bold text-teal-600">دانلود نسخه آزمایشی</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── چرا تیسافت — چیدمان نامتقارن ───────── */
function WhyTisaft() {
  const open = useSupportStatus();
  return (
    <section className="bg-paper py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal eyebrow">WHY TSOFT</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display block text-4xl leading-tight text-ink-900 sm:text-6xl">چرا کسب‌وکارها تیسافت را</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-4xl leading-tight sm:text-6xl"><span className="text-teal-600">نگه</span> می‌دارند؟</span>
              </span>
            </h2>
          </div>
          <p className="reveal max-w-sm text-sm leading-8 text-mist-500">
            نرم‌افزار حسابداری فقط یک ابزار نیست؛ شریکِ هر روزِ کسب‌وکار شماست — و شریک باید قابل اعتماد باشد.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* کارت بلند — پشتیبانی واقعی */}
          <div className="reveal grid-lines grid-lines-fade noise relative overflow-hidden rounded-[1.5rem] border border-ink-800 bg-ink-950 p-8 shadow-[0_28px_60px_-30px_rgba(12,31,25,0.6)] sm:p-10 lg:col-span-5 lg:row-span-2">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal-600/20 blur-[90px]" aria-hidden />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400">
              <Icon name="headset" className="h-7 w-7" />
            </span>
            <h3 className="relative mt-6 font-display text-3xl leading-snug text-white">پشتیبانیِ واقعی، نه تلفنِ گویا</h3>
            <p className="relative mt-3 text-sm leading-8 text-mist-300">
              تلفن را خودِ توسعه‌دهنده جواب می‌دهد؛ مشکل را همان‌جا می‌فهمد و همان تماس حلش می‌کند — با اتصال امن به سیستم شما، در هر استان که باشید.
            </p>

            <div className="relative mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm text-mist-300"><Icon name="sun" className="h-4 w-4 text-gold-400" /> صبح</span>
                <span className="font-latin text-sm font-bold text-white" dir="ltr">09:00 – 14:00</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm text-mist-300"><Icon name="moon" className="h-4 w-4 text-teal-400" /> عصر</span>
                <span className="font-latin text-sm font-bold text-white" dir="ltr">17:00 – 22:00</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="text-sm text-mist-300">روزهای تعطیل</span>
                <span className="text-xs font-bold text-gold-400">پشتیبانی اضطراری</span>
              </div>
            </div>

            <div className="relative mt-8 flex items-center gap-3 rounded-xl border border-gold-500/35 bg-gold-500/10 px-4 py-3.5">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${open ? "pulse-dot bg-teal-500" : "bg-gold-500"}`} />
              <p className="text-xs font-bold text-white">
                {open ? "الان آنلاین هستیم — همین حالا زنگ بزنید" : "الان خارج از ساعت کاری‌ایم؛ پیام بگذارید"}
              </p>
            </div>
            <p className="relative mt-5 text-center text-[11px] text-mist-300">
              <b className="text-gold-400">یک سال پشتیبانی رایگان</b> همراه هر خرید
            </p>
          </div>

          {/* کارت پهن — بدون قفل */}
          <div className="reveal card-pro group p-8 lg:col-span-7" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/12 text-teal-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name="key" className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-2xl text-ink-900">بدون قفل سخت‌افزاری</h3>
                <p className="mt-2 text-sm leading-8 text-mist-500">
                  نه دانگل، نه نگرانیِ گم‌شدن و سوختن قفل. فعال‌سازی همه‌ی محصولات با <b className="text-ink-900">پین‌کد نرم‌افزاری</b> است؛ جابه‌جایی لایسنس هم با یک تماس انجام می‌شود.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3.5 py-1.5 text-[11px] font-bold text-teal-600">
                  <Icon name="check" className="h-3.5 w-3.5" />
                  فعال‌سازی در کمتر از پنج دقیقه
                </span>
              </div>
            </div>
          </div>

          {/* بکاپ خودکار */}
          <div className="reveal card-pro group p-8 lg:col-span-4" style={{ "--rv-delay": "220ms" } as React.CSSProperties}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/12 text-teal-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name="cloud" className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-display text-2xl text-ink-900">بکاپِ خودکار</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">
              پشتیبان‌گیری زمان‌بندی‌شده؛ ذخیره در فضای ابری یا ارسال خودکار به ایمیل شما — اطلاعات‌تان هیچ‌وقت گم نمی‌شود.
            </p>
          </div>

          {/* همیشه به‌روز */}
          <div className="reveal card-pro group p-8 lg:col-span-3" style={{ "--rv-delay": "320ms" } as React.CSSProperties}>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-600 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name="update" className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-display text-2xl text-ink-900">همیشه به‌روز</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">
              آپدیت‌های رایگان؛ نرخ‌ها و قوانین مالیاتی همیشه لحاظ می‌شوند.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── اعتمادسازی — شمارنده‌ها و تضمین‌ها ───────── */
function TrustStat({ value, label, delay }: { value: number; label: string; delay: number }) {
  const { ref, text } = useCountUp(value, 1500, true);
  return (
    <div className="reveal" style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}>
      <p className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">
        <span ref={ref}>{fa(text)}</span>
      </p>
      <p className="mt-3 text-sm text-mist-300">{label}</p>
    </div>
  );
}

const ASSURANCES = [
  { icon: "shield", title: "داده‌ها روی سیستم خودتان", desc: "نرم‌افزار روی کامپیوتر شما نصب است؛ نه سرور ما، نه جای دیگر." },
  { icon: "cloud", title: "پشتیبان‌گیری مطمئن", desc: "بکاپ روزانه‌ی خودکار، در فضای ابری یا ایمیل شما." },
  { icon: "headset", title: "مستقیم با سازنده", desc: "بدون واسطه و نماینده؛ کسی که ساخته، جواب می‌دهد." },
];

function TrustBand() {
  return (
    <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-24 top-0 h-[400px] w-[400px] rounded-full bg-teal-600/13 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[340px] w-[340px] rounded-full bg-gold-500/9 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal eyebrow text-teal-400">20 YEARS OF TRUST</p>
            <h2 className="mt-4">
              <span className="line-mask"><span className="font-display block text-4xl leading-tight text-white sm:text-6xl">اعتماد، <span className="text-gold-400">ساخته‌شده</span></span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-4xl leading-tight text-white sm:text-6xl">در بیست سال</span>
              </span>
            </h2>
          </div>
          <p className="reveal max-w-sm text-sm leading-8 text-mist-300">
            از {fa(1385)} کنار کسب‌وکارهای ایرانی و افغان بوده‌ایم — و هنوز مشتریِ روز اول، مشتریِ ماست.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          <TrustStat value={20} label="سال سابقه‌ی تخصصی" delay={0} />
          <TrustStat value={1385} label="سالِ شروع راه" delay={100} />
          <TrustStat value={35} label="استان و شهر — ایران و افغانستان" delay={200} />
          <TrustStat value={2} label="محصول تخصصی، یک خانواده" delay={300} />
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
          {ASSURANCES.map((a, i) => (
            <div key={a.title} className="reveal flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-teal-500/40" style={{ "--rv-delay": `${i * 100}ms` } as React.CSSProperties}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/12 text-teal-400">
                <Icon name={a.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl text-white">{a.title}</h3>
                <p className="mt-1 text-[13px] leading-7 text-mist-300">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── امکانات — قابل اسکن ───────── */
function FeaturesScan({ nav }: { nav: NavFn }) {
  return (
    <section className="border-t border-ink-100 bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal eyebrow">FEATURES AT A GLANCE</p>
            <h2 className="reveal mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-6xl">هر دو محصول، در یک نگاه</h2>
          </div>
          <p className="reveal max-w-sm text-sm leading-8 text-mist-500">
            همه‌ی امکانات را لازم ندارید؟ مهم نیست — هر دو نرم‌افزار از روز اول، کامل‌اند.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {products.map((p, idx) => (
            <div key={p.id} className="reveal card-pro flex flex-col p-8 sm:p-9" style={{ "--rv-delay": `${idx * 130}ms` } as React.CSSProperties}>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#ffffff] shadow-md" style={{ background: p.accent }}>
                  <Icon name={p.features[0]?.icon ?? "box"} className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-display text-2xl text-ink-900">{p.name}</p>
                  <p className="font-latin text-[10px] tracking-[0.28em] text-mist-300">{p.latin} · {p.en}</p>
                </div>
                <span className="mr-auto hidden rounded-full px-3.5 py-1.5 text-[11px] font-bold sm:block" style={{ background: `${p.accent}1a`, color: p.accent }}>
                  {p.tagline}
                </span>
              </div>

              <div className="mt-8 grid flex-1 gap-x-7 gap-y-5 sm:grid-cols-2">
                {p.features.map((f) => (
                  <div key={f.title} className="tick-row group">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: `${p.accent}1f`, color: p.accent }}>
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{f.title}</p>
                      <p className="mt-0.5 text-xs leading-6 text-mist-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-50 pt-6">
                <button onClick={() => nav({ page: "product", id: p.id })} className="link-underline text-sm font-bold text-teal-600">
                  مشاهده‌ی کامل {p.name}
                </button>
                <button onClick={() => nav({ page: "downloads" })} className="flex items-center gap-1.5 text-xs font-bold text-mist-500 transition-colors hover:text-gold-600">
                  <Icon name="download" className="h-3.5 w-3.5" />
                  دانلود آزمایشی
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── نظرات مشتریان ───────── */
function Voices() {
  const quotes = products.filter((p) => p.quote).map((p) => ({ ...p.quote!, product: p.name, accent: p.accent }));
  return (
    <section className="bg-paper py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="reveal eyebrow">CUSTOMER VOICES</p>
        <h2 className="reveal mt-3 font-display text-4xl text-ink-900 sm:text-5xl">حرفِ مشتری‌های ما</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <figure key={q.product} className="reveal card-pro relative p-8 pt-11" style={{ "--rv-delay": `${i * 110}ms` } as React.CSSProperties}>
              <span className="absolute -top-5 right-8 flex h-10 w-10 items-center justify-center rounded-full font-display text-4xl text-[#ffffff] shadow-md" style={{ background: q.accent }} aria-hidden>”</span>
              <blockquote className="text-sm leading-8 text-mist-500">{q.text}</blockquote>
              <figcaption className="mt-5 border-t border-ink-50 pt-4">
                <p className="font-display text-lg text-ink-900">{q.author}</p>
                <p className="text-xs text-mist-500">{q.role} — {q.product}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── با عشق ───────── */
function WithLove({ nav }: { nav: NavFn }) {
  return (
    <section className="relative overflow-hidden border-t border-ink-100 bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <span className="heartbeat reveal mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-100 text-gold-600 glow-gold" aria-hidden>
          <Icon name="heart" className="h-10 w-10" />
        </span>
        <h2 className="reveal mt-7">
          <span className="line-mask"><span className="font-display block text-4xl leading-tight text-ink-900 sm:text-6xl">اینجا همه‌چیز با عشق ساخته می‌شه</span></span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-2xl leading-9 text-mist-500">
          تک‌تک محصولات تیسافت با علاقه‌ی واقعی به کارِ شما طراحی شده‌اند — و ما عاشقِ مشتری‌هایمان هستیم. رضایت شما، بزرگ‌ترین تبلیغ ماست.
        </p>
        <div className="reveal mt-12 grid gap-5 sm:grid-cols-2">
          <div className="card-pro p-8 text-right">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/12 text-teal-600"><Icon name="megaphone" className="h-6 w-6" /></span>
            <h3 className="mt-4 font-display text-2xl text-ink-900">خوبی‌هامون رو به همه بگین</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">اگر از تیسافت راضی هستید، معرفی شما به یک همکار یا دوست، بزرگ‌ترین هدیه‌ای است که می‌توانید به ما بدهید.</p>
          </div>
          <div className="card-pro p-8 text-right">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><Icon name="chat" className="h-6 w-6" /></span>
            <h3 className="mt-4 font-display text-2xl text-ink-900">اشکالات رو به خودمون بگین</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">نقد و پیشنهاد مستقیم، سریع‌ترین راهِ بهتر شدن ماست — مستقیم به دست سازنده می‌رسد و جدی گرفته می‌شود.</p>
          </div>
        </div>
        <button onClick={() => nav({ page: "contact" })} className="btn-dark reveal group mx-auto mt-10">
          <Icon name="heart" className="h-5 w-5 text-gold-400" />
          ارسال نظر و پیشنهاد
        </button>
      </div>
    </section>
  );
}

/* ───────── دعوت به دانلود ───────── */
const DL_PREVIEW = [
  { name: "TSOFT Setup", format: "ZIP", desc: "نصب کامل تیسافت" },
  { name: "Capital Installer", format: "EXE", desc: "نصب کامل کپیتال" },
  { name: "SQL Server 2008 R2 Express", format: "EXE", desc: "پیش‌نیاز پایگاه داده" },
];

function DownloadCta({ nav }: { nav: NavFn }) {
  return (
    <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600/13 blur-[130px]" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="reveal eyebrow text-teal-400">FREE TRIAL · START TODAY</p>
          <h2 className="mt-4">
            <span className="line-mask"><span className="font-display block text-5xl leading-[1.18] text-white sm:text-6xl">همین امروز <span className="text-gold-400">رایگان</span> نصب کنید؛</span></span>
            <span className="line-mask" style={{ "--rv-delay": "130ms" } as React.CSSProperties}>
              <span className="font-display block text-5xl leading-[1.18] text-white sm:text-6xl">با داده‌های <span className="text-teal-400">خودتان</span> تست کنید</span>
            </span>
          </h2>
          <p className="reveal mt-6 max-w-xl leading-9 text-mist-300">
            نسخه‌ی آزمایشی هر دو محصول رایگان است؛ نصب کنید، با اطلاعات واقعی فروشگاه یا بازرگانی‌تان کار کنید و بعد تصمیم بگیرید.
            هنگام خرید هم <b className="text-white">یک سال پشتیبانی کامل رایگان</b> همراه‌تان هست.
          </p>

          <ul className="reveal mt-7 flex flex-wrap gap-x-7 gap-y-3" style={{ "--rv-delay": "230ms" } as React.CSSProperties}>
            {["فعال‌سازی فوری با پین‌کد", "ویندوز ۱۰ و ۱۱", "تک‌کاربره و تحت شبکه"].map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-mist-300">
                <Icon name="check" className="h-4 w-4 text-teal-400" />
                {c}
              </li>
            ))}
          </ul>

          <div className="reveal mt-9 flex flex-wrap gap-4" style={{ "--rv-delay": "330ms" } as React.CSSProperties}>
            <button onClick={() => nav({ page: "downloads" })} className="btn-primary group !px-8 !py-4 text-lg">
              <Icon name="download" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
              رفتن به مرکز دانلود
            </button>
            <button onClick={() => nav({ page: "contact" })} className="btn-ghost-light">مشاوره با کارشناس</button>
          </div>
        </div>

        {/* پیش‌نمایش مرکز دانلود */}
        <div className="reveal rv-left" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900/80 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <p className="font-display text-xl text-white">مرکز دانلود</p>
              <span className="font-latin text-[10px] font-bold tracking-[0.2em] text-teal-400" dir="ltr">dl.tsoft20.ir</span>
            </div>
            <div className="divide-y divide-white/6">
              {DL_PREVIEW.map((f) => (
                <button key={f.name} onClick={() => nav({ page: "downloads" })} className="group flex w-full items-center gap-4 px-6 py-4 text-right transition-colors hover:bg-white/[0.05]">
                  <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/12 font-latin text-[10px] font-bold tracking-widest text-teal-400">{f.format}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-white" dir="ltr" style={{ textAlign: "right" }}>{f.name}</span>
                    <span className="block text-[11px] text-mist-300">{f.desc}</span>
                  </span>
                  <Icon name="download" className="h-4 w-4 shrink-0 text-mist-300 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-gold-400" />
                </button>
              ))}
            </div>
            <button onClick={() => nav({ page: "downloads" })} className="block w-full border-t border-white/8 px-6 py-4 text-center text-sm font-bold text-teal-400 transition-colors hover:bg-teal-500/10 hover:text-teal-300">
              مشاهده‌ی همه‌ی {fa(45)}+ فایل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── کپیتال — بخش ویژه‌ی صفحه اصلی ───────── */
const capitalSteps = [
  { icon: "coins", title: "تعریف ارز پایه", desc: "یک ارز را به‌عنوان پایه معرفی می‌کنید؛ مبنای قیمت‌گذاری همه‌ی ارزهای دیگر." },
  { icon: "globe", title: "نرخ‌دهی روزانه", desc: "هر روز نرخ هر ارز نسبت به ارز پایه وارد برنامه می‌شود و همه‌چیز به نرخ روز می‌ماند." },
  { icon: "spark", title: "نرخ لحظه‌ای هنگام ثبت", desc: "اگر وسط کار نرخ عوض شد، همان‌جا داخل فرم، نرخ لحظه‌ای را ثبت می‌کنید." },
  { icon: "users", title: "واحد ارز مشتری و تبدیل مانده", desc: "برای هر مشتری واحد ارز تعیین می‌شود؛ مانده‌ی صورتحساب به هر ارزِ برنامه تبدیل می‌شود." },
];

function CapitalSpotlight({ nav }: { nav: NavFn }) {
  const capital = products.find((p) => p.id === "capital") ?? products[0];
  return (
    <section id="capital" className="grid-lines grid-lines-fade noise relative scroll-mt-24 overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-[480px] w-[480px] rounded-full opacity-25 blur-[130px]" style={{ background: capital.accent }} aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-teal-600/15 blur-[120px]" aria-hidden />

      <div className="relative border-y border-white/10 bg-ink-900/40 py-4 backdrop-blur-sm">
        <div className="marquee-track">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 items-center" aria-hidden={rep === 1}>
              {currencies.map((c) => (
                <span key={c.code + rep} className="mx-6 flex items-center gap-3 whitespace-nowrap">
                  <Flag code={c.code} className="h-4 w-6 shadow" />
                  <span className="text-sm font-medium text-ink-100">{c.name}</span>
                  <span className="text-xs text-mist-300">{c.country}</span>
                  <span className="font-latin text-[10px] tracking-[0.2em] text-teal-400" dir="ltr">{c.code}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <p className="reveal eyebrow text-gold-400">CAPITAL · MULTI-CURRENCY ACCOUNTING</p>
            <h2 className="mt-4">
              <span className="line-mask"><span className="font-display block text-5xl leading-[1.12] text-white sm:text-7xl">کپیتال؛</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-5xl leading-[1.12] sm:text-7xl" style={{ color: capital.accent }}>حسابِ چند ارز، به نرخِ روز</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-2xl text-lg leading-9 text-mist-300" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              در بازرگانیِ امروز، یک فاکتور ممکن است با دلار بسته شود، با درهم پرداخت شود و در دفتر با تومان ثبت شود.
              کپیتال دقیقاً برای همین واقعیت ساخته شده است — حسابداری‌ای که چند ارز را هم‌زمان، دقیق و به نرخ روز نگه می‌دارد.
            </p>

            <div className="mt-10 space-y-4">
              {capitalSteps.map((s, i) => (
                <div
                  key={s.title}
                  className="reveal group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-gold-500/50 hover:bg-white/[0.07]"
                  style={{ "--rv-delay": `${260 + i * 90}ms` } as React.CSSProperties}
                >
                  <span className="font-latin text-3xl font-bold text-white/20 transition-colors duration-300 group-hover:text-gold-400" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-mist-300">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-10 flex flex-wrap gap-4" style={{ "--rv-delay": "650ms" } as React.CSSProperties}>
              <button onClick={() => nav({ page: "downloads" })} className="btn-primary group" style={{ background: capital.accent }}>
                <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                دانلود کپیتال
              </button>
              <button onClick={() => nav({ page: "product", id: "capital" })} className="btn-ghost-light">صفحه‌ی محصول</button>
            </div>
          </div>

          <div className="reveal rv-left relative lg:sticky lg:top-28" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
            <div className="pointer-events-none absolute -inset-10 rounded-full opacity-30 blur-[110px]" style={{ background: capital.accent }} aria-hidden />
            <div className="float-soft relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_45px_90px_-35px_rgba(0,0,0,0.85)]">
              <img src={capital.image} alt="کپیتال — نرم‌افزار حسابداری چندارزی | Capital multi-currency accounting software" loading="lazy" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(200deg, transparent 55%, rgba(12,31,25,0.45) 100%)" }} aria-hidden />
            </div>
            <div className="float-soft-late absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/90 px-5 py-3.5 shadow-2xl backdrop-blur">
              <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-gold-500" />
              <div>
                <p className="text-xs text-mist-300">همه‌ی ارزها به نرخ</p>
                <p className="font-display text-lg text-gold-400">ارز پایه — هر روز</p>
              </div>
            </div>
            <div className="float-soft absolute -top-5 left-6 rounded-2xl border border-white/10 bg-ink-900/90 px-5 py-3 shadow-2xl backdrop-blur" style={{ animationDelay: "1.4s" }}>
              <p className="font-latin text-[10px] tracking-[0.25em] text-teal-400" dir="ltr">BASE CURRENCY</p>
              <p className="mt-0.5 font-display text-lg text-white">تومان / دلار / افغانی…</p>
            </div>

            <div className="reveal mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6" style={{ "--rv-delay": "450ms" } as React.CSSProperties}>
              <p className="font-display text-xl text-white">پرطرفدار در بازار افغانستان</p>
              <p className="mt-2 text-sm leading-7 text-mist-300">
                از کابل و هرات تا قندهار و مزار شریف، بازرگانان افغان حساب‌هایشان را با کپیتال نگه می‌دارند —
                جایی که معاملات میان افغانی، دلار، درهم و تومان در جریان است.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["کابل", "هرات", "قندهار", "مزار شریف"].map((c) => (
                  <span key={c} className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3.5 py-1.5 text-xs font-medium text-gold-400">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10" dir="ltr">
          <div className="mx-auto max-w-4xl">
            <p className="font-latin text-xs tracking-[0.35em] text-teal-400">EN · CAPITAL ACCOUNTING SOFTWARE</p>
            <h3 className="mt-3 font-latin text-3xl font-bold text-white sm:text-4xl">Capital — Multi-Currency Accounting Software</h3>
            <p className="mt-4 leading-8 text-mist-300">
              Capital is a Windows-based, multi-currency accounting software developed by <b className="text-gold-400">Sarmaye Software Group (TSOFT)</b>.
              Define a <b className="text-white">base currency</b>, enter daily exchange rates for every other currency, and keep your entire
              ledger — invoices, receipts, payments and reports — always at the day's rate. If a rate changes while you are entering a
              document, you can set the instant rate right there. Each customer can have their own currency unit, and any account balance
              can be converted to every currency defined in the system. Capital is widely used by trading businesses across
              <b className="text-white"> Iran and Afghanistan</b> — Kabul, Herat, Kandahar and Mazar-i-Sharif — where daily commerce runs on
              afghani, dollar, dirham and toman.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Base currency & daily rate board",
                "Instant rate editing while recording",
                "Per-customer currency unit",
                "Balance conversion to any currency",
                "Multi-currency inventory & reports",
                "Standalone & network editions",
              ].map((f) => (
                <p key={f} className="flex items-center gap-2.5 text-sm text-mist-300">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-teal-400" />
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div ref={ref}>
      <ProductsShowcase nav={nav} />
      <CapitalSpotlight nav={nav} />
      <WhyTisaft />
      <TrustBand />
      <FeaturesScan nav={nav} />
      <SupportBand />
      <Voices />
      <WithLove nav={nav} />
      <DownloadCta nav={nav} />
    </div>
  );
}

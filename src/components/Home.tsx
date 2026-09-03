import { useEffect, useRef, useState } from "react";
import { products } from "../data";
import { fa, prefersReducedMotion, useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";
import SupportBand from "./SupportBand";

/* ───────── ویترین محصولات با اسکرول‌اسپای ───────── */
function ProductsShowcase({ nav }: { nav: NavFn }) {
  const [active, setActive] = useState(products[0].id);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("panel-", ""))),
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
    <section id="products" className="relative scroll-mt-24 bg-paper py-32 sm:py-44">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="reveal eyebrow">TSOFT · CAPITAL</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display block text-5xl leading-tight text-ink-900 sm:text-6xl">دو محصول،</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display block text-5xl leading-tight text-teal-600 sm:text-6xl">یک خانواده</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-md leading-9 text-mist-500">
              هر کسب‌وکار نرم‌افزار خودش را می‌خواهد؛ تیسافت برای فروشگاه و کپیتال برای بازرگانی چندارزی. اسکرول کنید تا هر دو را بشناسید.
            </p>
            <div className="reveal mt-10 space-y-2" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              {products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(p.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-right transition-all duration-300 ${
                    active === p.id ? "border-transparent bg-ink-950 text-white shadow-[0_18px_40px_-20px_rgba(12,31,25,0.5)]" : "border-ink-100 bg-white text-ink-800 hover:border-teal-500/50"
                  }`}
                >
                  <span className={`font-latin text-sm font-bold ${active === p.id ? "text-gold-400" : "text-mist-300"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-2xl transition-colors ${active === p.id ? "text-white" : "text-mist-500/70"}`}>{p.name}</span>
                  <span className={`mr-auto font-latin text-[10px] tracking-[0.25em] ${active === p.id ? "text-teal-400" : "text-mist-300"}`}>{p.latin}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {products.map((p) => (
              <div key={p.id} id={`panel-${p.id}`} ref={(el) => { panels.current[p.id] = el; }} className="reveal card-pro relative overflow-hidden p-8 sm:p-10">
                <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: p.accent }} aria-hidden />
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-ink-950 shadow-md transition-transform duration-300 hover:rotate-6" style={{ background: p.accent }}>
                    <Icon name={p.features[0]?.icon ?? "box"} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-display text-3xl text-ink-900">{p.name}</p>
                    <p className="font-latin text-[11px] tracking-[0.3em] text-mist-300">{p.latin} · {p.en}</p>
                  </div>
                </div>
                <p className="mt-5 font-display text-xl" style={{ color: p.accent }}>{p.tagline}</p>
                <p className="mt-4 max-w-2xl leading-9 text-mist-500">{p.short}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.features.slice(0, 4).map((f) => (
                    <span key={f.title} className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-ink-50/60 px-3.5 py-1.5 text-xs font-medium text-ink-800 transition-colors hover:border-teal-500/50 hover:text-teal-600">
                      <Icon name={f.icon} className="h-3.5 w-3.5" />
                      {f.title}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button onClick={() => nav({ page: "product", id: p.id })} className="btn-dark group !bg-ink-950">
                    آشنایی با {p.name}
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                  <button onClick={() => nav({ page: "downloads" })} className="link-underline text-sm font-semibold text-teal-600">دانلود نسخه آزمایشی</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── اعتمادسازی ───────── */
function StatItem({ v, suffix, plain, label }: { v: number; suffix?: string; plain?: boolean; label: string }) {
  const { ref, text } = useCountUp(v, 1600, plain);
  return (
    <div className="text-center">
      <p className="font-display text-5xl leading-none text-teal-600 sm:text-6xl">
        <span ref={ref}>{text}</span>
        {suffix && <span className="text-3xl text-gold-500">{suffix}</span>}
      </p>
      <p className="mt-3 text-sm text-mist-500">{label}</p>
    </div>
  );
}

function TrustBand() {
  const stats = [
    { v: 20, suffix: "+", label: "سال تجربه" },
    { v: 1385, plain: true, label: "سالِ شروع — و هنوز در مسیر" },
    { v: 35, label: "استان و شهر" },
    { v: 2, label: "محصول تخصصی" },
  ];
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
        <div className="reveal mt-16 grid gap-5 sm:grid-cols-3" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
          {[
            { icon: "shield", title: "داده‌ها روی سیستم خودتان", desc: "نرم‌افزار روی کامپیوتر شما نصب است؛ نه سرور ما، نه جای دیگر." },
            { icon: "cloud", title: "پشتیبان‌گیری مطمئن", desc: "بکاپ روزانه‌ی خودکار، در فضای ابری یا ایمیل شما." },
            { icon: "headset", title: "مستقیم با سازنده", desc: "بدون واسطه و نماینده؛ کسی که ساخته، جواب می‌دهد." },
          ].map((a) => (
            <div key={a.title} className="card-pro p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/12 text-teal-600">
                <Icon name={a.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-display text-xl text-ink-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-8 text-mist-500">{a.desc}</p>
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
              <span className="absolute -top-5 right-8 flex h-10 w-10 items-center justify-center rounded-full font-display text-4xl text-white shadow-md" style={{ background: q.accent }} aria-hidden>”</span>
              <blockquote className="text-sm leading-8 text-mist-500">{q.text}</blockquote>
              <figcaption className="mt-5 border-t border-ink-50 pt-4">
                <p className="font-display text-lg text-ink-900">{q.author}</p>
                <p className="text-xs text-mist-500">{q.role}</p>
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
function CtaBand({ nav }: { nav: NavFn }) {
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
            نسخه‌ی آزمایشی هر دو محصول رایگان است؛ نصب کنید، با اطلاعات واقعی فروشگاه یا بازرگانی‌تان کار کنید و بعد تصمیم بگیرید. هنگام خرید هم <b className="text-white">یک سال پشتیبانی کامل رایگان</b> همراه‌تان هست.
          </p>
          <ul className="reveal mt-7 flex flex-wrap gap-x-7 gap-y-3" style={{ "--rv-delay": "230ms" } as React.CSSProperties}>
            {["فعال‌سازی فوری با پین‌کد", "ویندوز ۱۰ و ۱۱", "تک‌کاربره و تحت شبکه"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-mist-300">
                <Icon name="check" className="h-4 w-4 text-teal-400" />
                {t}
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

        <div className="reveal rv-left" style={{ "--rv-delay": "250ms" } as React.CSSProperties}>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-900/80 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className="font-display text-xl text-white">مرکز دانلود</p>
              <span className="font-latin text-[10px] font-bold tracking-[0.2em] text-teal-400" dir="ltr">dl.tsoft20.ir</span>
            </div>
            <div className="divide-y divide-white/10">
              {[
                { name: "TSOFT Setup", note: "نصب کامل تیسافت", format: "ZIP" },
                { name: "Capital Installer", note: "نصب کامل کپیتال", format: "EXE" },
                { name: "SQL Server 2008 R2 Express", note: "پیش‌نیاز پایگاه داده", format: "EXE" },
              ].map((f) => (
                <button key={f.name} onClick={() => nav({ page: "downloads" })} className="group flex w-full items-center gap-4 px-6 py-4 text-right transition-colors hover:bg-white/[0.05]">
                  <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/12 font-latin text-[10px] font-bold tracking-widest text-teal-400">{f.format}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-white" dir="ltr" style={{ textAlign: "right" }}>{f.name}</span>
                    <span className="block text-[11px] text-mist-300">{f.note}</span>
                  </span>
                  <Icon name="download" className="h-4 w-4 shrink-0 text-mist-300 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-gold-400" />
                </button>
              ))}
            </div>
            <button onClick={() => nav({ page: "downloads" })} className="block w-full border-t border-white/10 px-6 py-4 text-center text-sm font-bold text-teal-400 transition-colors hover:bg-teal-500/10 hover:text-teal-300">
              مشاهده‌ی همه‌ی {fa(45)}+ فایل
            </button>
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
      <TrustBand />
      <SupportBand />
      <Voices />
      <WithLove nav={nav} />
      <CtaBand nav={nav} />
    </div>
  );
}

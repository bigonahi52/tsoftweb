import { useEffect, useRef, useState } from "react";
import { currencies, products } from "../data";
import { PHONE_FA, PHONE_TEL, prefersReducedMotion, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Flag, Icon } from "./Icons";
import SupportBand from "./SupportBand";

/* ویترین محصولات — ستون چسبان + اسکرول‌اسپای */
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
    <section id="products" className="relative scroll-mt-24 bg-paper py-32 sm:py-44">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">TSOFT FAMILY</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display text-5xl leading-tight text-ink-900 sm:text-6xl">دو محصول،</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-5xl leading-tight text-teal-600 sm:text-6xl">یک خانواده</span>
              </span>
            </h2>
            <p className="reveal mt-6 max-w-md leading-9 text-mist-500">
              یکی برای صندوق فروشگاه، یکی برای بازرگانی چندارزی. اسکرول کنید تا هر دو را از نزدیک ببینید.
            </p>
            <div className="reveal mt-10 space-y-2" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              {products.map((p, i) => (
                <button key={p.id} onClick={() => go(p.id)} className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-right transition-all duration-300 ${active === p.id ? "border-transparent bg-ink-950 text-white shadow-[0_18px_40px_-20px_rgba(10,27,33,0.5)]" : "border-ink-100 bg-white text-ink-800 hover:border-teal-500/50"}`}>
                  <span className={`font-latin text-sm font-bold ${active === p.id ? "text-gold-400" : "text-mist-300"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-2xl transition-colors ${active === p.id ? "text-white" : "text-mist-500/70"}`}>{p.name}</span>
                  <span className={`mr-auto font-latin text-[10px] tracking-[0.25em] ${active === p.id ? "text-teal-400" : "text-mist-300"}`}>{p.latin}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {products.map((p) => (
              <div key={p.id} id={`panel-${p.id}`} ref={(el) => { panels.current[p.id] = el; }} className="reveal card-lift relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 sm:p-10">
                <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: p.accent }} aria-hidden />
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-[#ffffff] transition-transform duration-300 hover:rotate-6" style={{ background: p.accent }}>
                    <Icon name={p.features[0]?.icon ?? "box"} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-display text-3xl text-ink-900">{p.name}</p>
                    <p className="font-latin text-[11px] tracking-[0.3em] text-mist-300">{p.latin} · {p.en}</p>
                  </div>
                  <span className="mr-auto hidden rounded-full bg-ink-50 px-4 py-2 text-xs font-bold text-mist-500 sm:block">{p.tagline}</span>
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
                  <button onClick={() => nav({ page: "product", id: p.id })} className="btn-shine group flex items-center gap-2 rounded-xl bg-ink-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-600">
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

/* چرا تیسافت */
function WhyTisaft() {
  const reasons = [
    { icon: "shield", title: "داده‌ی شما، امانت ماست", desc: "پشتیبان‌گیری خودکار، بکاپ ابری و ایمیلی — خیال‌تان از بابت اطلاعات راحت باشد." },
    { icon: "headset", title: "پشتیبانی واقعی", desc: "تلفن را خود توسعه‌دهنده جواب می‌دهد؛ با یک سال پشتیبانی رایگان همراه هر خرید." },
    { icon: "update", title: "همیشه به‌روز", desc: "آپدیت‌ها رایگان‌اند و نرخ‌ها و قوانین مالیاتی در آن‌ها لحاظ می‌شود." },
    { icon: "key", title: "بدون قفل سخت‌افزاری", desc: "فعال‌سازی همه محصولات با پین‌کد نرم‌افزاری است — نه دانگل، نه دردسر." },
  ];
  return (
    <section className="bg-paper py-32 sm:py-44">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">WHY TSOFT</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display text-5xl leading-tight text-ink-900 sm:text-6xl">چرا تیسافت؟</span></span>
            </h2>
            <p className="reveal mt-6 max-w-md leading-9 text-mist-500">
              چون نرم‌افزار حسابداری فقط یک ابزار نیست؛ شریکِ هر روزِ کسب‌وکار شماست. و شریک، باید قابل اعتماد باشد.
            </p>
            <div className="reveal mt-8 rounded-2xl bg-ink-50/70 p-5">
              <p className="font-latin text-[10px] tracking-[0.25em] text-teal-600">SUPPORT LINE</p>
              <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number mt-1 inline-block text-2xl text-ink-900 transition-colors hover:text-teal-600">{PHONE_FA}</a>
              <p className="mt-1 text-xs text-mist-500">۹ تا ۱۴ و ۱۷ تا ۲۲ — تعطیلات: اضطراری</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <div key={r.title} className="reveal card-lift rounded-3xl border border-ink-100 bg-white p-8" style={{ "--rv-delay": `${(i % 2) * 110}ms` } as React.CSSProperties}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-teal-400 transition-transform duration-300 hover:-rotate-6 hover:scale-110">
                  <Icon name={r.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-ink-900">{r.title}</h3>
                <p className="mt-2.5 text-sm leading-8 text-mist-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* نظرات مشتریان */
function Voices() {
  const quotes = products.filter((p) => p.quote).map((p) => ({ ...p.quote!, product: p.name, accent: p.accent }));
  return (
    <section className="bg-paper py-32 sm:py-44">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">CUSTOMER VOICES</p>
        <h2 className="reveal mt-3 font-display text-4xl text-ink-900 sm:text-5xl">حرفِ مشتری‌های ما</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <figure key={q.product} className="reveal card-lift relative rounded-3xl border border-ink-100 bg-white p-8 pt-11" style={{ "--rv-delay": `${i * 110}ms` } as React.CSSProperties}>
              <span className="absolute -top-5 right-8 flex h-10 w-10 items-center justify-center rounded-full font-display text-4xl text-[#ffffff]" style={{ background: q.accent }} aria-hidden>”</span>
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

/* با عشق */
function WithLove({ nav }: { nav: NavFn }) {
  return (
    <section className="relative overflow-hidden border-t border-ink-100 bg-white py-32 sm:py-40">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <span className="heartbeat reveal mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-100 text-gold-600" aria-hidden>
          <Icon name="heart" className="h-10 w-10" />
        </span>
        <h2 className="reveal mt-7">
          <span className="line-mask"><span className="font-display text-5xl leading-tight text-ink-900 sm:text-6xl">اینجا همه‌چیز با عشق ساخته می‌شه</span></span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-2xl leading-9 text-mist-500">
          تک‌تک محصولات تیسافت با علاقه‌ی واقعی به کارِ شما طراحی شده‌اند — و ما عاشقِ مشتری‌هایمان هستیم. رضایت شما، بزرگ‌ترین تبلیغ ماست.
        </p>
        <div className="reveal mt-12 grid gap-5 sm:grid-cols-2">
          <div className="card-lift rounded-3xl border border-ink-100 bg-paper p-8 text-right">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600"><Icon name="megaphone" className="h-6 w-6" /></span>
            <h3 className="mt-4 font-display text-2xl text-ink-900">خوبی‌هامون رو به همه بگین</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">اگر از تیسافت راضی هستید، معرفی شما به یک همکار یا دوست، بزرگ‌ترین هدیه‌ای است که می‌توانید به ما بدهید.</p>
          </div>
          <div className="card-lift rounded-3xl border border-ink-100 bg-paper p-8 text-right">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-600"><Icon name="chat" className="h-6 w-6" /></span>
            <h3 className="mt-4 font-display text-2xl text-ink-900">اشکالات رو به خودمون بگین</h3>
            <p className="mt-2 text-sm leading-8 text-mist-500">نقد و پیشنهاد مستقیم، سریع‌ترین راهِ بهتر شدن ماست — مستقیم به دست سازنده می‌رسد و جدی گرفته می‌شود.</p>
          </div>
        </div>
        <button onClick={() => nav({ page: "contact" })} className="btn-shine reveal group mx-auto mt-10 flex items-center gap-2.5 rounded-xl bg-ink-950 px-8 py-4 font-bold text-white transition-colors hover:bg-teal-600">
          <Icon name="heart" className="h-5 w-5 text-gold-400" />
          ارسال نظر و پیشنهاد
        </button>
      </div>
    </section>
  );
}

/* فراخوان پایانی */
function CtaBand({ nav }: { nav: NavFn }) {
  return (
    <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-600/12 blur-[130px]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-400">START TODAY</p>
        <h2 className="mt-4">
          <span className="line-mask"><span className="font-display text-5xl leading-[1.2] text-white sm:text-6xl">حسابِ سال‌های بعد را</span></span>
          <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <span className="font-display text-5xl leading-[1.2] text-gold-400 sm:text-6xl">همین امروز باز کن</span>
          </span>
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl leading-9 text-mist-300">
          نسخه آزمایشی هر دو محصول رایگان است؛ نصب کنید، با داده‌های خودتان تست کنید و بعد تصمیم بگیرید.
          هنگام خرید هم <b className="text-white">یک سال پشتیبانی کامل رایگان</b> همراه‌تان هست.
        </p>
        <div className="reveal mt-9 flex flex-wrap justify-center gap-4">
          <button onClick={() => nav({ page: "downloads" })} className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-8 py-4 text-lg font-bold text-ink-950 transition-colors hover:bg-teal-400">
            <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            دانلود رایگان
          </button>
          <button onClick={() => nav({ page: "contact" })} className="rounded-xl border border-ink-600 px-8 py-4 text-lg font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400">مشاوره با کارشناس</button>
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
      <WhyTisaft />
      <SupportBand />
      <Voices />
      <WithLove nav={nav} />
      <CtaBand nav={nav} />
    </div>
  );
}

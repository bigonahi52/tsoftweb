import { currencies, getProduct, products } from "../data";
import { useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Flag, Icon } from "./Icons";
import SupportBand from "./SupportBand";

/* ویترین ارزهای کپیتال */
function CurrencyShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-ink-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">MULTI-CURRENCY BOARD</p>
            <h2 className="mt-3">
              <span className="line-mask"><span className="font-display text-4xl leading-tight text-ink-900 sm:text-5xl">از افغانی تا یورو،</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-4xl leading-tight text-teal-600 sm:text-5xl">همه به نرخ روز</span>
              </span>
            </h2>
          </div>
          <p className="reveal max-w-sm leading-8 text-mist-500">
            یک ارز پایه معرفی می‌کنید؛ بقیه‌ی ارزها هر روز با نرخِ همان ارز پایه قیمت می‌گیرند و همه‌ی حساب‌ها به نرخ روز می‌مانند.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {currencies.map((c, i) => (
            <div key={c.code} className="reveal card-lift group flex flex-col items-center rounded-2xl border border-ink-100 bg-paper px-3 py-7 text-center hover:border-teal-500/50" style={{ "--rv-delay": `${(i % 7) * 70}ms` } as React.CSSProperties}>
              <span className="transition-transform duration-300 group-hover:scale-125">
                <Flag code={c.code} className="h-12 w-[72px] shadow-md" />
              </span>
              <span className="mt-3 font-display text-lg leading-6 text-ink-900">{c.name}</span>
              <span className="mt-1 text-[11px] text-mist-500">{c.country}</span>
              <span className="mt-2 rounded-full bg-ink-100/70 px-2.5 py-0.5 font-latin text-[9px] tracking-[0.2em] text-mist-500">{c.code}</span>
            </div>
          ))}
        </div>

        <div className="reveal mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-ink-950">
          <div className="flex items-center justify-between border-b border-ink-700/70 px-5 py-3">
            <p className="text-xs font-bold text-[#d9e9ec]">تابلوی نرخ روز — همه ارزها به نرخ ارز پایه</p>
            <span className="flex items-center gap-1.5 text-[10px] text-teal-400">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" />
              به‌روزرسانی روزانه
            </span>
          </div>
          <div className="marquee-track py-3.5">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex shrink-0 items-center" aria-hidden={rep === 1}>
                {currencies.concat(currencies).map((c, i) => (
                  <span key={c.code + i} className="mx-5 flex items-center gap-2 whitespace-nowrap">
                    <Flag code={c.code} className="h-4 w-6" />
                    <span className="text-xs text-[#d9e9ec]">{c.name} {c.country}</span>
                    <span className="font-latin text-[10px] text-mist-300" dir="ltr">{c.code}</span>
                    <span className="mr-4 h-1 w-1 rounded-full bg-gold-500/70" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="reveal mt-6 text-center text-sm text-mist-500">
          و ده‌ها ارز دیگر — از روپیه تا یوآن. اگر ارزی هست که کسب‌وکار شما لازم دارد و در فهرست نیست، <b className="text-teal-600">همان روز اضافه می‌کنیم.</b>
        </p>
      </div>
    </section>
  );
}

/* اصول مشترک همه محصولات */
const commonPrinciples = [
  { icon: "network", title: "تک‌کاربره و تحت شبکه", desc: "هر دو نسخه را داریم؛ چند کاربر هم‌زمان، بدون تداخل." },
  { icon: "key", title: "فعال‌سازی با پین‌کد", desc: "قفل نرم‌افزاری است — بدون قفل سخت‌افزاری و بدون نگرانی دانگل." },
  { icon: "cloud", title: "بکاپ ابری و ایمیلی", desc: "پشتیبان اطلاعات‌تان در فضای ابری ذخیره یا با ایمیل برایتان ارسال می‌شود." },
];

export default function ProductPage({ id, nav }: { id: string; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const p = getProduct(id) ?? products[0];
  const others = products.filter((x) => x.id !== p.id);

  return (
    <div ref={ref} className="bg-paper">
      {/* سرصفحه محصول */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-24 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full opacity-20 blur-[130px] transition-colors duration-700" style={{ background: p.accent }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <button onClick={() => nav({ page: "home" })} className="reveal group mb-8 flex items-center gap-2 text-sm text-mist-300 transition-colors hover:text-teal-400">
            <Icon name="arrow" className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
            همه محصولات
          </button>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="reveal flex items-center gap-5">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-[#ffffff] shadow-2xl" style={{ background: p.accent }}>
                  <Icon name={p.features[0]?.icon ?? "box"} className="h-10 w-10" />
                </span>
                <div>
                  <p className="font-latin text-[11px] tracking-[0.3em] text-teal-400">{p.latin} · {p.en}</p>
                  <h1 className="mt-1 font-display text-6xl leading-none text-white sm:text-7xl">{p.name}</h1>
                </div>
              </div>
              <p className="reveal mt-5 font-display text-2xl text-gold-400" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>{p.tagline}</p>
              <p className="reveal mt-6 max-w-xl leading-9 text-mist-300" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>{p.short}</p>
              <div className="reveal mt-8 flex flex-wrap gap-4" style={{ "--rv-delay": "280ms" } as React.CSSProperties}>
                <button onClick={() => nav({ page: "downloads" })} className="btn-shine group flex items-center gap-2.5 rounded-xl bg-teal-500 px-7 py-3.5 font-bold text-ink-950 transition-colors hover:bg-teal-400">
                  <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                  دانلود {p.name}
                </button>
                <button onClick={() => nav({ page: "contact" })} className="rounded-xl border border-ink-600 px-7 py-3.5 font-semibold text-ink-100 transition-colors hover:border-gold-500 hover:text-gold-400">درخواست دمو</button>
              </div>
            </div>

            <div className="reveal rv-scale relative hidden lg:block" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
              <div className="float-soft relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-ink-700/60 bg-ink-900/60">
                <div className="pointer-events-none absolute -inset-10 rounded-full opacity-25 blur-[90px]" style={{ background: p.accent }} aria-hidden />
                <span className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] text-[#ffffff] shadow-2xl" style={{ background: p.accent }}>
                  <Icon name={p.features[0]?.icon ?? "box"} className="h-16 w-16" />
                </span>
                <span className="absolute bottom-6 font-latin text-sm font-bold tracking-[0.4em] text-white/60" dir="ltr">{p.latin}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* اصول مشترک */}
      <section className="border-b border-ink-100 bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {commonPrinciples.map((c, i) => (
            <div key={c.title} className="reveal flex items-start gap-4 rounded-2xl border border-ink-100 bg-paper p-5" style={{ "--rv-delay": `${i * 90}ms` } as React.CSSProperties}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-teal-400"><Icon name={c.icon} className="h-5 w-5" /></span>
              <div>
                <p className="font-display text-lg text-ink-900">{c.title}</p>
                <p className="mt-0.5 text-xs leading-6 text-mist-500">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {p.id === "capital" && <CurrencyShowcase />}

      {/* معرفی */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">ABOUT</p>
              <h2 className="reveal mt-3">
                <span className="line-mask"><span className="font-display text-5xl leading-tight text-ink-900">با {p.name} آشنا شوید</span></span>
              </h2>
              <div className="reveal mt-7 space-y-5">
                {p.overview.map((o) => (
                  <p key={o.slice(0, 24)} className="leading-9 text-mist-500">{o}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {p.features.map((f, i) => (
                <div key={f.title} className="reveal card-lift group rounded-3xl border border-ink-100 bg-white p-7" style={{ "--rv-delay": `${(i % 2) * 100}ms` } as React.CSSProperties}>
                  <span className="flex items-center justify-center rounded-2xl bg-ink-950 text-teal-400 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ height: 52, width: 52 }}>
                    <Icon name={f.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-mist-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ماژول‌ها */}
      {p.modules && p.modules.length > 0 && (
        <section className="border-t border-ink-100 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="reveal font-display text-4xl text-ink-900 sm:text-5xl">ماژول‌ها و نسخه‌ها</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {p.modules.map((m, i) => (
                <div key={m.name} className={`reveal card-lift relative overflow-hidden rounded-3xl border-2 p-8 sm:p-10 ${m.featured ? "border-gold-500 bg-ink-950" : "border-ink-100 bg-paper"}`} style={{ "--rv-delay": `${i * 120}ms` } as React.CSSProperties}>
                  {m.badge && <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-ink-950">{m.badge}</span>}
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${m.featured ? "bg-gold-500 text-ink-950" : "bg-ink-950 text-teal-400"}`}>
                      <Icon name={m.featured ? "spark" : "box"} className="h-6 w-6" />
                    </span>
                    <h3 className={`font-display text-3xl ${m.featured ? "text-white" : "text-ink-900"}`}>{m.name}</h3>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {m.items.map((it) => (
                      <li key={it} className={`flex items-start gap-2.5 text-sm leading-7 ${m.featured ? "text-mist-300" : "text-mist-500"}`}>
                        <Icon name="check" className={`mt-1.5 h-4 w-4 shrink-0 ${m.featured ? "text-gold-400" : "text-teal-600"}`} />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => nav({ page: "contact" })} className={`btn-shine mt-8 w-full rounded-xl py-3.5 font-bold transition-transform hover:scale-[1.01] ${m.featured ? "bg-gold-500 text-[#0f262e]" : "bg-ink-900 text-[#ffffff]"}`}>
                    استعلام قیمت {m.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* مشخصات فنی */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="reveal font-display text-4xl text-ink-900 sm:text-5xl">مشخصات فنی</h2>
          <div className="reveal mt-10 overflow-hidden rounded-3xl border border-ink-100 bg-white">
            {p.specs.map(([k, v], i) => (
              <div key={k} className={`flex flex-col gap-1 px-7 sm:flex-row sm:items-center sm:justify-between ${i % 2 === 0 ? "bg-paper/70" : ""}`} style={{ paddingTop: 18, paddingBottom: 18 }}>
                <dt className="text-sm font-bold text-ink-900">{k}</dt>
                <dd className="text-left text-sm font-semibold text-mist-500">{v}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* نقل‌قول مشتری */}
      {p.quote && (
        <section className="border-t border-ink-100 bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span className="reveal mx-auto flex h-12 w-12 items-center justify-center rounded-full font-display text-4xl text-[#ffffff]" style={{ background: p.accent }} aria-hidden>”</span>
            <blockquote className="reveal mt-6 font-display text-3xl leading-[1.7] text-ink-900 sm:text-4xl" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>{p.quote.text}</blockquote>
            <p className="reveal mt-6 text-sm text-mist-500" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              <b className="text-ink-900">{p.quote.author}</b> — {p.quote.role}
            </p>
          </div>
        </section>
      )}

      <SupportBand compact />

      {/* بقیه خانواده */}
      {others.length > 0 && (
        <section className="border-t border-ink-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="reveal font-display text-3xl text-ink-900">محصول دیگر خانواده</h2>
              <button onClick={() => nav({ page: "home" })} className="link-underline text-sm font-semibold text-teal-600">همه محصولات</button>
            </div>
            <div className="mt-8 grid max-w-xl gap-4">
              {others.map((o, i) => (
                <button key={o.id} onClick={() => nav({ page: "product", id: o.id })} className="reveal card-lift group flex items-center gap-6 rounded-3xl border border-ink-100 bg-paper p-6 text-right" style={{ "--rv-delay": `${i * 80}ms` } as React.CSSProperties}>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#ffffff] transition-transform duration-300 group-hover:rotate-6" style={{ background: o.accent }}>
                    <Icon name={o.features[0]?.icon ?? "box"} className="h-7 w-7" />
                  </span>
                  <span>
                    <span className="block font-display text-xl text-ink-900 group-hover:text-teal-600">{o.name} <span className="font-latin text-[10px] tracking-[0.25em] text-mist-300">{o.latin}</span></span>
                    <span className="mt-1 block text-xs leading-6 text-mist-500">{o.tagline}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

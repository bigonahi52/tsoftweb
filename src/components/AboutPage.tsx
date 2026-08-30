import { fa, PHONE_TEL, useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

function BigStat({ value, suffix, label, plain }: { value: number; suffix?: string; label: string; plain?: boolean }) {
  const { ref, text } = useCountUp(value, 1400, plain);
  return (
    <div className="reveal card-lift rounded-3xl border border-ink-100 bg-white p-8 text-center">
      <p className="font-display text-6xl leading-none text-ink-900">
        <span ref={ref}>{text}</span>
        {suffix && <span className="text-4xl text-gold-500">{suffix}</span>}
      </p>
      <p className="mt-3 text-sm text-mist-500">{label}</p>
    </div>
  );
}

const values = [
  { icon: "scale", title: "دقت، قبل از سرعت", desc: "حساب باید درست باشد؛ بعد سریع. هر عددی که نرم‌افزار ما نشان می‌دهد، قابل اتکاست." },
  { icon: "headset", title: "پشتیبانی یعنی تعهد", desc: "وقتی می‌گوییم یک سال پشتیبانی رایگان، یعنی واقعاً پاسخ‌گوییم — تلفنی، ریموت، هر جا که باشید." },
  { icon: "shield", title: "داده مشتری، امانت است", desc: "همیشه یک اصل ساده داشتیم: هیچ داده‌ای بدون اجازه مشتری جابه‌جا نمی‌شود. پشتیبان‌گیری و امنیت، خط قرمز ماست." },
  { icon: "spark", title: "ساده، یعنی قدرتمند", desc: "نرم‌افزاری که آموزش نخواهد، کامل است. رابط‌های ما طوری ساخته شده‌اند که خودشان راه را نشان می‌دهند." },
];

const teamRoles = [
  "معماری محصولات و هسته‌ی حسابداری",
  "توسعه‌ی نرم‌افزار و پایگاه داده",
  "رابط کاربری و تجربه‌ی کاربری",
  "نصب و استقرار در محل مشتری",
  "پشتیبانی فنی و به‌روزرسانی",
];

export default function AboutPage({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-20 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-teal-600/15 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">TSOFT · CAPITAL · SINCE 2006</p>
              <h1 className="mt-4">
                <span className="line-mask"><span className="font-display text-6xl leading-[1.1] text-white sm:text-7xl">قصه‌ی یک حسابِ</span></span>
                <span className="line-mask" style={{ "--rv-delay": "130ms" } as React.CSSProperties}>
                  <span className="font-display text-6xl leading-[1.1] text-gold-400 sm:text-7xl">روشن</span>
                </span>
              </h1>
              <p className="reveal mt-6 text-lg leading-10 text-mist-300">
                تیسافت سال ۱۳۸۵ با یک ایده ساده شروع شد: نرم‌افزار حسابداریِ فروشگاه نباید از خودِ فروشگاه پیچیده‌تر باشد.
                اولین نسخه را برای یک سوپرمارکت نوشتیم — و هنوز همان مشتری، مشتری ماست.
              </p>
              <p className="reveal leading-9 text-mist-300" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
                از همان روز اول، <b className="text-white">توسعه و پشتیبانی هرگز برون‌سپاری نشد</b>؛ هر نسخه، دست‌سازِ خودمان است.
                امروز دو محصول تخصصی داریم — از صندوق فروشگاه تا حسابداری چندارزی بازرگانی — اما قانون اول عوض نشده:
                <b className="text-white"> نرم‌افزار باید به زبان کسب‌وکارِ مشتری حرف بزند.</b>
              </p>
            </div>
            <div className="reveal rv-scale mx-auto flex flex-col items-center">
              <div className="seal-pulse flex h-52 w-52 flex-col items-center justify-center rounded-full border-4 border-dashed border-gold-500/80 bg-gold-500/10">
                <span className="font-display text-8xl leading-none text-gold-400">{fa(20)}</span>
                <span className="mt-1 text-sm tracking-[0.35em] text-gold-400">سالگی</span>
              </div>
              <span className="mt-4 font-latin text-[10px] tracking-[0.3em] text-mist-300">1385 — 1405</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <BigStat value={20} label="سال توسعه بی‌وقفه" />
            <BigStat value={2} label="محصول تخصصی" />
            <BigStat value={35} label="استان و شهر — ایران و افغانستان" />
            <BigStat value={1385} plain label="سالِ شروع — و هنوز در مسیر" />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">OUR VALUES</p>
          <h2 className="reveal mt-3 font-display text-4xl text-ink-900 sm:text-5xl">چیزی که عوض نمی‌شود</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <div key={v.title} className="reveal card-lift flex gap-5 rounded-3xl border border-ink-100 bg-paper p-8" style={{ "--rv-delay": `${(i % 2) * 100}ms` } as React.CSSProperties}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-teal-400 transition-transform duration-300 hover:-rotate-6 hover:scale-110">
                  <Icon name={v.icon} className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-8 text-mist-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="reveal font-display text-4xl text-ink-900 sm:text-5xl">با چه کسی طرف هستید؟</h2>
            <p className="reveal text-sm text-mist-500">سازنده‌ای که خودش پشتیبانی می‌کند</p>
          </div>

          {/* کارت پروفایل بنیان‌گذار */}
          <div className="reveal card-lift relative mt-10 overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 sm:p-10">
            <span className="absolute inset-y-0 right-0 w-1.5 bg-gold-500" aria-hidden />
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
              {/* مونوگرام */}
              <div className="shrink-0">
                <div className="relative">
                  <span className="flex h-24 w-24 items-center justify-center rounded-full bg-ink-950 font-display text-4xl text-gold-400 shadow-[0_16px_40px_-16px_rgba(12,31,25,0.55)] sm:h-28 sm:w-28">
                    م.ب
                  </span>
                  <span className="pulse-dot absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-[3px] border-white bg-teal-500" />
                </div>
              </div>
              {/* معرفی */}
              <div className="flex-1">
                <p className="font-latin text-[10px] tracking-[0.3em] text-teal-600">FOUNDER & LEAD DEVELOPER</p>
                <h3 className="mt-2 font-display text-4xl text-ink-900 sm:text-[42px]">مهندس مهدی بیگناهی</h3>
                <p className="mt-1.5 font-display text-lg text-gold-600">بنیان‌گذار و توسعه‌دهنده‌ی ارشد تیسافت و کپیتال</p>
                <p className="mt-5 leading-9 text-mist-500">
                  وقتی زنگ می‌زنید، <b className="text-ink-900">خودِ مهندس بیگناهی</b> تلفن را جواب می‌دهد — همان کسی که بیست سال است
                  تک‌تک خط‌های این نرم‌افزارها را نوشته. اینجا واسطه‌ای در کار نیست؛ نه در فروش، نه در پشتیبانی.
                  برای همین مشکلات همان‌جا، پشت تلفن حل می‌شوند.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {teamRoles.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink-100 bg-paper px-3.5 py-1.5 text-xs font-medium text-ink-800 transition-colors hover:border-teal-500/60 hover:text-teal-600">{tag}</span>
                  ))}
                </div>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="btn-primary group mt-7 inline-flex"
                >
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <Icon name="phone" className="phone-ring h-5 w-5" />
                  </span>
                  تماس مستقیم با مهندس بیگناهی
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="text-center sm:text-right">
            <p className="font-display text-3xl text-ink-900 sm:text-4xl">همکاری با تیسافت؟</p>
            <p className="mt-2 max-w-md leading-8 text-mist-500">برای سال‌های پیشِ رو، دنبال همکاران تازه در فروش و معرفی محصولات هستیم — از هر استانِ ایران و افغانستان.</p>
          </div>
          <button onClick={() => nav({ page: "contact" })} className="btn-shine shrink-0 rounded-xl bg-gold-500 px-8 py-4 font-bold text-[#0c1f19] transition-transform hover:scale-[1.02]">
            صحبت کنیم
          </button>
        </div>
      </section>
    </div>
  );
}

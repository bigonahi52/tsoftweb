import { useCountUp, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

function BigStat({ value, suffix, label, plain }: { value: number; suffix?: string; label: string; plain?: boolean }) {
  const { ref, text } = useCountUp(value, 1400, plain);
  return (
    <div className="reveal rounded-3xl border border-ink-100 bg-paper p-8 text-center">
      <p className="flex items-baseline justify-center gap-1">
        <span ref={ref} className="font-display text-5xl text-teal-600">{text}</span>
        {suffix && <span className="font-display text-2xl text-gold-500">{suffix}</span>}
      </p>
      <p className="mt-2 text-sm text-mist-500">{label}</p>
    </div>
  );
}

const values = [
  { icon: "shield", title: "داده مشتری، امانت است", desc: "همیشه یک اصل ساده داشتیم: هیچ داده‌ای بدون اجازه مشتری جابه‌جا نمی‌شود. پشتیبان‌گیری و امنیت، خط قرمز ماست." },
  { icon: "heart", title: "با عشق می‌سازیم", desc: "هر محصول، حاصل علاقه‌ی واقعی به کار شماست؛ و ما عاشق مشتری‌هایمان هستیم." },
  { icon: "headset", title: "خودمان پشتیبانی می‌کنیم", desc: "تلفن را خود توسعه‌دهنده جواب می‌دهد؛ واسطه‌ای در کار نیست." },
];

const teamRoles = [
  "معماری محصولات و هسته‌ی حسابداری",
  "توسعه‌ی نرم‌افزار و پایگاه داده",
  "رابط کاربری و تجربه‌ی کاربری",
  "نصب و استقرار در محل مشتری",
  "آموزش و تولید محتوا",
  "پشتیبانی فنی و به‌روزرسانی",
];

export default function AboutPage({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-20 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-teal-600/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">TSOFT · SINCE 2006</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-[1.1] text-white sm:text-7xl">قصه‌ی یک حسابِ</span></span>
            <span className="line-mask" style={{ "--rv-delay": "130ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-[1.1] text-gold-400 sm:text-7xl">روشن</span>
            </span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <p className="reveal text-lg leading-10 text-mist-300">
                تیسافت سال ۱۳۸۵ با یک ایده ساده شروع شد: نرم‌افزار حسابداریِ فروشگاه نباید از خودِ فروشگاه پیچیده‌تر باشد.
                اولین نسخه را برای یک سوپرمارکت نوشتیم — و هنوز همان مشتری، مشتری ماست.
              </p>
              <p className="reveal leading-9 text-mist-300" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
                از همان روز اول، <b className="text-white">توسعه و پشتیبانی هرگز برون‌سپاری نشد</b>؛ هر نسخه، دست‌سازِ خودمان است.
                امروز پنج محصول داریم، از صندوق فروشگاه تا حسابداری یکپارچه کارخانه؛ اما قانون اول عوض نشده:
                <b className="text-white"> نرم‌افزار باید به زبان کسب‌وکارِ مشتری حرف بزند، نه به زبان برنامه‌نویس.</b>
              </p>
            </div>
            <div className="reveal rv-scale flex items-center justify-center" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              <div className="seal-pulse flex h-44 w-44 flex-col items-center justify-center rounded-full border-2 border-dashed border-gold-500 bg-ink-900/80">
                <span className="font-display text-6xl leading-none text-gold-400">۲۰</span>
                <span className="mt-1 text-sm tracking-[0.3em] text-gold-400/80">سال</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <BigStat value={20} label="سال توسعه بی‌وقفه" />
          <BigStat value={5} label="محصول تخصصی" />
          <BigStat value={35} label="استان و شهر — ایران و افغانستان" />
          <BigStat value={1385} plain label="سالِ شروع — و هنوز در مسیر" />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="reveal">
            <span className="line-mask"><span className="font-display text-4xl text-ink-900 sm:text-5xl">باورهای ما</span></span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="reveal card-lift rounded-3xl border border-ink-100 bg-paper p-8" style={{ "--rv-delay": `${(i % 3) * 100}ms` } as React.CSSProperties}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-teal-400">
                  <Icon name={v.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-ink-900">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-8 text-mist-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="reveal font-display text-4xl text-ink-900 sm:text-5xl">تیمی که خودش می‌سازد، خودش پشتیبانی می‌کند</h2>
            <p className="reveal text-sm text-mist-500">تیم کوچک، تعهد بزرگ</p>
          </div>
          <div className="reveal mt-10 rounded-3xl border border-ink-100 bg-white p-8 sm:p-10">
            <p className="max-w-3xl leading-9 text-mist-500">
              در تیسافت، فاصله‌ی بین «کسی که نرم‌افزار را می‌سازد» و «کسی که پشتیبانی می‌کند» صفر است.
              وقتی زنگ می‌زنید، همان کسی که کد را نوشته، مشکل را حل می‌کند — واسطه‌ای در کار نیست.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {teamRoles.map((r) => (
                <span key={r} className="rounded-full border border-ink-100 bg-paper px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:border-teal-500/60 hover:text-teal-600">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-950 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="text-center sm:text-right">
            <p className="font-display text-3xl text-white sm:text-4xl">همکاری با تیسافت؟</p>
            <p className="mt-2 max-w-md leading-8 text-mist-300">
              برای سال‌های پیشِ رو، دنبال همکاران تازه در فروش و معرفی محصولات هستیم — از هر استانِ ایران.
            </p>
          </div>
          <button onClick={() => nav({ page: "contact" })} className="btn-shine shrink-0 rounded-xl bg-gold-500 px-8 py-4 font-bold text-[#0f262e] transition-transform hover:scale-[1.02]">
            گفت‌وگو با ما
          </button>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { fa, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const mesFeatures = [
  { icon: "monitor", title: "نمایش خودکار نقشه", desc: "به محض ثبت بارکد، تصویر نقشه‌ی اول و دوم برای اپراتور باز می‌شود — کاهش چشمگیر خطای برش." },
  { icon: "barcode", title: "ثبت بارکد متناسب با کاربر", desc: "هر ایستگاه فقط مراحل مرتبط با نوع کاربری خودش را می‌بیند؛ ورود به مرحله‌ی غیرمجاز ممکن نیست." },
  { icon: "report", title: "مانیتورینگ لحظه‌ای", desc: "گزارش سفارشات انجام‌نشده و وضعیت بارکدها در هر لحظه — برای اولویت‌بندی تحویل به‌موقع." },
  { icon: "bell", title: "هشدار صوتی هوشمند", desc: "بارکد ناخوانا، تکراری یا اشتباه؟ پخش صدا و پیام اخطار، قبل از ورود به خط تولید." },
  { icon: "clock", title: "لاگ دقیق عملیات", desc: "ثبت ثانیه‌به‌ثانیه‌ی فعالیت پرسنل: زمان، کاربر و نام کامپیوتر — در گزارش کارکرد قابل بررسی." },
  { icon: "search", title: "جست‌وجوی بارکد و سفارش", desc: "مشاهده‌ی فوری نقشه، مشخصات شیشه و وضعیت تولید هر بارکد — برای بازتولید و پیگیری." },
];

const workflow = [
  { icon: "receipt", title: "ثبت سفارش", desc: "مشتری، پروژه، ابعاد، نوع شیشه و خدمات" },
  { icon: "monitor", title: "الصاق نقشه", desc: "تصاویر نقشه اول و دوم و فایل PDF" },
  { icon: "barcode", title: "تولید بارکد", desc: "لیست بارکد برای سفارش یا قطعات" },
  { icon: "bell", title: "کنترل اعتبار", desc: "بررسی صحت بارکد با هشدار صوتی" },
  { icon: "truck", title: "بارگیری و تحویل", desc: "رهگیری با راننده و شماره همراه" },
];

const differentiators = [
  { icon: "ruler", title: "دقت در جزئیات", desc: "تنظیمات اعشار ابعاد و محیط تا ریزترین واحدها — برای جلوگیری از ضرر مالی." },
  { icon: "phone", title: "ارتباط با مشتری", desc: "اطلاع‌رسانی پیامکی خودکار با الگوهای متصل به توکن." },
  { icon: "monitor", title: "حذف کاغذ از سالن", desc: "نمایش دیجیتال نقشه‌ها در ایستگاه‌های کاری؛ چاپ فقط در صورت نیاز." },
  { icon: "printer", title: "انعطاف در چاپ", desc: "طراحی آزاد فاکتور و برگه سفارش مطابق سلیقه‌ی شما." },
];

const shiFaq = [
  { q: "با ثبت بارکد، نقشه‌ی سفارش نمایش داده می‌شود؟", a: "بله. پس از ثبت بارکد، تصویر نقشه‌ی اول و دوم مربوط به سفارش به‌صورت خودکار روی مانیتور ایستگاه باز می‌شود." },
  { q: "اگر بارکد اشتباه ثبت شود چه اتفاقی می‌افتد؟", a: "سیستم اعتبار بارکد را بررسی می‌کند؛ در صورت تکراری، ابطال‌شده یا متعلق‌به‌مرحله‌ی‌دیگر بودن، پیام و هشدار صوتی پخش می‌شود و از ادامه‌ی عملیات جلوگیری می‌گردد." },
  { q: "آیا عملکرد پرسنل ثبت می‌شود؟", a: "بله. تاریخچه‌ی ثبت تولید شامل زمان عملیات، نام کاربر و نام کامپیوتر ثبت‌کننده است و در گزارش کارکرد قابل بررسی است." },
  { q: "آیا اطلاعات سالن پشتیبان‌گیری می‌شود؟", a: "بله. بک‌آپ فشرده و هم‌زمان از چند سال مالی، با قابلیت کم‌حجم‌سازی خودکار دیتابیس، ذخیره در فضای ابری و ارسال با ایمیل." },
];

export default function ShiOrderSections({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [open, setOpen] = useState(0);

  return (
    <div ref={ref}>
      {/* اتوماسیون سالن */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-24">
        <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-teal-600/12 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-400">PRODUCTION FLOOR · MES</p>
          <h2 className="mt-4">
            <span className="line-mask"><span className="font-display text-5xl leading-[1.15] text-white sm:text-6xl">سالن تولیدِ بدون کاغذ،</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-5xl leading-[1.15] text-teal-400 sm:text-6xl">بدون خطا</span>
            </span>
          </h2>
          <p className="reveal mt-6 max-w-2xl leading-9 text-mist-300">
            دیگر نیازی به چاپ و پخش کاغذی نقشه‌ها نیست. هر اپراتور با ثبت بارکد در ایستگاه کاری، بلافاصله نقشه‌ی
            همان شیشه‌ای را می‌بیند که باید برش بخورد و به خط بعد برود.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mesFeatures.map((f, i) => (
              <div key={f.title} className="reveal group rounded-2xl border border-ink-700/60 bg-ink-900/50 p-6 transition-colors hover:border-teal-500/50" style={{ "--rv-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 transition-transform duration-300 group-hover:scale-110">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg text-white">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-mist-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* روند کار */}
      <section className="border-t border-ink-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="reveal">
            <span className="line-mask"><span className="font-display text-4xl text-ink-900 sm:text-5xl">هر سفارش، یک مسیر مشخص</span></span>
          </h2>
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {workflow.map((s, i) => (
              <div key={s.title} className="reveal group" style={{ "--rv-delay": `${i * 90}ms` } as React.CSSProperties}>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink-100 bg-paper text-ink-800 transition-all duration-300 group-hover:border-teal-500 group-hover:bg-teal-500 group-hover:text-ink-950">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-latin text-2xl font-bold text-ink-100 transition-colors group-hover:text-teal-500">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-display text-lg text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-mist-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* چرا شی‌اوردر */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="reveal">
            <span className="line-mask"><span className="font-display text-4xl text-ink-900 sm:text-5xl">چرا کارگاه‌ها شی‌اوردر را انتخاب می‌کنند؟</span></span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d, i) => (
              <div key={d.title} className="reveal card-lift rounded-3xl border border-ink-100 bg-white p-7" style={{ "--rv-delay": `${(i % 4) * 90}ms` } as React.CSSProperties}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600">
                  <Icon name={d.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl text-ink-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-7 text-mist-500">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-8 flex items-center gap-4 rounded-2xl bg-ink-950 p-6">
            <span className="seal-pulse flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-[#0f262e]">
              <Icon name="cpu" className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-xl text-white">سبک و پرسرعت — Low Resource</h3>
              <p className="mt-1 text-sm leading-7 text-mist-300">با سخت‌افزارهای معمولی سالن تولید هم با سرعت بالا کار می‌کند؛ بدون نیاز به ارتقای کامپیوترهای قدیمی.</p>
            </div>
          </div>
        </div>
      </section>

      {/* سوالات متداول */}
      <section className="border-t border-ink-100 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">FAQ</p>
            <h2 className="mt-3">
              <span className="line-mask"><span className="font-display text-4xl leading-tight text-ink-900 sm:text-5xl">سوالاتی که مدیران سالن می‌پرسند</span></span>
            </h2>
            <p className="reveal mt-5 leading-9 text-mist-500">جواب سوال‌تان اینجا نیست؟ تماس بگیرید — {fa(5)} دقیقه‌ی اول، دمو روی داده‌های واقعی خودتان است.</p>
          </div>
          <div className="space-y-3">
            {shiFaq.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="reveal overflow-hidden rounded-2xl border border-ink-100 bg-paper" style={{ "--rv-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right">
                    <span className={`font-display text-lg transition-colors ${isOpen ? "text-teal-600" : "text-ink-900"}`}>{f.q}</span>
                    <Icon name="arrow" className={`h-4 w-4 shrink-0 text-teal-600 transition-transform duration-300 ${isOpen ? "rotate-90" : "-rotate-90"}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="border-t border-ink-100/70 px-6 py-4 text-sm leading-8 text-mist-500">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* دعوت به دمو */}
      <section className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="reveal">
            <span className="line-mask"><span className="font-display text-4xl text-ink-900 sm:text-5xl">بارکد را ثبت کنید، نقشه را ببینید</span></span>
          </h2>
          <p className="reveal mx-auto mt-4 max-w-xl leading-9 text-mist-500">در جلسه‌ی معرفی، فرآیند کامل را روی سناریوی واقعی کارگاه خودتان می‌بینید. مشاوره و دمو رایگان است.</p>
          <button onClick={() => nav({ page: "contact" })} className="btn-shine reveal group mx-auto mt-8 flex items-center gap-2.5 rounded-xl bg-teal-500 px-8 py-4 text-lg font-bold text-ink-950 transition-colors hover:bg-teal-400">
            درخواست دمو رایگان
            <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
}

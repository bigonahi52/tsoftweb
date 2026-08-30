import { products } from "../data";
import { PHONE_FA, PHONE_TEL, fa } from "../lib";
import type { NavFn } from "../lib";
import { Icon, Logo } from "./Icons";

export default function Footer({ nav }: { nav: NavFn }) {
  return (
    <footer className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pt-20 text-mist-300">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[720px] -translate-x-1/2 rounded-full bg-teal-600/10 blur-[110px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        {/* خط درخشان بالای فوتر */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-teal-500/50 to-transparent" aria-hidden />

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1.1fr]">
          {/* برند */}
          <div>
            <button onClick={() => nav({ page: "home" })} className="group flex items-center gap-3">
              <Logo className="h-11 w-11 transition-transform duration-300 group-hover:rotate-6" />
              <span className="text-right">
                <span className="block font-display text-2xl leading-7 text-white">تیسافت <span className="text-gold-400">و</span> کپیتال</span>
                <span className="mt-0.5 block font-latin text-[9px] tracking-[0.24em] text-teal-400" dir="ltr">TSOFT · CAPITAL · SINCE 2006</span>
              </span>
            </button>
            <p className="mt-5 max-w-xs text-sm leading-8">
              تیسافت برای صندوق فروشگاه و کپیتال برای بازرگانیِ چندارزی — بیست سال است حسابِ کسب‌وکارهای ایرانی و افغان را روشن نگه داشته‌ایم.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gold-500/35 bg-gold-500/10 px-4 py-3 text-sm text-gold-400">
              <Icon name="spark" className="h-4 w-4" />
              {fa("1385 — 1405")} · بیست‌سالگی تیسافت و کپیتال
            </div>
          </div>

          {/* محصولات */}
          <div>
            <p className="eyebrow text-teal-400">PRODUCTS</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <button onClick={() => nav({ page: "product", id: p.id })} className="group flex items-center gap-2.5 text-ink-100 transition-colors hover:text-gold-400">
                    <span className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:w-3" style={{ background: p.accent }} />
                    {p.name}
                    <span className="font-latin text-[9px] tracking-[0.2em] text-mist-300">{p.latin}</span>
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => nav({ page: "downloads" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">مرکز دانلود</button>
              </li>
              <li>
                <button onClick={() => nav({ page: "training" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">آموزش ویدیویی</button>
              </li>
            </ul>
          </div>

          {/* دسترسی سریع */}
          <div>
            <p className="eyebrow text-teal-400">COMPANY</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li><button onClick={() => nav({ page: "home" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">خانه</button></li>
              <li><button onClick={() => nav({ page: "about" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">درباره ما</button></li>
              <li><button onClick={() => nav({ page: "contact" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">تماس با ما</button></li>
              <li><button onClick={() => nav({ page: "login" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">ورود / ثبت‌نام</button></li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <p className="eyebrow text-teal-400">CONTACT</p>
            <ul className="mt-5 space-y-4 text-sm text-ink-100">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-teal-400" />
                <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number text-lg text-white transition-colors hover:text-gold-400">{PHONE_FA}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-teal-400" />
                <a href="mailto:info@tsoft20.ir" className="font-latin transition-colors hover:text-gold-400">info@tsoft20.ir</a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span className="text-[13px] leading-7">شنبه تا پنجشنبه: {fa("9")} تا {fa(14)} و {fa(17)} تا {fa(22)}<br />روزهای تعطیل: پشتیبانی تلفنی اضطراری</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="globe" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span className="text-[13px] leading-7">نصب، آموزش و پشتیبانی در سراسر ایران و افغانستان — کابل، هرات، قندهار و مزار شریف</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-7 text-xs sm:flex-row">
          <p>© {fa(1405)} — کلیه حقوق برای گروه نرم‌افزاری سرمایه (تیسافت) محفوظ است.</p>
          <p className="flex items-center gap-2">
            طراحی و توسعه: <span className="font-bold text-gold-400">مهندس مهدی بیگناهی</span>
            <Icon name="heart" className="h-3.5 w-3.5 text-gold-500" />
            <span className="font-latin tracking-[0.25em] text-teal-500" dir="ltr">TSOFT · EST. 2006</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

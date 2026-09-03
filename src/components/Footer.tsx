import { products } from "../data";
import { fa, PHONE_FA, PHONE_TEL } from "../lib";
import type { NavFn } from "../lib";
import { Icon, SiteLogo } from "./Icons";

export default function Footer({ nav }: { nav: NavFn }) {
  return (
    <footer className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pt-20 text-mist-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <button onClick={() => nav({ page: "home" })} className="flex items-center gap-3">
              <SiteLogo className="h-11 w-11" />
              <span className="text-right">
                <span className="block font-display text-2xl leading-6 text-white">تیسافت و کپیتال</span>
                <span className="mt-0.5 block font-latin text-[9px] tracking-[0.22em] text-teal-400">TSOFT · CAPITAL</span>
              </span>
            </button>
            <p className="mt-5 max-w-xs leading-8">
              بیست سال است نرم‌افزار حسابداری و مدیریت می‌سازیم؛ تیسافت برای صندوق فروشگاه و کپیتال برای حسابداری چندارزی بازرگانی.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-sm text-gold-400">
              <Icon name="spark" className="h-4 w-4" />
              {fa(1385)} — {fa(1405)} · از {fa(1385)} در کنار کسب‌وکارهای ایرانی
            </div>
          </div>

          <div>
            <p className="font-latin text-[10px] tracking-[0.3em] text-teal-400">PRODUCTS</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <button onClick={() => nav({ page: "product", id: p.id })} className="link-underline flex items-center gap-2 text-ink-100 transition-colors hover:text-gold-400">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
                    {p.name} <span className="font-latin text-[10px] text-mist-300">{p.latin}</span>
                  </button>
                </li>
              ))}
              <li><button onClick={() => nav({ page: "downloads" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">دانلودها</button></li>
              <li><button onClick={() => nav({ page: "training" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">آموزش ویدیویی</button></li>
            </ul>
          </div>

          <div>
            <p className="font-latin text-[10px] tracking-[0.3em] text-teal-400">COMPANY</p>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li><button onClick={() => nav({ page: "about" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">درباره ما</button></li>
              <li><button onClick={() => nav({ page: "contact" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">تماس با ما</button></li>
              <li><button onClick={() => nav({ page: "login" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">ورود / ثبت‌نام</button></li>
              <li><button onClick={() => nav({ page: "home" })} className="link-underline text-ink-100 transition-colors hover:text-gold-400">خانه</button></li>
            </ul>
          </div>

          <div>
            <p className="font-latin text-[10px] tracking-[0.3em] text-teal-400">CONTACT</p>
            <ul className="mt-5 space-y-4 text-sm text-ink-100">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-teal-400" />
                <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number text-lg text-white transition-colors hover:text-gold-400">{PHONE_FA}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-teal-400" />
                <span className="font-latin">info@tsoft20.ir</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>شنبه تا پنجشنبه: {fa(9)} تا {fa(14)} و {fa(17)} تا {fa(22)}<br />روزهای تعطیل: پشتیبانی تلفنی اضطراری</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="globe" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                نصب، آموزش و پشتیبانی در سراسر ایران و افغانستان — کابل، هرات، قندهار و مزار شریف
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink-700/60 pt-7 text-xs sm:flex-row">
          <p>© {fa(1405)} — کلیه حقوق برای گروه نرم‌افزاری سرمایه (تیسافت) محفوظ است.</p>
          <p className="flex items-center gap-2">
            طراحی و توسعه با عشق
            <Icon name="heart" className="h-3.5 w-3.5 text-gold-500" />
            <span className="font-latin tracking-[0.25em] text-teal-500" dir="ltr">TSOFT · EST. 2006</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

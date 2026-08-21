import { messengers, products } from "../data";
import { PHONE_FA, PHONE_TEL } from "../lib";
import type { NavFn } from "../lib";
import { Icon, SiteLogo } from "./Icons";

export default function Footer({ nav }: { nav: NavFn }) {
  return (
    <footer className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pt-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <SiteLogo className="h-11 w-11" />
              <div>
                <p className="font-display text-2xl text-white">تیسافت</p>
                <p className="font-latin text-[9px] tracking-[0.3em] text-teal-500">TSOFT GROUP</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs leading-8 text-mist-300">
              بیست سال است نرم‌افزار حسابداری و مدیریت می‌سازیم؛ از فروشگاه تا کارخانه، از صندوق تا صورت‌های مالی.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-sm text-gold-400">
              <Icon name="spark" className="h-4 w-4" />
              ۱۳۸۵ — ۱۴۰۵ · از ابتدا تا امروز، با شما
            </div>
          </div>

          <div>
            <p className="font-latin text-xs tracking-[0.3em] text-teal-400">PRODUCTS</p>
            <ul className="mt-5 space-y-3.5">
              {products.map((p) => (
                <li key={p.id}>
                  <button onClick={() => nav({ page: "product", id: p.id })} className="group flex items-center gap-2.5 text-sm text-ink-100 transition-colors hover:text-gold-400">
                    <span className="h-1.5 w-1.5 rounded-full transition-all group-hover:w-4" style={{ background: p.accent }} />
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-latin text-xs tracking-[0.3em] text-teal-400">QUICK LINKS</p>
            <ul className="mt-5 space-y-3.5 text-sm text-ink-100">
              <li><button onClick={() => nav({ page: "downloads" })} className="transition-colors hover:text-gold-400">مرکز دانلود</button></li>
              <li><button onClick={() => nav({ page: "training" })} className="transition-colors hover:text-gold-400">آموزش رایگان</button></li>
              <li><button onClick={() => nav({ page: "about" })} className="transition-colors hover:text-gold-400">درباره ما</button></li>
              <li><button onClick={() => nav({ page: "contact" })} className="transition-colors hover:text-gold-400">تماس با ما</button></li>
            </ul>
          </div>

          <div>
            <p className="font-latin text-xs tracking-[0.3em] text-teal-400">CONTACT</p>
            <ul className="mt-5 space-y-4 text-sm text-ink-100">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-teal-400" />
                <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number text-base text-white transition-colors hover:text-gold-400">{PHONE_FA}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-teal-400" />
                <span className="font-latin text-xs">info@tsoft20.ir</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span className="leading-7">شنبه تا پنجشنبه: ۹ تا ۱۴ و ۱۷ تا ۲۲<br />روزهای تعطیل: پشتیبانی تلفنی اضطراری</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="globe" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>نصب، آموزش و پشتیبانی در سراسر ایران و افغانستان — کابل، هرات، قندهار و مزار شریف</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {messengers.map((m) => (
                <span key={m.name} className="flex items-center gap-1.5 rounded-full border border-ink-700/70 px-3 py-1.5 text-[11px] text-ink-100">
                  <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink-700/60 py-7 text-xs text-mist-300 sm:flex-row">
          <p>© ۱۴۰۵ — کلیه حقوق برای گروه نرم‌افزاری تیسافت محفوظ است.</p>
          <p className="flex items-center gap-2">
            ساخته‌شده با عشق، برای کسب‌وکار ایرانی
            <span className="font-latin tracking-[0.25em] text-teal-500">TSOFT · EST. 2006</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

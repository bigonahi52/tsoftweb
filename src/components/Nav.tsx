import { useEffect, useState } from "react";
import type { PubUser } from "../api";
import { fa, PHONE_FA, PHONE_TEL } from "../lib";
import type { NavFn, Route } from "../lib";
import { Icon, SiteLogo } from "./Icons";

/** تاریخ امروز — شمسی و میلادی با اعداد فارسی */
function useTodayDate() {
  const [d] = useState(() => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).formatToParts(now);
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      const jalali = `${get("weekday")} ${get("day")} ${get("month")} ${get("year")}`;
      const gregory = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(now);
      return { jalali, gregory };
    } catch {
      return null;
    }
  });
  return d;
}

export default function Nav({ route, nav, user, onLogout }: { route: Route; nav: NavFn; user: PubUser | null; onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const today = useTodayDate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [route]);

  const links: { label: string; to: Route; key: string }[] = [
    { label: "خانه", to: { page: "home" }, key: "home" },
    { label: "محصولات", to: { page: "home" }, key: "products" },
    { label: "دانلودها", to: { page: "downloads" }, key: "downloads" },
    { label: "آموزش", to: { page: "training" }, key: "training" },
    { label: "درباره ما", to: { page: "about" }, key: "about" },
    { label: "تماس", to: { page: "contact" }, key: "contact" },
  ];

  const isActive = (key: string) => (key === "products" ? route.page === "product" : route.page === key);

  return (
    <>
      {/* نوار بالای هدر — تاریخ و تلفن */}
      <div className="relative z-[60] bg-ink-950 text-ink-100">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-center text-[13px] sm:justify-between sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="seal-pulse inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-950">۲۰</span>
            <p className="font-medium tracking-wide">
              <span className="text-gold-400">بیست‌سالگی تیسافت و کپیتال</span>
              <span className="mx-2 hidden text-ink-600 sm:inline">|</span>
              <span className="hidden sm:inline">دو دهه حسابِ روشن</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-mist-300">
            {today && (
              <span className="hidden items-center gap-2 lg:flex">
                <Icon name="clock" className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-medium text-ink-100">{today.jalali}</span>
                <span className="text-ink-600" aria-hidden="true">·</span>
                <span className="font-latin text-[11px] tracking-wide text-mist-300" dir="ltr">{today.gregory}</span>
              </span>
            )}
            <a href={`tel:${PHONE_TEL}`} className="group flex items-center gap-2.5 transition-colors hover:text-gold-400" title="تماس مستقیم با پشتیبانی">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-teal-500/35 bg-teal-500/10 text-teal-400 transition-all duration-300 group-hover:border-gold-500/60 group-hover:bg-gold-500/15 group-hover:text-gold-400">
                <span className="phone-ring-pulse absolute inset-0 rounded-xl border border-teal-500/40" aria-hidden />
                <Icon name="phone" className="phone-ring h-4 w-4" />
              </span>
              <span dir="ltr" className="phone-number text-[15px] text-gold-400 drop-shadow-[0_0_8px_rgba(234,166,59,0.28)] transition-all duration-300 group-hover:tracking-[0.06em] group-hover:text-white sm:text-[16.5px]">
                {PHONE_FA}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* هدر چسبان */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? "border-ink-100/60 bg-white/90 shadow-[0_8px_30px_-18px_rgba(12,31,25,0.35)] backdrop-blur-xl" : "border-transparent bg-paper/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button onClick={() => nav({ page: "home" })} className="group flex items-center gap-3">
            <SiteLogo className="h-10 w-10 transition-transform duration-300 group-hover:rotate-6" />
            <span className="text-right">
              <span className="block font-display text-[24px] leading-6 text-ink-900">تیسافت و کپیتال</span>
              <span className="mt-0.5 block font-latin text-[9px] tracking-[0.22em] text-teal-600">TSOFT · CAPITAL · SINCE 2006</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) =>
              l.key === "products" ? (
                <div key={l.key} className="relative" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
                  <button
                    onClick={() => {
                      nav({ page: "home" });
                      setTimeout(() => document.getElementById("products")?.scrollIntoView({ block: "start" }), 60);
                    }}
                    className={`nav-link flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive("products") || drop ? "nav-active text-teal-600" : "text-ink-800 hover:text-teal-600"
                    }`}
                  >
                    محصولات
                    <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform duration-300 ${drop ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className={`absolute right-0 top-full w-[400px] origin-top pt-3 transition-all duration-200 ${drop ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
                    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-[0_30px_60px_-20px_rgba(12,31,25,0.3)]">
                      <p className="px-3.5 pb-1 pt-2 font-latin text-[10px] tracking-[0.25em] text-mist-300">TSOFT · CAPITAL</p>
                      {[
                        { id: "tisaft", name: "تیسافت", latin: "TSOFT", short: "حسابداری فروشگاهی — نقره‌ای و طلایی" },
                        { id: "capital", name: "کپیتال", latin: "CAPITAL", short: "حسابداری چندارزی و مدیریت سرمایه" },
                      ].map((p) => (
                        <button key={p.id} onClick={() => nav({ page: "product", id: p.id })} className="group flex w-full items-start gap-3.5 rounded-xl px-3.5 py-3 text-right transition-colors hover:bg-ink-50">
                          <span className="mt-1.5 h-9 w-1 shrink-0 rounded-full bg-teal-500 transition-all group-hover:w-1.5 group-hover:h-10" />
                          <span>
                            <span className="flex items-baseline gap-2">
                              <span className="font-display text-lg text-ink-900 group-hover:text-teal-600 transition-colors">{p.name}</span>
                              <span className="font-latin text-[10px] tracking-[0.18em] text-mist-300">{p.latin}</span>
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-mist-500">{p.short}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={l.key}
                  onClick={() => nav(l.to)}
                  className={`nav-link relative rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${isActive(l.key) ? "nav-active text-teal-600" : "text-ink-800 hover:text-teal-600"}`}
                >
                  {l.label}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.role === "admin" && (
                  <button onClick={() => nav({ page: "admin" })} className="hidden rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02] sm:block">
                    پنل مدیریت
                  </button>
                )}
                {user.role !== "admin" && (
                  <button onClick={() => nav({ page: "panel" })} className="hidden rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-ink-950 transition-transform hover:scale-[1.02] sm:block">
                    پنل کاربری
                  </button>
                )}
                <button onClick={onLogout} className="hidden rounded-xl border border-ink-100 px-4 py-2.5 text-sm font-semibold text-ink-800 transition-colors hover:border-[#E14B4B]/50 hover:text-[#E14B4B] sm:block">
                  خروج
                </button>
              </>
            ) : (
              <button onClick={() => nav({ page: "login" })} className="hidden rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-600 sm:block">
                ورود / ثبت‌نام
              </button>
            )}
            <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-white text-ink-900 lg:hidden" aria-label="منو">
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* منوی موبایل */}
      <div className={`fixed inset-0 z-40 overflow-y-auto bg-ink-950 transition-all duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="grid-lines noise relative min-h-full px-6 pb-16 pt-28">
          <nav className="space-y-1">
            {links.map((l) => (
              <button key={l.key} onClick={() => { nav(l.to); setOpen(false); }} className="flex w-full items-center justify-between border-b border-ink-700/60 py-4 text-right">
                <span className={`font-display text-3xl ${isActive(l.key) ? "text-gold-400" : "text-ink-100"}`}>{l.label}</span>
                <Icon name="arrow" className="h-5 w-5 text-teal-500" />
              </button>
            ))}
          </nav>
          <div className="mt-8 space-y-2">
            <p className="font-latin text-[10px] tracking-[0.25em] text-mist-300">PRODUCTS</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "tisaft", name: "تیسافت", latin: "TSOFT" },
                { id: "capital", name: "کپیتال", latin: "CAPITAL" },
              ].map((p) => (
                <button key={p.id} onClick={() => { nav({ page: "product", id: p.id }); setOpen(false); }} className="rounded-full border border-ink-600 px-4 py-2 text-sm text-ink-100 transition-colors hover:border-teal-500 hover:text-teal-400">
                  {p.name} <span className="font-latin text-[10px] text-mist-300">{p.latin}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            {user ? (
              <div className="space-y-3">
                <button onClick={() => { nav({ page: user.role === "admin" ? "admin" : "panel" }); setOpen(false); }} className="w-full rounded-xl bg-gold-500 px-5 py-3.5 font-bold text-ink-950">
                  {user.role === "admin" ? "پنل مدیریت" : "پنل کاربری"}
                </button>
                <button onClick={() => { onLogout(); setOpen(false); }} className="w-full rounded-xl border border-ink-600 px-5 py-3.5 font-semibold text-ink-100">خروج</button>
              </div>
            ) : (
              <button onClick={() => { nav({ page: "login" }); setOpen(false); }} className="w-full rounded-xl bg-teal-500 px-5 py-3.5 font-bold text-ink-950">ورود / ثبت‌نام</button>
            )}
          </div>
          <p className="mt-12 text-center font-display text-lg text-gold-400">۱۳۸۵ — ۱۴۰۵ · دو دهه حسابِ روشن</p>
        </div>
      </div>
    </>
  );
}

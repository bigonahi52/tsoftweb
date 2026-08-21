import { useCallback, useEffect, useState } from "react";
import { getProduct } from "./data";
import { prefersReducedMotion, useRevealAll } from "./lib";
import type { NavFn, Route } from "./lib";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import ShiOrderSections from "./components/ShiOrderSections";
import DownloadsPage from "./components/DownloadsPage";
import TrainingPage from "./components/TrainingPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import { Icon } from "./components/Icons";

/** نوار پیشرفت اسکرول */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setP(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-right bg-teal-500" style={{ transform: `scaleX(${p})` }} />;
}

/** دکمه‌ی شناور بازگشت به بالا */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
      aria-label="بازگشت به بالای صفحه"
      title="بازگشت به بالا"
      className={`group fixed bottom-6 left-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/50 bg-ink-950 text-teal-400 shadow-[0_12px_30px_-10px_rgba(10,27,33,0.7)] transition-all duration-400 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Icon name="arrow" className="h-5 w-5 rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

const pageMeta: Record<string, { title: string; desc: string }> = {
  home: { title: "تیسافت (TSOFT) | ۲۰ سال حسابِ روشن — نرم‌افزارهای حسابداری و مدیریت کسب‌وکار", desc: "تیسافت؛ ۲۰ سال تجربه در نرم‌افزارهای حسابداری فروشگاهی، چندارزی، اتوماسیون تولید شیشه و پنجره، مدیریت شارژ ساختمان و حسابداری یکپارچه مالی." },
  downloads: { title: "مرکز دانلود | تیسافت (TSOFT)", desc: "دانلود نرم‌افزارهای تیسافت، کپیتال، شی‌اوردر، سازه‌یار و پیسافت + ابزارهای اتصال از راه دور و SQL Server." },
  training: { title: "آموزش رایگان ویدیویی | تیسافت (TSOFT)", desc: "دوره‌های ویدیویی حسابداری تیسافت و کپیتال در آپارات — رایگان برای همه." },
  about: { title: "درباره ما | تیسافت (TSOFT)", desc: "قصه‌ی بیست‌ساله‌ی تیسافت؛ تیمی که خودش می‌سازد و خودش پشتیبانی می‌کند." },
  contact: { title: "تماس با ما | تیسافت (TSOFT)", desc: "تلفن، ایمیل و پیام‌رسان‌های تیسافت — پشتیبانی در سراسر ایران و افغانستان." },
};

export default function App() {
  const [route, setRoute] = useState<Route>({ page: "home" });
  const ref = useRevealAll<HTMLDivElement>();

  const nav: NavFn = useCallback((r) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  /* عنوان و توضیح هر صفحه برای سئو */
  useEffect(() => {
    let meta = pageMeta[route.page];
    if (route.page === "product") {
      const p = getProduct(route.id) ?? getProduct("tisaft");
      if (p) meta = { title: `${p.name} (${p.latin}) | ${p.tagline} — تیسافت`, desc: p.overview[0] ?? p.short };
    }
    if (meta) {
      document.title = meta.title;
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", meta.desc);
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-paper font-body text-ink-900">
      <ScrollProgress />
      <BackToTop />
      <Nav route={route} nav={nav} />
      <div ref={ref}>
        {route.page === "home" && (
          <>
            <Hero nav={nav} />
            <Home nav={nav} />
          </>
        )}
        {route.page === "product" && (
          <>
            <ProductPage id={route.id} nav={nav} />
            {route.id === "shiorder" && <ShiOrderSections nav={nav} />}
          </>
        )}
        {route.page === "downloads" && <DownloadsPage />}
        {route.page === "training" && <TrainingPage />}
        {route.page === "about" && <AboutPage nav={nav} />}
        {route.page === "contact" && <ContactPage />}
      </div>
      <Footer nav={nav} />
    </div>
  );
}

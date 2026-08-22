import { useCallback, useEffect, useState } from "react";
import { getProduct } from "./data";
import { prefersReducedMotion, useRevealAll } from "./lib";
import type { NavFn, Route } from "./lib";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import DownloadsPage from "./components/DownloadsPage";
import TrainingPage from "./components/TrainingPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
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
      className={`group fixed bottom-6 left-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/50 bg-ink-950 text-teal-400 shadow-[0_12px_30px_-10px_rgba(10,27,33,0.7)] transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Icon name="arrow" className="h-5 w-5 rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

const pageMeta: Record<string, { title: string; desc: string }> = {
  home: { title: "تیسافت (TSOFT) | ۲۰ سال حسابِ روشن — نرم‌افزارهای حسابداری فروشگاهی و چندارزی", desc: "تیسافت؛ ۲۰ سال تجربه در نرم‌افزار حسابداری فروشگاهی و حسابداری چندارزی کپیتال — پشتیبانی در سراسر ایران و افغانستان." },
  downloads: { title: "مرکز دانلود | تیسافت (TSOFT)", desc: "دانلود نرم‌افزارهای تیسافت و کپیتال + ابزارهای اتصال از راه دور و SQL Server." },
  training: { title: "آموزش رایگان ویدیویی | تیسافت (TSOFT)", desc: "دوره‌های ویدیویی حسابداری تیسافت و کپیتال در آپارات — رایگان برای همه." },
  about: { title: "درباره ما | تیسافت (TSOFT)", desc: "قصه‌ی بیست‌ساله‌ی تیسافت؛ تیمی که خودش می‌سازد و خودش پشتیبانی می‌کند." },
  contact: { title: "تماس با ما | تیسافت (TSOFT)", desc: "تلفن، ایمیل و پیام‌رسان‌های تیسافت — پشتیبانی در سراسر ایران و افغانستان." },
};

/** نگاشت آدرس URL به محصول — تیسافت با tsoft و کپیتال با capital */
const SLUG_TO_ID: Record<string, string> = {
  tsoft: "tisaft",
  tisaft: "tisaft",
  capital: "capital",
};

const ID_TO_SLUG: Record<string, string> = {
  tisaft: "tsoft",
  capital: "capital",
};

function pathToRoute(path: string): Route {
  const seg = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!seg) return { page: "home" };
  if (SLUG_TO_ID[seg]) return { page: "product", id: SLUG_TO_ID[seg] };
  if (seg === "downloads") return { page: "downloads" };
  if (seg === "training") return { page: "training" };
  if (seg === "about") return { page: "about" };
  if (seg === "contact") return { page: "contact" };
  return { page: "home" };
}

function routeToPath(r: Route): string {
  if (r.page === "home") return "/";
  if (r.page === "product") return "/" + (ID_TO_SLUG[r.id] ?? r.id);
  return "/" + r.page;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));
  const ref = useRevealAll<HTMLDivElement>();

  const nav: NavFn = useCallback((r) => {
    setRoute(r);
    try {
      window.history.pushState(null, "", routeToPath(r));
    } catch {
      /* محیط‌های محدود */
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  /* دکمه‌های جلو/عقب مرورگر */
  useEffect(() => {
    const onPop = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
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
      <ChatWidget />
      <Nav route={route} nav={nav} />
      <div ref={ref}>
        {route.page === "home" && (
          <>
            <Hero nav={nav} />
            <Home nav={nav} />
          </>
        )}
        {route.page === "product" && <ProductPage id={route.id} nav={nav} />}
        {route.page === "downloads" && <DownloadsPage />}
        {route.page === "training" && <TrainingPage />}
        {route.page === "about" && <AboutPage nav={nav} />}
        {route.page === "contact" && <ContactPage />}
      </div>
      <Footer nav={nav} />
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { api, getToken, setToken, type PubUser } from "./api";
import { useRevealAll } from "./lib";
import type { NavFn, Route } from "./lib";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProductPage from "./components/ProductPage";
import DownloadsPage from "./components/DownloadsPage";
import TrainingPage from "./components/TrainingPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import AuthPage from "./components/AuthPage";
import UserPanel from "./components/UserPanel";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import { Icon } from "./components/Icons";

const SLUG_TO_ID: Record<string, string> = {
  tsoft: "tisaft",
  tisaft: "tisaft",
  capital: "capital",
};

function pathToRoute(path: string): Route {
  const seg = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!seg) return { page: "home" };
  let decoded = seg;
  try {
    decoded = decodeURIComponent(seg);
  } catch {
    /* ignore */
  }
  if (decoded.includes("آموزش-کپیتال") || decoded.includes("آموزش کپیتال")) return { page: "training" };
  if (SLUG_TO_ID[seg]) return { page: "product", id: SLUG_TO_ID[seg] };
  const known = ["downloads", "training", "about", "contact", "login", "register", "panel", "admin"];
  if (known.includes(seg)) return { page: seg as Route["page"] } as Route;
  return { page: "home" };
}

function routeToPath(r: Route): string {
  switch (r.page) {
    case "home":
      return "/";
    case "product":
      return r.id === "capital" ? "/capital" : "/tsoft";
    default:
      return "/" + r.page;
  }
}

const pageMeta: Record<string, { title: string; desc: string }> = {
  home: {
    title: "تیسافت و کپیتال (TSOFT · CAPITAL) | نرم‌افزار حسابداری فروشگاهی و چندارزی | گروه نرم‌افزاری سرمایه",
    desc: "کپیتال (Capital) نرم‌افزار حسابداری چندارزی از گروه نرم‌افزاری سرمایه (تیسافت TSOFT) — ارز پایه، نرخ روز، فاکتور و گزارش ارزی برای بازرگانی در ایران و افغانستان.",
  },
  downloads: { title: "مرکز دانلود | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "دانلود تیسافت، کپیتال، آپدیت‌ها و ابزارهای پشتیبانی." },
  training: { title: "آموزش ویدیویی | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "دوره‌های ویدیویی آموزش تیسافت و کپیتال — رایگان." },
  about: { title: "درباره ما | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "گروه نرم‌افزاری سرمایه — دو دهه تجربه در نرم‌افزارهای حسابداری." },
  contact: { title: "تماس با ما | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "تلفن، ایمیل و پیام‌رسان‌های پشتیبانی تیسافت و کپیتال." },
  login: { title: "ورود | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "ورود به حساب کاربری." },
  register: { title: "ثبت‌نام | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "ساخت حساب کاربری." },
  panel: { title: "پنل کاربری | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "تیکت‌ها و چت با پشتیبانی." },
  admin: { title: "پنل مدیریت | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "پنل مدیریت — کاربران، تیکت‌ها و گفتگوها." },
};

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-right bg-teal-500" style={{ transform: `scaleX(${p})` }} />;
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      aria-label="بازگشت به بالای صفحه"
      title="بازگشت به بالا"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed bottom-6 left-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/50 bg-ink-950 text-teal-400 shadow-[0_12px_30px_-10px_rgba(12,31,25,0.7)] transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-950 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Icon name="arrow" className="h-5 w-5 rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));
  const [user, setUser] = useState<PubUser | null>(null);
  const ref = useRevealAll<HTMLDivElement>();

  /* بازیابی نشست */
  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then((d) => setUser(d.user))
      .catch(() => setToken(null));
  }, []);

  /* مسیریابی با History API */
  useEffect(() => {
    const onPop = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const nav: NavFn = useCallback((r: Route) => {
    setRoute(r);
    const path = routeToPath(r);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    window.scrollTo({ top: 0 });
  }, []);

  /* متادیتای صفحه */
  useEffect(() => {
    let meta = pageMeta[route.page];
    if (route.page === "product") {
      meta =
        route.id === "capital"
          ? { title: "کپیتال (Capital) | حسابداری چندارزی | گروه نرم‌افزاری سرمایه", desc: "کپیتال: نرم‌افزار حسابداری چندارزی با ارز پایه، نرخ روز و گزارش‌های ارزی." }
          : { title: "تیسافت (TSOFT) | حسابداری فروشگاهی | گروه نرم‌افزاری سرمایه", desc: "تیسافت: نرم‌افزار حسابداری فروشگاهی با ماژول نقره‌ای و طلایی برای بازار ایران." };
    }
    if (meta) {
      document.title = meta.title;
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", meta.desc);
    }
  }, [route]);

  const onAuth = (u: PubUser, token: string) => {
    setToken(token);
    setUser(u);
  };
  const onLogout = () => {
    api.logout().catch(() => {});
    setToken(null);
    setUser(null);
    nav({ page: "home" });
  };

  const renderPage = () => {
    switch (route.page) {
      case "home":
        return (
          <>
            <Hero nav={nav} />
            <Home nav={nav} />
          </>
        );
      case "product":
        return <ProductPage id={route.id} nav={nav} />;
      case "downloads":
        return <DownloadsPage />;
      case "training":
        return <TrainingPage />;
      case "about":
        return <AboutPage nav={nav} />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <AuthPage tab="login" onAuth={onAuth} nav={nav} />;
      case "register":
        return <AuthPage tab="register" onAuth={onAuth} nav={nav} />;
      case "panel":
        return user ? <UserPanel user={user} onLogout={onLogout} nav={nav} /> : <AuthPage tab="login" onAuth={onAuth} nav={nav} />;
      case "admin":
        return user && user.role === "admin" ? (
          <AdminPanel user={user} onLogout={onLogout} nav={nav} />
        ) : (
          <AuthPage tab="login" onAuth={onAuth} nav={nav} />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className="min-h-screen bg-paper font-body text-ink-900">
      <ScrollProgress />
      <Nav route={route} nav={nav} user={user} onLogout={onLogout} />
      <main>{renderPage()}</main>
      <Footer nav={nav} />
      <BackToTop />
    </div>
  );
}

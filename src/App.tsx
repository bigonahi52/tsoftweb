import { useCallback, useEffect, useState } from "react";
import { api, getToken, setToken, type PubUser } from "./api";
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
import AuthPage from "./components/AuthPage";
import UserPanel from "./components/UserPanel";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { Icon, Logo } from "./components/Icons";

/** لودینگ اولیه — لوگو + نوار نور + نام برند */
function Splash() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), 1150);
    const t2 = window.setTimeout(() => setGone(true), 1700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink-950 ${leaving ? "splash-out" : ""}`}
      aria-hidden="true"
    >
      <div className="grid-lines grid-lines-fade noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute h-[340px] w-[340px] rounded-full bg-teal-600/14 blur-[110px]" />

      <div className="splash-logo-in relative">
        <Logo className="h-20 w-20 drop-shadow-[0_0_28px_rgba(23,176,166,0.45)]" />
      </div>

      {/* نوار نور متحرک */}
      <div className="relative mt-9 h-[3px] w-44 overflow-hidden rounded-full bg-ink-700/60">
        <span className="splash-bar absolute inset-y-0 w-1/3 rounded-full bg-teal-500" />
      </div>

      {/* نام برند — تیسافت و کپیتال */}
      <p className="splash-logo-in relative mt-6 font-display text-4xl leading-none text-white">
        تیسافت <span className="text-gold-400">و</span> کپیتال
      </p>
      <p className="relative mt-4 font-latin text-sm font-bold tracking-[0.35em] text-ink-100" dir="ltr">
        {"TSOFT · CAPITAL".split("").map((ch, i) => (
          <span key={i} className="splash-letter" style={{ animationDelay: `${i * 0.06}s` }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </p>
      <p className="splash-logo-in relative mt-3 text-xs tracking-wide text-mist-300" style={{ animationDelay: "0.4s" }}>
        ۲۰ سال حسابِ روشن
      </p>
    </div>
  );
}

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
  home: {
    title: "تیسافت و کپیتال (TSOFT · CAPITAL) | نرم‌افزار حسابداری فروشگاهی و چندارزی | گروه نرم‌افزاری سرمایه",
    desc: "کپیتال (Capital) نرم‌افزار حسابداری چندارزی از گروه نرم‌افزاری سرمایه (تیسافت TSOFT) — ارز پایه، نرخ روز و گزارش ارزی برای ایران و افغانستان. Capital multi-currency accounting software.",
  },
  downloads: { title: "مرکز دانلود | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "دانلود نرم‌افزارهای تیسافت و کپیتال + ابزارهای اتصال از راه دور و SQL Server." },
  training: { title: "آموزش رایگان ویدیویی | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "دوره‌های ویدیویی حسابداری تیسافت و کپیتال در آپارات — رایگان برای همه." },

  about: { title: "درباره ما | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "قصه‌ی بیست‌ساله‌ی تیسافت و کپیتال؛ تیمی که خودش می‌سازد و خودش پشتیبانی می‌کند." },
  contact: { title: "تماس با ما | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "تلفن، ایمیل و پیام‌رسان‌های تیسافت و کپیتال — پشتیبانی در سراسر ایران و افغانستان." },
  login: { title: "ورود | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "ورود به حساب کاربری تیسافت و کپیتال برای تیکت و چت پشتیبانی." },
  register: { title: "ثبت‌نام | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "ساخت حساب کاربری تیسافت و کپیتال برای تیکت و چت پشتیبانی." },
  panel: { title: "پنل کاربری | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "پنل کاربری — تیکت‌ها، چت با پشتیبانی و حساب کاربری." },
  admin: { title: "پنل مدیریت | تیسافت و کپیتال (TSOFT · CAPITAL)", desc: "پنل مدیریت — کاربران، تیکت‌ها و گفتگوها." },
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
  /* آدرس‌های قدیمی وردپرسِ صفحه آموزش کپیتال → هدایت به /training */
  let decoded = seg;
  try { decoded = decodeURIComponent(seg); } catch { /* encoded نامعتبر */ }
  if (decoded.includes("آموزش-کپیتال") || decoded.includes("آموزش کپیتال")) return { page: "training" };
  if (SLUG_TO_ID[seg]) return { page: "product", id: SLUG_TO_ID[seg] };
  if (seg === "downloads") return { page: "downloads" };
  if (seg === "training") return { page: "training" };
  if (seg === "about") return { page: "about" };
  if (seg === "contact") return { page: "contact" };
  if (seg === "login") return { page: "login" };
  if (seg === "register") return { page: "register" };
  if (seg === "panel") return { page: "panel" };
  if (seg === "admin") return { page: "admin" };
  return { page: "home" };
}

function routeToPath(r: Route): string {
  if (r.page === "home") return "/";
  if (r.page === "product") return "/" + (ID_TO_SLUG[r.id] ?? r.id);
  return "/" + r.page;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));
  const [user, setUser] = useState<PubUser | null>(null);
  const ref = useRevealAll<HTMLDivElement>();

  /* بازیابی نشست کاربر هنگام بارگذاری */
  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then((d) => {
        if (d && d.user && d.user.id) setUser(d.user);
        else setToken(null);
      })
      .catch(() => setToken(null));
  }, []);

  const handleAuth = useCallback((u: PubUser) => setUser(u), []);
  const handleUserUpdate = useCallback((u: PubUser) => setUser(u), []);
  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
    setRoute({ page: "home" });
    try {
      window.history.pushState(null, "", "/");
    } catch {
      /* ignore */
    }
  }, []);

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
      if (p) {
        const enSuffix =
          p.id === "capital"
            ? " | Capital — multi-currency accounting software by Sarmaye Software Group (TSOFT): base currency, daily exchange rates, per-customer currency unit and balance conversion."
            : "";
        meta = { title: `${p.name} (${p.latin}) | ${p.tagline} — تیسافت TSOFT | گروه نرم‌افزاری سرمایه`, desc: (p.overview[0] ?? p.short) + enSuffix };
      }
    }
    if (meta) {
      document.title = meta.title;
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", meta.desc);
    }
  }, [route]);

  return (
    <div className="min-h-screen bg-paper font-body text-ink-900">
      <Splash />
      <ScrollProgress />
      <BackToTop />
      <Nav route={route} nav={nav} user={user} onLogout={handleLogout} />
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
        {(route.page === "login" || route.page === "register") && (
          <AuthPage mode={route.page} nav={nav} onAuth={handleAuth} />
        )}
        {route.page === "panel" &&
          (user ? (
            <UserPanel user={user} onUser={handleUserUpdate} nav={nav} onLogout={handleLogout} />
          ) : (
            <AuthPage mode="login" nav={nav} onAuth={handleAuth} />
          ))}
        {route.page === "admin" &&
          (user && user.role === "admin" ? (
            <AdminPanel user={user} nav={nav} onLogout={handleLogout} />
          ) : (
            <AuthPage mode="login" nav={nav} onAuth={handleAuth} />
          ))}
      </div>
      <Footer nav={nav} />
      <ChatWidget user={user} nav={nav} />
    </div>
  );
}

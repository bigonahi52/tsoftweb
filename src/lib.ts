import { useEffect, useRef, useState } from "react";

export type Route =
  | { page: "home" }
  | { page: "product"; id: string }
  | { page: "downloads" }
  | { page: "training" }
  | { page: "about" }
  | { page: "contact" };

export type NavFn = (r: Route) => void;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (s: string | number): string => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

export const PHONE_FA = fa("0915 313 3726");
export const PHONE_TEL = "+989153133726";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** تبدیل لینک صفحه‌ی آپارات به لینک پخش داخلی */
export function aparatEmbed(url: string): string {
  const m = url.match(/aparat\.com\/v\/([A-Za-z0-9]+)/i);
  return m ? `https://www.aparat.com/video/video/embed/videohash/${m[1]}/vt/frame` : url;
}

/** فعال‌سازی انیمیشن ورود همه‌ی عناصر .reveal در یک محدوده */
export function useRevealAll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal");
    if (prefersReducedMotion()) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    /* عناصری که بعداً اضافه می‌شوند (مثل فیلتر دانلود) هم دیده شوند */
    const mut = new MutationObserver(() => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((el) => obs.observe(el));
    });
    mut.observe(root, { childList: true, subtree: true });
    return () => {
      obs.disconnect();
      mut.disconnect();
    };
  }, []);
  return ref;
}

/** شمارنده‌ی متحرک اعداد */
export function useCountUp(target: number, duration = 1400, plain = false) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          if (prefersReducedMotion()) {
            setVal(target);
            return;
          }
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  const text = plain ? fa(val) : fa(val.toLocaleString("en-US"));
  return { ref, text };
}

/** چرخش آرام واژه‌ها با محو نرم */
export function useGentleWord(words: string[], hold = 2800) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % words.length);
        setVisible(true);
      }, 320);
    }, hold);
    return () => window.clearInterval(id);
  }, [words.length, hold]);
  return { word: words[i], index: i, visible };
}

/** تاریخ امروز به شمسی — «چهارشنبه 28 مرداد 1405» */
export function useTodayDate(): string | null {
  const [d] = useState(() => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("fa-IR-u-nu-fa", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).formatToParts(now);
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
      return `${get("weekday")} ${get("day")} ${get("month")} ${get("year")}`;
    } catch {
      return null;
    }
  });
  return d;
}

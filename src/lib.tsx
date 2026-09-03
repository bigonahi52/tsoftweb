import { useEffect, useRef, useState } from "react";

/* ── انواع مسیریابی ── */
export type Route =
  | { page: "home" }
  | { page: "product"; id: string }
  | { page: "downloads" }
  | { page: "training" }
  | { page: "about" }
  | { page: "contact" }
  | { page: "login" }
  | { page: "register" }
  | { page: "panel" }
  | { page: "admin" };

export type NavFn = (r: Route) => void;

/* ── اعداد فارسی ── */
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

/* ── شماره تماس ── */
export const PHONE_FA = "۰۹۱۵ ۳۱۳ ۳۷۲۶";
export const PHONE_TEL = "+989153133726";

/* ── تشخیص کاهش حرکت ── */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── ورود عناصر هنگام اسکرول ── */
export function useRevealAll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const els = Array.from(root.querySelectorAll(".reveal"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    /* عناصری که بعداً (با تغییر state) اضافه می‌شوند را هم زیر نظر بگیر */
    const mo = new MutationObserver(() => {
      root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => obs.observe(el));
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      obs.disconnect();
      mo.disconnect();
    };
  }, []);
  return ref;
}

/* ── شمارنده‌ی متحرک ── */
export function useCountUp(target: number, duration = 1600, plain = false) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [text, setText] = useState(plain ? String(target) : "۰");
  const started = useRef(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(plain ? String(target) : fa(target.toLocaleString("en-US")));
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(target * eased);
            setText(plain ? String(val) : fa(val.toLocaleString("en-US")));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, plain]);
  return { ref, text };
}

/* ── چرخش نرم کلمات ── */
export function useGentleWord(words: string[], hold = 3200) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, hold);
    return () => window.clearInterval(id);
  }, [words.length, hold]);
  return { word: words[index], index, visible, select: (i: number) => setIndex(i) };
}

/* ── اجرای تابع در بازه‌های زمانی ── */
export function usePolling(fn: () => void, ms: number, active = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!active) return;
    const run = () => ref.current();
    run();
    const id = window.setInterval(run, ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}

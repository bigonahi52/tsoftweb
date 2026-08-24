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
export const fa = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

/** فرمت مبلغ با جداکننده‌ی هزارگان و اعداد فارسی */
export const money = (n: number): string => fa(Math.round(n).toLocaleString("en-US"));

/** تاریخ فارسی کوتاه */
export const faDate = (t: number): string =>
  new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(t);

export const faTime = (t: number): string =>
  new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(t);

export const PHONE_FA = "۰۹۱۵ ۳۱۳ ۳۷۲۶";
export const PHONE_TEL = "+989153133726";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** تبدیل لینک صفحه‌ی آپارات به لینک پخش داخلی */
export function aparatEmbed(url: string): string {
  const m = url.match(/aparat\.com\/v\/([A-Za-z0-9]+)/);
  return m ? `https://www.aparat.com/video/video/embed/videohash/${m[1]}/vt/frame` : url;
}

/** نمایش عناصر هنگام اسکرول */
export function useRevealAll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
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
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVal(target);
      return;
    }
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
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

/** تاریخ امروز — شمسی به ترتیب «روز هفته + روز + ماه + سال» و میلادی به انگلیسی */
export function useTodayDate(): { jalali: string; gregory: string } | null {
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
      const jalali = `${get("weekday")} ${get("day")} ${get("month")} ${get("year")}`.trim();

      const gparts = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).formatToParts(now);
      const gget = (t: string) => gparts.find((p) => p.type === t)?.value ?? "";
      const gregory = `${gget("day")} ${gget("month")} ${gget("year")}`.trim();

      return { jalali, gregory };
    } catch {
      return null;
    }
  });
  return d;
}

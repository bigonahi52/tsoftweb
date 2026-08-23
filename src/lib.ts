import { useEffect, useRef, useState } from "react";

export type Route =
  | { page: "home" }
  | { page: "product"; id: string }
  | { page: "downloads" }
  | { page: "training" }
  | { page: "support" }
  | { page: "about" }
  | { page: "contact" };

export type NavFn = (r: Route) => void;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (s: string | number): string => String(s).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

/** فرمت مبلغ با جداکننده‌ی هزارگان و اعداد فارسی */
export const money = (n: number): string => fa(Math.round(n).toLocaleString("en-US"));

/** تاریخ فارسی از timestamp */
export function faDate(t: number): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-nu-fa", { day: "numeric", month: "long", year: "numeric" }).format(new Date(t));
  } catch {
    return "";
  }
}

/** ساعت فارسی از timestamp */
export function faTime(t: number): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-nu-fa", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date(t));
  } catch {
    return "";
  }
}

export const PHONE_FA = "+۹۸ ۹۱۵ ۳۱۳ ۳۷۲۶";
export const PHONE_TEL = "+989153133726";

/** مشخصات کارت برای پرداخت کارت‌به‌کارت */
export const CARD_NUMBER = "6219861807656078";
export const CARD_NUMBER_FA = "۶۲۱۹ ۸۶۱۸ ۰۷۶۵ ۶۰۷۸";
export const CARD_HOLDER = "مهدی بیگناهی";

/** کوچک‌سازی تصویر برای ذخیره‌ی سبک (حداکثر عرض ۹۰۰ پیکسل) */
export function fileToDataURL(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("فایل تصویر معتبر نیست"));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxW / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(String(reader.result));
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          resolve(String(reader.result));
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

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

/** شمارنده‌ی متحرک با اعداد فارسی */
export function useCountUp(target: number, duration = 1400, plain = false) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(fa(0));
  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(plain ? fa(target) : fa(target.toLocaleString("en-US")));
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      setText(plain ? fa(val) : fa(val.toLocaleString("en-US")));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, plain]);
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

/** تاریخ امروز — شمسی با اعداد فارسی و میلادی به انگلیسی */
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
      const jalali = `${get("weekday")} ${get("day")} ${get("month")} ${get("year")}`;
      const gregory = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);
      return { jalali, gregory };
    } catch {
      return null;
    }
  });
  return d;
}

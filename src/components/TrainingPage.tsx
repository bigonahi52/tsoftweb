import { useCallback, useEffect, useState } from "react";
import { capitalSessions, extraVideos, tisaftSessions } from "../data";
import type { Session } from "../data";
import { aparatEmbed, fa, useRevealAll } from "../lib";
import { Icon } from "./Icons";

type Playing = { title: string; href: string; accent: string } | null;

function PlayerModal({ playing, onClose }: { playing: Playing; onClose: () => void }) {
  const close = useCallback(onClose, [onClose]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing, close]);

  if (!playing) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <button aria-label="بستن" onClick={close} className="absolute inset-0 cursor-default bg-ink-950/85 backdrop-blur-sm" />
      <div className="player-pop relative w-full max-w-4xl overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between gap-4 border-b border-ink-700/70 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: playing.accent }}>
              <Icon name="play" className="h-4 w-4 translate-x-[1px] text-[#ffffff]" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-white">{playing.title}</p>
              <p className="font-latin text-[10px] tracking-[0.2em] text-mist-300">TSOFT ACADEMY · APARAT</p>
            </div>
          </div>
          <button onClick={close} aria-label="بستن" className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-ink-100 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe key={playing.href} src={aparatEmbed(playing.href)} title={playing.title} className="absolute inset-0 h-full w-full" frameBorder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-ink-700/70 px-5 py-3 text-[11px] text-mist-300">
          <span>برای تمام‌صفحه از دکمه‌ی خودِ پخش‌کننده‌ی آپارات استفاده کنید.</span>
          <span className="font-latin tracking-[0.15em]" dir="ltr">16:9 · HD</span>
        </div>
      </div>
    </div>
  );
}

function CourseBlock({ title, subtitle, product, accent, sessions, onPlay }: { title: string; subtitle: string; product: string; accent: string; sessions: Session[]; onPlay: (p: Playing) => void }) {
  return (
    <div className="reveal mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink-100 pb-5">
        <div className="flex items-center gap-4">
          <span className="flex shrink-0 items-center justify-center rounded-2xl px-3.5 py-3 text-white" style={{ background: accent }}>
            <Icon name="play" className="h-6 w-6 translate-x-[1px]" />
          </span>
          <div>
            <h3 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h3>
            <p className="mt-1 text-sm text-mist-500">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full px-4 py-2 text-xs font-bold text-[#ffffff]" style={{ background: accent }}>{fa(sessions.length)} جلسه — {product}</span>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sessions.map((s, i) => (
          <button key={s.n + s.href} onClick={() => onPlay({ title: s.title, href: s.href, accent })} className="reveal card-lift group relative overflow-hidden rounded-2xl border border-ink-100 bg-white text-right" style={{ "--rv-delay": `${(i % 4) * 80}ms` } as React.CSSProperties}>
            <div className="relative flex h-32 items-center justify-center overflow-hidden bg-ink-950">
              <div className="grid-lines grid-lines-fade absolute inset-0 opacity-70" />
              <span className="absolute -left-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-50" style={{ background: accent }} />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-all duration-300 group-hover:scale-110">
                <Icon name="play" className="h-5 w-5 translate-x-[1px] text-white" />
              </span>
              <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-2.5 py-1 font-latin text-[9px] font-bold tracking-widest text-mist-300" dir="ltr">APARAT</span>
            </div>
            <div className="p-4">
              <p className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-[#ffffff]" style={{ background: accent }}>{fa(s.n)}</span>
                <span className="font-display text-lg leading-7 text-ink-900 transition-colors group-hover:text-teal-600">{s.title}</span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExtraCard({ title, href, delay, onPlay }: { title: string; href: string; delay: number; onPlay: (p: Playing) => void }) {
  return (
    <button onClick={() => onPlay({ title, href, accent: "#17B0A6" })} className="reveal group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-[0_20px_44px_-22px_rgba(10,27,33,0.4)]" style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}>
      <span className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-950">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <Icon name="play" className="relative h-5 w-5 translate-x-[1px] text-white transition-transform duration-300 group-hover:scale-125" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg leading-7 text-ink-900 transition-colors group-hover:text-teal-600">{title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-mist-500">
          <Icon name="monitor" className="h-3.5 w-3.5 text-teal-600" />
          پخش داخل سایت
        </span>
      </span>
    </button>
  );
}

const faqs = [
  { q: "آموزش بعد از خرید چگونه است؟", a: "علاوه بر ویدیوهای همین صفحه، یک جلسه آموزش آنلاین رایگان با کارشناس دارید و دفترچه راهنمای فارسی هم همراه نرم‌افزار ارائه می‌شود." },
  { q: "آیا ویدیوها رایگان هستند؟", a: "بله؛ همه‌ی ویدیوها برای همه — مشتری و غیرمشتری — آزاد است." },
  { q: "پشتیبان‌گیری خودکار است؟", a: "در همه محصولات، زمان‌بندی پشتیبان‌گیری خودکار قابل تنظیم است و می‌توانید نسخه‌ها را در فضای ابری یا با ایمیل ذخیره کنید." },
];

export default function TrainingPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [playing, setPlaying] = useState<Playing>(null);
  const totalVideos = tisaftSessions.length + capitalSessions.length + extraVideos.length;

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-gold-500/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-gold-400">TSOFT ACADEMY</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">آموزش، رایگان</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">مثل همیشه</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            روی هر جلسه کلیک کنید تا ویدیو همین‌جا داخل سایت پخش شود. این صفحه برای همه آزاد است.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { k: "ویدیوی آموزشی", v: totalVideos },
              { k: "جلسه‌ی دوره‌ی تیسافت", v: tisaftSessions.length },
              { k: "جلسه‌ی دوره‌ی کپیتال", v: capitalSessions.length },
            ].map((x) => (
              <p key={x.k} className="flex items-baseline gap-2">
                <span className="font-display text-4xl text-white">{fa(x.v)}</span>
                <span className="text-sm text-mist-300">{x.k}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">VIDEO COURSES — APARAT</p>
              <h2 className="reveal mt-3 font-display text-4xl text-ink-900 sm:text-5xl">دوره‌های ویدیویی، جلسه به جلسه</h2>
            </div>
            <p className="reveal max-w-sm text-sm leading-8 text-mist-500">همه ویدیوها در کانال آپارات تیسافت منتشر شده‌اند؛ روی هر جلسه کلیک کنید تا همین‌جا پخش شود.</p>
          </div>

          <CourseBlock title="دوره‌ی کامل حسابداری تیسافت" subtitle="از صفر تا گزارش‌گیری — یازده جلسه‌ی پیوسته" product="تیسافت" accent="#6D28D9" sessions={tisaftSessions} onPlay={setPlaying} />
          <CourseBlock title="دوره‌ی حسابداری چندارزی کپیتال" subtitle="تعریف ارز پایه، نرخ‌دهی روزانه و گزارش‌های ارزی" product="کپیتال" accent="#7C3AED" sessions={capitalSessions} onPlay={setPlaying} />

          <div className="reveal mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink-100 pb-5">
              <div className="flex items-center gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-2xl bg-ink-900 px-3.5 py-3 text-teal-400">
                  <Icon name="cpu" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-3xl text-ink-900 sm:text-4xl">نصب، فعال‌سازی و نکات فنی</h3>
                  <p className="mt-1 text-sm text-mist-500">ویدیوهای کوتاه برای راه‌اندازی بی‌دردسر</p>
                </div>
              </div>
              <span className="rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-teal-400">{fa(extraVideos.length)} ویدیو — مشترک</span>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {extraVideos.map((v, i) => (
                <ExtraCard key={v.href} title={v.title} href={v.href} delay={(i % 3) * 90} onPlay={setPlaying} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.3em] text-teal-600">NEED HELP?</p>
            <h2 className="reveal mt-3 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">آموزش، همراهِ محصول</h2>
            <p className="reveal mt-5 leading-9 text-mist-500">
              هیچ مشتری‌ای را پشت منوها تنها نمی‌گذاریم؛ ویدیوهای آموزشی، دفترچه‌ی فارسی و جلسه‌ی شروعِ کار برای همه‌ی
              محصولات رایگان است — حتی اگر هنوز نخریده باشید.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={f.q} className="faq reveal group rounded-2xl border border-ink-100 bg-white" style={{ "--rv-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-right font-bold text-ink-900 transition-colors hover:text-teal-600">
                  {f.q}
                  <svg viewBox="0 0 24 24" className="faq-chevron h-5 w-5 shrink-0 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="border-t border-ink-50 px-6 py-5 text-sm leading-8 text-mist-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PlayerModal playing={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

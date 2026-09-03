import { useCallback, useEffect, useState } from "react";
import { capitalSessions, extraVideos, tisaftSessions, type Session } from "../data";
import { fa, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const aparatEmbed = (href: string) => {
  const m = href.match(/aparat\.com\/v\/([^/?#]+)/);
  return m ? `https://www.aparat.com/video/video/embed/videohash/${m[1]}/vt/frame` : href;
};

type Playing = { title: string; href: string; accent: string } | null;

function PlayerModal({ playing, onClose }: { playing: Playing; onClose: () => void }) {
  const close = useCallback(onClose, [onClose]);
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
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
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between gap-4 border-b border-ink-700/70 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: playing.accent }}>
              <Icon name="play" className="h-4 w-4 translate-x-[1px] text-ink-950" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg text-white">{playing.title}</p>
              <p className="font-latin text-[10px] tracking-[0.2em] text-mist-300">TSOFT ACADEMY · APARAT</p>
            </div>
          </div>
          <button onClick={close} aria-label="بستن" className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-ink-100 transition-colors hover:border-[#E14B4B] hover:text-[#ff9d94]"><Icon name="close" className="h-4 w-4" /></button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe key={playing.href} src={aparatEmbed(playing.href)} title={playing.title} className="absolute inset-0 h-full w-full" frameBorder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
        <p className="border-t border-ink-700/70 px-5 py-3 text-center text-[11px] text-mist-300">برای تمام‌صفحه از دکمه‌ی خودِ پخش‌کننده‌ی آپارات استفاده کنید · Esc می‌بندد.</p>
      </div>
    </div>
  );
}

function CourseBlock({ title, subtitle, product, accent, sessions, onPlay }: { title: string; subtitle: string; product: string; accent: string; sessions: Session[]; onPlay: (p: Playing) => void }) {
  return (
    <div className="reveal mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink-100 pb-5">
        <div className="flex items-center gap-4">
          <span className="flex shrink-0 items-center justify-center rounded-2xl px-3.5 py-3 text-ink-950" style={{ background: accent }}>
            <Icon name="play" className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h3>
            <p className="mt-1 text-sm text-mist-500">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full px-4 py-2 text-xs font-bold text-ink-950" style={{ background: accent }}>{fa(sessions.length)} جلسه — {product}</span>
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
              <span className="absolute right-3 top-3 rounded-full bg-ink-900/80 px-2.5 py-1 font-latin text-[9px] font-bold tracking-widest text-mist-300" dir="ltr">APARAT</span>
            </div>
            <div className="p-4">
              <p className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-ink-950" style={{ background: accent }}>{fa(s.n)}</span>
                <span className="font-display text-base leading-7 text-ink-900 transition-colors group-hover:text-teal-600">{s.title}</span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TrainingPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [playing, setPlaying] = useState<Playing>(null);
  const total = tisaftSessions.length + capitalSessions.length + extraVideos.length;

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-gold-500/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal eyebrow text-gold-400">TSOFT ACADEMY</p>
          <h1 className="reveal mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">آموزش، رایگان</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">مثل همیشه</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">روی هر جلسه کلیک کنید تا ویدیو همین‌جا داخل سایت پخش شود — این صفحه برای همه آزاد است.</p>
          <div className="reveal mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(total)}</span><span className="text-sm text-mist-300">ویدیوی آموزشی</span></p>
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(tisaftSessions.length)}</span><span className="text-sm text-mist-300">جلسه‌ی تیسافت</span></p>
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(capitalSessions.length)}</span><span className="text-sm text-mist-300">جلسه‌ی کپیتال</span></p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="reveal eyebrow">VIDEO COURSES — APARAT</p>
              <h2 className="reveal mt-3 font-display text-4xl text-ink-900 sm:text-5xl">دوره‌های ویدیویی، جلسه به جلسه</h2>
            </div>
            <p className="reveal max-w-sm text-sm leading-8 text-mist-500">همه ویدیوها در کانال آپارات تیسافت منتشر شده‌اند؛ روی هر جلسه کلیک کنید تا همین‌جا پخش شود.</p>
          </div>

          <CourseBlock title="دوره‌ی کامل حسابداری تیسافت" subtitle="از صفر تا گزارش‌گیری — یازده جلسه‌ی پیوسته" product="تیسافت" accent="#16b87f" sessions={tisaftSessions} onPlay={setPlaying} />
          <CourseBlock title="دوره‌ی حسابداری چندارزی کپیتال" subtitle="تعریف ارز پایه، نرخ‌دهی روزانه و گزارش‌های ارزی" product="کپیتال" accent="#eaa63b" sessions={capitalSessions} onPlay={setPlaying} />

          <div className="reveal mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink-100 pb-5">
              <div className="flex items-center gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-2xl bg-ink-950 px-3.5 py-3 text-teal-400"><Icon name="cpu" className="h-6 w-6" /></span>
                <div>
                  <h3 className="font-display text-3xl text-ink-900 sm:text-4xl">نصب، فعال‌سازی و نکات فنی</h3>
                  <p className="mt-1 text-sm text-mist-500">ویدیوهای کوتاه برای راه‌اندازی بی‌دردسر</p>
                </div>
              </div>
              <span className="rounded-full bg-ink-950 px-4 py-2 text-xs font-bold text-teal-400">{fa(extraVideos.length)} ویدیو — مشترک</span>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {extraVideos.map((v, i) => (
                <button key={v.href} onClick={() => setPlaying({ title: v.title, href: v.href, accent: "#16b87f" })} className="reveal group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-[0_20px_44px_-22px_rgba(12,31,25,0.4)]" style={{ "--rv-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
                  <span className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-950">
                    <div className="grid-lines absolute inset-0 opacity-60" />
                    <Icon name="play" className="relative h-5 w-5 translate-x-[1px] text-white transition-transform duration-300 group-hover:scale-125" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg leading-7 text-ink-900 transition-colors group-hover:text-teal-600">{v.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-mist-500">
                      <Icon name="monitor" className="h-3.5 w-3.5 text-teal-600" />
                      پخش داخل سایت
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PlayerModal playing={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

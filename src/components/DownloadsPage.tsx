import { useMemo, useState } from "react";
import { downloadGroups } from "../data";
import { fa, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const formatColor: Record<string, string> = {
  EXE: "#16b87f", ZIP: "#eaa63b", RAR: "#E14B4B", MSI: "#8B5CF6", TXT: "#5d7a6d", MP4: "#F5820D",
};

export default function DownloadsPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState(downloadGroups[0].id);
  const [query, setQuery] = useState("");

  const groups = useMemo(
    () =>
      downloadGroups.map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => !query.trim() || i.name.toLowerCase().includes(query.trim().toLowerCase()) || i.note.includes(query.trim())
        ),
      })),
    [query]
  );
  const shown = groups.filter((g) => g.id === tab || query.trim());
  const total = downloadGroups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal eyebrow text-teal-400">DOWNLOAD CENTER</p>
          <h1 className="reveal mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">مرکز دانلود</span></span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            نسخه‌ی آزمایشی رایگان، آخرین آپدیت‌ها و ابزارهای پشتیبانی — {fa(total)}+ فایل آماده.
          </p>
          <div className="reveal mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
            <Icon name="search" className="h-5 w-5 shrink-0 text-teal-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جست‌وجوی فایل… (مثلاً AnyDesk یا SQL)" className="w-full bg-transparent text-sm text-white placeholder:text-mist-300 focus:outline-none" />
            {query && <button onClick={() => setQuery("")} aria-label="پاک کردن"><Icon name="close" className="h-4 w-4 text-mist-300" /></button>}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {!query.trim() && (
            <div className="reveal mb-8 flex flex-wrap gap-2">
              {downloadGroups.map((g) => (
                <button key={g.id} onClick={() => setTab(g.id)} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${tab === g.id ? "border-transparent bg-ink-950 text-white shadow-lg" : "border-ink-100 bg-white text-mist-500 hover:border-teal-500/50 hover:text-teal-600"}`}>
                  {g.title}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${tab === g.id ? "bg-teal-500/20 text-teal-400" : "bg-ink-50 text-mist-500"}`}>{fa(g.items.length)}</span>
                </button>
              ))}
            </div>
          )}

          {shown.map((g) => (
            <div key={g.id} className="reveal mb-12">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="font-display text-2xl text-ink-900">{g.title}</h2>
                <p className="text-xs text-mist-500">{g.desc}</p>
              </div>
              {g.items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink-100 bg-white py-10 text-center text-sm text-mist-500">فایلی با این مشخصات پیدا نشد.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((f, i) => (
                    <a key={f.href} href={f.href} className="card-lift group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5" style={{ "--rv-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
                      <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl font-latin text-[10px] font-bold tracking-widest text-white" style={{ background: formatColor[f.format] ?? "#5d7a6d" }}>{f.format}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900 transition-colors group-hover:text-teal-600" dir="ltr" style={{ textAlign: "right" }}>{f.name}</span>
                        <span className="block truncate text-[11px] text-mist-500">{f.note}</span>
                      </span>
                      <Icon name="download" className="h-5 w-5 shrink-0 text-mist-300 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-teal-600" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="reveal mt-6 rounded-2xl border border-gold-500/40 bg-gold-100/50 px-5 py-4 text-sm text-ink-800">
            <b>نکته:</b> فایل‌های چندبخشی (RAR) را کامل دانلود و با WinRAR باز کنید. اگر فایلی را پیدا نکردید، با پشتیبانی تماس بگیرید.
          </div>
        </div>
      </section>
    </div>
  );
}

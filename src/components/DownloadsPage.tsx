import { useState } from "react";
import { downloadGroups } from "../data";
import type { DownloadItem } from "../data";
import { fa, PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const formatColor: Record<string, string> = {
  EXE: "#16b87f", ZIP: "#eaa63b", RAR: "#E14B4B", MSI: "#8B5CF6", TXT: "#5d7a6d", MP4: "#F5820D", APK: "#3d9a50",
};

/* ───────── کارت فایل (فشرده) ───────── */

function FileCard({ item, delay }: { item: DownloadItem; delay: number }) {
  const color = formatColor[item.format] ?? "#5f7a82";
  return (
    <div
      className="reveal group flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-[0_16px_36px_-22px_rgba(10,27,33,0.45)]"
      style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}
    >
      <span
        className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg font-latin text-[10px] font-bold tracking-widest text-[#ffffff]"
        style={{ background: color }}
      >
        {item.format}
      </span>
      <div className="min-w-0 flex-1">
        <a
          href={item.href}
          dir="ltr"
          title={item.name}
          className="block truncate text-right font-display text-[15px] leading-6 text-ink-900 transition-colors hover:text-teal-600"
        >
          {item.name}
        </a>
        <p className="truncate text-[11px] leading-5 text-mist-500">{item.note}</p>
      </div>
      <a
        href={item.href}
        aria-label={`دانلود ${item.name}`}
        title="دانلود فایل"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white transition-all duration-300 hover:bg-teal-600 active:scale-95"
      >
        <Icon name="download" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      </a>
    </div>
  );
}

export default function DownloadsPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const total = downloadGroups.reduce((s, g) => s + g.items.length, 0);
  const q = query.trim().toLowerCase();
  const groups = downloadGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.name.toLowerCase().includes(q) || i.note.includes(query.trim())),
    }))
    .filter((g) => g.items.length > 0 && (tab === "all" || g.id === tab));
  const shown = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-14 pt-14 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">DOWNLOAD CENTER</p>
          <h1 className="mt-4">
            <span className="line-mask">
              <span className="font-display text-6xl leading-none text-white sm:text-7xl">مرکز دانلود</span>
            </span>
          </h1>
          <p className="reveal mt-4 max-w-2xl leading-8 text-mist-300">
            فایل‌های نصب، آپدیت و ابزارهای پشتیبانی تیسافت و کپیتال — همه با لینک مستقیم و رایگان.
          </p>
          <div className="reveal mt-6 flex flex-wrap gap-x-10 gap-y-3">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-white">{fa(total)}</span>
              <span className="text-sm text-mist-300">فایل آماده</span>
            </p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-white">{fa(downloadGroups.length)}</span>
              <span className="text-sm text-mist-300">دسته‌بندی</span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* تب‌ها و جستجو — چسبان */}
          <div className="reveal sticky top-[70px] z-30 mb-8 rounded-2xl border border-ink-100 bg-white/95 p-4 shadow-[0_16px_40px_-24px_rgba(10,27,33,0.35)] backdrop-blur">
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative lg:w-72">
                <Icon name="search" className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جست‌وجوی فایل…"
                  className="w-full rounded-xl border border-ink-100 bg-paper py-2.5 pl-4 pr-11 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setTab("all")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                    tab === "all" ? "bg-ink-950 text-white" : "border border-ink-100 bg-paper text-mist-500 hover:border-teal-500/50 hover:text-teal-600"
                  }`}
                >
                  همه ({fa(total)})
                </button>
                {downloadGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setTab(g.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                      tab === g.id ? "bg-ink-950 text-white" : "border border-ink-100 bg-paper text-mist-500 hover:border-teal-500/50 hover:text-teal-600"
                    }`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* نکته‌ها */}
          <div className="reveal mb-6 flex items-start gap-3 rounded-2xl border border-gold-500/40 bg-gold-100/50 px-5 py-4 text-sm leading-7 text-ink-800">
            <Icon name="spark" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <p>
              <b>نکته:</b> فایل‌های چندبخشی (RAR) را کامل دانلود و با WinRAR باز کنید. اگر فایلی دانلود نشد، با پشتیبانی
              <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number mx-1 font-bold text-teal-600 hover:text-teal-500">
                {PHONE_FA}
              </a>
              تماس بگیرید تا مستقیم برایتان ارسال کنیم.
            </p>
          </div>

          {/* گروه‌ها */}
          {groups.length === 0 && (
            <div className="reveal rounded-2xl border border-dashed border-ink-100 bg-white px-6 py-14 text-center">
              <Icon name="search" className="mx-auto h-8 w-8 text-mist-300" />
              <p className="mt-3 font-display text-xl text-ink-900">فایلی پیدا نشد</p>
              <p className="mt-1 text-sm text-mist-500">عبارت دیگری را جست‌وجو کنید یا دسته‌ی «همه» را انتخاب کنید.</p>
            </div>
          )}

          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.id} className="reveal">
                <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-ink-100 pb-3">
                  <div>
                    <h2 className="font-display text-2xl text-ink-900">{g.title}</h2>
                    <p className="mt-0.5 text-xs text-mist-500">{g.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-ink-50 px-3 py-1 text-[11px] font-bold text-mist-500">{fa(g.items.length)} فایل</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {g.items.map((it, i) => (
                    <FileCard key={it.name + it.href} item={it} delay={(i % 6) * 55} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {query.trim() && shown > 0 && (
            <p className="reveal mt-8 text-center text-xs text-mist-500">
              {fa(shown)} فایل برای «{query.trim()}» پیدا شد.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { downloadGroups } from "../data";
import { fa, PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const formatColor: Record<string, string> = {
  EXE: "#17B0A6", ZIP: "#E5A93D", RAR: "#E14B4B", MSI: "#8B5CF6", TXT: "#5f7a82", MP4: "#F5820D",
};

function DownloadRow({ name, note, href, format, delay }: { name: string; note: string; href: string; format: string; delay: number }) {
  const color = formatColor[format] ?? "#5f7a82";

  return (
    <div className="reveal group flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-[0_20px_44px_-24px_rgba(10,27,33,0.4)] sm:flex-row sm:items-center" style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}>
      <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl font-latin text-[10px] font-bold tracking-widest text-[#ffffff]" style={{ background: color }}>{format}</span>
      <div className="min-w-0 flex-1">
        <a href={href} className="block truncate font-display text-lg text-ink-900 transition-colors hover:text-teal-600" title={name} dir="ltr" style={{ textAlign: "right" }}>{name}</a>
        <p className="mt-0.5 truncate text-xs text-mist-500">{note}</p>
      </div>
      <a
        href={href}
        className="btn-shine group/dl flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-teal-600"
      >
        <Icon name="download" className="h-4 w-4 transition-transform duration-300 group-hover/dl:translate-y-0.5" />
        دانلود فایل
      </a>
    </div>
  );
}

export default function DownloadsPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const total = downloadGroups.reduce((s, g) => s + g.items.length, 0);
  const groups = downloadGroups.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.name.toLowerCase().includes(query.trim().toLowerCase()) || i.note.includes(query.trim())),
  })).filter((g) => g.items.length > 0 && (tab === "all" || g.id === tab));
  const shown = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">DOWNLOAD CENTER</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">مرکز دانلود</span></span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            فایل‌های نصب، آپدیت و ابزارهای پشتیبانی تیسافت و کپیتال — همه با لینک مستقیم و رایگان.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(total)}</span><span className="text-sm text-mist-300">فایل آماده</span></p>
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(downloadGroups.length)}</span><span className="text-sm text-mist-300">دسته‌بندی</span></p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="reveal mb-4 flex items-center gap-3 rounded-2xl border border-gold-500/40 bg-gold-100/50 px-5 py-4 text-sm text-ink-800">
            <Icon name="spark" className="h-5 w-5 shrink-0 text-gold-600" />
            <p>
              <b>نکته:</b> فایل‌های چندبخشی (RAR) را کامل دانلود و با WinRAR باز کنید. اگر فایلی دانلود نشد، با پشتیبانی
              <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number mx-1 font-bold text-teal-600 hover:text-teal-500">{PHONE_FA}</a>
              تماس بگیرید تا مستقیم برایتان ارسال کنیم.
            </p>
          </div>
          <div className="reveal mb-8 flex items-center gap-3 rounded-2xl border border-teal-500/40 bg-teal-100/50 px-5 py-4 text-sm text-ink-800" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <Icon name="headset" className="h-5 w-5 shrink-0 text-teal-600" />
            <p><b>همراه هر خرید:</b> یک سال پشتیبانی کامل رایگان — تلفنی و ریموت، مستقیم از خود توسعه‌دهنده؛ ۹ تا ۱۴ و ۱۷ تا ۲۲، روزهای تعطیل هم به‌صورت اضطراری.</p>
          </div>

          <div className="reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Icon name="search" className="absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-mist-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جست‌وجوی فایل…"
                className="w-full rounded-xl border border-ink-100 bg-white py-3 pl-4 pr-11 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[{ id: "all", title: "همه" }, ...downloadGroups].map((g) => (
                <button key={g.id} onClick={() => setTab(g.id)} className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${tab === g.id ? "bg-ink-950 text-white" : "border border-ink-100 bg-white text-mist-500 hover:border-teal-500/50 hover:text-teal-600"}`}>
                  {g.title}
                </button>
              ))}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="reveal rounded-3xl border border-dashed border-ink-100 bg-white py-20 text-center">
              <Icon name="search" className="mx-auto h-10 w-10 text-mist-300" />
              <p className="mt-4 font-display text-2xl text-ink-900">فایلی پیدا نشد</p>
              <p className="mt-2 text-sm text-mist-500">عبارت دیگری جست‌وجو کنید یا با پشتیبانی تماس بگیرید.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {groups.map((g) => (
                <div key={g.id}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-teal-400"><Icon name={g.icon} className="h-5 w-5" /></span>
                      <div>
                        <h2 className="font-display text-2xl text-ink-900">{g.title}</h2>
                        <p className="text-xs text-mist-500">{g.desc}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-bold text-mist-500">{fa(g.items.length)} فایل</span>
                  </div>
                  <div className="space-y-3">
                    {g.items.map((it, i) => (
                      <DownloadRow key={it.href + it.name} {...it} delay={(i % 4) * 70} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="reveal mt-10 text-center text-xs text-mist-500">
            نمایش {fa(shown)} فایل از {fa(total)} — اگر فایل را نمی‌بینید، روی اسم آن کلیک‌راست و «Save link as» را بزنید.
          </p>
        </div>
      </section>
    </div>
  );
}

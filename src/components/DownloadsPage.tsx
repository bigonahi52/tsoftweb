import { useMemo, useRef, useState } from "react";
import { downloadGroups } from "../data";
import type { DownloadItem } from "../data";
import { fa, useRevealAll } from "../lib";
import { Icon } from "./Icons";

function DownloadRow({ item }: { item: DownloadItem }) {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const timer = useRef<number | null>(null);

  const startDownload = () => {
    if (state !== "idle") return;
    setState("working");
    /* دانلود با آیفریم مخفی — بدون جابه‌جایی صفحه */
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.src = item.href;
    document.body.appendChild(frame);
    window.setTimeout(() => frame.remove(), 8000);
    /* پشتیبان: باز شدن در تب جدید */
    window.setTimeout(() => window.open(item.href, "_blank", "noopener"), 1200);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("done"), 1600);
    window.setTimeout(() => setState("idle"), 6000);
  };

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/60 hover:shadow-[0_18px_40px_-24px_rgba(10,27,33,0.4)] sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 font-latin text-[10px] font-bold tracking-widest text-ink-800 transition-colors duration-300 group-hover:bg-teal-500 group-hover:text-ink-950">
        {item.format}
      </span>
      <div className="min-w-0 flex-1">
        <a href={item.href} download target="_blank" rel="noopener noreferrer" className="block truncate font-display text-lg text-ink-900 transition-colors hover:text-teal-600">
          {item.name}
        </a>
        <p className="mt-0.5 truncate text-xs text-mist-500">{item.note}</p>
      </div>
      <button
        onClick={startDownload}
        className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
          state === "done"
            ? "bg-teal-500 text-ink-950"
            : "bg-ink-950 text-white hover:bg-teal-600"
        }`}
      >
        <Icon name={state === "done" ? "check" : "download"} className="h-4 w-4" />
        {state === "working" ? "در حال دانلود…" : state === "done" ? "دانلود شروع شد" : "دانلود فایل"}
      </button>
    </div>
  );
}

export default function DownloadsPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const total = downloadGroups.reduce((s, g) => s + g.items.length, 0);

  const groups = useMemo(
    () =>
      downloadGroups
        .filter((g) => tab === "all" || g.id === tab)
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (i) =>
              i.name.includes(query.trim()) ||
              i.note.includes(query.trim()) ||
              i.format.includes(query.trim().toUpperCase())
          ),
        }))
        .filter((g) => g.items.length > 0),
    [tab, query]
  );

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">DOWNLOAD CENTER</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">مرکز دانلود</span></span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            همه‌ی فایل‌های نصب، به‌روزرسانی و ابزارهای موردنیاز — یک‌جا. نسخه‌ی آزمایشی همه محصولات رایگان است.
          </p>
          <p className="reveal mt-4 inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-xs font-medium text-teal-300">
            <Icon name="box" className="h-3.5 w-3.5" />
            {fa(total)} فایل آماده دانلود
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="reveal mb-4 flex items-center gap-3 rounded-2xl border border-gold-500/40 bg-gold-100/50 px-5 py-4 text-sm text-ink-800">
            <Icon name="spark" className="h-5 w-5 shrink-0 text-gold-600" />
            <p>فایل‌های چندبخشی (RAR) را کامل دانلود و با WinRAR باز کنید. اگر فایلی بالا نیامد، با پشتیبانی تماس بگیرید.</p>
          </div>

          <div className="reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-mist-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جست‌وجوی فایل…"
                className="w-full rounded-xl border border-ink-100 bg-white py-3.5 pl-4 pr-11 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[{ id: "all", title: "همه" }, ...downloadGroups.map((g) => ({ id: g.id, title: g.title.split(" ").slice(0, 2).join(" ") }))].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                    tab === t.id ? "bg-ink-950 text-white" : "border border-ink-100 bg-white text-mist-500 hover:border-teal-500/60 hover:text-teal-600"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="reveal rounded-3xl border border-dashed border-ink-100 bg-white py-20 text-center">
              <Icon name="search" className="mx-auto h-10 w-10 text-mist-300" />
              <p className="mt-4 font-display text-2xl text-ink-900">فایلی پیدا نشد</p>
              <p className="mt-2 text-sm text-mist-500">عبارت دیگری را امتحان کنید.</p>
            </div>
          ) : (
            groups.map((g) => (
              <div key={g.id} className="reveal mb-10">
                <div className="mb-4 flex items-center gap-3 border-b-2 border-ink-100 pb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-teal-400">
                    <Icon name={g.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl text-ink-900">{g.title}</h2>
                    <p className="text-xs text-mist-500">{g.desc} — {fa(g.items.length)} فایل</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {g.items.map((it) => (
                    <DownloadRow key={it.href + it.name} item={it} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

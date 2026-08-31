import { useEffect, useMemo, useRef, useState } from "react";
import { capitalChapters, type ChapterBlock } from "../data/capitalChapters";
import { fa, prefersReducedMotion } from "../lib";
import { Icon } from "./Icons";

const LS_READ = "tsoft_cap_read_v1";
const LS_CHECK = "tsoft_cap_check_v1";

/* ── ذخیره‌سازی سبک ── */
function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveJson(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

/* ─────────────── رندر بلوک‌های محتوا ─────────────── */

function InteractiveChecklist({ id, items }: { id: string; items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => loadJson(`${LS_CHECK}:${id}`, items.map(() => false)));
  useEffect(() => saveJson(`${LS_CHECK}:${id}`, checked), [checked, id]);
  const done = checked.filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-teal-500/30 bg-teal-500/[0.05] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
          <Icon name="check" className="h-4 w-4 text-teal-600" />
          چک‌لیست تعاملی
        </p>
        <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-bold text-teal-600" dir="ltr">
          {fa(done)} / {fa(items.length)}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => {
          const on = checked[i];
          return (
            <li key={it}>
              <button
                onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-right text-sm transition-all duration-300 ${
                  on ? "border-teal-500/60 bg-white text-ink-900 shadow-[0_6px_18px_-10px_rgba(14,159,110,0.4)]" : "border-ink-100 bg-white/60 text-mist-500 hover:border-teal-500/40"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${on ? "border-teal-500 bg-teal-500 text-white" : "border-ink-300 bg-white"}`}>
                  {on && <Icon name="check" className="h-3 w-3" />}
                </span>
                <span className={on ? "line-through decoration-teal-500/50" : ""}>{it}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BlockView({ b }: { b: ChapterBlock }) {
  switch (b.t) {
    case "p":
      return <p className="text-[15px] leading-9 text-mist-500">{b.text}</p>;

    case "note":
      return (
        <div className="flex gap-3.5 rounded-2xl border-r-4 border-gold-500 bg-gold-500/[0.08] p-5">
          <Icon name="spark" className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
          <p className="text-sm leading-8 text-ink-800">{b.text}</p>
        </div>
      );

    case "warn":
      return (
        <div className="flex gap-3.5 rounded-2xl border-r-4 border-[#e14b4b] bg-[#e14b4b]/[0.06] p-5">
          <Icon name="bell" className="mt-1 h-5 w-5 shrink-0 text-[#e14b4b]" />
          <p className="text-sm leading-8 text-ink-800">{b.text}</p>
        </div>
      );

    case "list":
      return (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {b.items.map((it) => (
            <li key={it} className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-800 transition-colors hover:border-teal-500/50">
              <Icon name="check" className="h-4 w-4 shrink-0 text-teal-600" />
              {it}
            </li>
          ))}
        </ul>
      );

    case "fields":
      return (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
          <p className="border-b border-ink-100 bg-ink-50/70 px-5 py-3.5 text-sm font-bold text-ink-900">{b.title}</p>
          <div className="grid sm:grid-cols-2">
            {b.items.map((it, i) => (
              <p key={it} className="flex items-center gap-3 border-b border-ink-50 px-5 py-3.5 text-sm text-mist-500">
                <span className="font-latin text-[11px] font-bold text-teal-600" dir="ltr">{String(i + 1).padStart(2, "0")}</span>
                {it}
              </p>
            ))}
          </div>
        </div>
      );

    case "example":
      return (
        <div className="overflow-hidden rounded-2xl bg-ink-950">
          <p className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5 text-xs font-bold text-gold-400">
            <Icon name="coins" className="h-4 w-4" />
            {b.title}
          </p>
          <div className="space-y-2 px-5 py-5">
            {b.lines.map((l) => (
              <p key={l} className={`font-latin text-sm leading-7 ${l.startsWith("→") ? "text-teal-400" : "text-ink-100"}`} dir="ltr" style={{ textAlign: "left" }}>
                {l}
              </p>
            ))}
          </div>
        </div>
      );

    case "checklist":
      return <InteractiveChecklist id={b.id} items={b.items} />;

    case "flow":
      return (
        <div className="flex flex-col items-stretch">
          {b.steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center">
              <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-teal-500/35 bg-teal-500/[0.07] px-5 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">{fa(i + 1)}</span>
                <p className="text-sm font-medium text-ink-900">{s}</p>
              </div>
              {i < b.steps.length - 1 && <Icon name="arrow" className="my-1 h-4 w-4 rotate-90 text-teal-500/70" />}
            </div>
          ))}
        </div>
      );

    case "golden":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {b.items.map((g) => (
            <div key={g.n} className="card-pro relative overflow-hidden rounded-2xl bg-white p-6">
              <span className="absolute -left-3 -top-5 font-display text-[72px] leading-none text-gold-500/15">{g.n}</span>
              <p className="relative font-display text-xl text-ink-900">{g.title}</p>
              <p className="relative mt-2 text-sm leading-7 text-mist-500">{g.desc}</p>
            </div>
          ))}
        </div>
      );
  }
}

/* ─────────────── کامپوننت اصلی ─────────────── */

export default function CapitalAcademy() {
  const [active, setActive] = useState(capitalChapters[0].id);
  const [read, setRead] = useState<string[]>(() => loadJson(LS_READ, []));
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const chapter = capitalChapters.find((c) => c.id === active) ?? capitalChapters[0];

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return capitalChapters;
    return capitalChapters.filter((c) => c.title.includes(q) || c.intro.includes(q) || c.blocks.some((b) => ("text" in b ? b.text.includes(q) : false)));
  }, [query]);

  /* علامت‌گذاری فصل به‌عنوان خوانده‌شده هنگام باز شدن */
  useEffect(() => {
    setRead((r) => (r.includes(active) ? r : [...r, active]));
  }, [active]);
  useEffect(() => saveJson(LS_READ, read), [read]);

  const select = (id: string) => {
    setActive(id);
    if (!prefersReducedMotion()) {
      contentRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  const progress = Math.round((read.length / capitalChapters.length) * 100);
  const idx = capitalChapters.findIndex((c) => c.id === chapter.id);
  const prev = capitalChapters[idx - 1];
  const next = capitalChapters[idx + 1];

  return (
    <section id="capital-academy" className="scroll-mt-24 border-t border-ink-100 bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* سربرگ بخش */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">CAPITAL ACADEMY · {fa(17)} CHAPTERS</p>
            <h2 className="reveal mt-4">
              <span className="line-mask"><span className="font-display text-4xl leading-tight text-ink-900 sm:text-5xl">راهنمای جامع آموزش</span></span>
              <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
                <span className="font-display text-4xl leading-tight text-gold-600 sm:text-5xl"> نرم‌افزار Capital</span>
              </span>
            </h2>
            <p className="reveal mt-4 max-w-2xl text-sm leading-8 text-mist-500" style={{ "--rv-delay": "200ms" } as React.CSSProperties}>
              از منطق ارز و معرفی کالا تا فاکتور، صندوق و گزارش‌ها — مرحله‌به‌مرحله با مثال‌های عملی. چک‌لیست‌ها تعاملی‌اند و پیشرفت مطالعه‌ی شما ذخیره می‌شود.
            </p>
          </div>
          {/* پیشرفت مطالعه */}
          <div className="reveal w-full max-w-[260px] rounded-2xl border border-ink-100 bg-white p-5" style={{ "--rv-delay": "260ms" } as React.CSSProperties}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-ink-900">پیشرفت مطالعه</p>
              <span className="font-latin text-sm font-bold text-teal-600" dir="ltr">{fa(progress)}٪</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gold-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2.5 text-[11px] text-mist-500">{fa(read.length)} از {fa(capitalChapters.length)} فصل خوانده شد</p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
          {/* ── سایدبار فصل‌ها ── */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو در فصل‌ها…"
                className="w-full rounded-xl border border-ink-100 bg-white py-3 pl-4 pr-11 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/10"
              />
            </div>

            <nav className="mt-4 max-h-[560px] space-y-1 overflow-y-auto pl-1 lg:max-h-[62vh]">
              {filtered.map((c) => {
                const isActive = c.id === active;
                const isRead = read.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => select(c.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-right transition-all duration-300 ${
                      isActive ? "border-gold-500/60 bg-gold-500/[0.09] shadow-[0_10px_26px_-16px_rgba(234,166,59,0.5)]" : "border-transparent hover:border-ink-100 hover:bg-white"
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300 ${isActive ? "bg-gold-500 text-ink-950" : "bg-ink-100/70 text-mist-500 group-hover:bg-teal-500/15 group-hover:text-teal-600"}`}>
                      {fa(c.n)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-bold transition-colors ${isActive ? "text-ink-900" : "text-mist-500 group-hover:text-ink-900"}`}>{c.title}</span>
                      <span className="block truncate text-[11px] text-mist-300">{c.intro}</span>
                    </span>
                    {isRead && !isActive && <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-teal-600" />}
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="px-3 py-6 text-center text-xs text-mist-300">فصلی با این عبارت پیدا نشد.</p>}
            </nav>
          </aside>

          {/* ── محتوای فصل ── */}
          <div ref={contentRef} className="scroll-mt-28 min-w-0">
            <article key={chapter.id} className="reveal is-in">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-gold-400 shadow-[0_16px_36px_-16px_rgba(12,31,25,0.55)]">
                  <Icon name={chapter.icon} className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-latin text-[10px] font-bold tracking-[0.3em] text-teal-600" dir="ltr">CHAPTER {String(chapter.n).padStart(2, "0")}</p>
                  <h3 className="font-display text-3xl text-ink-900 sm:text-4xl">{chapter.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-gold-600">{chapter.intro}</p>

              <div className="mt-8 space-y-6">
                {chapter.blocks.map((b, i) => (
                  <BlockView key={chapter.id + i} b={b} />
                ))}
              </div>

              {/* ناوبری فصل‌ها */}
              <div className="mt-12 flex items-center justify-between gap-4 border-t border-ink-100 pt-7">
                {prev ? (
                  <button onClick={() => select(prev.id)} className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-white px-5 py-3.5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-[0_14px_30px_-18px_rgba(14,159,110,0.45)]">
                    <Icon name="arrow" className="h-4 w-4 -rotate-90 text-mist-300 transition-transform group-hover:-translate-y-0.5 group-hover:text-teal-600" />
                    <span>
                      <span className="block text-[10px] text-mist-300">فصل قبل</span>
                      <span className="block text-sm font-bold text-ink-900">{prev.title}</span>
                    </span>
                  </button>
                ) : <span />}
                {next ? (
                  <button onClick={() => select(next.id)} className="group flex items-center gap-3 rounded-xl bg-ink-950 px-5 py-3.5 text-left text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-[0_16px_34px_-16px_rgba(14,159,110,0.55)]">
                    <span>
                      <span className="block text-[10px] text-mist-300">فصل بعد</span>
                      <span className="block text-sm font-bold">{next.title}</span>
                    </span>
                    <Icon name="arrow" className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-0.5" />
                  </button>
                ) : (
                  <span className="rounded-xl bg-gold-500/[0.12] px-5 py-3.5 text-sm font-bold text-gold-600">پایان دوره — آفرین! 🎓</span>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { downloadGroups } from "../data";
import type { DownloadGroup, DownloadItem } from "../data";
import { fa, PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

const ADMIN_PASS = "tsoft20";

const formatColor: Record<string, string> = {
  EXE: "#17B0A6", ZIP: "#E5A93D", RAR: "#E14B4B", MSI: "#8B5CF6", TXT: "#5f7a82", MP4: "#F5820D", APK: "#3d9a50",
};
const FORMATS = ["EXE", "ZIP", "RAR", "MSI", "TXT", "MP4", "APK"];

/* ───────── لایه‌ی ذخیره‌ی تغییرات مدیر (localStorage) ───────── */

const K_CUSTOM = "tsoft_dl_custom_groups";
const K_REMOVED_G = "tsoft_dl_removed_groups";
const K_ADDED = "tsoft_dl_added_items";
const K_REMOVED_I = "tsoft_dl_removed_items";

function read<T>(k: string, f: T): T {
  try {
    const r = localStorage.getItem(k);
    return r ? (JSON.parse(r) as T) : f;
  } catch {
    return f;
  }
}
function write(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

type AddedItem = { group: string; item: DownloadItem & { _key: string } };

function useDownloadStore() {
  const [customGroups, setCustomGroups] = useState<DownloadGroup[]>(() => read(K_CUSTOM, []));
  const [removedGroups, setRemovedGroups] = useState<string[]>(() => read(K_REMOVED_G, []));
  const [addedItems, setAddedItems] = useState<AddedItem[]>(() => read(K_ADDED, []));
  const [removedItems, setRemovedItems] = useState<string[]>(() => read(K_REMOVED_I, []));

  useEffect(() => write(K_CUSTOM, customGroups), [customGroups]);
  useEffect(() => write(K_REMOVED_G, removedGroups), [removedGroups]);
  useEffect(() => write(K_ADDED, addedItems), [addedItems]);
  useEffect(() => write(K_REMOVED_I, removedItems), [removedItems]);

  const groups = useMemo<DownloadGroup[]>(() => {
    const base = downloadGroups
      .filter((g) => !removedGroups.includes(g.id))
      .map((g) => {
        const own = g.items.filter((i) => !removedItems.includes(`${g.id}::${i.name}`));
        const extra = addedItems.filter((a) => a.group === g.id).map((a) => a.item);
        return { ...g, items: [...own, ...extra] };
      })
      .filter((g) => g.items.length > 0);
    const custom = customGroups
      .filter((g) => !removedGroups.includes(g.id))
      .map((g) => ({ ...g, items: [...g.items, ...addedItems.filter((a) => a.group === g.id).map((a) => a.item)] }));
    return [...base, ...custom];
  }, [customGroups, removedGroups, addedItems, removedItems]);

  return {
    groups,
    addItem: (group: string, item: DownloadItem) =>
      setAddedItems((p) => [...p, { group, item: { ...item, _key: `${Date.now()}` } }]),
    removeItem: (group: string, name: string) =>
      setRemovedItems((p) => [...p, `${group}::${name}`]),
    addGroup: (title: string, desc: string) =>
      setCustomGroups((p) => [...p, { id: `custom-${Date.now()}`, title, desc, items: [] }]),
    removeGroup: (id: string) => setRemovedGroups((p) => [...p, id]),
    isCustom: (id: string) => customGroups.some((g) => g.id === id),
  };
}

/* ───────── کارت فایل (فشرده) ───────── */

function FileCard({ group, item, admin, onRemove, delay }: { group: string; item: DownloadItem; admin: boolean; onRemove: () => void; delay: number }) {
  const color = formatColor[item.format] ?? "#5f7a82";
  return (
    <div
      className="reveal group relative flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-[0_16px_36px_-22px_rgba(10,27,33,0.45)]"
      style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}
    >
      <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg font-latin text-[10px] font-bold tracking-widest text-[#ffffff]" style={{ background: color }}>
        {item.format}
      </span>
      <div className="min-w-0 flex-1">
        <a href={item.href} dir="ltr" title={item.name} className="block truncate text-right font-display text-[15px] leading-6 text-ink-900 transition-colors hover:text-teal-600">
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
      {admin && (
        <button
          onClick={() => {
            if (window.confirm(`فایل «${item.name}» حذف شود؟`)) onRemove();
          }}
          aria-label="حذف فایل"
          title="حذف فایل"
          className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#E14B4B]/40 bg-white text-[#E14B4B] shadow-sm transition-all hover:bg-[#E14B4B] hover:text-white"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ───────── مودال‌ها ───────── */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="بستن" onClick={onClose} className="absolute inset-0 cursor-default bg-ink-950/80 backdrop-blur-sm" />
      <div className="player-pop relative w-full max-w-md overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_50px_110px_-30px_rgba(10,27,33,0.6)]">
        <div className="flex items-center justify-between border-b border-ink-50 bg-paper px-6 py-4">
          <p className="font-display text-xl text-ink-900">{title}</p>
          <button onClick={onClose} aria-label="بستن" className="flex h-8 w-8 items-center justify-center rounded-lg text-mist-500 transition-colors hover:bg-ink-50 hover:text-[#E14B4B]">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

function AddFileModal({ groups, onClose, onSave }: { groups: DownloadGroup[]; onClose: () => void; onSave: (g: string, i: DownloadItem) => void }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [href, setHref] = useState("");
  const [format, setFormat] = useState("EXE");
  const [group, setGroup] = useState(groups[0]?.id ?? "");
  const [err, setErr] = useState("");

  const save = () => {
    if (!name.trim() || !href.trim()) {
      setErr("نام فایل و لینک دانلود الزامی است");
      return;
    }
    onSave(group, { name: name.trim(), note: note.trim() || "—", href: href.trim(), format });
    onClose();
  };

  return (
    <Modal title="افزودن فایل جدید" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">نام فایل *</span>
          <input dir="ltr" value={name} onChange={(e) => setName(e.target.value)} placeholder="TsoftUpdate 1405-06-15.exe" className={inputCls + " text-left"} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">توضیح کوتاه</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً: آخرین آپدیت تیسافت" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">لینک دانلود *</span>
          <input dir="ltr" value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://dl.tsoft20.ir/Download/..." className={inputCls + " text-left"} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-900">نوع فایل</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className={inputCls}>
              {FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink-900">دسته</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className={inputCls}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </label>
        </div>
        {err && <p className="ticker-in rounded-lg bg-[#E14B4B]/10 px-4 py-2.5 text-xs font-bold text-[#E14B4B]">{err}</p>}
        <button onClick={save} className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500">
          <Icon name="plus" className="h-4 w-4" />
          ذخیره فایل
        </button>
      </div>
    </Modal>
  );
}

function AddGroupModal({ onClose, onSave }: { onClose: () => void; onSave: (t: string, d: string) => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");
  const save = () => {
    if (!title.trim()) {
      setErr("عنوان دسته الزامی است");
      return;
    }
    onSave(title.trim(), desc.trim() || "فایل‌های این دسته");
    onClose();
  };
  return (
    <Modal title="افزودن دسته‌ی جدید" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">عنوان دسته *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: درایورهای چاپگر" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">توضیح</span>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="توضیح کوتاهی برای این دسته" className={inputCls} />
        </label>
        {err && <p className="ticker-in rounded-lg bg-[#E14B4B]/10 px-4 py-2.5 text-xs font-bold text-[#E14B4B]">{err}</p>}
        <button onClick={save} className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500">
          <Icon name="plus" className="h-4 w-4" />
          ساخت دسته
        </button>
      </div>
    </Modal>
  );
}

function PassModal({ onClose, onOk }: { onClose: () => void; onOk: () => void }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) onOk();
    else setErr(true);
  };
  return (
    <Modal title="ورود به پنل مدیریت" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-xs leading-6 text-mist-500">برای افزودن و حذف فایل‌ها و دسته‌ها، رمز مدیریت را وارد کنید.</p>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-ink-900">رمز عبور</span>
          <div className="relative">
            <Icon name="lock" className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-300" />
            <input
              type="password"
              autoFocus
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setErr(false);
              }}
              placeholder="••••••••"
              className={inputCls + " pr-11"}
            />
          </div>
        </label>
        {err && <p className="ticker-in rounded-lg bg-[#E14B4B]/10 px-4 py-2.5 text-xs font-bold text-[#E14B4B]">رمز اشتباه است — دوباره تلاش کنید</p>}
        <button type="submit" className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-600">
          <Icon name="gear" className="h-4 w-4" />
          ورود
        </button>
      </form>
    </Modal>
  );
}

/* ───────── صفحه ───────── */

export default function DownloadsPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const store = useDownloadStore();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState<"pass" | "file" | "group" | null>(null);

  const q = query.trim().toLowerCase();
  const groups = store.groups.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.name.toLowerCase().includes(q) || i.note.includes(query.trim())),
  })).filter((g) => (tab === "all" || g.id === tab));
  const visible = groups.filter((g) => g.items.length > 0);
  const total = store.groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div ref={ref} className="bg-paper">
      {/* سرصفحه‌ی فشرده */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[320px] w-[320px] rounded-full bg-teal-600/15 blur-[110px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
          <div>
            <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">DOWNLOAD CENTER</p>
            <h1 className="mt-3">
              <span className="line-mask"><span className="font-display text-5xl leading-none text-white sm:text-6xl">مرکز دانلود</span></span>
            </h1>
            <p className="reveal mt-4 max-w-xl text-sm leading-8 text-mist-300">
              فایل‌های نصب، آپدیت و ابزارهای پشتیبانی تیسافت و کپیتال — با لینک مستقیم و رایگان.
            </p>
          </div>
          <div className="reveal flex items-center gap-8">
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(total)}</span><span className="text-xs text-mist-300">فایل</span></p>
            <p className="flex items-baseline gap-2"><span className="font-display text-4xl text-white">{fa(store.groups.length)}</span><span className="text-xs text-mist-300">دسته</span></p>
          </div>
        </div>
      </section>

      {/* نوار ابزار چسبان: جستجو + تب‌ها + مدیریت */}
      <div className="sticky top-[70px] z-40 border-b border-ink-100 bg-paper/95 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 sm:px-6">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Icon name="search" className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی فایل…"
              className="w-full rounded-xl border border-ink-100 bg-white py-2.5 pl-4 pr-10 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <button
              onClick={() => setTab("all")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${tab === "all" ? "bg-ink-950 text-white shadow-md" : "bg-white text-mist-500 hover:text-teal-600"}`}
            >
              همه <span className="font-latin">{fa(total)}</span>
            </button>
            {store.groups.map((g) => (
              <button
                key={g.id}
                onClick={() => setTab(g.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${tab === g.id ? "bg-ink-950 text-white shadow-md" : "bg-white text-mist-500 hover:text-teal-600"}`}
              >
                {g.title}
              </button>
            ))}
          </div>
          <button
            onClick={() => (admin ? setAdmin(false) : setModal("pass"))}
            title={admin ? "خروج از حالت مدیریت" : "پنل مدیریت"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
              admin
                ? "border-gold-500 bg-gold-500 text-ink-950 shadow-[0_8px_20px_-8px_rgba(229,169,61,0.7)]"
                : "border-ink-100 bg-white text-mist-500 hover:border-teal-500/60 hover:text-teal-600"
            }`}
          >
            <Icon name="gear" className={`h-4.5 w-4.5 ${admin ? "" : "transition-transform duration-500 hover:rotate-90"}`} />
          </button>
        </div>
      </div>

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* نوار راهنمای فشرده */}
          <div className="reveal mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-ink-100 bg-white px-5 py-3.5 text-xs text-mist-500">
            <span className="flex items-center gap-2"><Icon name="spark" className="h-4 w-4 text-gold-600" /> فایل‌های چندبخشی (RAR) را با WinRAR باز کنید</span>
            <span className="hidden h-4 w-px bg-ink-100 sm:block" aria-hidden />
            <span className="flex items-center gap-2">
              <Icon name="headset" className="h-4 w-4 text-teal-600" />
              همراه هر خرید، یک سال پشتیبانی رایگان —
              <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number font-bold text-teal-600 hover:text-teal-500">{PHONE_FA}</a>
            </span>
          </div>

          {/* نوار مدیریت */}
          {admin && (
            <div className="ticker-in mb-8 flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-gold-500/60 bg-gold-100/40 px-5 py-4">
              <span className="flex items-center gap-2 font-display text-lg text-ink-900">
                <Icon name="gear" className="h-5 w-5 text-gold-600" />
                حالت مدیریت فعال است
              </span>
              <span className="hidden text-xs text-mist-500 sm:inline">— با دکمه‌ی قرمز روی هر کارت، فایل حذف می‌شود</span>
              <div className="mr-auto flex items-center gap-2.5">
                <button onClick={() => setModal("group")} className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-600">
                  <Icon name="plus" className="h-3.5 w-3.5" />
                  دسته‌ی جدید
                </button>
                <button onClick={() => setAdmin(false)} className="rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-xs font-bold text-mist-500 transition-colors hover:border-[#E14B4B]/50 hover:text-[#E14B4B]">
                  خروج از مدیریت
                </button>
              </div>
            </div>
          )}

          {/* گروه‌ها */}
          {visible.length === 0 && (
            <div className="reveal rounded-2xl border border-dashed border-ink-100 bg-white py-16 text-center">
              <Icon name="search" className="mx-auto h-10 w-10 text-mist-300" />
              <p className="mt-4 font-display text-2xl text-ink-900">چیزی پیدا نشد</p>
              <p className="mt-1 text-sm text-mist-500">عبارت دیگری جستجو کنید یا تب «همه» را بزنید.</p>
            </div>
          )}

          <div className="space-y-10">
            {visible.map((g) => (
              <div key={g.id}>
                <div className="mb-4 flex flex-wrap items-center gap-3 border-b-2 border-ink-100 pb-3">
                  <h2 className="font-display text-2xl text-ink-900">{g.title}</h2>
                  <span className="rounded-full bg-ink-50 px-3 py-1 text-[11px] font-bold text-mist-500">{fa(g.items.length)} فایل</span>
                  <p className="hidden text-xs text-mist-500 md:block">— {g.desc}</p>
                  {admin && (
                    <div className="mr-auto flex items-center gap-2">
                      <button onClick={() => setModal("file")} className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[11px] font-bold text-white transition-colors hover:bg-teal-500">
                        <Icon name="plus" className="h-3.5 w-3.5" />
                        فایل جدید
                      </button>
                      {store.isCustom(g.id) && (
                        <button
                          onClick={() => {
                            if (window.confirm(`دسته‌ی «${g.title}» و همه‌ی فایل‌هایش حذف شود؟`)) store.removeGroup(g.id);
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-[#E14B4B]/40 px-3.5 py-2 text-[11px] font-bold text-[#E14B4B] transition-colors hover:bg-[#E14B4B] hover:text-white"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                          حذف دسته
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((it, i) => (
                    <FileCard
                      key={g.id + "::" + it.name}
                      group={g.id}
                      item={it}
                      admin={admin}
                      onRemove={() => store.removeItem(g.id, it.name)}
                      delay={(i % 3) * 70}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!admin && (
            <p className="reveal mt-12 text-center text-[11px] text-mist-300">
              فایل جدیدی لازم دارید؟ با پشتیبانی تماس بگیرید — معمولاً همان روز اضافه می‌شود.
            </p>
          )}
        </div>
      </section>

      {/* مودال‌ها */}
      {modal === "pass" && (
        <PassModal
          onClose={() => setModal(null)}
          onOk={() => {
            setAdmin(true);
            setModal(null);
          }}
        />
      )}
      {modal === "file" && <AddFileModal groups={store.groups} onClose={() => setModal(null)} onSave={store.addItem} />}
      {modal === "group" && <AddGroupModal onClose={() => setModal(null)} onSave={store.addGroup} />}
    </div>
  );
}

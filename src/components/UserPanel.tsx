import { useEffect, useRef, useState } from "react";
import {
  changePassword,
  getFilesFor,
  getInvoicesFor,
  getMessages,
  markRead,
  sendMessage,
  useStoreTick,
} from "../store";
import type { Invoice } from "../store";
import { fa, faDate, faTime, money, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { currentUser, logout } from "../store";
import { Icon } from "./Icons";
import InvoiceSheet from "./InvoiceSheet";

export default function UserPanel({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  useStoreTick();
  const user = currentUser();
  const [draft, setDraft] = useState("");
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [pw, setPw] = useState({ p1: "", p2: "" });
  const [pwMsg, setPwMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = user ? getMessages(user.id) : [];
  const files = user ? getFilesFor(user.id) : [];
  const invoices = user ? getInvoicesFor(user.id) : [];

  useEffect(() => {
    if (user) markRead(user.id, "user");
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length]);

  if (!user) {
    nav({ page: "login" });
    return null;
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    sendMessage(user.id, "user", t);
  };

  const submitPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.p1.length < 4) return setPwMsg("رمز جدید باید حداقل ۴ حرف باشد");
    if (pw.p1 !== pw.p2) return setPwMsg("دو رمز با هم یکی نیستند");
    changePassword(user.id, pw.p1);
    setPw({ p1: "", p2: "" });
    setPwMsg("رمز عبور تغییر کرد ✓");
  };

  return (
    <div ref={ref} className="bg-paper">
      {/* سربرگ */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute -right-24 top-0 h-[320px] w-[320px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/15 font-display text-3xl text-teal-400">
              {user.firstName.slice(0, 1)}
            </span>
            <div>
              <p className="font-latin text-[10px] tracking-[0.3em] text-teal-400">MY PANEL</p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                سلام، {user.firstName} {user.lastName}!
              </h1>
            </div>
          </div>
          <button
            onClick={() => { logout(); nav({ page: "home" }); }}
            className="flex items-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-bold text-ink-100 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]"
          >
            <Icon name="logout" className="h-4 w-4" />
            خروج از حساب
          </button>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* گفتگو با پشتیبانی */}
          <div className="reveal overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-[0_30px_70px_-45px_rgba(10,27,33,0.45)]">
            <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
              <p className="flex items-center gap-2.5 font-display text-xl text-ink-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600"><Icon name="headset" className="h-4.5 w-4.5" /></span>
                گفتگو با پشتیبانی
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1.5 text-[11px] font-bold text-teal-600">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" />
                پاسخ‌های ما همین‌جا می‌آید
              </span>
            </div>

            <div className="relative h-[380px] overflow-y-auto bg-ink-950 px-5 py-5">
              <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
              <div className="relative flex flex-col gap-3">
                {msgs.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-400"><Icon name="chat" className="h-7 w-7" /></span>
                    <p className="font-display text-lg text-white">هنوز پیامی نفرستاده‌اید</p>
                    <p className="max-w-[240px] text-xs leading-6 text-mist-300">سوال، مشکل فنی یا درخواست دمو — بنویسید؛ پاسخ همین‌جا می‌آید.</p>
                  </div>
                )}
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${m.from === "user" ? "rounded-tr-sm bg-teal-600 text-white" : "rounded-tl-sm bg-ink-800 text-ink-100"}`}>
                      {m.auto && <p className="mb-1 text-[10px] font-bold text-gold-400">پاسخ خودکار دستیار</p>}
                      <p>{m.text}</p>
                      <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-teal-400/60" : "text-mist-300/50"}`}>{faTime(m.time)}</p>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-ink-100 bg-paper p-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="پیام‌تان را بنویسید…"
                className="min-w-0 flex-1 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-mist-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
              <button type="submit" disabled={!draft.trim()} aria-label="ارسال" className="btn-shine flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-40">
                <Icon name="send" className="h-4.5 w-4.5 -scale-x-100" />
              </button>
            </form>
          </div>

          {/* ستون کناری */}
          <div className="space-y-6">
            {/* فاکتورها */}
            <div className="reveal rounded-3xl border border-ink-100 bg-white p-6" style={{ "--rv-delay": "90ms" } as React.CSSProperties}>
              <p className="flex items-center gap-2.5 font-display text-xl text-ink-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600"><Icon name="invoice" className="h-4.5 w-4.5" /></span>
                فاکتورهای من
                <span className="mr-auto rounded-full bg-ink-50 px-3 py-1 text-xs font-bold text-mist-500">{fa(invoices.length)}</span>
              </p>
              <div className="mt-4 space-y-3">
                {invoices.length === 0 && <p className="rounded-xl bg-paper px-4 py-4 text-center text-xs text-mist-500">هنوز فاکتوری برای شما صادر نشده است.</p>}
                {invoices.map((inv) => (
                  <button key={inv.id} onClick={() => setViewInv(inv)} className="card-lift flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-paper p-4 text-right">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${inv.status === "paid" ? "bg-teal-500/15 text-teal-600" : "bg-gold-500/15 text-gold-600"}`}>
                      <Icon name={inv.status === "paid" ? "check" : "clock"} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-900">{inv.kind === "sale" ? "فاکتور فروش نرم‌افزار" : "فاکتور خدمات پشتیبانی"}</span>
                      <span className="mt-0.5 block text-[11px] text-mist-500">{inv.no} · {faDate(inv.time)}</span>
                    </span>
                    <span className="shrink-0 font-latin text-sm font-bold text-ink-900" dir="ltr">{money(invoiceSum(inv))}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* فایل‌های دریافتی */}
            <div className="reveal rounded-3xl border border-ink-100 bg-white p-6" style={{ "--rv-delay": "180ms" } as React.CSSProperties}>
              <p className="flex items-center gap-2.5 font-display text-xl text-ink-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600"><Icon name="file" className="h-4.5 w-4.5" /></span>
                فایل‌های ارسالی تیسافت
                <span className="mr-auto rounded-full bg-ink-50 px-3 py-1 text-xs font-bold text-mist-500">{fa(files.length)}</span>
              </p>
              <div className="mt-4 space-y-3">
                {files.length === 0 && <p className="rounded-xl bg-paper px-4 py-4 text-center text-xs text-mist-500">فایلی برایتان ارسال نشده است.</p>}
                {files.map((f) => (
                  <a key={f.id} href={f.href} target="_blank" rel="noopener noreferrer" className="card-lift flex items-center gap-3 rounded-2xl border border-ink-100 bg-paper p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-teal-400"><Icon name="download" className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-900">{f.name}</span>
                      <span className="mt-0.5 block text-[11px] text-mist-500">{faDate(f.time)}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* حساب کاربری */}
            <div className="reveal rounded-3xl border border-ink-100 bg-white p-6" style={{ "--rv-delay": "270ms" } as React.CSSProperties}>
              <p className="flex items-center gap-2.5 font-display text-xl text-ink-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-950 text-teal-400"><Icon name="lock" className="h-4.5 w-4.5" /></span>
                حساب کاربری
              </p>
              <div className="mt-4 space-y-2.5 rounded-2xl bg-paper p-4 text-sm">
                <p className="flex justify-between"><span className="text-mist-500">نام و نام خانوادگی</span><b className="text-ink-900">{user.firstName} {user.lastName}</b></p>
                <p className="flex justify-between"><span className="text-mist-500">شماره تماس</span><b className="font-latin text-ink-900" dir="ltr">{user.phone}</b></p>
              </div>
              <form onSubmit={submitPw} className="mt-4 space-y-3">
                <input type="password" value={pw.p1} onChange={(e) => setPw({ ...pw, p1: e.target.value })} placeholder="رمز عبور جدید" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                <input type="password" value={pw.p2} onChange={(e) => setPw({ ...pw, p2: e.target.value })} placeholder="تکرار رمز جدید" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                {pwMsg && <p className="ticker-in text-xs font-bold text-teal-600">{pwMsg}</p>}
                <button type="submit" className="w-full rounded-xl bg-ink-950 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-600">تغییر رمز عبور</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {viewInv && <InvoiceSheet inv={viewInv} onClose={() => setViewInv(null)} />}
    </div>
  );
}

function invoiceSum(inv: Invoice): number {
  return inv.items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
}

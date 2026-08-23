import { useEffect, useRef, useState } from "react";
import {
  changePassword,
  closeTicket,
  conversations,
  createInvoice,
  customerUsers,
  getInvoices,
  getMessages,
  getTickets,
  getUserById,
  invoiceTotal,
  markRead,
  openTicketsCount,
  replyTicket,
  sendFileToUser,
  sendMessage,
  setInvoicePayUrl,
  setInvoiceStatus,
  totalUnread,
  useStoreTick,
} from "../store";
import type { Invoice, InvoiceItem, Ticket } from "../store";
import { currentUser, logout } from "../store";
import { fa, faDate, faTime, money, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";
import InvoiceSheet from "./InvoiceSheet";

export default function AdminPanel({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  useStoreTick();
  const me = currentUser();

  const [tab, setTab] = useState<"chats" | "tickets" | "invoices">("chats");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [fileModal, setFileModal] = useState(false);
  const [invModal, setInvModal] = useState(false);
  const [payFor, setPayFor] = useState<Invoice | null>(null);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [viewTick, setViewTick] = useState<Ticket | null>(null);
  const [tickReply, setTickReply] = useState("");
  const [tickFilter, setTickFilter] = useState<"all" | "open" | "answered" | "closed">("all");
  const endRef = useRef<HTMLDivElement>(null);

  const convs = conversations();
  const users = customerUsers();
  const invoices = getInvoices();
  const tickets = getTickets().filter((t) => tickFilter === "all" || t.status === tickFilter);
  const unread = totalUnread();
  const openTix = openTicketsCount();
  const paidSum = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + invoiceTotal(i), 0);
  const active = activeId ? getUserById(activeId) : null;
  const msgs = activeId ? getMessages(activeId) : [];

  useEffect(() => {
    if (activeId) markRead(activeId, "admin");
  });
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs.length, activeId]);

  if (!me || me.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper px-4">
        <div className="reveal max-w-md rounded-3xl border border-ink-100 bg-white p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5695e]/10 text-[#c0443a]"><Icon name="lock" className="h-8 w-8" /></span>
          <h1 className="mt-5 font-display text-3xl text-ink-900">دسترسی فقط برای مدیر</h1>
          <p className="mt-3 text-sm leading-8 text-mist-500">این بخش مخصوص مدیر سایت است. با حساب مدیر وارد شوید.</p>
          <button onClick={() => nav({ page: "login" })} className="btn-shine mt-6 rounded-xl bg-ink-950 px-8 py-3.5 font-bold text-white transition-colors hover:bg-teal-600">
            صفحه‌ی ورود
          </button>
        </div>
      </div>
    );
  }

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    const t = reply.trim();
    if (!t || !activeId) return;
    setReply("");
    sendMessage(activeId, "admin", t);
  };

  const stats = [
    { icon: "users", label: "کاربران", value: fa(users.length) },
    { icon: "chat", label: "پیام نخوانده", value: fa(unread), gold: unread > 0 },
    { icon: "headset", label: "تیکت باز", value: fa(openTix), gold: openTix > 0 },
    { icon: "invoice", label: "فاکتورها", value: fa(invoices.length) },
    { icon: "coins", label: "مجموع پرداخت‌شده", value: money(paidSum) + " ریال" },
  ];

  return (
    <div ref={ref} className="bg-paper">
      {/* سربرگ */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-12 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute -left-24 top-0 h-[320px] w-[320px] rounded-full bg-gold-500/12 blur-[120px]" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400"><Icon name="shield" className="h-8 w-8" /></span>
            <div>
              <p className="font-latin text-[10px] tracking-[0.3em] text-gold-400">ADMIN PANEL</p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">پنل مدیریت تیسافت</h1>
            </div>
          </div>
          <button onClick={() => { logout(); nav({ page: "home" }); }} className="flex items-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-bold text-ink-100 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]">
            <Icon name="logout" className="h-4 w-4" />
            خروج
          </button>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* آمار */}
          <div className="reveal grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className="card-lift rounded-2xl border border-ink-100 bg-white p-5" style={{ "--rv-delay": `${i * 80}ms` } as React.CSSProperties}>
                <p className="flex items-center gap-2 text-xs font-bold text-mist-500">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.gold ? "bg-gold-500/15 text-gold-600" : "bg-teal-500/12 text-teal-600"}`}><Icon name={s.icon} className="h-4 w-4" /></span>
                  {s.label}
                </p>
                <p className={`mt-3 font-display text-2xl leading-7 sm:text-3xl ${s.gold ? "text-gold-600" : "text-ink-900"}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* تب‌ها */}
          <div className="reveal mt-8 flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-ink-100 bg-white p-1.5">
              {[
                { id: "chats" as const, label: `گفتگوها${unread ? ` (${fa(unread)} جدید)` : ""}` },
                { id: "invoices" as const, label: "فاکتورها" },
              ].map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${tab === t.id ? "bg-ink-950 text-white shadow" : "text-mist-500 hover:text-teal-600"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            {tab === "invoices" && (
              <button onClick={() => setInvModal(true)} className="btn-shine mr-auto flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-ink-950 transition-colors hover:bg-teal-400">
                <Icon name="plus" className="h-4 w-4" />
                صدور فاکتور جدید
              </button>
            )}
          </div>

          {tab === "chats" ? (
            <div className="reveal mt-6 grid items-start gap-6 lg:grid-cols-[0.9fr_1.35fr]">
              {/* فهرست گفتگوها */}
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
                <p className="border-b border-ink-100 px-5 py-4 font-display text-lg text-ink-900">مشتری‌هایی که پیام گذاشته‌اند</p>
                <div className="max-h-[540px] overflow-y-auto">
                  {convs.length === 0 && <p className="px-5 py-10 text-center text-sm text-mist-500">هنوز پیامی از مشتریان نیامده است.</p>}
                  {convs.map((c) => (
                    <button key={c.user.id} onClick={() => setActiveId(c.user.id)} className={`flex w-full items-center gap-3.5 border-b border-ink-50 px-5 py-4 text-right transition-colors ${activeId === c.user.id ? "bg-teal-500/8" : "hover:bg-paper"}`}>
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 font-display text-lg text-teal-400">
                        {c.user.firstName.slice(0, 1)}
                        {c.unread > 0 && <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-ink-950">{fa(c.unread)}</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900">{c.user.firstName} {c.user.lastName}</span>
                        <span className="block truncate text-[11px] text-mist-500">{c.last?.text}</span>
                      </span>
                      <span className="shrink-0 text-[10px] text-mist-300">{c.last ? faTime(c.last.time) : ""}</span>
                    </button>
                  ))}
                  {/* کاربران بدون پیام */}
                  {users.filter((u) => !convs.some((c) => c.user.id === u.id)).map((u) => (
                    <div key={u.id} className="flex items-center gap-3.5 border-b border-ink-50 px-5 py-4 opacity-70">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 font-display text-lg text-mist-500">{u.firstName.slice(0, 1)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink-900">{u.firstName} {u.lastName}</span>
                        <span className="block text-[11px] text-mist-300">هنوز پیامی نفرستاده</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* گفتگوی فعال */}
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
                {!active ? (
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 text-teal-600"><Icon name="chat" className="h-8 w-8" /></span>
                    <p className="font-display text-2xl text-ink-900">یک گفتگو را انتخاب کنید</p>
                    <p className="max-w-xs text-sm leading-7 text-mist-500">مشخصات کامل مشتری (نام و شماره) بالای هر گفتگو نمایش داده می‌شود.</p>
                  </div>
                ) : (
                  <>
                    {/* مشخصات مشتری */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 bg-paper px-5 py-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 font-display text-lg text-teal-400">{active.firstName.slice(0, 1)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink-900">{active.firstName} {active.lastName}</p>
                        <p className="font-latin text-xs text-mist-500" dir="ltr">{active.phone}</p>
                      </div>
                      <button onClick={() => { setFileModal(true); }} className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-[11px] font-bold text-ink-800 transition-colors hover:border-teal-500 hover:text-teal-600">
                        <Icon name="file" className="h-3.5 w-3.5" />
                        ارسال فایل
                      </button>
                      <button onClick={() => setInvModal(true)} className="flex items-center gap-1.5 rounded-lg border border-ink-100 bg-white px-3 py-2 text-[11px] font-bold text-ink-800 transition-colors hover:border-gold-500 hover:text-gold-600">
                        <Icon name="invoice" className="h-3.5 w-3.5" />
                        صدور فاکتور
                      </button>
                    </div>

                    <div className="relative h-[400px] overflow-y-auto bg-ink-950 px-5 py-5">
                      <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
                      <div className="relative flex flex-col gap-3">
                        {msgs.map((m) => (
                          <div key={m.id} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${m.from === "user" ? "rounded-tr-sm bg-teal-600 text-white" : "rounded-tl-sm bg-ink-800 text-ink-100"}`}>
                              {m.auto && <p className="mb-1 text-[10px] font-bold text-gold-400">پاسخ خودکار دستیار</p>}
                              <p>{m.text}</p>
                              <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-teal-400/60" : "text-mist-300/50"}`}>{faDate(m.time)} — {faTime(m.time)}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={endRef} />
                      </div>
                    </div>

                    <form onSubmit={sendReply} className="flex items-center gap-2 border-t border-ink-100 bg-paper p-4">
                      <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`پاسخ به ${active.firstName}…`} className="min-w-0 flex-1 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
                      <button type="submit" disabled={!reply.trim()} className="btn-shine flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-teal-400 transition-colors hover:bg-teal-600 hover:text-white disabled:opacity-40">
                        <Icon name="send" className="h-4.5 w-4.5 -scale-x-100" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* جدول فاکتورها */
            <div className="reveal mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink-100 text-right text-xs text-mist-500">
                      <th className="px-6 py-4 font-bold">شماره</th>
                      <th className="px-4 py-4 font-bold">مشتری</th>
                      <th className="px-4 py-4 font-bold">نوع</th>
                      <th className="px-4 py-4 font-bold">تاریخ</th>
                      <th className="px-4 py-4 font-bold">مبلغ (ریال)</th>
                      <th className="px-4 py-4 font-bold">وضعیت</th>
                      <th className="px-4 py-4 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-mist-500">هنوز فاکتوری صادر نکرده‌اید.</td></tr>
                    )}
                    {invoices.map((inv) => {
                      const cu = getUserById(inv.userId);
                      return (
                        <tr key={inv.id} className="border-b border-ink-50 transition-colors hover:bg-paper/70">
                          <td className="px-6 py-4 font-latin font-bold text-ink-900" dir="ltr">{inv.no}</td>
                          <td className="px-4 py-4 font-bold text-ink-900">{cu ? `${cu.firstName} ${cu.lastName}` : "—"}</td>
                          <td className="px-4 py-4 text-mist-500">{inv.kind === "sale" ? "فروش نرم‌افزار" : "خدمات پشتیبانی"}</td>
                          <td className="px-4 py-4 text-mist-500">{faDate(inv.time)}</td>
                          <td className="px-4 py-4 font-latin font-bold" dir="ltr">{money(invoiceTotal(inv))}</td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setInvoiceStatus(inv.id, inv.status === "paid" ? "issued" : "paid")}
                              className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors ${inv.status === "paid" ? "bg-teal-500/15 text-teal-600 hover:bg-teal-500/25" : "bg-gold-500/15 text-gold-600 hover:bg-gold-500/25"}`}
                              title="برای تغییر وضعیت کلیک کنید"
                            >
                              {inv.status === "paid" ? "پرداخت شده" : "در انتظار پرداخت"}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <button onClick={() => setViewInv(inv)} className="link-underline text-xs font-bold text-teal-600">مشاهده و چاپ</button>
                              <button
                                onClick={() => setPayFor(inv)}
                                className={`link-underline flex items-center gap-1 text-xs font-bold ${inv.payUrl ? "text-teal-600" : "text-gold-600"}`}
                                title={inv.payUrl ? "ویرایش لینک پرداخت" : "افزودن لینک پرداخت"}
                              >
                                <Icon name="link" className="h-3.5 w-3.5" />
                                {inv.payUrl ? "لینک پرداخت ✓" : "لینک پرداخت"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تنظیمات مدیر */}
          <div className="reveal mt-10 rounded-3xl border border-ink-100 bg-white p-6 sm:p-8">
            <p className="flex items-center gap-2.5 font-display text-xl text-ink-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-950 text-teal-400"><Icon name="lock" className="h-4.5 w-4.5" /></span>
              تغییر رمز عبور مدیر
            </p>
            <AdminPasswordForm userId={me.id} />
          </div>
        </div>
      </section>

      {fileModal && <FileModal userId={activeId} onClose={() => setFileModal(false)} />}
      {invModal && <InvoiceModal defaultUserId={activeId} onClose={() => setInvModal(false)} />}
      {viewInv && <InvoiceSheet inv={viewInv} onClose={() => setViewInv(null)} />}
    </div>
  );
}

/* ── فرم تغییر رمز مدیر ── */
function AdminPasswordForm({ userId }: { userId: string }) {
  const [pw, setPw] = useState({ p1: "", p2: "" });
  const [msg, setMsg] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.p1.length < 4) return setMsg("رمز جدید باید حداقل ۴ حرف باشد");
    if (pw.p1 !== pw.p2) return setMsg("دو رمز با هم یکی نیستند");
    changePassword(userId, pw.p1);
    setPw({ p1: "", p2: "" });
    setMsg("رمز عبور مدیر تغییر کرد ✓");
  };
  return (
    <form onSubmit={submit} className="mt-4 flex max-w-2xl flex-col gap-3 sm:flex-row">
      <input type="password" value={pw.p1} onChange={(e) => setPw({ ...pw, p1: e.target.value })} placeholder="رمز جدید" className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
      <input type="password" value={pw.p2} onChange={(e) => setPw({ ...pw, p2: e.target.value })} placeholder="تکرار رمز جدید" className="flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
      <button type="submit" className="rounded-xl bg-ink-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-600">تغییر رمز</button>
      {msg && <p className="ticker-in w-full text-xs font-bold text-teal-600 sm:self-center">{msg}</p>}
    </form>
  );
}

/* ── مودال ارسال فایل ── */
function FileModal({ userId, onClose }: { userId: string | null; onClose: () => void }) {
  const users = customerUsers();
  const [target, setTarget] = useState(userId ?? users[0]?.id ?? "");
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const [err, setErr] = useState("");

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2.5 * 1024 * 1024) {
      setErr("حجم فایل بیشتر از ۲.۵ مگابایت است — فایل‌های بزرگ را روی هاست آپلود و لینکش را بگذارید.");
      return;
    }
    setErr("");
    setName(f.name);
    const r = new FileReader();
    r.onload = () => setHref(String(r.result));
    r.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return setErr("گیرنده را انتخاب کنید");
    const res = sendFileToUser(target, name, href);
    if (!res.ok) return setErr(res.error ?? "خطا");
    sendMessage(target, "admin", `فایل «${name || "ارسالی"}» برایتان ارسال شد — از بخش فایل‌های پنل‌تان دانلود کنید.`);
    onClose();
  };

  return (
    <Modal title="ارسال فایل به مشتری" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-900">گیرنده</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none">
            {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.phone}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-900">نام فایل</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: آپدیت تیسافت ۱۴۰۵" className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-100 bg-paper px-4 py-4 text-sm font-bold text-mist-500 transition-colors hover:border-teal-500 hover:text-teal-600">
            <Icon name="file" className="h-5 w-5" />
            {name ? "تغییر فایل" : "انتخاب فایل (تا ۲.۵MB)"}
            <input type="file" onChange={onPick} className="hidden" />
          </label>
          <input value={href.startsWith("data:") ? "" : href} onChange={(e) => setHref(e.target.value)} placeholder="یا لینک فایل (https://…)" className="rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" dir="ltr" style={{ textAlign: "right" }} />
        </div>
        {err && <p className="ticker-in text-xs font-bold text-[#c0443a]">{err}</p>}
        <button type="submit" className="btn-shine w-full rounded-xl bg-teal-500 py-3.5 font-bold text-ink-950 transition-colors hover:bg-teal-400">ارسال فایل</button>
      </form>
    </Modal>
  );
}

/* ── مودال صدور فاکتور ── */
function InvoiceModal({ defaultUserId, onClose }: { defaultUserId: string | null; onClose: () => void }) {
  const users = customerUsers();
  const [target, setTarget] = useState(defaultUserId ?? users[0]?.id ?? "");
  const [kind, setKind] = useState<"sale" | "support">("sale");
  const [items, setItems] = useState<InvoiceItem[]>([{ title: "", amount: 0 }]);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const setItem = (i: number, k: "title" | "amount", v: string) => {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, [k]: k === "amount" ? Number(v) || 0 : v } : it)));
  };
  const total = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return setErr("مشتری را انتخاب کنید");
    const valid = items.filter((it) => it.title.trim() && it.amount > 0);
    if (valid.length === 0) return setErr("حداقل یک قلم با مبلغ معتبر وارد کنید");
    createInvoice(target, kind, valid, note.trim() || undefined);
    onClose();
  };

  return (
    <Modal title="صدور فاکتور جدید" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-900">مشتری</span>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:outline-none">
              {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.phone}</option>)}
            </select>
          </label>
          <div>
            <span className="mb-2 block text-sm font-bold text-ink-900">نوع فاکتور</span>
            <div className="flex rounded-xl border border-ink-100 bg-paper p-1">
              {[
                { id: "sale" as const, label: "فروش نرم‌افزار" },
                { id: "support" as const, label: "خدمات پشتیبانی" },
              ].map((k) => (
                <button type="button" key={k.id} onClick={() => setKind(k.id)} className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${kind === k.id ? "bg-ink-950 text-white" : "text-mist-500"}`}>
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-ink-900">اقلام فاکتور</span>
          <div className="space-y-2.5">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={it.title} onChange={(e) => setItem(i, "title", e.target.value)} placeholder={`قلم ${fa(i + 1)} — مثلاً: لایسنس ماژول طلایی`} className="min-w-0 flex-1 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" />
                <input value={it.amount || ""} onChange={(e) => setItem(i, "amount", e.target.value.replace(/[^\d]/g, ""))} placeholder="مبلغ (ریال)" className="w-36 rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" dir="ltr" style={{ textAlign: "right" }} />
                <button type="button" onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))} disabled={items.length === 1} aria-label="حذف قلم" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ink-100 text-mist-500 transition-colors hover:border-[#e5695e] hover:text-[#c0443a] disabled:opacity-30">
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => setItems((arr) => [...arr, { title: "", amount: 0 }])} className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-500">
              <Icon name="plus" className="h-4 w-4" />
              افزودن قلم
            </button>
            <p className="text-sm text-mist-500">جمع کل: <b className="font-latin text-ink-900" dir="ltr">{money(total)}</b> ریال</p>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-900">توضیحات (اختیاری)</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="مثلاً: شامل یک سال پشتیبانی رایگان" className="w-full resize-none rounded-xl border border-ink-100 bg-paper px-4 py-3 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" />
        </label>

        {err && <p className="ticker-in text-xs font-bold text-[#c0443a]">{err}</p>}
        <button type="submit" className="btn-shine w-full rounded-xl bg-gold-500 py-3.5 font-bold text-ink-950 transition-colors hover:bg-gold-400">صدور فاکتور</button>
      </form>
    </Modal>
  );
}

/* ── قاب مودال ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="بستن" onClick={onClose} className="absolute inset-0 cursor-default bg-ink-950/85 backdrop-blur-sm" />
      <div className="player-pop relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-ink-700/70 bg-white p-7 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl text-ink-900">{title}</h3>
          <button onClick={onClose} aria-label="بستن" className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 text-mist-500 transition-colors hover:border-[#e5695e] hover:text-[#c0443a]">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

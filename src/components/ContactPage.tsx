import { useState } from "react";
import { api, ApiError } from "../api";
import { messengers } from "../data";
import { fa, PHONE_FA, PHONE_TEL, useRevealAll } from "../lib";
import { Icon } from "./Icons";

export default function ContactPage() {
  const ref = useRevealAll<HTMLDivElement>();
  const [form, setForm] = useState({ name: "", phone: "", business: "", product: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await api.contact(form);
      setSent(true);
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : "خطا در ارسال پیام");
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal eyebrow text-teal-400">GET IN TOUCH</p>
          <h1 className="reveal mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">حرف‌تان را بزنید؛</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">گوش می‌دهیم</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            سوال درباره محصولات، استعلام قیمت، درخواست دمو یا همکاری — فرم را پر کنید یا مستقیم تماس بگیرید؛ معمولاً همان روز پاسخ می‌دهیم.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal rounded-3xl border border-ink-100 bg-white p-8 sm:p-10">
            {sent ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                <span className="seal-pulse flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-ink-950"><Icon name="check" className="h-10 w-10" /></span>
                <h2 className="mt-6 font-display text-4xl text-ink-900">رسید!</h2>
                <p className="mt-3 max-w-sm leading-8 text-mist-500">
                  {form.name ? `${form.name} عزیز، ` : ""}پیام شما با موفقیت ارسال شد. در اولین ساعت کاری با شما تماس می‌گیریم.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", phone: "", business: "", product: "", message: "" }); }} className="link-underline mt-8 text-sm font-bold text-teal-600">ارسال پیام دیگر</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2 className="font-display text-3xl text-ink-900">فرم تماس</h2>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نام و نام خانوادگی *</span>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: علی رضایی" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">شماره تماس</span>
                    <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0915 ..." className={inputCls + " text-left"} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نوع کسب‌وکار</span>
                    <input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="فروشگاه، بازرگانی…" className={inputCls} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-ink-900">محصول موردنظر</span>
                    <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className={inputCls}>
                      <option value="">هنوز مطمئن نیستم — راهنمایی می‌خواهم</option>
                      <option>تیسافت — حسابداری فروشگاهی</option>
                      <option>کپیتال — حسابداری چندارزی</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-bold text-ink-900">پیام شما *</span>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="چند خط درباره نیازتان بنویسید…" className={inputCls + " resize-none"} />
                  </label>
                </div>
                {err && <p className="mt-4 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-sm font-bold text-[#E14B4B]">{err}</p>}
                <button type="submit" disabled={busy} className="btn-shine group mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink-950 py-4 text-base font-bold text-white transition-colors hover:bg-teal-600 disabled:opacity-60">
                  {busy ? "در حال ارسال…" : "ارسال پیام"}
                  <Icon name="send" className="h-4 w-4 -scale-x-100 transition-transform group-hover:-translate-x-1" />
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <div className="reveal card-lift flex gap-5 rounded-3xl border border-ink-100 bg-white p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-teal-400"><Icon name="phone" className="h-6 w-6" /></span>
              <div>
                <p className="font-display text-xl text-ink-900">تلفن پشتیبانی و فروش</p>
                <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number mt-1.5 inline-block text-3xl text-teal-600 transition-colors hover:text-teal-500">{PHONE_FA}</a>
                <p className="mt-1.5 text-sm text-mist-500">شنبه تا پنجشنبه — {fa(9)} تا {fa(14)} و {fa(17)} تا {fa(22)} · تعطیلات: اضطراری</p>
              </div>
            </div>

            <div className="reveal card-lift flex gap-5 rounded-3xl border border-ink-100 bg-white p-6" style={{ "--rv-delay": "90ms" } as React.CSSProperties}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-teal-400"><Icon name="mail" className="h-6 w-6" /></span>
              <div>
                <p className="font-display text-xl text-ink-900">ایمیل</p>
                <p className="mt-1.5 text-sm text-mist-500"><span className="font-latin">info@tsoft20.ir</span> — <span className="font-latin">sales@tsoft20.ir</span></p>
              </div>
            </div>

            <div className="reveal card-lift flex gap-5 rounded-3xl border border-ink-100 bg-white p-6" style={{ "--rv-delay": "180ms" } as React.CSSProperties}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-gold-400"><Icon name="chat" className="h-6 w-6" /></span>
              <div>
                <p className="font-display text-xl text-ink-900">در پیام‌رسان‌ها هم هستیم</p>
                <p className="mt-1.5 text-sm leading-7 text-mist-500">
                  با شماره‌ی <a href={`tel:${PHONE_TEL}`} dir="ltr" className="phone-number text-teal-600">{PHONE_FA}</a> در همه‌ی این پیام‌رسان‌ها در دسترسیم؛ پیام بفرستید، معمولاً همان روز پاسخ می‌دهیم.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {messengers.map((m) => (
                    <span key={m.name} className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-paper px-3.5 py-1.5 text-xs font-medium text-ink-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal relative overflow-hidden rounded-3xl border border-ink-100 bg-ink-950 p-6" style={{ "--rv-delay": "270ms" } as React.CSSProperties}>
              <div className="grid-lines grid-lines-fade absolute inset-0" />
              <p className="relative font-latin text-[10px] tracking-[0.3em] text-teal-400">WHAT YOU GET</p>
              <p className="relative mt-1 font-display text-xl text-white">با هر خرید، همراه‌تان هستیم</p>
              <ul className="relative mt-4 space-y-3">
                {["یک سال پشتیبانی کامل رایگان — تلفنی و با اتصال امن", "فعال‌سازی با پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری", "نسخه‌ی تک‌کاربره یا تحت شبکه، بسته به نیاز شما", "بکاپ در فضای ابری یا ارسال خودکار با ایمیل"].map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-sm leading-7 text-mist-300">
                    <Icon name="check" className="mt-1.5 h-4 w-4 shrink-0 text-gold-400" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

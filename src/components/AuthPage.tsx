import { useState } from "react";
import { api, ApiError, type PubUser } from "../api";
import { useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

type Tab = "login" | "register" | "forgot";

export default function AuthPage({ tab: initial, onAuth, nav }: { tab: Tab; onAuth: (u: PubUser, token: string) => void; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<Tab>(initial);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", code: "", newPass: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");
  const [showPass, setShowPass] = useState(false);

  const inputCls = "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

  const switchTab = (t: Tab) => {
    setTab(t);
    setErr("");
    setNotice("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setNotice("");
    try {
      if (tab === "register") {
        const d = await api.register({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email || undefined, password: form.password });
        onAuth(d.user, d.token);
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      } else if (tab === "login") {
        const d = await api.login({ phone: form.phone, password: form.password });
        onAuth(d.user, d.token);
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      } else if (tab === "forgot") {
        if (!form.code) {
          const d = await api.forgot(form.phone);
          setNotice(d.demoCode ? `کد بازیابی شما: ${d.demoCode} (در نسخه‌ی ابری به ایمیل‌تان ارسال می‌شود)` : "کد بازیابی ارسال شد");
          setForm({ ...form, code: " " });
        } else {
          await api.reset({ phone: form.phone, code: form.code.trim(), newPass: form.newPass });
          setNotice("رمز عبور با موفقیت تغییر کرد — حالا وارد شوید");
          switchTab("login");
        }
      }
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : "خطایی رخ داد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-14 pt-14">
        <div className="pointer-events-none absolute -left-32 top-0 h-[340px] w-[340px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="reveal eyebrow text-teal-400">TSOFT · CAPITAL</p>
          <h1 className="reveal mt-4">
            <span className="line-mask"><span className="font-display text-5xl leading-none text-white sm:text-6xl">{tab === "register" ? "به خانواده بپیوندید" : tab === "forgot" ? "بازیابی رمز عبور" : "خوش آمدید"}</span></span>
          </h1>
          <p className="reveal mx-auto mt-4 max-w-xl leading-9 text-mist-300">
            با حساب کاربری، تیکت پشتیبانی بزنید و چت آنلاین داشته باشید — پاسخ‌ها را در پنل خود می‌بینید.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-md px-4">
          <div className="reveal card-pro p-8">
            <div className="mb-7 flex rounded-xl bg-ink-50 p-1">
              {([["login", "ورود"], ["register", "ثبت‌نام"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => switchTab(id)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${tab === id ? "bg-ink-950 text-white shadow" : "text-mist-500"}`}>{label}</button>
              ))}
            </div>

            {err && <p className="mb-4 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-sm font-bold text-[#E14B4B]">{err}</p>}
            {notice && <p className="mb-4 rounded-xl bg-teal-500/10 px-4 py-3 text-sm font-bold text-teal-600">{notice}</p>}

            <form onSubmit={submit} className="space-y-4">
              {tab === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block"><span className="mb-1.5 block text-xs font-bold text-ink-900">نام *</span><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="علی" className={inputCls} /></label>
                    <label className="block"><span className="mb-1.5 block text-xs font-bold text-ink-900">نام خانوادگی *</span><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="رضایی" className={inputCls} /></label>
                  </div>
                  <label className="block"><span className="mb-1.5 block text-xs font-bold text-ink-900">ایمیل (اختیاری)</span><input dir="ltr" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputCls + " text-left"} /></label>
                </>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-ink-900">{tab === "forgot" ? "شماره موبایل" : "شماره موبایل یا نام کاربری"} *</span>
                <input required dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={tab === "login" ? "0915 ... یا admin" : "0915 ..."} className={inputCls + " text-left"} />
              </label>
              {(tab === "login" || tab === "register") && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-ink-900">رمز عبور *</span>
                  <div className="relative">
                    <input required dir="ltr" type={showPass ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" className={inputCls + " pl-11 text-left"} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-300 hover:text-teal-600" aria-label="نمایش رمز">
                      <Icon name={showPass ? "eyeoff" : "eye"} className="h-5 w-5" />
                    </button>
                  </div>
                </label>
              )}
              {tab === "forgot" && form.code && (
                <>
                  <label className="block"><span className="mb-1.5 block text-xs font-bold text-ink-900">کد بازیابی *</span><input required dir="ltr" value={form.code.trim()} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="کد ۶ رقمی" className={inputCls + " text-left"} /></label>
                  <label className="block"><span className="mb-1.5 block text-xs font-bold text-ink-900">رمز جدید *</span><input required dir="ltr" type="password" value={form.newPass} onChange={(e) => setForm({ ...form, newPass: e.target.value })} placeholder="••••••" className={inputCls + " text-left"} /></label>
                </>
              )}
              <button type="submit" disabled={busy} className="btn-shine w-full rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-ink-950 transition-colors hover:bg-teal-400 disabled:opacity-60">
                {busy ? "در حال انجام…" : tab === "login" ? "ورود" : tab === "register" ? "ساخت حساب" : form.code ? "تغییر رمز عبور" : "ارسال کد بازیابی"}
              </button>
            </form>

            {tab === "login" && (
              <button onClick={() => switchTab("forgot")} className="link-underline mt-5 block text-center text-xs font-bold text-mist-500 hover:text-teal-600">رمز عبور را فراموش کرده‌اید؟</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

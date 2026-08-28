import { useState } from "react";
import { api, ApiError, setToken, type PubUser } from "../api";
import { useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const inputCls =
  "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

export default function AuthPage({ mode, nav, onAuth }: { mode: "login" | "register"; nav: NavFn; onAuth: (u: PubUser) => void }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<"login" | "register">(mode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    setBusy(true);
    try {
      if (tab === "register") {
        const d = await api.register({ firstName, lastName, phone, password });
        setToken(d.token);
        onAuth(d.user);
        setNotice(d.first ? "حساب شما به‌عنوان مدیر ساخته شد — به پنل مدیریت خوش آمدید!" : "");
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      } else {
        const d = await api.login({ phone, password });
        setToken(d.token);
        onAuth(d.user);
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      }
    } catch (ex) {
      setErrMsg(ex instanceof ApiError ? ex.message : "خطایی رخ داد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">TSOFT ACCOUNT</p>
          <h1 className="mt-4">
            <span className="line-mask"><span className="font-display text-6xl leading-none text-white sm:text-7xl">حساب کاربری</span></span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">تیسافت</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            با ثبت‌نام، تیکت پشتیبانی بزنید، با پشتیبانی چت کنید و تاریخچه‌ی درخواست‌هایتان را دنبال کنید.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="reveal overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-[0_30px_70px_-30px_rgba(10,27,33,0.25)]">
            {/* تب‌ها */}
            <div className="grid grid-cols-2 border-b border-ink-100">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setErrMsg(""); }}
                  className={`py-4 font-display text-xl transition-all ${
                    tab === t ? "bg-paper text-teal-600 shadow-[inset_0_-3px_0_var(--color-teal-500)]" : "text-mist-500 hover:text-ink-900"
                  }`}
                >
                  {t === "login" ? "ورود" : "ثبت‌نام"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-5 p-8">
              {tab === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نام</span>
                    <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="مثلاً: مهدی" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نام خانوادگی</span>
                    <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="مثلاً: بیگناهی" className={inputCls} />
                  </label>
                </div>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink-900">شماره موبایل</span>
                <input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0915 ..." className={inputCls + " text-left"} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink-900">رمز عبور</span>
                <input required type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className={inputCls + " text-left"} />
              </label>

              {errMsg && (
                <p className="ticker-in flex items-start gap-2 rounded-xl bg-[#E14B4B]/10 px-4 py-3 text-sm font-bold text-[#E14B4B]">
                  <Icon name="bell" className="mt-0.5 h-4 w-4 shrink-0" />
                  {errMsg}
                </p>
              )}
              {notice && (
                <p className="ticker-in flex items-start gap-2 rounded-xl bg-teal-100 px-4 py-3 text-sm font-bold text-teal-600">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-shine flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink-900 py-4 text-base font-bold text-white transition-colors hover:bg-teal-600 disabled:opacity-60"
              >
                {busy ? "در حال پردازش…" : tab === "login" ? "ورود به حساب" : "ساخت حساب"}
                {!busy && <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />}
              </button>

              <p className="text-center text-xs leading-6 text-mist-500">
                {tab === "register"
                  ? "اولین حسابی که ساخته شود، دسترسی مدیر خواهد داشت."
                  : "حساب ندارید؟ از تب «ثبت‌نام» یک حساب بسازید."}
              </p>
            </form>
          </div>

          <p className="reveal mt-6 text-center text-xs leading-6 text-mist-500" style={{ "--rv-delay": "150ms" } as React.CSSProperties}>
            اطلاعات شما فقط برای پشتیبانی استفاده می‌شود و نزد ما امن است.
          </p>
        </div>
      </section>
    </div>
  );
}

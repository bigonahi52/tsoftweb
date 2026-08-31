import { useState } from "react";
import { api, ApiError, setToken, type PubUser } from "../api";
import { useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const inputCls =
  "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

/** فیلد رمز عبور با دکمه‌ی چشم برای نمایش/پنهان کردن */
function PassInput({ value, onChange, placeholder = "••••••" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        required
        type={show ? "text" : "password"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls + " text-left pl-12"}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
        title={show ? "پنهان کردن رمز" : "نمایش رمز"}
        className={`absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-200 ${
          show ? "bg-teal-500/12 text-teal-600" : "text-mist-500 hover:bg-ink-50 hover:text-teal-600"
        }`}
      >
        <Icon name={show ? "eyeoff" : "eye"} className="h-5 w-5" />
      </button>
    </div>
  );
}

type Tab = "login" | "register" | "forgot";

export default function AuthPage({ mode, nav, onAuth }: { mode: "login" | "register"; nav: NavFn; onAuth: (u: PubUser) => void }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [tab, setTab] = useState<Tab>(mode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [notice, setNotice] = useState("");

  /* فراموشی رمز */
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState("");
  const [newPass, setNewPass] = useState("");

  const switchTab = (t: Tab) => {
    setTab(t);
    setErrMsg("");
    setNotice("");
    setForgotStep(1);
    setResetCode("");
    setNewPass("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    setBusy(true);
    try {
      if (tab === "register") {
        const d = await api.register({ firstName, lastName, phone, email: email.trim() || undefined, password });
        /* اعتبارسنجی شکل پاسخ — اگر سرور پاسخ ناقص داد، خطای شفاف بینداز */
        if (!d || !d.token || !d.user || !d.user.id) {
          throw new ApiError("پاسخ سرور کامل نبود — صفحه را تازه کنید و دوباره تلاش کنید");
        }
        setToken(d.token);
        onAuth(d.user);
        setNotice(d.first ? "حساب شما به‌عنوان مدیر ساخته شد — به پنل مدیریت خوش آمدید!" : "");
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      } else if (tab === "login") {
        const d = await api.login({ phone, password });
        if (!d || !d.token || !d.user || !d.user.id) {
          throw new ApiError("پاسخ سرور کامل نبود — صفحه را تازه کنید و دوباره تلاش کنید");
        }
        setToken(d.token);
        onAuth(d.user);
        nav({ page: d.user.role === "admin" ? "admin" : "panel" });
      } else if (tab === "forgot") {
        if (forgotStep === 1) {
          const d = await api.forgot(phone);
          setNotice(
            d.demoCode
              ? `حالت نمایشی — کد بازیابی شما: ${d.demoCode} (بعد از فعال‌سازی ایمیل، کد به ایمیل‌تان ارسال می‌شود)`
              : "اگر این شماره ثبت شده باشد و ایمیل داشته باشد، کد بازیابی برایتان ارسال شد."
          );
          setForgotStep(2);
        } else {
          await api.reset({ phone, code: resetCode, newPass });
          setTab("login");
          setNotice("رمز عبور شما بازنشانی شد — حالا وارد شوید.");
        }
      }
    } catch (ex) {
      if (ex instanceof ApiError) {
        setErrMsg(ex.message);
      } else {
        /* خطای غیرمنتظره — برای دیباگ در کنسول ثبت می‌شود
           (هرگز اطلاعات حساس مثل رمز عبور لاگ نمی‌شود) */
        console.error("[tsoft/auth] خطای غیرمنتظره:", ex);
        setErrMsg("خطای غیرمنتظره‌ای رخ داد — اتصال اینترنت را بررسی و دوباره تلاش کنید");
      }
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
            {tab !== "forgot" && (
              <div className="grid grid-cols-2 border-b border-ink-100">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className={`py-4 font-display text-xl transition-all ${
                      tab === t ? "bg-paper text-teal-600 shadow-[inset_0_-3px_0_var(--color-teal-500)]" : "text-mist-500 hover:text-ink-900"
                    }`}
                  >
                    {t === "login" ? "ورود" : "ثبت‌نام"}
                  </button>
                ))}
              </div>
            )}

            {tab === "forgot" && (
              <div className="flex items-center justify-between border-b border-ink-100 bg-paper px-6 py-4">
                <p className="font-display text-xl text-teal-600">
                  {forgotStep === 1 ? "فراموشی رمز عبور" : "کد بازیابی"}
                </p>
                <button onClick={() => switchTab("login")} className="text-xs font-bold text-mist-500 transition-colors hover:text-teal-600">
                  بازگشت به ورود ←
                </button>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5 p-8">
              {tab === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-ink-900">نام</span>
                      <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="مثلاً: علی" className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-ink-900">نام خانوادگی</span>
                      <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="مثلاً: رضایی" className={inputCls} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">ایمیل (برای بازیابی رمز)</span>
                    <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls + " text-left"} />
                  </label>
                </>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink-900">
                  {tab === "login" ? "شماره موبایل یا نام کاربری" : "شماره موبایل"}
                </span>
                <input
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tab === "login" ? "0915 ... یا نام کاربری" : "0915 ..."}
                  className={inputCls + " text-left"}
                />
              </label>

              {tab !== "forgot" && (
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-ink-900">رمز عبور</span>
                  <PassInput value={password} onChange={setPassword} />
                </label>
              )}

              {tab === "forgot" && forgotStep === 2 && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">کد بازیابی (ارسال‌شده به ایمیل)</span>
                    <input required dir="ltr" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="6 رقم" className={inputCls + " text-center font-latin tracking-[0.5em]"} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">رمز عبور جدید</span>
                    <PassInput value={newPass} onChange={setNewPass} />
                  </label>
                </>
              )}

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
                {busy
                  ? "در حال پردازش…"
                  : tab === "login"
                    ? "ورود به حساب"
                    : tab === "register"
                      ? "ساخت حساب"
                      : forgotStep === 1
                        ? "ارسال کد بازیابی"
                        : "بازنشانی رمز عبور"}
                {!busy && <Icon name="arrow" className="h-4 w-4" />}
              </button>

              {tab === "login" && (
                <button type="button" onClick={() => switchTab("forgot")} className="link-underline block w-full text-center text-xs font-bold text-mist-500 transition-colors hover:text-teal-600">
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              )}

              <p className="text-center text-xs leading-6 text-mist-500">
                {tab === "register"
                  ? "اولین حسابی که ساخته شود، دسترسی مدیر خواهد داشت."
                  : tab === "login"
                    ? "حساب ندارید؟ از تب «ثبت‌نام» یک حساب بسازید."
                    : forgotStep === 1
                      ? "شماره‌ی خود را وارد کنید تا کد بازیابی به ایمیل‌تان ارسال شود."
                      : "کد ارسال‌شده تا ۱۰ دقیقه اعتبار دارد."}
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

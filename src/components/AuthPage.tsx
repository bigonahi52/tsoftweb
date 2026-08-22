import { useState } from "react";
import { currentUser, loginUser, registerUser } from "../store";
import { useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

const perks = [
  { icon: "chat", text: "چت مستقیم با پشتیبانی و پیگیری پاسخ‌ها" },
  { icon: "file", text: "دریافت فایل‌ها و آپدیت‌های اختصاصی از طرف تیسافت" },
  { icon: "invoice", text: "مشاهده و چاپ فاکتور خرید و خدمات پشتیبانی" },
  { icon: "award", text: "یک سال پشتیبانی رایگان همراه هر خرید" },
];

export default function AuthPage({ mode, nav }: { mode: "login" | "register"; nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const isLogin = mode === "login";
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", pass: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.phone.trim() || !form.pass.trim()) {
      setError("شماره تماس و رمز عبور را وارد کنید");
      return;
    }
    if (!isLogin && (!form.firstName.trim() || !form.lastName.trim())) {
      setError("نام و نام خانوادگی را وارد کنید");
      return;
    }
    if (!isLogin && form.pass.length < 4) {
      setError("رمز عبور باید حداقل ۴ حرف باشد");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const res = isLogin
        ? loginUser(form.phone, form.pass)
        : registerUser(form.firstName, form.lastName, form.phone, form.pass);
      setBusy(false);
      if (!res.ok) {
        setError(res.error ?? "خطایی رخ داد");
        return;
      }
      const logged = currentUser();
      nav({ page: logged?.role === "admin" ? "admin" : "panel" });
    }, 450);
  };

  const inputCls =
    "w-full rounded-xl border border-ink-100 bg-paper px-4 py-3.5 text-sm text-ink-900 transition-all placeholder:text-mist-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15";

  return (
    <div ref={ref} className="bg-paper">
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-14 pt-12 sm:pt-16">
        <div className="pointer-events-none absolute -left-32 top-0 h-[340px] w-[340px] rounded-full bg-teal-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-teal-400">{isLogin ? "WELCOME BACK" : "JOIN TSOFT"}</p>
          <h1 className="mt-3">
            <span className="line-mask">
              <span className="font-display text-5xl leading-none text-white sm:text-6xl">{isLogin ? "ورود به حساب" : "ساخت حساب کاربری"}</span>
            </span>
          </h1>
          <p className="reveal mt-4 max-w-xl leading-8 text-mist-300">
            {isLogin
              ? "وارد شوید تا گفتگوها، فایل‌ها و فاکتورهایتان را ببینید."
              : "در کمتر از یک دقیقه حساب بسازید؛ چت با پشتیبانی، دریافت فایل و فاکتور، همه یک‌جا."}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* مزایا */}
          <div className="reveal order-2 lg:order-1">
            <h2 className="font-display text-3xl text-ink-900">با حساب کاربری چه چیزی گیرتان می‌آید؟</h2>
            <div className="mt-6 space-y-4">
              {perks.map((p, i) => (
                <div key={p.text} className="reveal card-lift flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5" style={{ "--rv-delay": `${i * 90}ms` } as React.CSSProperties}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-teal-400">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <p className="text-sm leading-7 text-mist-500">{p.text}</p>
                </div>
              ))}
            </div>
            <p className="reveal mt-6 rounded-2xl border border-teal-500/40 bg-teal-100/40 px-5 py-4 text-sm leading-7 text-ink-800">
              <b>مهم:</b> هنگام چت با پشتیبانی، نام، نام خانوادگی و شماره‌ی شما برای تیم ما نمایش داده می‌شود تا بدانیم با چه کسی صحبت می‌کنیم.
            </p>
          </div>

          {/* فرم */}
          <div className="reveal order-1 rounded-3xl border border-ink-100 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(10,27,33,0.4)] sm:p-10 lg:order-2">
            {/* تب‌ها */}
            <div className="flex rounded-xl border border-ink-100 bg-paper p-1.5">
              {[
                { id: "login" as const, label: "ورود" },
                { id: "register" as const, label: "ثبت‌نام" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => nav({ page: t.id })}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${
                    mode === t.id ? "bg-ink-950 text-white shadow" : "text-mist-500 hover:text-teal-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <h3 className="mt-7 flex items-center gap-3 font-display text-2xl text-ink-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600">
                <Icon name={isLogin ? "lock" : "user"} className="h-5 w-5" />
              </span>
              {isLogin ? "خوش برگشتید!" : "اطلاعات شما"}
            </h3>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نام</span>
                    <input value={form.firstName} onChange={set("firstName")} placeholder="مثلاً: علی" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-ink-900">نام خانوادگی</span>
                    <input value={form.lastName} onChange={set("lastName")} placeholder="مثلاً: محمدی" className={inputCls} />
                  </label>
                </div>
              )}
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink-900">شماره تماس{!isLogin && <span className="text-mist-300"> (نام کاربری شما)</span>}</span>
                <input value={form.phone} onChange={set("phone")} placeholder="۰۹۱۲ ..." className={inputCls} dir="ltr" style={{ textAlign: "right" }} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink-900">رمز عبور</span>
                <input type="password" value={form.pass} onChange={set("pass")} placeholder={isLogin ? "رمز عبور" : "حداقل ۴ حرف"} className={inputCls} dir="ltr" style={{ textAlign: "right" }} />
              </label>

              {error && (
                <p className="ticker-in flex items-center gap-2 rounded-xl border border-[#e5695e]/40 bg-[#e5695e]/10 px-4 py-3 text-sm font-bold text-[#c0443a]">
                  <Icon name="close" className="h-4 w-4" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-shine group flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink-950 py-4 text-base font-bold text-white transition-colors hover:bg-teal-600 disabled:opacity-60"
              >
                {busy ? "یک لحظه…" : isLogin ? "ورود به حساب" : "ساخت حساب و شروع"}
                {!busy && <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:-translate-x-1" />}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-6 text-mist-500">
              {isLogin ? (
                <>حساب ندارید؟{" "}
                  <button onClick={() => nav({ page: "register" })} className="link-underline font-bold text-teal-600">همین حالا بسازید</button>
                </>
              ) : (
                <>قبلاً ثبت‌نام کرده‌اید؟{" "}
                  <button onClick={() => nav({ page: "login" })} className="link-underline font-bold text-teal-600">وارد شوید</button>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

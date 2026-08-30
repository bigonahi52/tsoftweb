/* فراموشی رمز عبور:
   action=forgot → کد بازیابی ۶ رقمی ساخته و به ایمیل کاربر می‌فرستد (۱۰ دقیقه اعتبار)
   action=reset  → کد + رمز جدید را گرفته و رمز را بازنشانی می‌کند */
import { err, getUser, hashPass, jdel, jget, jset, kvOk, normPhone, ok, saveUser, uid, userByPhone, verifyPass } from "./_kv";
import { emailConfigured, emailShell, sendEmail } from "./_email";

const CODE_TTL = 60 * 10; // ۱۰ دقیقه

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  if (req.method !== "POST") return err("درخواست نامعتبر", 405);

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const action = body.action;
  const phone = normPhone(body.phone);

  if (action === "forgot") {
    const u = await userByPhone(phone);
    /* برای جلوگیری از لو رفتن اینکه شماره‌ای ثبت شده یا نه، همیشه پیام موفق می‌فرستیم */
    if (!u) return ok({ ok: true });
    if (!u.email)
      return err("برای این حساب ایمیلی ثبت نشده است — برای بازیابی رمز با پشتیبانی تماس بگیرید.");
    if (!emailConfigured())
      return err("سرویس ایمیل پیکربندی نشده است — متغیر RESEND_API_KEY را در داشبورد Vercel تنظیم کنید.", 503);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const salt = uid().slice(0, 10);
    await jset(`reset:${u.id}`, { salt, hash: hashPass(code, salt) }, CODE_TTL);

    const sent = await sendEmail(
      u.email,
      "کد بازیابی رمز عبور تیسافت",
      emailShell(
        "بازیابی رمز عبور",
        `<p>سلام <b>${u.firstName} ${u.lastName}</b> عزیز،</p>
         <p>کد بازیابی رمز عبور شما:</p>
         <div style="text-align:center;margin:24px 0;">
           <span style="display:inline-block;background:#0a1b21;color:#43c9bf;font-size:32px;font-weight:bold;letter-spacing:10px;padding:16px 32px;border-radius:14px;">${code}</span>
         </div>
         <p>این کد تا <b>۱۰ دقیقه</b> اعتبار دارد.</p>
         <p style="color:#5f7a82;font-size:12px;">اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>`
      )
    );
    if (!sent) return err("خطا در ارسال ایمیل — دوباره تلاش کنید.", 500);
    return ok({ ok: true });
  }

  if (action === "reset") {
    const code = String(body.code || "");
    const newPass = String(body.newPass || "");
    const u = await userByPhone(phone);
    if (!u) return err("کاربری با این شماره یافت نشد");
    if (newPass.length < 4) return err("رمز جدید باید حداقل ۴ حرف باشد");

    const rec = await jget<{ salt: string; hash: string } | null>(`reset:${u.id}`, null);
    if (!rec) return err("کد بازیابی منقضی شده است — دوباره درخواست دهید");
    if (!verifyPass(code, rec.salt, rec.hash)) return err("کد بازیابی اشتباه است");

    u.salt = uid().slice(0, 12);
    u.passHash = hashPass(newPass, u.salt);
    await saveUser(u);
    await jdel(`reset:${u.id}`);
    return ok({ ok: true });
  }

  return err("درخواست نامعتبر");
}

export const config = { runtime: "nodejs" };

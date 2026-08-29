/* فرم «تماس با ما»: پیام کاربر را به ایمیل مدیر می‌فرستد.
   ایمیل مقصد: bigonahi@gmail.com (قابل تغییر با متغیر CONTACT_EMAIL در Vercel) */
import { kvOk } from "../server/db";
import { err, ok } from "../server/auth";
import { emailConfigured, emailShell, sendEmail } from "../server/email";

const OWNER_EMAIL = process.env.CONTACT_EMAIL || "bigonahi@gmail.com";

export default async function handler(req: Request) {
  if (!kvOk()) return err("بک‌اند فعال نیست — Vercel KV را فعال کنید.", 503);
  if (req.method !== "POST") return err("درخواست نامعتبر", 405);
  if (!emailConfigured())
    return err("سرویس ایمیل پیکربندی نشده است — متغیر RESEND_API_KEY را در داشبورد Vercel تنظیم کنید.", 503);

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const business = (body.business || "").trim();
  const product = (body.product || "").trim();
  const message = (body.message || "").trim();

  if (!name || !message) return err("نام و متن پیام الزامی است");
  if (message.length < 5) return err("پیام خیلی کوتاه است");

  const html = emailShell(
    "پیام جدید از فرم تماس",
    `<p><b>${name}</b> از طریق فرم تماس سایت پیام فرستاده است:</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
       ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">تلفن</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${phone}</td></tr>` : ""}
       ${business ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">کسب‌وکار</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${business}</td></tr>` : ""}
       ${product ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">محصول موردنظر</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${product}</td></tr>` : ""}
     </table>
     <div style="background:#eef6f7;border-right:4px solid #17b0a6;padding:16px;border-radius:8px;line-height:1.9;">${message.replace(/\n/g, "<br>")}</div>
     <p style="margin-top:20px;font-size:12px;color:#5f7a82;">برای پاسخ، مستقیم با شماره‌ی بالا تماس بگیرید.</p>`
  );

  const sent = await sendEmail(OWNER_EMAIL, `پیام تماس از ${name}`, html);
  if (!sent) return err("خطا در ارسال پیام — دوباره تلاش کنید یا مستقیم تماس بگیرید.", 500);
  return ok({ ok: true });
}

export const config = { runtime: "nodejs" };

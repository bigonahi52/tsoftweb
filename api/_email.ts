/* ماژول مشترکِ خودکفا — ارسال ایمیل با Resend
   ─ با پیشوند «_» تا Vercel آن را به‌عنوان کد مشترک باندل کند.
   ─ نیاز به متغیر محیطی RESEND_API_KEY دارد (در داشبورد Vercel).
   ─ فرستنده‌ی پیش‌فرض «onboarding@resend.dev» آزمایشی است و فقط به ایمیلِ
     ثبت‌شده در حساب Resend می‌فرستد؛ برای دامنه‌ی خود، EMAIL_FROM را تنظیم
     و دامنه را در Resend تأیید کنید. */

const FROM = process.env.EMAIL_FROM || "تیسافت TSOFT <onboarding@resend.dev>";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export type SendResult = { ok: boolean; id?: string; error?: string };

export async function sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[email] RESEND_API_KEY is not set in environment variables");
    return { ok: false, error: "RESEND_API_KEY تنظیم نشده است" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) {
      console.error("[email] Resend rejected the request:", res.status, JSON.stringify(data));
      return { ok: false, error: data.message || data.name || `Resend HTTP ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (e) {
    console.error("[email] network error while calling Resend:", e);
    return { ok: false, error: "خطای شبکه در ارتباط با سرویس ایمیل" };
  }
}

export const emailShell = (title: string, bodyHtml: string) => `
<!doctype html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f7faf4;font-family:Tahoma,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ddebe3;">
    <div style="background:#0c1f19;padding:20px 28px;">
      <div style="color:#4bd39b;font-weight:bold;font-size:18px;">گروه نرم‌افزاری سرمایه <span style="color:#eaa63b;">TSOFT</span></div>
      <div style="color:#92bca9;font-size:12px;margin-top:4px;">${title}</div>
    </div>
    <div style="padding:28px;color:#1a463a;line-height:1.9;font-size:14px;">${bodyHtml}</div>
    <div style="padding:16px 28px;background:#eef4ee;color:#5d7a6d;font-size:11px;border-top:1px solid #ddebe3;">
      این ایمیل به‌صورت خودکار از سامانه‌ی تیسافت ارسال شده است · tsoft20.ir
    </div>
  </div>
</body>
</html>`;

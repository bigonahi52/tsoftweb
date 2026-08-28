/* ارسال ایمیل با Resend — نیاز به متغیر محیطی RESEND_API_KEY در داشبورد Vercel دارد.
   راهنمای دریافت کلید رایگان: resend.com (روزانه ۱۰۰ ایمیل رایگان) */

const FROM = process.env.EMAIL_FROM || "تیسافت <onboarding@resend.dev>";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** قالب ایمیل فارسی با طراحی ساده و رسمی */
export const emailShell = (title: string, bodyHtml: string) => `
<!doctype html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f6fbfb;font-family:Tahoma,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9e9ec;">
    <div style="background:#0a1b21;padding:20px 28px;">
      <div style="color:#43c9bf;font-weight:bold;font-size:18px;">تیسافت <span style="color:#e5a93d;">TSOFT</span></div>
      <div style="color:#7fa9b5;font-size:12px;margin-top:4px;">${title}</div>
    </div>
    <div style="padding:28px;color:#14313a;line-height:1.9;font-size:14px;">${bodyHtml}</div>
    <div style="padding:16px 28px;background:#eef6f7;color:#5f7a82;font-size:11px;border-top:1px solid #d9e9ec;">
      این ایمیل به‌صورت خودکار از سامانه‌ی تیسافت ارسال شده است · tsoft20.ir
    </div>
  </div>
</body>
</html>`;

/* فرم «تماس با ما»: پیام کاربر را به ایمیل مدیر می‌فرستد.
   ایمیل مقصد: bigonahi@gmail.com (قابل تغییر با متغیر CONTACT_EMAIL در Vercel)

   مهم — این route کاملاً self-contained است:
   هیچ import از پوشه‌ی server/ ندارد تا خطای ERR_MODULE_NOT_FOUND در Vercel رخ ندهد.
   هیچ وابستگی به Vercel KV یا دیتابیس ندارد؛ فقط به RESEND_API_KEY وابسته است. */

const OWNER_EMAIL = process.env.CONTACT_EMAIL || "bigonahi@gmail.com";
const FROM = process.env.EMAIL_FROM || "گروه نرم‌افزاری سرمایه TSOFT <onboarding@resend.dev>";
const SUBJECT = "پیام جدید از فرم تماس سایت TSOFT";

const err = (message: string, status = 400) =>
  Response.json({ error: message }, { status });

const ok = (data: unknown) => Response.json(data);

/** قالب ایمیل فارسی با طراحی ساده و رسمی */
const emailShell = (title: string, bodyHtml: string) => `
<!doctype html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f6fbfb;font-family:Tahoma,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9e9ec;">
    <div style="background:#0a1b21;padding:20px 28px;">
      <div style="color:#43c9bf;font-weight:bold;font-size:18px;">گروه نرم‌افزاری سرمایه <span style="color:#e5a93d;">TSOFT</span></div>
      <div style="color:#7fa9b5;font-size:12px;margin-top:4px;">${title}</div>
    </div>
    <div style="padding:28px;color:#14313a;line-height:1.9;font-size:14px;">${bodyHtml}</div>
    <div style="padding:16px 28px;background:#eef6f7;color:#5f7a82;font-size:11px;border-top:1px solid #d9e9ec;">
      این ایمیل به‌صورت خودکار از سامانه‌ی تیسافت ارسال شده است · tsoft20.ir
    </div>
  </div>
</body>
</html>`;

/** ارسال ایمیل با Resend — خطاها در سمت سرور لاگ می‌شوند تا در Vercel Logs قابل بررسی باشند */
async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set in environment variables");
    return { ok: false, error: "RESEND_API_KEY تنظیم نشده است" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!res.ok) {
      /* ثبت خطای واقعی Resend در لاگ سرور — بدون اطلاعات حساس */
      console.error("[contact] Resend rejected the request:", res.status, JSON.stringify(data));
      return { ok: false, error: data.message || data.name || `Resend HTTP ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (e) {
    console.error("[contact] network error while calling Resend:", e);
    return { ok: false, error: "خطای شبکه در ارتباط با سرویس ایمیل" };
  }
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return err("درخواست نامعتبر", 405);

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is missing in environment variables");
    return err("سرویس ایمیل پیکربندی نشده است — متغیر RESEND_API_KEY را در داشبورد Vercel تنظیم کنید.", 503);
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const business = (body.business || "").trim();
  const product = (body.product || "").trim();
  const message = (body.message || "").trim();

  if (!name || !message) return err("نام و متن پیام الزامی است");
  if (message.length < 5) return err("پیام خیلی کوتاه است");

  const html = emailShell(
    SUBJECT,
    `<p><b>${name}</b> از طریق فرم تماس سایت پیام فرستاده است:</p>
     <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
       ${name ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;width:130px;">نام و نام خانوادگی</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${name}</td></tr>` : ""}
       ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">شماره تماس</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;" dir="ltr">${phone}</td></tr>` : ""}
       ${business ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">نوع کسب‌وکار</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${business}</td></tr>` : ""}
       ${product ? `<tr><td style="padding:8px;border-bottom:1px solid #d9e9ec;color:#5f7a82;">محصول موردنظر</td><td style="padding:8px;border-bottom:1px solid #d9e9ec;">${product}</td></tr>` : ""}
     </table>
     <div style="background:#eef4ee;border-right:4px solid #16b87f;padding:16px;border-radius:8px;line-height:1.9;">${message.replace(/\n/g, "<br>")}</div>
     <p style="margin-top:20px;font-size:12px;color:#5f7a82;">برای پاسخ، با شماره‌ی فوق تماس بگیرید.</p>`
  );

  /* چون فرم ایمیلِ مشتری را نمی‌گیرد (فقط تلفن)، Reply-To روی ایمیل مدیر تنظیم می‌شود
     تا پاسخِ احتمالی به آدرس معتبر برود و bounce نخورد. */
  const result = await sendEmail(OWNER_EMAIL, SUBJECT, html, OWNER_EMAIL);

  if (!result.ok) {
    /* خطای واقعی Resend قبلاً لاگ شده؛ اینجا فقط به کاربر پیام مناسب می‌دهیم */
    console.error("[contact] failed to send contact email:", result.error);
    return err("خطا در ارسال پیام — دوباره تلاش کنید یا مستقیم با شماره‌ی پشتیبانی تماس بگیرید.", 500);
  }

  return ok({ ok: true, id: result.id });
}

export const config = { runtime: "nodejs" };

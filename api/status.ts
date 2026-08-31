/* وضعیت سیستم — آیا دیتابیس ابری (Vercel KV) فعال است یا خیر؟
   این endpoint برای تشخیص این است که داده‌ها در ابر ذخیره می‌شوند
   (بین همه دستگاه‌ها مشترک) یا فقط در مرورگرِ محلی. */
import { kvOk } from "./_kv";

export default async function handler() {
  return Response.json({
    kv: kvOk(),
    mode: kvOk() ? "cloud" : "local",
    message: kvOk()
      ? "دیتابیس ابری فعال است — داده‌ها بین همه‌ی دستگاه‌ها مشترک‌اند."
      : "دیتابیس ابری فعال نیست — داده‌ها فقط در مرورگر هر کاربر ذخیره می‌شوند.",
  });
}

export const config = { runtime: "nodejs" };

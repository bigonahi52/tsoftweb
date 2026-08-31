/* وضعیت سیستم — آیا دیتابیس ابری (Upstash Redis) فعال است یا خیر؟
   ─ حالت: cloud (داده‌ها بین همه‌ی دستگاه‌ها مشترک‌اند) یا local (فقط مرورگر)
   ─ با ?ping=1 یک تست واقعی خواندن/نوشتن روی دیتابیس انجام می‌دهد تا
     اتصال به‌صورت قطعی تأیید شود (بدون افشای هیچ مقدار حساس). */
import { kv, kvOk, redisSource } from "./_kv";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const doPing = url.searchParams.get("ping") === "1";

  const base = {
    kv: kvOk(),
    mode: kvOk() ? ("cloud" as const) : ("local" as const),
    source: redisSource,
    env: {
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    },
    message: kvOk()
      ? "دیتابیس ابری فعال است — داده‌ها بین همه‌ی دستگاه‌ها مشترک‌اند."
      : "دیتابیس ابری فعال نیست — داده‌ها فقط در مرورگر هر کاربر ذخیره می‌شوند. متغیرهای env را در داشبورد Vercel بررسی کنید.",
  };

  if (!doPing || !kv) return Response.json(base);

  /* تست round-trip واقعی: نوشتن یک کلید موقت، خواندنش و پاک‌کردنش */
  try {
    const testKey = "tsoft:ping";
    const testValue = `ok-${Date.now()}`;
    await kv.set(testKey, testValue, { ex: 30 });
    const readBack = await kv.get<string>(testKey);
    await kv.del(testKey);
    return Response.json({
      ...base,
      ping: { ok: readBack === testValue, write: true, read: readBack !== null, match: readBack === testValue },
    });
  } catch (e) {
    return Response.json(
      { ...base, ping: { ok: false, error: String(e instanceof Error ? e.message : e) } },
      { status: 200 }
    );
  }
}

export const config = { runtime: "nodejs" };

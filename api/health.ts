/* سلامت دیتابیس — /api/health
   ─ تست واقعی و عمیق اتصال Upstash Redis / Vercel KV
   ─ هرگز crash نمی‌کند: ماژول داده با import پویا بارگذاری می‌شود و اگر خطایی
     باشد، دلیل واقعی آن گزارش می‌شود (نه یک خطای عمومی).
   ─ هیچ مقدار حساسی برگردانده نمی‌شود — فقط «بود/نبود» متغیرها (Boolean)
     و پیام‌های خطای فنی.
   خروجی:
     ok      : آیا دیتابیس ابری واقعاً کار می‌کند (تنظیم + پینگ موفق)؟
     mode    : cloud | local
     env     : کدام Environment Variableها در Runtime دیده می‌شوند
     source  : اتصال از کدام مجموعه متغیر ساخته شده
     moduleError : اگر ماژول داده اصلاً بارگذاری نشد، دلیلش
     ping    : نتیجه‌ی تست واقعی نوشتن/خواندن روی Redis */
export default async function handler() {
  const env = {
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    KV_URL: Boolean(process.env.KV_URL),
    REDIS_URL: Boolean(process.env.REDIS_URL),
    KV_REST_API_READ_ONLY_TOKEN: Boolean(process.env.KV_REST_API_READ_ONLY_TOKEN),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
  };

  let moduleError: string | null = null;
  let kvOkFlag = false;
  let source: "kv" | "upstash" | "none" = "none";
  let ping: { ok: boolean; ms?: number; error?: string } | null = null;

  try {
    const m = await import("./_kv");
    kvOkFlag = m.kvOk();
    source = m.redisSource;
    if (kvOkFlag) ping = await m.pingRedis();
  } catch (e) {
    moduleError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const cloud = kvOkFlag && ping?.ok === true;

  return Response.json({
    ok: cloud,
    mode: kvOkFlag ? "cloud" : "local",
    env,
    source,
    moduleError,
    ping,
    ts: new Date().toISOString(),
  });
}

export const config = { runtime: "nodejs" };

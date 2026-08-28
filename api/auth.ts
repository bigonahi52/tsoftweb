/* احراز هویت: ثبت‌نام، ورود، جلسه‌ی من، خروج، ویرایش، تغییر رمز */
import {
  allUserIds,
  endSession,
  jdel,
  jset,
  kvOk,
  newSession,
  pub,
  saveUser,
  sessionUser,
  userByPhone,
  type DbUser,
} from "../server/db";
import { err, hashPass, normPhone, ok, uid, verifyPass } from "../server/auth";

export default async function handler(req: Request) {
  if (!kvOk())
    return err("بک‌اند فعال نیست — لطفاً در داشبورد Vercel یک فروشگاه KV (Redis) اضافه کنید تا متغیرهای KV_REST_API_URL و KV_REST_API_TOKEN ساخته شوند.", 503);

  /* جلسه‌ی فعلی */
  if (req.method === "GET") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    return ok({ user: pub(u) });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const action = body.action;

  if (action === "register") {
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const phone = normPhone(body.phone);
    const password = String(body.password || "");
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    if (phone.length < 6) return err("شماره تماس معتبر نیست");
    if (password.length < 4) return err("رمز عبور باید حداقل ۴ حرف باشد");
    if (await userByPhone(phone)) return err("این شماره قبلاً ثبت شده — وارد شوید");

    const ids = await allUserIds();
    const salt = uid().slice(0, 12);
    const isFirst = ids.length === 0;
    const user: DbUser = {
      id: uid(),
      firstName,
      lastName,
      phone,
      salt,
      passHash: hashPass(password, salt),
      role: isFirst || phone === (process.env.ADMIN_PHONE || "") ? "admin" : "user",
      createdAt: Date.now(),
    };
    await saveUser(user);
    const token = await newSession(user.id);
    return ok({ token, user: pub(user), first: isFirst });
  }

  if (action === "login") {
    const phone = normPhone(body.phone);
    const u = await userByPhone(phone);
    if (!u || !verifyPass(String(body.password || ""), u.salt, u.passHash))
      return err("شماره تماس یا رمز عبور اشتباه است");
    const token = await newSession(u.id);
    return ok({ token, user: pub(u) });
  }

  if (action === "logout") {
    await endSession(req);
    return ok({ ok: true });
  }

  if (action === "update") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    u.firstName = firstName;
    u.lastName = lastName;
    await saveUser(u);
    return ok({ user: pub(u) });
  }

  if (action === "password") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    if (!verifyPass(String(body.oldPass || ""), u.salt, u.passHash))
      return err("رمز فعلی اشتباه است");
    const newPass = String(body.newPass || "");
    if (newPass.length < 4) return err("رمز جدید باید حداقل ۴ حرف باشد");
    u.salt = uid().slice(0, 12);
    u.passHash = hashPass(newPass, u.salt);
    await saveUser(u);
    return ok({ ok: true });
  }

  return err("درخواست نامعتبر");
}

export const config = { runtime: "nodejs" };

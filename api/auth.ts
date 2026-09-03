/* احراز هویت: ثبت‌نام، ورود، جلسه‌ی من، خروج، ویرایش، تغییر رمز
   + کارهای مدیریتی: listUsers (فهرست کاربران)، deleteUser (حذف کاربر)، wipe (حذف همه)
   ─ فقط به ماژول مشترک ./_kv وابسته است (الگوی رسمی Vercel) تا هرگز دچار
     ERR_MODULE_NOT_FOUND نشود. */
import {
  ADMIN_PASSWORD,
  ADMIN_PHONE,
  allUserIds,
  endSession,
  ensureAdmin,
  err,
  getUser,
  hashPass,
  jdel,
  jset,
  kvOk,
  newSession,
  normPhone,
  ok,
  pub,
  saveUser,
  sessionUser,
  tokenOf,
  uid,
  userByPhone,
  verifyPass,
  type DbUser,
} from "./_kv";

export default async function handler(req: Request) {
  if (!kvOk())
    return err("بک‌اند فعال نیست — در داشبورد Vercel یک فروشگاه KV (Redis) اضافه کنید.", 503);

  /* حساب مدیر ثابت را (اگر نیست) بساز تا همیشه قابل ورود باشد */
  await ensureAdmin();

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
    const email = (body.email || "").trim().toLowerCase() || undefined;
    const password = String(body.password || "");
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    if (phone.length < 3) return err("نام کاربری/شماره تماس معتبر نیست");
    if (password.length < 4) return err("رمز عبور باید حداقل ۴ حرف باشد");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("ایمیل معتبر نیست");
    if (await userByPhone(phone)) return err("این نام کاربری/شماره قبلاً ثبت شده — وارد شوید");

    const salt = uid().slice(0, 12);
    const user: DbUser = {
      id: uid(),
      firstName,
      lastName,
      phone,
      email,
      salt,
      passHash: hashPass(password, salt),
      /* کاربران عادی همیشه نقش «user» می‌گیرند؛ فقط حساب مدیر (با نام کاربری
         و رمز ثابت) نقش «admin» دارد. */
      role: phone === ADMIN_PHONE ? "admin" : "user",
      createdAt: Date.now(),
    };
    await saveUser(user);
    const token = await newSession(user.id);
    return ok({ token, user: pub(user), first: false });
  }

  if (action === "login") {
    const phone = normPhone(body.phone);
    const u = await userByPhone(phone);
    if (!u || !verifyPass(String(body.password || ""), u.salt, u.passHash))
      return err("نام کاربری یا رمز عبور اشتباه است");
    const token = await newSession(u.id);
    return ok({ token, user: pub(u) });
  }

  if (action === "logout") {
    const token = tokenOf(req);
    if (token) await jdel(`s:${token}`);
    return ok({ ok: true });
  }

  if (action === "update") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase() || undefined;
    if (!firstName || !lastName) return err("نام و نام خانوادگی را کامل وارد کنید");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return err("ایمیل معتبر نیست");
    u.firstName = firstName;
    u.lastName = lastName;
    u.email = email;
    await saveUser(u);
    return ok({ user: pub(u) });
  }

  if (action === "password") {
    const u = await sessionUser(req);
    if (!u) return err("وارد نشده‌اید", 401);
    if (!verifyPass(String(body.oldPass || ""), u.salt, u.passHash)) return err("رمز فعلی اشتباه است");
    const newPass = String(body.newPass || "");
    if (newPass.length < 4) return err("رمز جدید باید حداقل ۴ حرف باشد");
    u.salt = uid().slice(0, 12);
    u.passHash = hashPass(newPass, u.salt);
    await saveUser(u);
    return ok({ ok: true });
  }

  /* ───── کارهای مدیریتی ───── */

  if (action === "listUsers") {
    const me = await sessionUser(req);
    if (!me || me.role !== "admin") return err("دسترسی فقط برای مدیر", 403);
    const ids = await allUserIds();
    const users = [];
    for (const id of ids) {
      const u = await getUser(id);
      if (u) users.push(pub(u));
    }
    return ok({ users });
  }

  if (action === "deleteUser") {
    const me = await sessionUser(req);
    if (!me || me.role !== "admin") return err("دسترسی فقط برای مدیر", 403);
    const targetId = String(body.targetId || "");
    if (!targetId) return err("کاربر مشخص نشده است");
    if (targetId === me.id) return err("نمی‌توانید حساب خودتان را حذف کنید");
    const target = await getUser(targetId);
    if (!target) return err("کاربر پیدا نشد", 404);
    await jdel(`u:${targetId}`);
    const ids = await allUserIds();
    await jset("users", ids.filter((id) => id !== targetId));
    return ok({ ok: true });
  }

  if (action === "wipe") {
    const me = await sessionUser(req);
    if (!me || me.role !== "admin") return err("دسترسی فقط برای مدیر", 403);
    const ids = await allUserIds();
    let deleted = 0;
    for (const id of ids) {
      if (id === me.id) continue; /* حساب خود مدیر حفظ می‌شود تا قفل نشود */
      await jdel(`u:${id}`);
      deleted++;
    }
    await jset("users", ids.filter((id) => id === me.id));
    return ok({ ok: true, deleted });
  }

  return err("درخواست نامعتبر");
}

export const config = { runtime: "nodejs" };

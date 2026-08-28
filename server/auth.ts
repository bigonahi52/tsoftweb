/* ابزارهای امنیتی سمت سرور */
import { randomBytes, scryptSync } from "crypto";

export const uid = () => randomBytes(6).toString("hex") + Date.now().toString(36);

export const hashPass = (pass: string, salt: string) =>
  scryptSync(pass, salt, 32).toString("hex");

export const verifyPass = (pass: string, salt: string, stored: string) => {
  try {
    return hashPass(pass, salt) === stored;
  } catch {
    return false;
  }
};

/** شماره‌ی تلفن را یکدست می‌کند (ارقام فارسی ← لاتین، حذف فاصله و خط) */
export const normPhone = (p: string) =>
  String(p || "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s\-()]/g, "");

export const err = (message: string, status = 400) =>
  Response.json({ error: message }, { status });

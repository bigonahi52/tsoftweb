/*
  تنظیمات Firebase — برای ذخیره‌ی اطلاعات در ابر (پاک نمی‌شود و بین همه‌ی دستگاه‌ها هماهنگ است)

  چطور فعالش کنید (۵ دقیقه، رایگان):
  ۱. بروید به https://console.firebase.google.com و با اکانت گوگل وارد شوید
  ۲. روی «Add project» بزنید، یک نام بگذارید (مثلاً tsoft20) و بسازید
  ۳. در صفحه‌ی پروژه، روی آیکون «Web» (علامت </>) بزنید تا یک App ساخته شود
  ۴. بعد از ساخت، یک کد config نمایش داده می‌شود — مقادیر آن را جایگزین مقادیر زیر کنید
  ۵. از منوی Build گزینه‌ی «Firestore Database» را باز کنید، «Create database» بزنید
     و حالت «Start in test mode» را انتخاب کنید (برای شروع کافی است)
  تمام — از این لحظه اطلاعات سایت در ابر ذخیره می‌شود.
*/
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

/** آیا تنظیمات واقعی وارد شده یا هنوز جای‌نگه‌دار است؟ */
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("PASTE_");

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase init failed, falling back to local storage.", e);
  }
}

export { app, db };

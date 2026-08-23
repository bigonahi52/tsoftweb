/*
  لایه‌ی هماهنگ‌سازی ابری (Firebase Firestore)
  - خواندن‌ها از حافظه‌ی محلی انجام می‌شود (سریع و همیشه در دسترس)
  - هر نوشتن، هم محلی ذخیره می‌شود و هم به ابر فرستاده می‌شود
  - با هر تغییر در ابر، همه‌ی دستگاه‌ها به‌صورت زنده به‌روز می‌شوند
*/
import { db, isFirebaseConfigured } from "./firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";

/** نگاشت کلید محلی به نام کلکسیون در ابر */
export const CLOUD_MAP: Record<string, string> = {
  tsoft_users: "users",
  tsoft_msgs: "messages",
  tsoft_files: "files",
  tsoft_invoices: "invoices",
  tsoft_tickets: "tickets",
};

type Item = { id: string } & Record<string, unknown>;

let started = false;

function localRead(key: string): Item[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Item[]) : [];
  } catch {
    return [];
  }
}
function localWrite(key: string, items: Item[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

/** فرستادن همه‌ی آیتم‌های یک کلکسیون به ابر (هرکدام با شناسه‌ی خودش) */
export function pushCollection(key: string, items: Item[]) {
  if (!isFirebaseConfigured || !db) return;
  const col = CLOUD_MAP[key];
  if (!col || !Array.isArray(items)) return;
  items.forEach((it) => {
    if (it && it.id) {
      try {
        setDoc(doc(db!, col, String(it.id)), it as Record<string, unknown>);
      } catch {
        /* ignore */
      }
    }
  });
}

/** ادغام داده‌ی ابری با داده‌ی محلی بر اساس شناسه (ابر مرجع است) */
function mergeFromCloud(key: string, cloudItems: Item[]) {
  const byId = new Map<string, Item>();
  localRead(key).forEach((it) => it && it.id && byId.set(String(it.id), it));
  cloudItems.forEach((it) => it && it.id && byId.set(String(it.id), it));
  localWrite(key, Array.from(byId.values()));
  window.dispatchEvent(new Event("tsoft-data"));
  window.dispatchEvent(new Event("tsoft-auth"));
}

/** راه‌اندازی شنونده‌های زنده — فقط یک بار صدا زده می‌شود */
export function initCloudSync() {
  if (started || !isFirebaseConfigured || !db) return;
  started = true;
  Object.entries(CLOUD_MAP).forEach(([key, col]) => {
    try {
      onSnapshot(
        collection(db!, col),
        (snap) => {
          const items: Item[] = [];
          snap.forEach((d) => items.push(d.data() as Item));
          mergeFromCloud(key, items);
        },
        () => {
          /* در صورت خطا، سایت با حافظه‌ی محلی به کارش ادامه می‌دهد */
        }
      );
    } catch {
      /* ignore */
    }
  });
}

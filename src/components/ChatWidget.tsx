import { PHONE_FA } from "../lib";
import { Icon } from "./Icons";

/* دکمه‌ی شناور چت — راهنمایی سریع به سمت تماس/پیام‌رسان‌ها */
export default function ChatWidget() {
  return (
    <a
      href={`tel:+989153133726`}
      aria-label="چت با پشتیبانی"
      title={`چت با پشتیبانی — ${PHONE_FA}`}
      className="group fixed bottom-6 right-6 z-[65] flex h-15 w-15 items-center justify-center rounded-full bg-teal-500 text-ink-950 shadow-[0_16px_40px_-10px_rgba(12,31,25,0.7)] transition-all duration-300 hover:scale-105"
      style={{ height: 60, width: 60 }}
    >
      <span className="phone-ring-pulse absolute inset-0 rounded-full border-2 border-teal-500/60" aria-hidden />
      <Icon name="chat" className="h-7 w-7 transition-transform duration-300 group-hover:rotate-6" />
      <span className="absolute -left-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-teal-500" />
    </a>
  );
}

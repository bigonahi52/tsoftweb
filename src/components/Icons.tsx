import type { SVGProps } from "react";

/* ── آیکون‌های خطی ── */
const paths: Record<string, React.ReactNode> = {
  receipt: (
    <>
      <path d="M6 3h12v18l-2.4-1.6L13.2 21l-2.4-1.6L8.4 21 6 19.4V3Z" />
      <path d="M9 8h6M9 12h6M9 15.5h4" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  network: (
    <>
      <rect x="9" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="15" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M12 9v3M12 12H6v3M12 12h6v3" />
    </>
  ),
  ledger: (
    <>
      <path d="M5 4h14v16H5a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 5 4Z" />
      <path d="M8 4v16M11.5 9h4M11.5 13h4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M8 20h8" />
      <path d="M12 6 5 8m7-2 7 2" />
      <path d="M5 8l-2 5a3.5 3.5 0 0 0 7 0L8 8M19 8l-2 5a3.5 3.5 0 0 0 7 0l-2-5" transform="translate(-1.5 0)" />
    </>
  ),
  report: (
    <>
      <path d="M5 4h11l3 3v13H5V4Z" />
      <path d="M16 4v3h3M9 16v-3M12 16v-5M15 16v-2" />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="M14.5 7.6A5 5 0 1 1 7.6 14.5" />
      <path d="M9 7v4M7.5 9h3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  edit: (
    <>
      <path d="M14 5.5 18.5 10 8 20.5H3.5V16L14 5.5Z" />
      <path d="M12.5 7 17 11.5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  barcode: (
    <>
      <path d="M4 6v12M7.5 6v12M10 6v9M13 6v12M16 6v9M20 6v12" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" />
      <path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.8c2.2.8 3.5 2.5 3.5 5.2" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3h10v5" />
      <rect x="4" y="8" width="16" height="8" rx="1.5" />
      <path d="M7 13h10v8H7v-8Z" />
    </>
  ),
  phone: (
    <>
      <path d="M6 4h3.5l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 13l4 1.5V18a2 2 0 0 1-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  chat: (
    <>
      <path d="M12 3.5c-4.7 0-8.5 3.2-8.5 7.1 0 1.6.7 3.1 1.8 4.3l-.6 3.4 3.5-1.6c1.2.4 2.5.6 3.8.6 4.7 0 8.5-3.2 8.5-7.1S16.7 3.5 12 3.5Z" />
      <path d="M8.2 10.6h.01M12 10.6h.01M15.8 10.6h.01" strokeLinecap="round" strokeWidth="2.2" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v.7a2.3 2.3 0 0 1-2.3 2.3H13" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4.5" />
      <path d="M11.2 11.2 20 20M16.5 16.5 19 14M14 14l1.8-1.8" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5 4 4 0 0 1 17.5 18H7Z" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
      <rect x="10" y="10" width="4" height="4" rx="0.8" />
      <path d="M9 3.5v3M15 3.5v3M9 17.5v3M15 17.5v3M3.5 9h3M3.5 15h3M17.5 9h3M17.5 15h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4.5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-2 7 5.5-3 5.5 3-2-7" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-9.3-9.2A5.2 5.2 0 0 1 12 6.7a5.2 5.2 0 0 1 9.3 4.1C19.5 15.4 12 20 12 20Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l7 4.5V4L8 8H5.5A1.5 1.5 0 0 0 4 10Z" />
      <path d="M18 9a3.5 3.5 0 0 1 0 6M8 15.5V19a1.5 1.5 0 0 0 3 .5" />
    </>
  ),
  update: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01" strokeLinecap="round" strokeWidth="2.4" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 1 0 2.8 2.8l5.5-5.5a4.5 4.5 0 0 0 5.6-6L14 12l-2-2 2.5-3.5Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 10 14M21 3l-7 18-3-7-7-3 17-8Z" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  play: (
    <>
      <path d="M7 5.5v13l11-6.5-11-6.5Z" />
    </>
  ),
  check: (
    <>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5 13.5 5h2.7l1 2.4 2.4 1v2.7L22 12.5 19.6 14v2.7l-2.4 1-1 2.4h-2.7L12 22.5 10.5 20H7.8l-1-2.4-2.4-1v-2.7L2 12.5 4.4 11V8.3l2.4-1 1-2.4h2.7L12 2.5Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeoff: (
    <>
      <path d="M4 4l16 16" />
      <path d="M10.6 5.9c.46-.06.93-.1 1.4-.1 6 0 9.5 6.2 9.5 6.2a17.4 17.4 0 0 1-2.7 3.4M6.7 6.8A16.8 16.8 0 0 0 2.5 12S6 18.2 12 18.2c1.2 0 2.3-.25 3.3-.64" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
};

export function Icon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] ?? paths.box}
    </svg>
  );
}

/* ── لوگوی رسمی TSOFT (مونوگرام T + کمان C طلایی) ── */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="لوگوی تیسافت">
      <rect width="48" height="48" rx="13.5" fill="#0e9f6e" />
      <rect x="8.5" y="8.5" width="31" height="31" rx="8.5" fill="#0c1f19" opacity="0.55" />
      <rect x="11" y="13" width="21" height="4.6" rx="2.3" fill="#eef4ee" />
      <rect x="18.8" y="13" width="4.8" height="22" rx="2.4" fill="#eef4ee" />
      <path d="M25.7 21 A 8.6 8.6 0 1 1 25.7 32" stroke="#eaa63b" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SiteLogo({ className }: { className?: string }) {
  return <Logo className={className} />;
}

/* ── پرچم کشورها ── */
const flags: Record<string, React.ReactNode> = {
  USD: (
    <>
      <rect width="24" height="16" fill="#b22234" />
      {[2, 4.5, 7, 9.5, 12, 14].map((y) => (
        <rect key={y} y={y} width="24" height="1.2" fill="#fff" />
      ))}
      <rect width="10" height="8" fill="#3c3b6e" />
    </>
  ),
  EUR: (
    <>
      <rect width="24" height="16" fill="#003399" />
      <circle cx="12" cy="8" r="4.5" fill="none" stroke="#ffcc00" strokeWidth="1.4" strokeDasharray="1.5 1.4" />
    </>
  ),
  AED: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.3" fill="#00732f" />
      <rect y="10.7" width="24" height="5.3" fill="#000" />
      <rect width="6" height="16" fill="#ff0000" />
    </>
  ),
  AFN: (
    <>
      <rect width="24" height="16" fill="#000" />
      <rect x="8" width="8" height="16" fill="#d32011" />
      <circle cx="12" cy="8" r="2.6" fill="none" stroke="#fff" strokeWidth="1" />
    </>
  ),
  IRR: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.3" fill="#239f40" />
      <rect y="10.7" width="24" height="5.3" fill="#da0000" />
      <circle cx="12" cy="8" r="1.6" fill="#da0000" />
    </>
  ),
  TRY: (
    <>
      <rect width="24" height="16" fill="#e30a17" />
      <circle cx="9.5" cy="8" r="3.6" fill="#fff" />
      <circle cx="10.4" cy="8" r="2.9" fill="#e30a17" />
      <path d="m13.5 6.4.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.8-1.3.8.3-1.5-1.1-1 1.5-.2.6-1.4Z" fill="#fff" transform="scale(0.7) translate(6.5 4)" />
    </>
  ),
  IQD: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.3" fill="#ce1126" />
      <rect y="10.7" width="24" height="5.3" fill="#000" />
      <path d="M6 9.2h12" stroke="#007a3d" strokeWidth="1.4" />
    </>
  ),
};

export function Flag({ code, className }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" style={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>
      {flags[code] ?? <rect width="24" height="16" fill="#5d8a72" />}
    </svg>
  );
}

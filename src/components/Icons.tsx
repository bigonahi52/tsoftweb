import { useEffect, useState } from "react";

const paths: Record<string, React.ReactNode> = {
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.6V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </>
  ),
  network: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M12 12H6v4M12 12h6v4" />
    </>
  ),
  ledger: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2" />
      <path d="M8.5 3v18M12 8h4M12 12h4M12 16h4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M8 20h8M12 4 6 7M12 4l6 3" />
      <path d="M6 7 3.5 13a3 3 0 0 0 5 0L6 7ZM18 7l-2.5 6a3 3 0 0 0 5 0L18 7Z" />
    </>
  ),
  report: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M9 6.5v5M7.3 8h3.4" />
      <path d="M14.5 8.6a5.5 5.5 0 1 1-5.9 7.9" />
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
      <path d="m14.5 5 4.5 4.5L8.5 20H4v-4.5L14.5 5Z" />
      <path d="m12.5 7 4.5 4.5" />
    </>
  ),
  store: (
    <>
      <path d="M4 8 5.5 3h13L20 8M4 8v13h16V8M4 8h16" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  barcode: (
    <>
      <path d="M4 5v14M8 5v14M11 5v14M14 5v10M17 5v14M20 5v14" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4M8 20h8" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="9" r="2.8" />
      <path d="M15.5 14.6a4.8 4.8 0 0 1 5 4.4" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v6h-4v5H7v-5H3v-6a2 2 0 0 1 2-2Z" />
      <path d="M7 16h10" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V9l6 4V9l6 4V4h6v17H3Z" />
      <path d="M8 17h2M13 17h2M17.5 17h1.5" />
    </>
  ),
  phone: (
    <>
      <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
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
      <path d="M4.5 13a7.5 7.5 0 0 1 15 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4.5" />
      <path d="m11.5 11.5 8 8M17 17l2-2M14.5 14.5l2-2" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A4 4 0 0 1 17 18H7Z" />
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
      <path d="M12 3 5 6v5.5c0 4.5 3 7.8 7 9.5 4-1.7 7-5 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l2.2 6L21 12l-6.8 3L12 21l-2.2-6L3 12l6.8-3L12 3Z" />
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
      <path d="M12 20s-7.5-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 11c-1.8 4.4-9.3 9-9.3 9Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10v4l3 .5V9.5L3 10ZM6 9.5 18 4v16L6 14.5M18 8.5a3.5 3.5 0 0 1 0 7" />
      <path d="m8 15 1.2 5h3l-.9-4.2" />
    </>
  ),
  update: (
    <>
      <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2M19.5 12a7.5 7.5 0 0 1-13 5.2" />
      <path d="M17.5 3v4h-4M6.5 21v-4h4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5S14.5 18.2 12 20.5C9.5 18.2 8.2 15.3 8.2 12S9.5 5.8 12 3.5Z" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6h12v11h-12zM14.5 9h4l3 3.5V17h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01M11 7.5h3M11 16.5h3" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4.5 4.5 0 0 1 5.7-1.4l-3.2 3.2 1.7 1.7L21.9 6.8a4.5 4.5 0 0 1-5.9 5.9L8 20.7a2 2 0 0 1-2.8-2.8l8-8a4.5 4.5 0 0 1 1.3-3.4Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5L19.5 7" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  download: (
    <>
      <path d="M12 3v11M7.5 9.5 12 14l4.5-4.5" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" />
    </>
  ),
  fullscreen: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </>
  ),
};

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] ?? paths.box}
    </svg>
  );
}

/* ───────── لوگو ───────── */
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="13.5" fill="#0f948b" />
      <rect x="8.5" y="8.5" width="31" height="31" rx="8.5" fill="#17b0a6" />
      <rect x="15" y="14.5" width="18" height="4.4" rx="2.2" fill="#eef6f7" />
      <rect x="21.8" y="14.5" width="4.4" height="17.5" rx="2.2" fill="#eef6f7" />
      <circle cx="35.5" cy="33.5" r="5.6" fill="#e5a93d" />
      <path d="m33.2 33.5 1.7 1.7 3-3.4" stroke="#0f948b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** لوگوی هوشمند — اگر public/logo.png موجود بود از آن، وگرنه لوگوی داخلی */
export function SiteLogo({ className = "h-10 w-10" }: { className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrc("/logo.png");
    img.src = "/logo.png";
  }, []);
  if (src) return <img src={src} alt="لوگوی تیسافت" className={className} />;
  return <Logo className={className} />;
}

/* ───────── پرچم‌های گرافیکی ارزها ───────── */
export function Flag({ code, className = "h-6 w-9" }: { code: string; className?: string }) {
  const flags: Record<string, React.ReactNode> = {
    USD: (
      <>
        <rect width="36" height="24" fill="#B22234" />
        {[3, 9, 15, 21].map((y) => (
          <rect key={y} y={y} width="36" height="3" fill="#fff" />
        ))}
        <rect width="16" height="12" fill="#3C3B6E" />
        {[3, 6, 9, 12].map((x) =>
          [3, 6, 9].map((y) => <circle key={x + y} cx={x} cy={y} r="0.9" fill="#fff" />)
        )}
      </>
    ),
    EUR: (
      <>
        <rect width="36" height="24" fill="#003399" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return <circle key={i} cx={18 + 7 * Math.sin(a)} cy={12 - 7 * Math.cos(a)} r="1.1" fill="#FFCC00" />;
        })}
      </>
    ),
    AED: (
      <>
        <rect width="36" height="8" fill="#00732F" />
        <rect y="8" width="36" height="8" fill="#fff" />
        <rect y="16" width="36" height="8" fill="#242424" />
        <rect width="10" height="24" fill="#FF0000" />
      </>
    ),
    AFN: (
      <>
        <rect width="12" height="24" fill="#000" />
        <rect x="12" width="12" height="24" fill="#D32011" />
        <rect x="24" width="12" height="24" fill="#007A36" />
        <circle cx="18" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.2" />
        <path d="M18 9v6M16 12h4" stroke="#fff" strokeWidth="1" />
      </>
    ),
    IRR: (
      <>
        <rect width="36" height="8" fill="#239F40" />
        <rect y="8" width="36" height="8" fill="#fff" />
        <rect y="16" width="36" height="8" fill="#DA0000" />
        <path d="M15 12c0 2.5 1.3 4 3 4s3-1.5 3-4c-.8.8-1.8 1-3 1s-2.2-.2-3-1Z" fill="#DA0000" />
      </>
    ),
    TRY: (
      <>
        <rect width="36" height="24" fill="#E30A17" />
        <circle cx="15" cy="12" r="5.5" fill="#fff" />
        <circle cx="16.5" cy="12" r="4.4" fill="#E30A17" />
        <path d="m21 9.5 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3 1-2Z" fill="#fff" transform="scale(0.8) translate(7 2.5)" />
      </>
    ),
    IQD: (
      <>
        <rect width="36" height="8" fill="#CE1126" />
        <rect y="8" width="36" height="8" fill="#fff" />
        <rect y="16" width="36" height="8" fill="#000" />
        <path d="M10 14h16" stroke="#007A3D" strokeWidth="2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 36 24" className={`${className} shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10`} aria-hidden>
      {flags[code] ?? flags.USD}
    </svg>
  );
}

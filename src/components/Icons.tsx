import React from "react";

const paths: Record<string, React.ReactNode> = {
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6L8.4 20.5 6 18.9v-15.4Z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="m4 7 8 4 8-4M12 11v10" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="12" cy="18" r="2.4" />
      <path d="M7.8 7.6 10.7 16M16.2 7.6 13.3 16M8.4 6h7.2" />
    </>
  ),
  ledger: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5v17M12.5 8h3.5M12.5 11.5h3.5M12.5 15h2" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M12 6.5 6 8m6-1.5L18 8" />
      <path d="M3.5 13.5 6 8l2.5 5.5a2.7 2.7 0 0 1-5 0ZM15.5 13.5 18 8l2.5 5.5a2.7 2.7 0 0 1-5 0Z" />
    </>
  ),
  report: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 15v-3.5M12 15V8.5M16 15v-5" strokeLinecap="round" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5.5" ry="2.8" />
      <path d="M3.5 7v5c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8V7" />
      <path d="M3.5 12v5c0 1.5 2.5 2.8 5.5 2.8 1.2 0 2.3-.2 3.2-.6" />
      <path d="M14.6 10.2c.6 3.9 3 6.3 5.9 6.3v-4.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" />
    </>
  ),
  edit: (
    <>
      <path d="m14.5 5.5 4 4L8 20l-4.7.7L4 16 14.5 5.5Z" />
      <path d="m12.5 7.5 4 4" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5a2.6 2.6 0 0 0 5.3 0 2.65 2.65 0 0 0 5.4 0 2.6 2.6 0 0 0 5.3 0M5 12v8h14v-8" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  barcode: (
    <>
      <path d="M4 6v12M7.5 6v12M10 6v12M13.5 6v12M16 6v12M20 6v12" strokeLinecap="round" />
    </>
  ),
  monitor: (
    <>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M12 4a5.5 5.5 0 0 1 5.5 5.5c0 4.5 1.5 6 1.5 6H5s1.5-1.5 1.5-6A5.5 5.5 0 0 1 12 4Z" />
      <path d="M10 19a2.1 2.1 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.5-3.4 2.7-5.3 5.5-5.3s5 1.9 5.5 5.3" />
      <path d="M15.5 5.8a3.2 3.2 0 0 1 0 5.4M17.5 14.6c1.6.8 2.7 2.4 3 4.9" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V4h10v4M7 17H4.5V10a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7H17" />
      <rect x="7" y="14.5" width="10" height="5.5" rx="1" />
    </>
  ),
  phone: (
    <>
      <path d="M5.5 4h3.6l1.5 4-2.2 1.7a12.5 12.5 0 0 0 5.9 5.9L16 13.4l4 1.5v3.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />
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
      <path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13" />
      <rect x="3.5" y="12.5" width="4" height="6" rx="1.5" />
      <rect x="16.5" y="12.5" width="4" height="6" rx="1.5" />
      <path d="M19.5 18.5v.7a2.3 2.3 0 0 1-2.3 2.3H13" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4.5" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m11.5 11.5 8 8M17 17l2-2M14.5 14.5l2-2" strokeLinecap="round" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.7 1.2A4 4 0 0 1 17.5 18H7Z" />
      <path d="M12 12.5v4.5m0 0-2-2m2 2 2-2" strokeLinecap="round" />
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
      <path d="M12 3.5 5 6v5.5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-2.5Z" />
      <path d="m9 11.5 2.2 2.2 4-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5c.6 4.5 2 5.9 6.5 6.5-4.5.6-5.9 2-6.5 6.5-.6-4.5-2-5.9-6.5-6.5 4.5-.6 5.9-2 6.5-6.5Z" />
      <path d="M18.5 15.5c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.8 13.5-1.6 7 4.8-2.7 4.8 2.7-1.6-7" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="m4 10.5 12-5.5v14L4 13.5v-3Z" />
      <path d="M16 8.5a3.5 3.5 0 0 1 0 7M6.5 14.5 8 20h3l-1.2-5" />
    </>
  ),
  update: (
    <>
      <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2L20 9M20 4.5V9h-4.5M19.5 12a7.5 7.5 0 0 1-13 5.2L4 15M4 19.5V15h4.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M3.5 12h17M12 3.5c-2.5 2.3-3.8 5.2-3.8 8.5s1.3 6.2 3.8 8.5c2.5-2.3 3.8-5.2 3.8-8.5S14.5 5.8 12 3.5Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" strokeLinecap="round" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h12v10h-12zM14.5 10h4l3 3.5v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01" strokeLinecap="round" strokeWidth="2.2" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4.5 4.5 0 0 1 5.6-.6l-3 3 .4 2.6 2.6.4 3-3" transform="translate(-3 -1)" />
      <path d="M13.5 10.5 5 19a2 2 0 0 1-2.8-2.8l8.5-8.5" transform="translate(1 0)" />
    </>
  ),
  arrow: (
    <>
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 19.5h15" strokeLinecap="round" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 3.5 10l6.5 2.5L12.5 19l8-15.5Z" strokeLinejoin="round" />
      <path d="m10 12.5 4.5-4.5" strokeLinecap="round" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3.5h9l3 3V20.5H6z" strokeLinejoin="round" />
      <path d="M15 3.5v3h3" strokeLinejoin="round" />
      <path d="M9 10h6M9 13h6M9 16h3.5" strokeLinecap="round" />
    </>
  ),
  file: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" strokeLinejoin="round" />
      <path d="M14 3.5v4h4" strokeLinejoin="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
      <path d="M8.5 10.5v-3a3.5 3.5 0 0 1 7 0v3" />
      <path d="M12 14.5v2" strokeLinecap="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" strokeLinecap="round" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5H6.5v15H14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 12H21m0 0-3.5-3.5M21 12l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5l.8 13h9.4l.8-13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5v5.5M14 10.5v5.5" strokeLinecap="round" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </>
  ),
  play: (
    <>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </>
  ),
  check: (
    <>
      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="1.5" transform="rotate(-20 12 12)" />
      <path d="m8.5 9.5 1 2.5M12 8.2l1 2.5M15.5 7l1 2.5" strokeLinecap="round" />
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

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="13.5" fill="#0f948b" />
      <rect x="8.5" y="8.5" width="31" height="31" rx="8.5" fill="#14313a" />
      <rect x="15" y="14.5" width="18" height="4.4" rx="2.2" fill="#eef6f7" />
      <rect x="21.8" y="14.5" width="4.4" height="17.5" rx="2.2" fill="#eef6f7" />
      <circle cx="35.5" cy="33.5" r="5.6" fill="#E5A93D" />
      <path d="m33.2 33.5 1.7 1.7 3-3.4" stroke="#0f262e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SiteLogo({ className = "h-10 w-10" }: { className?: string }) {
  const [broken, setBroken] = React.useState(false);
  if (!broken) {
    return <img src="/logo.png" alt="تیسافت" className={className} onError={() => setBroken(true)} />;
  }
  return <Logo className={className} />;
}

const flags: Record<string, React.ReactNode> = {
  USD: (
    <>
      <rect width="24" height="16" rx="2" fill="#f4f4f4" />
      <path d="M0 3h24M0 6.5h24M0 10h24M0 13.5h24" stroke="#C8452C" strokeWidth="1.6" />
      <rect width="10" height="8" rx="1.5" fill="#2E4C7A" />
      <circle cx="2.6" cy="2.3" r="0.7" fill="#fff" /><circle cx="5.6" cy="2.3" r="0.7" fill="#fff" /><circle cx="8" cy="2.3" r="0.7" fill="#fff" />
      <circle cx="4" cy="4.4" r="0.7" fill="#fff" /><circle cx="6.8" cy="4.4" r="0.7" fill="#fff" />
      <circle cx="2.6" cy="6.3" r="0.7" fill="#fff" /><circle cx="5.6" cy="6.3" r="0.7" fill="#fff" /><circle cx="8" cy="6.3" r="0.7" fill="#fff" />
    </>
  ),
  EUR: (
    <>
      <rect width="24" height="16" rx="2" fill="#20387F" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
        const r = (a * Math.PI) / 180;
        return <circle key={a} cx={12 + 5.4 * Math.cos(r)} cy={8 + 5.4 * Math.sin(r)} r="0.85" fill="#F5C400" />;
      })}
    </>
  ),
  AED: (
    <>
      <rect width="24" height="16" rx="2" fill="#f4f4f4" />
      <rect width="24" height="5.4" rx="2" fill="#00843D" />
      <rect y="10.6" width="24" height="5.4" rx="2" fill="#232323" />
      <rect width="6.5" height="16" rx="1.5" fill="#CE1126" />
    </>
  ),
  AFN: (
    <>
      <rect width="24" height="16" rx="2" fill="#232323" />
      <rect x="0" width="8" height="16" fill="#232323" />
      <rect x="8" width="8" height="16" fill="#C8102E" />
      <rect x="16" width="8" height="16" fill="#009E49" />
      <circle cx="12" cy="8" r="2.6" fill="none" stroke="#F5C400" strokeWidth="1" />
      <path d="M12 5.8v4.4M10.5 8h3" stroke="#F5C400" strokeWidth="0.9" />
    </>
  ),
  IRR: (
    <>
      <rect width="24" height="16" rx="2" fill="#f4f4f4" />
      <rect width="24" height="5.2" rx="2" fill="#1F9A48" />
      <rect y="10.8" width="24" height="5.2" rx="2" fill="#C8102E" />
      <path d="M12 5.6c-1.6 1-1.6 3.8 0 4.8 1.6-1 1.6-3.8 0-4.8Z" fill="#C8102E" />
    </>
  ),
  TRY: (
    <>
      <rect width="24" height="16" rx="2" fill="#CE1126" />
      <circle cx="10" cy="8" r="3.6" fill="#f4f4f4" />
      <circle cx="11" cy="8" r="2.9" fill="#CE1126" />
      <path d="m14.6 6.4.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2.7-1.5Z" fill="#f4f4f4" />
    </>
  ),
  IQD: (
    <>
      <rect width="24" height="16" rx="2" fill="#f4f4f4" />
      <rect width="24" height="5.2" rx="2" fill="#C8102E" />
      <rect y="10.8" width="24" height="5.2" rx="2" fill="#232323" />
      <path d="M6 9.4c.8-.9 2-.9 2.6 0M11 9.4c.8-.9 2-.9 2.6 0M16 9.4c.8-.9 2-.9 2.6 0" stroke="#007A3D" strokeWidth="1" fill="none" strokeLinecap="round" />
    </>
  ),
};

export function Flag({ code, className = "h-6 w-9" }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={`${className} shrink-0 rounded-[3px]`} aria-hidden>
      {flags[code] ?? <rect width="24" height="16" rx="2" fill="#5b8b99" />}
    </svg>
  );
}

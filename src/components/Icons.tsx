const paths: Record<string, React.ReactNode> = {
  receipt: (
    <>
      <path d="M6 3h12v18l-2.4-1.6L13.2 21l-2.4-1.6L8.4 21 6 19.4V3Z" />
      <path d="M9 8h6M9 12h6M9 15.5h4" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5" cy="18" r="2.4" />
      <circle cx="19" cy="18" r="2.4" />
      <path d="M12 7.5V12m0 0-5.4 4M12 12l5.4 4" />
    </>
  ),
  ledger: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5v17M12.5 8h3.5M12.5 12h3.5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10" />
      <path d="M5 8 12 6l7 2" />
      <path d="M5 8l-2.5 5a3 3 0 0 0 5 0L5 8ZM19 8l-2.5 5a3 3 0 0 0 5 0L19 8Z" />
    </>
  ),
  report: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
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
      <path d="M4 20h16" />
      <path d="M6 16 16.5 5.5a1.9 1.9 0 0 1 2.7 0l.3.3a1.9 1.9 0 0 1 0 2.7L9 19l-4 1 1-4Z" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5.5 4h13L20 9" />
      <path d="M4 9a2.6 2.6 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.6 2.6 0 0 0 20 9" />
      <path d="M5.5 12v8h13v-8M10 20v-5h4v5" />
    </>
  ),
  barcode: (
    <>
      <path d="M4 6v12M7.5 6v12M10 6v12M13.5 6v12M16 6v12M20 6v12" strokeWidth="1.6" />
    </>
  ),
  monitor: (
    <>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
    </>
  ),
  bell: (
    <>
      <path d="M12 4a6 6 0 0 1 6 6v3.5l1.5 3h-15L6 13.5V10a6 6 0 0 1 6-6Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6.3a3.2 3.2 0 0 1 0 4.9M17.5 14.6a5.5 5.5 0 0 1 3 4.4" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V4h10v4" />
      <rect x="4" y="8" width="16" height="8" rx="1.5" />
      <path d="M7 13h10v7H7v-7Z" />
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
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </>
  ),
  chat: (
    <>
      <path d="M12 3.5c-4.7 0-8.5 3.2-8.5 7.1 0 1.6.7 3.1 1.8 4.3l-.6 3.4 3.5-1.6c1.2.4 2.5.6 3.8.6 4.7 0 8.5-3.2 8.5-7.1S16.7 3.5 12 3.5Z" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5" />
      <rect x="3.5" y="13" width="4" height="6" rx="1.6" />
      <rect x="16.5" y="13" width="4" height="6" rx="1.6" />
      <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15.5" r="4.5" />
      <path d="M11.5 12.5 19 5M16.5 7.5l2.5 2.5M14 10l2 2" />
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
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.5 9.5" />
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
      <path d="m8.8 13.5-1.8 7 5-3 5 3-1.8-7" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7.5-4.6-9.3-9.2A5.2 5.2 0 0 1 12 6.7a5.2 5.2 0 0 1 9.3 4.1C19.5 15.4 12 20 12 20Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l7 4.5V4L8 8.5H5.5A1.5 1.5 0 0 0 4 10Z" />
      <path d="M18 9a3.5 3.5 0 0 1 0 6M8 15.5V19a1.5 1.5 0 0 0 3 .5" />
    </>
  ),
  update: (
    <>
      <path d="M19 12a7 7 0 1 1-2.3-5.2" />
      <path d="M19 3v4.5h-4.5" />
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
      <path d="M3.5 12h17M12 3.5c-2.7 2.5-2.7 14.5 0 17 2.7-2.5 2.7-14.5 0-17Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.2 15.2 5 5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3V6ZM14 10h4l3 3v3h-7v-6Z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4.5" width="16" height="6" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="6" rx="1.5" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01" strokeWidth="2" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5.2 5L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5-5.2L14.6 12l-2.6-2.6 2.5-2.9Z" />
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
      <path d="m4 11 16-7-5 16-3.5-6.5L4 11Z" />
      <path d="M11.5 13.5 20 4" />
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
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </>
  ),
  check: (
    <>
      <path d="m5 12.5 4.5 4.5L19 7" />
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

/** لوگوی تیسافت */
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="13.5" fill="var(--color-teal-600)" />
      <rect x="8.5" y="8.5" width="31" height="31" rx="8.5" fill="var(--color-ink-900)" opacity="0.55" />
      <rect x="15" y="14.5" width="18" height="4.4" rx="2.2" fill="#eef6f7" />
      <rect x="21.8" y="14.5" width="4.4" height="17.5" rx="2.2" fill="#eef6f7" />
      <circle cx="35.5" cy="33.5" r="5.6" fill="var(--color-gold-500)" />
      <path d="m33.2 33.5 1.7 1.7 3-3.4" stroke="var(--color-teal-600)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SiteLogo({ className }: { className?: string }) {
  return <Logo className={className} />;
}

const flags: Record<string, React.ReactNode> = {
  USD: (
    <>
      <rect width="30" height="20" fill="#b22234" />
      <rect y="2.86" width="30" height="2.86" fill="#fff" />
      <rect y="8.57" width="30" height="2.86" fill="#fff" />
      <rect y="14.28" width="30" height="2.86" fill="#fff" />
      <rect width="13" height="10" fill="#3c3b6e" />
    </>
  ),
  EUR: (
    <>
      <rect width="30" height="20" fill="#003399" />
      <circle cx="15" cy="10" r="6" fill="none" stroke="#ffcc00" strokeWidth="1.4" strokeDasharray="1.5 1.6" />
    </>
  ),
  AED: (
    <>
      <rect width="30" height="20" fill="#00732f" />
      <rect y="6.7" width="30" height="6.6" fill="#fff" />
      <rect y="13.3" width="30" height="6.7" fill="#111" />
      <rect width="9" height="20" fill="#ff0000" />
    </>
  ),
  AFN: (
    <>
      <rect width="10" height="20" fill="#111" />
      <rect x="10" width="10" height="20" fill="#d32011" />
      <rect x="20" width="10" height="20" fill="#007a36" />
      <circle cx="15" cy="10" r="3.4" fill="none" stroke="#fff" strokeWidth="1" />
    </>
  ),
  IRR: (
    <>
      <rect width="30" height="20" fill="#239f40" />
      <rect y="6.7" width="30" height="6.6" fill="#fff" />
      <rect y="13.3" width="30" height="6.7" fill="#da0000" />
      <path d="M15 8.2c-1 .9-1.4 2-.8 3.1.5 1 1.5 1.3 2.5 1" stroke="#da0000" strokeWidth="1" fill="none" />
    </>
  ),
  TRY: (
    <>
      <rect width="30" height="20" fill="#e30a17" />
      <circle cx="12.5" cy="10" r="5" fill="#fff" />
      <circle cx="14" cy="10" r="4" fill="#e30a17" />
      <path d="m17.5 10-1.2.9.45-1.45L15.6 8.6l1.5.02L17.6 7.2l.5 1.4 1.5-.05-1.15.95.45 1.45L17.5 10Z" fill="#fff" />
    </>
  ),
  IQD: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.6" fill="#ce1126" />
      <rect y="13.4" width="30" height="6.6" fill="#111" />
      <path d="M8 11.5h4M13 10l1 1.5h3" stroke="#007a3d" strokeWidth="1.2" fill="none" />
    </>
  ),
};

export function Flag({ code, className = "h-4 w-6" }: { code: string; className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} rounded-[3px] shadow-sm`} aria-hidden>
      {flags[code] ?? flags.USD}
    </svg>
  );
}

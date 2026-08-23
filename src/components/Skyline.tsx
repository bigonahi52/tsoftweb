/** صحنه‌های شهری مینیمال — تهران برای تیسافت، دوبی برای کپیتال */

type Win = { x: number; y: number; lit?: boolean; d?: number };

function WindowGrid({ bx, by, cols, rows, gx, gy, w = 7, h = 10 }: { bx: number; by: number; cols: number; rows: number; gx: number; gy: number; w?: number; h?: number }) {
  const wins: Win[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = (r * 7 + c * 3) % 5;
      wins.push({ x: bx + c * gx, y: by + r * gy, lit: k < 2, d: ((r + c) % 6) * 0.55 });
    }
  }
  return (
    <g>
      {wins.map((wn, i) => (
        <rect
          key={i}
          x={wn.x}
          y={wn.y}
          width={w}
          height={h}
          rx={1}
          fill={wn.lit ? "#e5a93d" : "#122b33"}
          opacity={wn.lit ? 0.85 : 0.9}
          className={wn.lit && i % 3 === 0 ? "tw" : undefined}
          style={wn.lit && i % 3 === 0 ? { animationDelay: `${wn.d}s` } : undefined}
        />
      ))}
    </g>
  );
}

const Stars = ({ seed = 1 }: { seed?: number }) => (
  <g fill="#7fa9b5">
    {[
      [60, 52, 1.6], [140, 90, 1.2], [250, 40, 1.8], [330, 74, 1.1], [415, 34, 1.5],
      [505, 60, 1.2], [590, 96, 1.7], [210, 118, 1], [470, 118, 1.2], [90, 130, 1.3],
    ].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} opacity={0.5} className="tw" style={{ animationDelay: `${(i * seed * 0.7) % 4}s` }} />
    ))}
  </g>
);

/* ─── صحنه‌ی تهران — تیسافت ─── */
export function TehranScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label="چشم‌انداز شب تهران با برج میلاد و فروشگاه">
      <defs>
        <linearGradient id="skT" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2a34" />
          <stop offset="70%" stopColor="#0a1d24" />
          <stop offset="100%" stopColor="#091a20" />
        </linearGradient>
      </defs>
      <rect width="640" height="440" fill="url(#skT)" />
      <Stars />

      {/* ماه */}
      <circle cx="546" cy="74" r="30" fill="#e5a93d" opacity="0.16" />
      <circle cx="546" cy="74" r="21" fill="#f0c066" opacity="0.92" />
      <circle cx="539" cy="68" r="5" fill="#e5a93d" opacity="0.5" />
      <circle cx="552" cy="80" r="3.4" fill="#e5a93d" opacity="0.5" />

      {/* لایه‌ی دوردست */}
      <g fill="#0f252d">
        <rect x="0" y="252" width="52" height="128" />
        <rect x="66" y="222" width="40" height="158" />
        <rect x="252" y="240" width="46" height="140" />
        <rect x="300" y="262" width="60" height="118" />
        <rect x="482" y="236" width="44" height="144" />
        <rect x="596" y="250" width="44" height="130" />
      </g>

      {/* برج میلاد */}
      <g>
        <polygon points="414,380 446,380 439,212 421,212" fill="#16333d" />
        <ellipse cx="430" cy="196" rx="40" ry="26" fill="#1b3d49" />
        <ellipse cx="430" cy="196" rx="40" ry="26" fill="none" stroke="#2b5663" strokeWidth="1.4" />
        <path d="M394 190 a40 26 0 0 1 72 0" fill="none" stroke="#43c9bf" strokeWidth="1.2" opacity="0.6" />
        {/* پنجره‌های نورانی غرفه */}
        <g fill="#e5a93d">
          <rect x="404" y="190" width="7" height="9" rx="1" className="tw" />
          <rect x="417" y="186" width="7" height="9" rx="1" opacity="0.9" />
          <rect x="430" y="185" width="7" height="9" rx="1" className="tw" style={{ animationDelay: "1.2s" }} />
          <rect x="443" y="187" width="7" height="9" rx="1" opacity="0.85" />
          <rect x="455" y="192" width="6" height="8" rx="1" className="tw" style={{ animationDelay: "2.1s" }} />
        </g>
        <rect x="426" y="128" width="8" height="44" fill="#16333d" />
        <line x1="430" y1="128" x2="430" y2="66" stroke="#2b5663" strokeWidth="3" />
        <line x1="430" y1="86" x2="430" y2="66" stroke="#43c9bf" strokeWidth="1.4" opacity="0.7" />
        <circle cx="430" cy="63" r="3.4" fill="#ff6b5e" className="blink-red" />
      </g>

      {/* ساختمان‌های میانی با پنجره */}
      <g>
        <rect x="46" y="268" width="74" height="112" fill="#143038" />
        <WindowGrid bx={54} by={278} cols={3} rows={4} gx={22} gy={26} />
        <rect x="132" y="296" width="56" height="84" fill="#122b33" />
        <WindowGrid bx={140} by={306} cols={2} rows={3} gx={24} gy={26} />
        <rect x="492" y="282" width="66" height="98" fill="#143038" />
        <WindowGrid bx={500} by={292} cols={3} rows={4} gx={20} gy={22} />
      </g>

      {/* فروشگاه تیسافت — پیشانی صحنه */}
      <g>
        <rect x="210" y="300" width="150" height="80" fill="#173844" />
        {/* سایه‌بان راه‌راه */}
        <g>
          <path d="M202 300 h166 l-10 20 h-146 z" fill="#0f948b" />
          <path d="M218 300 h24 l-3 20 h-24 z" fill="#c9efec" opacity="0.85" />
          <path d="M266 300 h24 l-3 20 h-24 z" fill="#c9efec" opacity="0.85" />
          <path d="M314 300 h24 l-3 20 h-24 z" fill="#c9efec" opacity="0.85" />
        </g>
        {/* تابلوی نورانی */}
        <rect x="238" y="328" width="94" height="18" rx="4" fill="#0c2129" stroke="#43c9bf" strokeWidth="1" opacity="0.95" />
        <rect x="246" y="334" width="30" height="6" rx="3" fill="#43c9bf" className="tw" style={{ animationDelay: "0.8s" }} />
        <rect x="282" y="334" width="42" height="6" rx="3" fill="#e5a93d" opacity="0.9" />
        {/* شیشه‌ی فروشگاه */}
        <rect x="222" y="352" width="60" height="28" fill="#0e262e" stroke="#2b5663" strokeWidth="1" />
        <rect x="230" y="358" width="20" height="7" rx="2" fill="#43c9bf" opacity="0.75" />
        <rect x="230" y="369" width="32" height="5" rx="2.5" fill="#2b5663" />
        <rect x="296" y="352" width="26" height="28" fill="#0e262e" stroke="#2b5663" strokeWidth="1" />
        <rect x="330" y="352" width="20" height="28" fill="#122b33" />
      </g>

      {/* رسید شناور */}
      <g className="float-soft">
        <rect x="376" y="318" width="52" height="64" rx="5" fill="#f6fbfb" transform="rotate(6 402 350)" />
        <g transform="rotate(6 402 350)">
          <rect x="384" y="328" width="26" height="4" rx="2" fill="#0f948b" />
          <rect x="384" y="338" width="36" height="3" rx="1.5" fill="#9cb4ba" />
          <rect x="384" y="346" width="30" height="3" rx="1.5" fill="#9cb4ba" />
          <rect x="384" y="354" width="36" height="3" rx="1.5" fill="#9cb4ba" />
          <rect x="384" y="365" width="36" height="5" rx="2.5" fill="#e5a93d" />
        </g>
      </g>

      {/* زمین */}
      <rect x="0" y="380" width="640" height="60" fill="#0b1e25" />
      <rect x="0" y="380" width="640" height="2" fill="#17b0a6" opacity="0.25" />
      <g fill="#17b0a6" opacity="0.12">
        <rect x="40" y="398" width="90" height="2" rx="1" />
        <rect x="240" y="412" width="120" height="2" rx="1" />
        <rect x="470" y="402" width="100" height="2" rx="1" />
      </g>
    </svg>
  );
}

/* ─── صحنه‌ی دوبی — کپیتال ─── */
export function DubaiScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label="چشم‌انداز شب دوبی با برج خلیفه و سکه‌های ارز">
      <defs>
        <linearGradient id="skD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122a33" />
          <stop offset="70%" stopColor="#0b1d24" />
          <stop offset="100%" stopColor="#091a20" />
        </linearGradient>
      </defs>
      <rect width="640" height="440" fill="url(#skD)" />
      <Stars seed={2} />

      {/* ماه */}
      <circle cx="96" cy="70" r="28" fill="#e5a93d" opacity="0.15" />
      <circle cx="96" cy="70" r="19" fill="#f0c066" opacity="0.92" />

      {/* لایه‌ی دوردست */}
      <g fill="#0f252d">
        <rect x="0" y="240" width="46" height="140" />
        <rect x="60" y="214" width="38" height="166" />
        <rect x="262" y="236" width="44" height="144" />
        <rect x="352" y="258" width="52" height="122" />
        <rect x="592" y="246" width="48" height="134" />
      </g>

      {/* برج خلیفه — مناره‌ی پلکانی */}
      <g>
        <path
          d="M148 380 L148 302 L158 302 L158 246 L168 246 L168 200 L176 200 L176 160 L183 160 L183 122 L188 122 L188 92 L192 92 L192 122 L197 122 L197 160 L204 160 L204 200 L212 200 L212 246 L222 246 L222 302 L232 302 L232 380 Z"
          fill="#173844"
        />
        <line x1="190" y1="92" x2="190" y2="44" stroke="#2b5663" strokeWidth="3" />
        <circle cx="190" cy="41" r="3.4" fill="#ff6b5e" className="blink-red" />
        {/* چراغ‌های پلکانی */}
        <g fill="#e5a93d">
          <rect x="172" y="256" width="5" height="7" rx="1" className="tw" />
          <rect x="182" y="210" width="5" height="7" rx="1" opacity="0.9" />
          <rect x="193" y="170" width="5" height="7" rx="1" className="tw" style={{ animationDelay: "1.4s" }} />
          <rect x="203" y="256" width="5" height="7" rx="1" opacity="0.85" />
          <rect x="160" y="312" width="5" height="7" rx="1" className="tw" style={{ animationDelay: "2.2s" }} />
          <rect x="214" y="312" width="5" height="7" rx="1" opacity="0.9" />
        </g>
      </g>

      {/* برج بادبان (الهام از برج العرب) */}
      <g>
        <path d="M500 380 C500 262 540 190 588 166 L588 380 Z" fill="#173844" />
        <path d="M500 380 C500 262 540 190 588 166" fill="none" stroke="#43c9bf" strokeWidth="1.4" opacity="0.65" />
        <ellipse cx="556" cy="212" rx="17" ry="4" fill="#1b3d49" stroke="#43c9bf" strokeWidth="1" opacity="0.9" />
        <g fill="#e5a93d">
          <rect x="548" y="246" width="6" height="8" rx="1" className="tw" style={{ animationDelay: "0.6s" }} />
          <rect x="562" y="270" width="6" height="8" rx="1" opacity="0.9" />
          <rect x="540" y="296" width="6" height="8" rx="1" className="tw" style={{ animationDelay: "1.8s" }} />
          <rect x="556" y="322" width="6" height="8" rx="1" opacity="0.85" />
        </g>
      </g>

      {/* ساختمان‌های میانی */}
      <g>
        <rect x="306" y="272" width="62" height="108" fill="#143038" />
        <WindowGrid bx={314} by={282} cols={3} rows={4} gx={18} gy={24} />
        <rect x="412" y="250" width="52" height="130" fill="#122b33" />
        <WindowGrid bx={420} by={260} cols={2} rows={5} gx={22} gy={24} />
      </g>

      {/* سکه‌های ارزی شناور */}
      <g className="float-soft">
        <circle cx="292" cy="120" r="24" fill="#e5a93d" />
        <circle cx="292" cy="120" r="18" fill="none" stroke="#0a1b21" strokeWidth="1.6" opacity="0.45" />
        <text x="292" y="128" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="700" fill="#0a1b21">$</text>
      </g>
      <g className="float-soft-late">
        <circle cx="372" cy="82" r="19" fill="#43c9bf" />
        <circle cx="372" cy="82" r="14" fill="none" stroke="#0a1b21" strokeWidth="1.4" opacity="0.4" />
        <text x="372" y="89" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="17" fontWeight="700" fill="#0a1b21">€</text>
      </g>
      <g className="float-soft" style={{ animationDelay: "1.4s" }}>
        <circle cx="452" cy="128" r="16" fill="#f0c066" />
        <text x="452" y="134" textAnchor="middle" fontFamily="Vazirmatn, sans-serif" fontSize="13" fontWeight="700" fill="#0a1b21">د.إ</text>
      </g>

      {/* آب و بازتاب */}
      <rect x="0" y="380" width="640" height="60" fill="#0b1e25" />
      <rect x="0" y="380" width="640" height="2" fill="#e5a93d" opacity="0.2" />
      <g fill="#e5a93d" opacity="0.1">
        <rect x="60" y="396" width="110" height="2" rx="1" />
        <rect x="250" y="410" width="140" height="2" rx="1" />
        <rect x="470" y="400" width="110" height="2" rx="1" />
      </g>
      <g fill="#43c9bf" opacity="0.1">
        <rect x="150" y="420" width="90" height="2" rx="1" />
        <rect x="380" y="394" width="70" height="2" rx="1" />
      </g>
    </svg>
  );
}

/** صحنه‌ی محصول — با قاب و تعویض نرم */
export function SkyScene({ variant, className }: { variant: "tehran" | "dubai"; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <TehranScene className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out ${variant === "tehran" ? "opacity-100" : "opacity-0"}`} />
      <DubaiScene className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out ${variant === "dubai" ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}

/** صحنه‌های فروشگاهی مینیمال — تیسافت: صندوق فروشگاه، کپیتال: فروشگاه با ارزهای شناور */

/* ── تیسافت: داخل فروشگاه با صندوق و قفسه ── */
export function ShopScene() {
  return (
    <svg viewBox="0 0 480 340" className="h-full w-full" role="img" aria-label="نمای داخل فروشگاه با صندوق فروش">
      <defs>
        <linearGradient id="shop-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12313b" />
          <stop offset="100%" stopColor="#0b222b" />
        </linearGradient>
        <linearGradient id="shop-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2831" />
          <stop offset="100%" stopColor="#081b22" />
        </linearGradient>
        <linearGradient id="pos-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10323c" />
          <stop offset="100%" stopColor="#0a232c" />
        </linearGradient>
      </defs>

      {/* دیوار و کف */}
      <rect width="480" height="230" fill="url(#shop-wall)" />
      <rect y="230" width="480" height="110" fill="url(#shop-floor)" />
      {/* خطوط کاشی کف */}
      <g stroke="#143440" strokeWidth="1.5">
        <path d="M0 262h480" /><path d="M0 296h480" />
        <path d="M120 230 96 340" /><path d="M240 230v110" /><path d="M360 230l24 110" />
      </g>

      {/* تابلوی فروشگاه */}
      <g>
        <rect x="150" y="22" width="180" height="34" rx="7" fill="#0d2630" stroke="#1d424e" strokeWidth="1.5" />
        <circle cx="168" cy="39" r="7" fill="#17b0a6" />
        <path d="M164.5 39h7M168 35.5v7" stroke="#06231f" strokeWidth="1.6" strokeLinecap="round" />
        <text x="252" y="45" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700" letterSpacing="4" fill="#c9efec">TSOFT MARKET</text>
        <rect x="230" y="56" width="20" height="12" fill="#1d424e" />
      </g>

      {/* قفسه‌ی سمت چپ با کالاها */}
      <g>
        <rect x="30" y="86" width="128" height="8" rx="3" fill="#1d424e" />
        <rect x="30" y="140" width="128" height="8" rx="3" fill="#1d424e" />
        <rect x="30" y="86" width="6" height="144" fill="#163843" />
        <rect x="152" y="86" width="6" height="144" fill="#163843" />
        {/* ردیف اول */}
        <rect x="42" y="62" width="16" height="24" rx="3" fill="#e5a93d" />
        <rect x="64" y="66" width="16" height="20" rx="3" fill="#43c9bf" />
        <rect x="86" y="58" width="16" height="28" rx="3" fill="#7fa9b5" />
        <rect x="108" y="64" width="16" height="22" rx="3" fill="#e5a93d" />
        <rect x="130" y="60" width="16" height="26" rx="3" fill="#43c9bf" />
        {/* ردیف دوم */}
        <rect x="42" y="114" width="20" height="26" rx="4" fill="#43c9bf" />
        <rect x="68" y="118" width="20" height="22" rx="4" fill="#7fa9b5" />
        <rect x="94" y="112" width="20" height="28" rx="4" fill="#e5a93d" />
        <rect x="120" y="116" width="20" height="24" rx="4" fill="#43c9bf" />
        {/* بطری‌های ردیف سوم */}
        <g>
          <rect x="46" y="172" width="12" height="34" rx="5" fill="#17b0a6" />
          <rect x="48" y="166" width="8" height="8" rx="2" fill="#0f948b" />
          <rect x="70" y="176" width="12" height="30" rx="5" fill="#e5a93d" />
          <rect x="72" y="170" width="8" height="8" rx="2" fill="#c98f2b" />
          <rect x="94" y="172" width="12" height="34" rx="5" fill="#7fa9b5" />
          <rect x="96" y="166" width="8" height="8" rx="2" fill="#5b8b99" />
          <rect x="118" y="176" width="12" height="30" rx="5" fill="#43c9bf" />
          <rect x="120" y="170" width="8" height="8" rx="2" fill="#17b0a6" />
        </g>
      </g>

      {/* قفسه‌ی سمت راست */}
      <g>
        <rect x="330" y="100" width="118" height="8" rx="3" fill="#1d424e" />
        <rect x="330" y="150" width="118" height="8" rx="3" fill="#1d424e" />
        <rect x="330" y="100" width="6" height="130" fill="#163843" />
        <rect x="442" y="100" width="6" height="130" fill="#163843" />
        <rect x="342" y="76" width="18" height="24" rx="3" fill="#7fa9b5" />
        <rect x="366" y="80" width="18" height="20" rx="3" fill="#e5a93d" />
        <rect x="390" y="74" width="18" height="26" rx="3" fill="#43c9bf" />
        <rect x="414" y="78" width="18" height="22" rx="3" fill="#7fa9b5" />
        <rect x="342" y="124" width="22" height="26" rx="4" fill="#e5a93d" />
        <rect x="370" y="128" width="22" height="22" rx="4" fill="#43c9bf" />
        <rect x="398" y="122" width="22" height="28" rx="4" fill="#7fa9b5" />
      </g>

      {/* پیشخوان صندوق */}
      <g>
        <rect x="176" y="212" width="180" height="14" rx="4" fill="#1d424e" />
        <rect x="186" y="226" width="160" height="70" rx="8" fill="#12313b" stroke="#1d424e" strokeWidth="1.5" />
        <rect x="200" y="240" width="40" height="10" rx="3" fill="#163843" />
        <rect x="200" y="256" width="52" height="8" rx="3" fill="#163843" />
        {/* مانیتور POS */}
        <rect x="252" y="150" width="92" height="62" rx="7" fill="#0d2630" stroke="#2b5663" strokeWidth="2" />
        <rect x="260" y="158" width="76" height="46" rx="4" fill="url(#pos-screen)" />
        {/* ردیف‌های فاکتور روی مانیتور */}
        <rect x="266" y="165" width="40" height="4" rx="2" fill="#17b0a6" />
        <rect x="266" y="174" width="52" height="3.5" rx="1.5" fill="#3d6d7b" />
        <rect x="266" y="182" width="44" height="3.5" rx="1.5" fill="#3d6d7b" />
        <rect x="266" y="190" width="56" height="3.5" rx="1.5" fill="#3d6d7b" />
        <rect x="266" y="198" width="30" height="4" rx="2" fill="#e5a93d" />
        <rect x="290" y="212" width="16" height="10" fill="#163843" />
        {/* رسید چاپی */}
        <g className="float-soft-late">
          <rect x="204" y="180" width="30" height="44" rx="2" fill="#eef6f7" />
          <rect x="209" y="187" width="20" height="2.5" rx="1" fill="#7fa9b5" />
          <rect x="209" y="193" width="14" height="2.5" rx="1" fill="#9cb4ba" />
          <rect x="209" y="199" width="18" height="2.5" rx="1" fill="#9cb4ba" />
          <rect x="209" y="208" width="20" height="3" rx="1.5" fill="#17b0a6" />
        </g>
        {/* بارکدخوان با لیزر */}
        <g>
          <rect x="346" y="196" width="20" height="16" rx="4" fill="#0d2630" stroke="#2b5663" strokeWidth="1.5" />
          <path d="M356 200v8" stroke="#e5695e" strokeWidth="1.8" className="tw" />
          {/* بسته‌ی در حال اسکن */}
          <rect x="340" y="204" width="32" height="10" rx="2" fill="#e5a93d" />
          <path d="M345 206v6M349 206v6M352 206v6M357 206v6M361 206v6M366 206v6" stroke="#0a1b21" strokeWidth="1.4" />
        </g>
      </g>

      {/* سبد خرید */}
      <g className="float-soft">
        <path d="M70 258h56l-7 34H79z" fill="none" stroke="#43c9bf" strokeWidth="3" strokeLinejoin="round" />
        <path d="M64 258 60 250h-8" stroke="#43c9bf" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M80 264v22M92 264v24M104 264v24M116 264v22" stroke="#43c9bf" strokeWidth="1.6" opacity="0.6" />
        <circle cx="84" cy="298" r="5" fill="#0d2630" stroke="#43c9bf" strokeWidth="2.5" />
        <circle cx="114" cy="298" r="5" fill="#0d2630" stroke="#43c9bf" strokeWidth="2.5" />
        <rect x="82" y="246" width="16" height="14" rx="2" fill="#e5a93d" />
        <rect x="100" y="248" width="14" height="12" rx="2" fill="#7fa9b5" />
      </g>

      {/* ذرات نور */}
      <circle cx="200" cy="80" r="3" fill="#43c9bf" opacity="0.5" className="tw" />
      <circle cx="320" cy="70" r="4" fill="#e5a93d" opacity="0.45" className="tw" style={{ animationDelay: "1.1s" }} />
      <circle cx="452" cy="60" r="3" fill="#43c9bf" opacity="0.4" className="tw" style={{ animationDelay: "2s" }} />
    </svg>
  );
}

/* ── کپیتال: فروشگاه با تابلوی نرخ ارز و ارزهای شناور ── */
const RATES: { sym: string; name: string; rate: string; d: number }[] = [
  { sym: "$", name: "دلار", rate: "63,000", d: 0 },
  { sym: "€", name: "یورو", rate: "68,400", d: 0.7 },
  { sym: "د.إ", name: "درهم", rate: "17,150", d: 1.4 },
  { sym: "؋", name: "افغانی", rate: "890", d: 2.1 },
  { sym: "﷼", name: "تومان", rate: "1", d: 2.8 },
];

export function ExchangeScene() {
  return (
    <svg viewBox="0 0 480 340" className="h-full w-full" role="img" aria-label="فروشگاه با تابلوی نرخ ارزهای دلار، یورو، درهم، افغانی و تومان">
      <defs>
        <linearGradient id="ex-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2b1e" />
          <stop offset="100%" stopColor="#0c1f24" />
        </linearGradient>
        <linearGradient id="ex-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2630" />
          <stop offset="100%" stopColor="#091d25" />
        </linearGradient>
      </defs>

      {/* دیوار و کف */}
      <rect width="480" height="236" fill="url(#ex-wall)" />
      <rect y="236" width="480" height="104" fill="#081b22" />
      <g stroke="#12313b" strokeWidth="1.5">
        <path d="M0 268h480" /><path d="M0 302h480" />
        <path d="M140 236 116 340" /><path d="M340 236l24 104" />
      </g>

      {/* تابلوی بزرگ نرخ ارز */}
      <g>
        <rect x="96" y="26" width="288" height="188" rx="12" fill="url(#ex-board)" stroke="#1d424e" strokeWidth="2" />
        <rect x="96" y="26" width="288" height="30" rx="12" fill="#12313b" />
        <circle cx="116" cy="41" r="4" fill="#e5a93d" className="tw" />
        <text x="240" y="46" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="12" fontWeight="700" letterSpacing="3" fill="#c9efec">EXCHANGE · نرخ روز</text>
        {/* ردیف‌های نرخ */}
        {RATES.map((r, i) => (
          <g key={r.name} transform={`translate(0 ${70 + i * 28})`}>
            <text x="126" y="14" fontFamily="Space Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#e5a93d">{r.sym}</text>
            <text x="160" y="13" fontFamily="Vazirmatn, sans-serif" fontSize="12" fill="#c9d8dc">{r.name}</text>
            <text x="356" y="13" textAnchor="end" fontFamily="Space Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#43c9bf" className="tw" style={{ animationDelay: `${r.d}s` }}>{r.rate}</text>
            <path d="M120 22h240" stroke="#143440" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* پیشخوان صرافی */}
      <g>
        <rect x="120" y="248" width="240" height="12" rx="4" fill="#1d424e" />
        <rect x="132" y="260" width="216" height="56" rx="8" fill="#12313b" stroke="#1d424e" strokeWidth="1.5" />
        {/* اسکناس‌های روی پیشخوان */}
        <rect x="150" y="238" width="52" height="24" rx="3" fill="#17b0a6" transform="rotate(-6 176 250)" />
        <circle cx="176" cy="250" r="7" fill="#0f948b" transform="rotate(-6 176 250)" />
        <rect x="212" y="240" width="52" height="24" rx="3" fill="#e5a93d" transform="rotate(4 238 252)" />
        <circle cx="238" cy="252" r="7" fill="#c98f2b" transform="rotate(4 238 252)" />
        {/* ماشین‌حساب */}
        <rect x="290" y="226" width="44" height="32" rx="4" fill="#0d2630" stroke="#2b5663" strokeWidth="1.5" />
        <rect x="296" y="231" width="32" height="8" rx="2" fill="#17b0a6" opacity="0.8" />
        <g fill="#3d6d7b">
          <rect x="296" y="243" width="6" height="5" rx="1" /><rect x="305" y="243" width="6" height="5" rx="1" /><rect x="314" y="243" width="6" height="5" rx="1" /><rect x="323" y="243" width="6" height="5" rx="1" />
          <rect x="296" y="250" width="6" height="5" rx="1" /><rect x="305" y="250" width="6" height="5" rx="1" /><rect x="314" y="250" width="6" height="5" rx="1" /><rect x="323" y="250" width="6" height="5" rx="1" />
        </g>
      </g>

      {/* ارزهای شناور — سکه و اسکناس با نماد */}
      <g className="float-soft">
        <circle cx="62" cy="92" r="26" fill="#e5a93d" />
        <circle cx="62" cy="92" r="19" fill="none" stroke="#0a1b21" strokeWidth="2" opacity="0.4" />
        <text x="62" y="100" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="22" fontWeight="700" fill="#0a1b21">$</text>
      </g>
      <g className="float-soft-late">
        <rect x="396" y="70" width="58" height="28" rx="4" fill="#17b0a6" />
        <circle cx="425" cy="84" r="9" fill="#0f948b" />
        <text x="425" y="89" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#c9efec">€</text>
      </g>
      <g className="float-soft" style={{ animationDelay: "0.8s" }}>
        <circle cx="428" cy="158" r="22" fill="#f0c066" />
        <circle cx="428" cy="158" r="16" fill="none" stroke="#0a1b21" strokeWidth="2" opacity="0.4" />
        <text x="428" y="164" textAnchor="middle" fontFamily="Vazirmatn, sans-serif" fontSize="13" fontWeight="700" fill="#0a1b21">د.إ</text>
      </g>
      <g className="float-soft-late" style={{ animationDelay: "0.5s" }}>
        <rect x="30" y="160" width="56" height="27" rx="4" fill="#7fa9b5" />
        <circle cx="58" cy="173" r="8" fill="#5b8b99" />
        <text x="58" y="178" textAnchor="middle" fontFamily="Vazirmatn, sans-serif" fontSize="12" fontWeight="700" fill="#0a1b21">؋</text>
      </g>
      <g className="float-soft" style={{ animationDelay: "1.6s" }}>
        <circle cx="76" cy="236" r="20" fill="#43c9bf" />
        <text x="76" y="242" textAnchor="middle" fontFamily="Vazirmatn, sans-serif" fontSize="11" fontWeight="700" fill="#062a26">تومان</text>
      </g>
      <g className="float-soft-late" style={{ animationDelay: "1.2s" }}>
        <circle cx="404" cy="232" r="17" fill="#e5a93d" />
        <circle cx="404" cy="232" r="12" fill="none" stroke="#0a1b21" strokeWidth="1.6" opacity="0.4" />
        <text x="404" y="237" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="14" fontWeight="700" fill="#0a1b21">$</text>
      </g>

      {/* ذرات نور */}
      <circle cx="110" cy="48" r="3" fill="#43c9bf" opacity="0.5" className="tw" style={{ animationDelay: "0.4s" }} />
      <circle cx="380" cy="40" r="3.5" fill="#e5a93d" opacity="0.45" className="tw" style={{ animationDelay: "1.5s" }} />
    </svg>
  );
}

/** صحنه‌ی فروشگاه بر اساس محصول */
export function StoreScene({ kind }: { kind: "tisaft" | "capital" }) {
  return kind === "capital" ? <ExchangeScene /> : <ShopScene />;
}

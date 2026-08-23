export type ProductFeature = { title: string; desc: string; icon: string };
export type ProductModule = { name: string; badge?: string; items: string[]; featured?: boolean };

export type Product = {
  id: string;
  name: string;
  latin: string;
  en: string;
  tagline: string;
  accent: string;
  image: string;
  imgPos?: string;
  short: string;
  overview: string[];
  features: ProductFeature[];
  modules?: ProductModule[];
  specs: [string, string][];
  quote?: { text: string; author: string; role: string };
};

export const currencies = [
  { sym: "$", code: "USD", name: "دلار", country: "آمریکا" },
  { sym: "€", code: "EUR", name: "یورو", country: "اتحادیه اروپا" },
  { sym: "د.إ", code: "AED", name: "درهم", country: "امارات" },
  { sym: "؋", code: "AFN", name: "افغانی", country: "افغانستان" },
  { sym: "﷼", code: "IRR", name: "تومان / ریال", country: "ایران" },
  { sym: "₺", code: "TRY", name: "لیر", country: "ترکیه" },
  { sym: "ع.د", code: "IQD", name: "دینار", country: "عراق" },
];

export const products: Product[] = [
  {
    id: "tisaft",
    name: "تیسافت",
    latin: "TSOFT",
    en: "TSOFT Retail",
    tagline: "حسابِ فروشگاه، در مشتِ شما",
    accent: "#17B0A6",
    image: "https://image.qwenlm.ai/generated-images/82dfe783-3c11-4c08-a256-c046d1cc3b8c/_result.png",
    short:
      "نرم‌افزار حسابداری فروشگاهی تیسافت، به‌صورت تک‌کاربره و تحت شبکه روی ویندوز کار می‌کند و در دو ماژول نقره‌ای و طلایی ارائه می‌شود. نسخه‌ی طلایی، حسابداری کامل دارد: سند دستی، کدینگ، تراز و گزارش‌های حسابداری بر اساس کدینگِ خودتان.",
    overview: [
      "تیسافت برای فروشگاه‌ها و کسب‌وکارهای خرد و متوسط ساخته شده؛ جایی که سرعتِ صندوق و دقتِ حسابداری باید هم‌زمان اتفاق بیفتد. فاکتور بزنید، موجودی انبار را لحظه‌ای ببینید و گزارش روزانه‌ی فروش را با یک کلیک بگیرید.",
      "ماژول نقره‌ای همه‌ی نیازهای روزمره‌ی یک فروشگاه را پوشش می‌دهد؛ و اگر کسب‌وکار شما بزرگ‌تر شد یا حسابدار دارید، ماژول طلایی یک حسابداری کامل در اختیارتان می‌گذارد: کدینگ مالی را خودتان می‌سازید و به فرم‌های دریافت، پرداخت و فاکتورهای برنامه ارتباط می‌دهید؛ بعد ترازنامه، کارت حساب، تراز آزمایشی و سود و زیان را دقیقاً بر اساس همان کدینگِ خودتان می‌گیرید.",
      "ارتباط با مشتری هم در تیسافت جدی گرفته شده است: سیستم پیامکِ داخلی، بعد از هر فاکتور فروش و هر دریافت، اطلاعات و مانده‌حساب را برای مشتری پیامک می‌کند و سررسید چک‌ها و اقساط را به‌موقع یادآوری می‌کند. تیسافت به سامانه‌ی مودیان هم وصل می‌شود و اطلاعات فروش را طبق قانون پایانه‌های فروشگاهی، مستقیم ارسال می‌کند.",
    ],
    features: [
      { title: "صندوق و فاکتور سریع", desc: "صدور فاکتور فروش با بارکدخوان، قیمت چندگانه و تخفیف — در چند ثانیه.", icon: "receipt" },
      { title: "انبار و موجودی لحظه‌ای", desc: "ورود و خروج کالا، کاردکس، نقطه‌ی سفارش و گزارش موجودی در هر لحظه.", icon: "box" },
      { title: "تک‌کاربره و تحت شبکه", desc: "نسخه‌ی تک‌کاربره برای یک صندوق و نسخه‌ی شبکه برای چند کاربر هم‌زمان.", icon: "network" },
      { title: "سند دستی (طلایی)", desc: "ثبت سند حسابداری دستی برای هر رویداد مالی — فراتر از فاکتور.", icon: "ledger" },
      { title: "کدینگ درختی (طلایی)", desc: "تعریف کدینگ حساب‌ها به سلیقه‌ی خودتان، در هر عمق و ساختاری.", icon: "edit" },
      { title: "تراز آزمایشی (طلایی)", desc: "گرفتن تراز در هر مقطع زمانی و کنترل صحت ثبت‌های حسابداری.", icon: "scale" },
      { title: "گزارش‌های کدینگ‌محور", desc: "ترازنامه، کارت حساب و سود و زیان دقیقاً بر اساس کدینگی که خودتان تعریف کرده‌اید.", icon: "report" },
      { title: "پیامک خودکار فاکتور", desc: "بعد از فاکتور فروش، پیامک تاریخ، شماره، مبلغ و مانده‌حساب — اتوماتیک یا با تأیید شما.", icon: "phone" },
      { title: "پیامک دریافت و مانده", desc: "بعد از ثبت دریافت، پیامک مشخصات و نوع دریافتی به‌همراه مانده‌حساب برای مشتری.", icon: "chat" },
      { title: "یادآوری سررسید چک و قسط", desc: "اعلام و یادآوری تاریخ سررسید چک‌های دریافتی و اقساط مشتری‌ها با پیامک.", icon: "bell" },
      { title: "اتصال به سامانه مودیان", desc: "ارسال اطلاعات فاکتورهای فروش به سامانه‌ی مودیان طبق قانون پایانه‌های فروشگاهی.", icon: "globe" },
      { title: "مشتری و حساب اشخاص", desc: "مانده‌حساب مشتریان، دریافت و پرداخت، چک و اعتبار + ارسال مانده از گزارش بدهکاران.", icon: "users" },
    ],
    modules: [
      {
        name: "ماژول نقره‌ای",
        items: [
          "فاکتور خرید و فروش با بارکدخوان",
          "مدیریت انبار و موجودی لحظه‌ای",
          "حساب مشتریان و تأمین‌کنندگان",
          "چک‌ها و دریافت و پرداخت",
          "گزارش‌های فروش روزانه و ماهانه",
          "نسخه‌ی تک‌کاربره و تحت شبکه",
        ],
      },
      {
        name: "ماژول طلایی",
        badge: "حسابداری کامل",
        featured: true,
        items: [
          "همه‌ی امکانات ماژول نقره‌ای",
          "سند حسابداری دستی",
          "کدینگ مالی دلخواه شما و ارتباط آن با فرم‌های دریافت، پرداخت و فاکتورها",
          "ترازنامه و تراز آزمایشی در هر مقطع زمانی",
          "کارت حساب و گردش بدهکار و بستانکار",
          "سود و زیان بر اساس کدینگِ واردشده",
        ],
      },
      {
        name: "سیستم پیامک",
        badge: "ارتباط با مشتری",
        items: [
          "پیامک فاکتور فروش: تاریخ، شماره، مبلغ و مانده‌حساب — اتوماتیک یا با تأیید",
          "پیامک بعد از ثبت دریافت: مشخصات و نوع دریافتی به‌همراه مانده‌حساب",
          "یادآوری سررسید چک‌های دریافتی از مشتریان",
          "یادآوری تاریخ سررسید اقساط",
          "ارسال مانده‌حساب از گزارش بدهکاران و بستانکاران",
        ],
      },
      {
        name: "سامانه مودیان",
        badge: "الزام قانونی",
        items: [
          "اتصال مستقیم تیسافت به سامانه‌ی مودیان (intamedia.ir)",
          "ارسال اطلاعات فاکتورهای فروش به‌صورت صورتحساب الکترونیکی",
          "درج شناسه‌ی یکتای حافظه‌ی مالیاتی روی اسناد فروش",
          "منطبق با قانون پایانه‌های فروشگاهی و سامانه‌ی مودیان",
          "همگام با آخرین ابلاغیه‌های سازمان امور مالیاتی",
        ],
      },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز — تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["بانک اطلاعاتی", "Microsoft SQL Server"],
      ["پشتیبان‌گیری", "خودکار — ذخیره در فضای ابری یا ارسال با ایمیل"],
      ["سخت‌افزار جانبی", "بارکدخوان، فیش‌پرینتر، کشوی پول و ترازو"],
      ["پیامک", "اتصال به پنل پیامکی با توکن اختصاصی — ارسال خودکار و دستی"],
      ["سامانه مودیان", "اتصال و ارسال صورتحساب الکترونیکی به intamedia.ir"],
      ["پشتیبانی", "یک سال رایگان همراه خرید — تلفنی و با اتصال امن"],
    ],
    quote: {
      text: "از روزی که تیسافت گذاشتیم، انبار و صندوق هیچ‌وقت با هم اختلاف نداشته‌اند.",
      author: "صاحب سوپرمارکت زنجیره‌ای",
      role: "مشتری از سال ۱۳۸۸",
    },
  },
  {
    id: "capital",
    name: "کپیتال",
    latin: "CAPITAL",
    en: "Capital Multi-Currency",
    tagline: "به نرخِ روز، حسابِ چند ارز",
    accent: "#E5A93D",
    image: "https://image.qwenlm.ai/generated-images/073419fc-765c-4f0b-a89a-3f7dd340b19a/_result.png",
    imgPos: "50% 8%",
    short:
      "کپیتال نرم‌افزار حسابداری چندارزی است: یک ارز پایه معرفی می‌کنید و بقیه‌ی ارزها هر روز با نرخ ارز پایه قیمت‌گذاری می‌شوند. هنگام ثبت، اگر نرخ تغییر کرده باشد همان‌جا نرخ لحظه‌ای می‌دهید؛ برای هر مشتری واحد ارز تعیین می‌شود و مانده‌ی صورتحساب به هر ارزی که بخواهید تبدیل می‌شود.",
    overview: [
      "در بازرگانیِ امروز، یک فاکتور ممکن است با دلار بسته شود، با درهم پرداخت شود و در دفتر با تومان ثبت شود. کپیتال دقیقاً برای همین واقعیت ساخته شده است: حسابداری‌ای که چند ارز را هم‌زمان، دقیق و به نرخ روز نگه می‌دارد.",
      "ساختار کپیتال ساده و قدرتمند است: یک ارز پایه معرفی می‌کنید و بقیه‌ی ارزها را تعریف می‌کنید؛ هر روز نرخ هر ارز نسبت به ارز پایه وارد برنامه می‌شود و همه‌ی محاسبات بر همان نرخِ روز انجام می‌گیرد. تاریخچه‌ی نرخ‌ها هم نگهداری می‌شود تا هر سند، با نرخِ همان روزِ خودش ثبت شده باشد و قابل پیگیری باشد.",
      "هنگام ثبت اسناد و فاکتورها، اگر نرخ همان لحظه تغییر کرده باشد، کاربر می‌تواند همان‌جا و داخل همان فرم، نرخ لحظه‌ای را وارد کند — بدون خروج از سند و بدون دوباره‌کاری. این یعنی حسابِ شما همیشه با واقعیتِ بازار هماهنگ است، نه با نرخ دیروز.",
      "برای هر مشتری می‌توانید واحد ارز مشخص کنید؛ مبلغ‌ها به‌صورت خودکار به واحد ارزیِ همان مشتری تبدیل می‌شود. و در صورتحساب، مانده‌ی مشتری قابل تبدیل به هر یک از واحدهای ارزی است که داخل برنامه وارد کرده‌اید — تا هر طرف حساب، مانده را به ارزِ خودش ببیند و اختلافی در میان نباشد.",
      "کپیتال در بازار افغانستان جایگاه ویژه‌ای پیدا کرده است؛ از کابل و هرات تا قندهار و مزار شریف، بازرگانان و فروشگاه‌داران افغان حساب‌هایشان را با کپیتال نگه می‌دارند — جایی که معاملات روزمره میان افغانی، دلار، درهم و تومان در جریان است.",
    ],
    features: [
      { title: "معرفی ارز پایه", desc: "یک ارز به‌عنوان پایه تعریف می‌شود؛ مبنای قیمت‌گذاری بقیه‌ی ارزها.", icon: "coins" },
      { title: "نرخ‌دهی روزانه", desc: "نرخ همه‌ی ارزها هر روز نسبت به ارز پایه وارد برنامه می‌شود.", icon: "clock" },
      { title: "نرخ لحظه‌ای هنگام ثبت", desc: "اگر نرخ وسط کار عوض شد، همان‌جا داخل فرم، نرخ لحظه‌ای می‌دهید.", icon: "edit" },
      { title: "واحد ارز مشتری", desc: "برای هر مشتری واحد ارز مشخص می‌شود و مبلغ‌ها به ارز خودش تبدیل می‌شود.", icon: "users" },
      { title: "تبدیل مانده در صورتحساب", desc: "مانده‌ی مشتری در صورتحساب، به هر ارزِ ثبت‌شده در برنامه تبدیل می‌شود.", icon: "scale" },
      { title: "فاکتور و بازرگانی", desc: "خرید، فروش و پیش‌فاکتور با ثبت هم‌زمان مبلغ ارزی و معادل آن.", icon: "receipt" },
      { title: "انبار چندارزی", desc: "موجودی، بهای تمام‌شده و گزارش مصرف — با قابلیت مشاهده‌ی ارزی.", icon: "box" },
      { title: "گزارش‌های کامل", desc: "گزارش‌های جامع انبار و حسابداری، به تفکیک ارز و به نرخ روز.", icon: "report" },
    ],
    modules: [
      {
        name: "هسته‌ی چندارزی",
        badge: "قلب کپیتال",
        featured: true,
        items: [
          "تعریف ارز پایه و ارزهای متعدد",
          "ورود روزانه‌ی نرخ ارزها نسبت به ارز پایه",
          "ثبت نرخ لحظه‌ای داخل فرم هنگام ثبت سند",
          "تعیین واحد ارز برای هر مشتری",
          "تبدیل مانده‌ی صورتحساب به ارزهای ثبت‌شده",
          "تاریخچه‌ی نرخ‌ها و اسناد با نرخ همان روز",
        ],
      },
      {
        name: "بازرگانی و انبار",
        items: [
          "فاکتور خرید و فروش ارزی",
          "پیش‌فاکتور و سفارش مشتری",
          "انبار، کاردکس و بهای تمام‌شده",
          "حساب اشخاص با مانده‌ی ارزی",
          "چک‌ها، دریافت و پرداخت",
          "گزارش‌های کامل انبار و حسابداری",
        ],
      },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز — تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["ساختار ارزی", "چندارزی با ارز پایه و نرخ‌دهی روزانه"],
      ["بانک اطلاعاتی", "Microsoft SQL Server"],
      ["پشتیبان‌گیری", "خودکار — ذخیره در فضای ابری یا ارسال با ایمیل"],
      ["پشتیبانی", "یک سال رایگان همراه خرید — تلفنی و با اتصال امن"],
    ],
    quote: {
      text: "قبلاً مانده‌ی هر مشتری را دستی به دلار و افغانی حساب می‌کردیم؛ حالا کپیتال خودش تبدیل می‌کند.",
      author: "مدیر بازرگانی در هرات",
      role: "مشتری از سال ۱۳۹۸",
    },
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const messengers = [
  { name: "واتس‌اپ", en: "WhatsApp", color: "#25D366" },
  { name: "تلگرام", en: "Telegram", color: "#2AABEE" },
  { name: "بله", en: "Bale", color: "#E14B4B" },
  { name: "ایتا", en: "Eitaa", color: "#F5820D" },
  { name: "روبیکا", en: "Rubika", color: "#8B5CF6" },
];

export type Session = { n: number; title: string; href: string };

export const tisaftSessions: Session[] = [
  { n: 1, title: "جلسه اول آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/k03y45h" },
  { n: 2, title: "جلسه دوم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/d74ex78" },
  { n: 3, title: "جلسه سوم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/v696b4e" },
  { n: 4, title: "جلسه چهارم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/a30n5v5" },
  { n: 5, title: "جلسه پنجم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/6u4N7" },
  { n: 6, title: "جلسه ششم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/6u4N7" },
  { n: 7, title: "جلسه هفتم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/yTzjr" },
  { n: 8, title: "جلسه هشتم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/l062f53" },
  { n: 9, title: "جلسه نهم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/p4569k6" },
  { n: 10, title: "جلسه دهم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/n53qne1" },
  { n: 11, title: "جلسه یازدهم آموزش حسابداری تیسافت", href: "https://www.aparat.com/v/k630946" },
];

export const capitalSessions: Session[] = [
  { n: 1, title: "جلسه اول آموزش حسابداری چندارزی کپیتال", href: "https://www.aparat.com/v/aogu281" },
  { n: 2, title: "جلسه دوم آموزش حسابداری چندارزی کپیتال", href: "https://www.aparat.com/v/yeftc78" },
  { n: 3, title: "جلسه سوم آموزش حسابداری چندارزی کپیتال", href: "https://www.aparat.com/v/sdp6u1g" },
  { n: 4, title: "جلسه چهارم آموزش حسابداری چندارزی کپیتال", href: "https://www.aparat.com/v/gnz84sh" },
];

export const extraVideos: Session[] = [
  { n: 1, title: "آموزش نصب و راه‌اندازی حسابداری تیسافت", href: "https://www.aparat.com/v/U69nj" },
  { n: 2, title: "آموزش نصب و فعال‌سازی قفل نرم‌افزاری", href: "https://www.aparat.com/v/p56cklp" },
  { n: 3, title: "آموزش نحوه آپدیت نسخه‌های جدید تیسافت", href: "https://www.aparat.com/v/m92g53z" },
  { n: 4, title: "آموزش امکانات نسخه ۱۴۰۰", href: "https://www.aparat.com/v/u28fhl8" },
  { n: 5, title: "آموزش تنظیم زبان فارسی در ویندوز", href: "https://www.aparat.com/v/v80791r" },
];

export type DownloadItem = { name: string; note: string; href: string; format: string };
export type DownloadGroup = { id: string; title: string; icon: string; desc: string; items: DownloadItem[] };

export const downloadGroups: DownloadGroup[] = [
  {
    id: "products",
    title: "نصب و به‌روزرسانی محصولات",
    icon: "download",
    desc: "فایل‌های نصب و آپدیت تیسافت و کپیتال",
    items: [
      { name: "TSOFT Install Files", note: "فایل‌های نصب تیسافت", href: "https://tsoft20.ir/Download/TSOFT Install Files.zip", format: "ZIP" },
      { name: "TSOFT Setup", note: "برنامه‌ی نصب تیسافت", href: "https://tsoft20.ir/Download/TSOFT Setup.zip", format: "ZIP" },
      { name: "TSOFT EXE 140503", note: "نسخه‌ی اجرایی تیسافت — ۱۴۰۵/۰۳", href: "https://tsoft20.ir/Download/Amoot.rar", format: "RAR" },
      { name: "TsoftUpdate 1405-01-31", note: "آخرین آپدیت تیسافت", href: "https://tsoft20.ir/Download/TsoftUpdate 1405-01-31.exe", format: "EXE" },
      { name: "TsoftUpdate 14011210", note: "آپدیت تیسافت — ۱۴۰۱/۱۲", href: "https://tsoft20.ir/Download/TsoftUpdate 14011210.exe", format: "EXE" },
      { name: "Capital Install Files", note: "فایل‌های نصب کپیتال", href: "https://tsoft20.ir/Download/capital.zip", format: "ZIP" },
      { name: "Capital Update 1405-01-31", note: "آخرین آپدیت کپیتال", href: "https://tsoft20.ir/Download/CapitalUpdate 1405-01-31.exe", format: "EXE" },
      { name: "Capital Update 1404-01-03", note: "آپدیت کپیتال — ۱۴۰۴/۰۱", href: "https://tsoft20.ir/Download/CapitalUpdate 1404-01-03.exe", format: "EXE" },
      { name: "TSOFT & FastDetach", note: "تیسافت همراه FastDetach", href: "https://tsoft20.ir/Download/Tsoft_FastDetach.zip", format: "ZIP" },
      { name: "Report Factor file change", note: "تغییر فایل فاکتور گزارش", href: "https://tsoft20.ir/Download/Report Factor file change.zip", format: "ZIP" },
      { name: "TSOFT Backup Sender", note: "ارسال‌کننده‌ی بکاپ — نسخه ۰۴.۰۹", href: "https://tsoft20.ir/Download/SendEmailTray.exe", format: "EXE" },
    ],
  },
  {
    id: "remote",
    title: "ابزارهای اتصال از راه دور",
    icon: "network",
    desc: "برای پشتیبانی ریموت — یکی از این‌ها را نصب کنید",
    items: [
      { name: "AnyDesk", note: "اتصال سریع از راه دور", href: "https://tsoft20.ir/Download/AnyDesk.exe", format: "EXE" },
      { name: "Supremo", note: "اتصال از راه دور", href: "https://tsoft20.ir/Download/Supremo.exe", format: "EXE" },
      { name: "TeamViewer", note: "نسخه ۱۵.۱۳.۶", href: "https://tsoft20.ir/Download/TeamViewer.15.13.6_ TSOFT20.ir.exe", format: "EXE" },
      { name: "UltraViewer", note: "نسخه ۶.۲.۰", href: "https://tsoft20.ir/Download/UltraViewer.6.2.0 Toft20.ir.exe", format: "EXE" },
      { name: "Dorsan Desk", note: "اتصال از راه دور دورسان", href: "https://tsoft20.ir/Download/DorsanDesk.msi", format: "MSI" },
      { name: "Dorsan Desk (32Bit)", note: "فقط میزبان — ۳۲ بیتی", href: "https://tsoft20.ir/Download/DorsanDesk-x32.msi", format: "MSI" },
      { name: "Alpemix", note: "اتصال از راه دور آلپمیکس", href: "https://tsoft20.ir/Download/Alpemix.exe", format: "EXE" },
    ],
  },
  {
    id: "sql",
    title: "SQL Server و پیش‌نیازها",
    icon: "server",
    desc: "بانک اطلاعاتی و پیش‌نیازهای نصب محصولات",
    items: [
      { name: "SQL Server 2008 R2 Express", note: "نسخه‌ی رایگان — پیشنهادی", href: "https://tsoft20.ir/Download/SQL 2008 R2_x86_ENU.exe", format: "EXE" },
      { name: "SQL Server 2008 R2 SP3 Standard", note: "۱۱ پارت فشرده — پارت‌های ۰۱ تا ۱۱", href: "https://tsoft20.ir/Download/sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part01.rar", format: "RAR" },
      { name: "SQL Server 2000 Personal", note: "برای سیستم‌های قدیمی", href: "https://tsoft20.ir/Download/Personal Edition.exe.zip", format: "ZIP" },
      { name: "SQL Server 2000 For Win10", note: "نسخه‌ی سازگار با ویندوز ۱۰", href: "https://tsoft20.ir/Download/SQL Server 2000 Win10.zip", format: "ZIP" },
      { name: "SQL Server 2014 (32-bit)", note: "نسخه‌ی رسمی مایکروسافت — ۳۲ بیتی", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2032BIT/SQLEXPRWT_x86_ENU.exe", format: "EXE" },
      { name: "SQL Server 2014 (64-bit)", note: "نسخه‌ی رسمی مایکروسافت — ۶۴ بیتی", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2064BIT/SQLEXPRWT_x64_ENU.exe", format: "EXE" },
      { name: ".NET Framework 3.5 SP1", note: "پیش‌نیاز اجرای برخی نسخه‌ها", href: "https://tsoft20.ir/Download/dotNetFx35_WX_9_x86_x64.exe", format: "EXE" },
    ],
  },
  {
    id: "tools",
    title: "ابزارهای کمکی",
    icon: "wrench",
    desc: "فونت، فشرده‌سازی و سایر ابزارها",
    items: [
      { name: "WinRAR", note: "بازکردن فایل‌های فشرده — نسخه ۶.۲۰", href: "https://tsoft20.ir/Download/WinRAR.6.20 TSOFT20.ir.zip", format: "ZIP" },
      { name: "Fonts", note: "فونت‌های مورد نیاز نرم‌افزارها", href: "https://tsoft20.ir/Download/font.zip", format: "ZIP" },
      { name: "UpServer", note: "فایل متنی تنظیمات سرور", href: "https://tsoft20.ir/Download/Upserver.txt", format: "TXT" },
      { name: "Foxit PDF Creator (Win 32)", note: "سازنده‌ی PDF — ۳۲ بیتی", href: "https://tsoft20.ir/Download/Foxit PDF Creator Win 32.zip", format: "ZIP" },
      { name: "Foxit PDF Creator (Win 64)", note: "سازنده‌ی PDF — ۶۴ بیتی", href: "https://tsoft20.ir/Download/Foxit PDF Creator  Win 64.zip", format: "ZIP" },
      { name: "فیلم نصب Foxit PDF Creator", note: "راهنمای ویدیویی نصب", href: "https://tsoft20.ir/Download/Foxit Pdf Creator Install.mp4", format: "MP4" },
      { name: "Office 2003", note: "۴ پارت فشرده — پارت‌های ۱ تا ۴", href: "https://tsoft20.ir/Download/office2003.part1.rar", format: "RAR" },
    ],
  },
];

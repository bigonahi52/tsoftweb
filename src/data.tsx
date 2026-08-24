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
  short: string;
  overview: string[];
  features: ProductFeature[];
  modules?: ProductModule[];
  specs: [string, string][];
  quote?: { text: string; author: string; role: string };
};

export const currencies = [
  { code: "USD", name: "دلار", country: "آمریکا" },
  { code: "EUR", name: "یورو", country: "اتحادیه اروپا" },
  { code: "AED", name: "درهم", country: "امارات" },
  { code: "AFN", name: "افغانی", country: "افغانستان" },
  { code: "IRR", name: "تومان / ریال", country: "ایران" },
  { code: "TRY", name: "لیر", country: "ترکیه" },
  { code: "IQD", name: "دینار", country: "عراق" },
];

export const products: Product[] = [
  {
    id: "tisaft",
    name: "تیسافت",
    latin: "TSOFT",
    en: "TSOFT Retail",
    tagline: "حسابِ فروشگاه، در مشتِ شما",
    accent: "#17b0a6",
    image: "https://image.qwenlm.ai/generated-images/5337cf2a-7e31-4b15-be58-ac1a0df7eb02/_result.png",
    short:
      "نرم‌افزار حسابداری فروشگاهی تیسافت، به‌صورت تک‌کاربره و تحت شبکه روی ویندوز کار می‌کند و در دو ماژول نقره‌ای و طلایی ارائه می‌شود. نسخه‌ی طلایی حسابداری کامل دارد: کدینگ دلخواه، ترازنامه، کارت حساب و گزارش سود و زیان.",
    overview: [
      "تیسافت برای فروشگاه‌ها و کسب‌وکارهای خرد و متوسط ساخته شده؛ جایی که سرعتِ صندوق و دقتِ حسابداری باید هم‌زمان اتفاق بیفتد. فاکتور بزنید، موجودی انبار را لحظه‌ای ببینید و گزارش روزانه‌ی فروش را با یک کلیک بگیرید.",
      "ماژول نقره‌ای همه‌ی نیازهای روزمره‌ی یک فروشگاه را پوشش می‌دهد؛ و اگر کسب‌وکار شما بزرگ‌تر شد یا حسابدار دارید، ماژول طلایی یک حسابداری کامل با کدینگ درختی و گزارش‌های استاندارد در اختیارتان می‌گذارد.",
    ],
    features: [
      { title: "صندوق و فاکتور سریع", desc: "صدور فاکتور فروش با بارکدخوان، قیمت چندگانه و تخفیف — در چند ثانیه.", icon: "receipt" },
      { title: "انبار و موجودی لحظه‌ای", desc: "ورود و خروج کالا، کاردکس، نقطه‌ی سفارش و گزارش موجودی در هر لحظه.", icon: "box" },
      { title: "تک‌کاربره و تحت شبکه", desc: "نسخه‌ی تک‌کاربره برای یک صندوق و نسخه‌ی شبکه برای چند کاربر هم‌زمان.", icon: "network" },
      { title: "کدینگ درختی (طلایی)", desc: "تعریف کدینگ حساب‌ها به سلیقه‌ی خودتان و اتصال به فرم‌های دریافت و پرداخت.", icon: "edit" },
      { title: "ترازنامه و تراز آزمایشی", desc: "گرفتن تراز در هر مقطع زمانی و کنترل صحت ثبت‌های حسابداری.", icon: "scale" },
      { title: "سود و زیان بر اساس کدینگ", desc: "گزارش سود و زیان و کارت حساب دقیقاً بر اساس کدینگی که خودتان تعریف کرده‌اید.", icon: "report" },
      { title: "پیامک هوشمند", desc: "ارسال خودکار پیامک فاکتور، دریافتی و یادآوری سررسید چک و اقساط.", icon: "chat" },
      { title: "اتصال به سامانه مودیان", desc: "ارسال اطلاعات فروش به سامانه مودیان و صدور صورتحساب الکترونیکی.", icon: "shield" },
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
          "تعریف کدینگ درختی دلخواه",
          "ترازنامه، کارت حساب و تراز آزمایشی",
          "گزارش سود و زیان بر اساس کدینگ شما",
          "پیامک خودکار فاکتور و دریافتی",
          "اتصال به سامانه مودیان",
        ],
      },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز — تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["بانک اطلاعاتی", "Microsoft SQL Server"],
      ["پشتیبان‌گیری", "خودکار — ذخیره در فضای ابری یا ارسال با ایمیل"],
      ["سامانه مودیان", "اتصال و ارسال صورتحساب الکترونیکی"],
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
    accent: "#e5a93d",
    image: "https://image.qwenlm.ai/generated-images/6f82d0af-5b48-4dc9-86a2-7a3ff5115590/_result.png",
    short:
      "کپیتال نرم‌افزار حسابداری چندارزی است: یک ارز پایه معرفی می‌کنید و بقیه‌ی ارزها هر روز با نرخ ارز پایه قیمت‌گذاری می‌شوند. هنگام ثبت، اگر نرخ تغییر کرده باشد همان‌جا نرخ لحظه‌ای می‌دهید؛ برای هر مشتری واحد ارز تعیین می‌شود و مانده‌ی صورتحساب به هر ارزی که بخواهید تبدیل می‌شود.",
    overview: [
      "در بازرگانیِ امروز، یک فاکتور ممکن است با دلار بسته شود، با درهم پرداخت شود و در دفتر با تومان ثبت شود. کپیتال دقیقاً برای همین واقعیت ساخته شده است: حسابداری‌ای که چند ارز را هم‌زمان، دقیق و به نرخ روز نگه می‌دارد.",
      "ساختار کپیتال ساده و قدرتمند است: یک ارز پایه معرفی می‌کنید و بقیه‌ی ارزها را تعریف می‌کنید؛ هر روز نرخ هر ارز نسبت به ارز پایه وارد برنامه می‌شود و همه‌ی محاسبات بر همان نرخِ روز انجام می‌گیرد.",
      "کپیتال در بازار افغانستان جایگاه ویژه‌ای پیدا کرده است؛ از کابل و هرات تا قندهار و مزار شریف، بازرگانان افغان حساب‌هایشان را با کپیتال نگه می‌دارند — جایی که معاملات میان افغانی، دلار، درهم و تومان در جریان است.",
    ],
    features: [
      { title: "معرفی ارز پایه", desc: "یک ارز را پایه قرار می‌دهید؛ مبنای قیمت‌گذاری بقیه‌ی ارزها.", icon: "coins" },
      { title: "نرخ‌دهی روزانه", desc: "نرخ هر ارز هر روز نسبت به ارز پایه وارد برنامه می‌شود؛ با تاریخچه‌ی نرخ‌ها.", icon: "update" },
      { title: "نرخ لحظه‌ای هنگام ثبت", desc: "اگر نرخ وسط کار عوض شود، همان‌جا داخل فرم نرخ لحظه‌ای می‌دهید.", icon: "clock" },
      { title: "واحد ارز مشتری", desc: "برای هر مشتری واحد ارز تعیین می‌شود و مبلغ‌ها به ارز خودش تبدیل می‌شود.", icon: "users" },
      { title: "تبدیل مانده در صورتحساب", desc: "مانده‌ی مشتری به هر ارزِ ثبت‌شده در برنامه قابل تبدیل است.", icon: "report" },
      { title: "فاکتور و بازرگانی", desc: "خرید، فروش و پیش‌فاکتور با ثبت هم‌زمان مبلغ ارزی و معادل آن.", icon: "receipt" },
      { title: "انبار چندارزی", desc: "موجودی، بهای تمام‌شده و سود انبار به ریال و ارز قابل گزارش است.", icon: "box" },
      { title: "گزارش‌های ارزی کامل", desc: "گزارش‌های انبار و حسابداری به ریال و ارز؛ همه با نرخ همان روز.", icon: "scale" },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز — تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["بانک اطلاعاتی", "Microsoft SQL Server"],
      ["تعداد ارز", "نامحدود — با پرچم و کد ISO هر کشور"],
      ["پشتیبان‌گیری", "خودکار — ذخیره در فضای ابری یا ارسال با ایمیل"],
      ["پشتیبانی", "یک سال رایگان همراه خرید — تلفنی و با اتصال امن"],
    ],
    quote: {
      text: "با کپیتال دیگر نگران نوسان نرخ نیستم؛ مانده‌ی هر مشتری به ارز خودش دقیق است.",
      author: "مدیر بازرگانی واردات",
      role: "مشتری از سال ۱۳۹۶",
    },
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export type DownloadItem = { name: string; note: string; href: string; format: string };
export type DownloadGroup = { id: string; title: string; desc: string; items: DownloadItem[] };

const D = "https://dl.tsoft20.ir/Download/";
export const downloadGroups: DownloadGroup[] = [
  {
    id: "install",
    title: "نصب و به‌روزرسانی محصولات",
    desc: "نصب کامل و آپدیت‌های تیسافت و کپیتال",
    items: [
      { name: "TSOFT Setup.zip", note: "نصب کامل تیسافت", href: D + "TSOFT Setup.zip", format: "ZIP" },
      { name: "TSOFT Install Files.zip", note: "فایل‌های نصب تیسافت", href: D + "TSOFT Install Files.zip", format: "ZIP" },
      { name: "capital.zip", note: "نصب کامل کپیتال", href: D + "capital.zip", format: "ZIP" },
      { name: "TsoftUpdate 1405-01-31.exe", note: "آخرین آپدیت تیسافت", href: D + "TsoftUpdate 1405-01-31.exe", format: "EXE" },
      { name: "CapitalUpdate 1405-01-31.exe", note: "آخرین آپدیت کپیتال", href: D + "CapitalUpdate 1405-01-31.exe", format: "EXE" },
      { name: "TSOFT EXE 140503", note: "فایل اجرایی تیسافت", href: D + "Amoot.rar", format: "RAR" },
      { name: "Tsoft & Fastdetach", note: "تیسافت به همراه Fastdetach", href: D + "Tsoft_FastDetach.zip", format: "ZIP" },
    ],
  },
  {
    id: "remote",
    title: "ابزارهای اتصال از راه دور",
    desc: "برای پشتیبانی ریموت و اتصال امن به سیستم مشتری",
    items: [
      { name: "AnyDesk.exe", note: "اتصال سریع از راه دور", href: D + "AnyDesk.exe", format: "EXE" },
      { name: "Supremo.exe", note: "اتصال امن از راه دور", href: D + "Supremo.exe", format: "EXE" },
      { name: "TeamViewer", note: "TeamViewer 15.13.6", href: D + "TeamViewer.15.13.6_ TSOFT20.ir.exe", format: "EXE" },
      { name: "UltraViewer", note: "UltraViewer 6.2.0", href: D + "UltraViewer.6.2.0 Toft20.ir.exe", format: "EXE" },
      { name: "Dorsan Desk", note: "نسخه ۶۴ بیتی", href: D + "DorsanDesk.msi", format: "MSI" },
      { name: "Dorsan Desk (32Bit)", note: "فقط میزبان", href: D + "DorsanDesk-x32.msi", format: "MSI" },
      { name: "Alpemix.exe", note: "اتصال از راه دور", href: D + "Alpemix.exe", format: "EXE" },
    ],
  },
  {
    id: "sql",
    title: "SQL Server و پیش‌نیازها",
    desc: "بانک اطلاعاتی و پیش‌نیازهای نصب",
    items: [
      { name: "SQL Server 2008 R2 Express", note: "نسخه اکسپرس ۳۲ بیتی", href: D + "SQL 2008 R2_x86_ENU.exe", format: "EXE" },
      { name: "SQL Server 2000 Personal", note: "نسخه شخصی", href: D + "Personal Edition.exe.zip", format: "ZIP" },
      { name: "SQL Server 2000 For Win10", note: "سازگار با ویندوز ۱۰", href: D + "SQL Server 2000 Win10.zip", format: "ZIP" },
      { name: "SQL Server 2014 (32-bit)", note: "نسخه ۳۲ بیتی مایکروسافت", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2032BIT/SQLEXPRWT_x86_ENU.exe", format: "EXE" },
      { name: "SQL Server 2014 (64-bit)", note: "نسخه ۶۴ بیتی مایکروسافت", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2064BIT/SQLEXPRWT_x64_ENU.exe", format: "EXE" },
      { name: ".NET Framework 3.5 SP1", note: "پیش‌نیاز اجرای برنامه‌ها", href: D + "dotNetFx35_WX_9_x86_x64.exe", format: "EXE" },
    ],
  },
  {
    id: "tools",
    title: "ابزارهای کمکی",
    desc: "فونت، فشرده‌سازی و ابزارهای جانبی",
    items: [
      { name: "WinRAR 6.20", note: "باز کردن فایل‌های فشرده", href: D + "WinRAR.6.20 TSOFT20.ir.zip", format: "ZIP" },
      { name: "Fonts", note: "فونت‌های مورد نیاز برنامه", href: D + "font.zip", format: "ZIP" },
      { name: "Foxit PDF Creator (32)", note: "سازنده PDF — ۳۲ بیتی", href: D + "Foxit PDF Creator Win 32.zip", format: "ZIP" },
      { name: "Foxit PDF Creator (64)", note: "سازنده PDF — ۶۴ بیتی", href: D + "Foxit PDF Creator  Win 64.zip", format: "ZIP" },
      { name: "آموزش نصب Foxit", note: "فیلم راهنمای نصب", href: D + "Foxit Pdf Creator Install.mp4", format: "MP4" },
      { name: "Upserver", note: "فایل تنظیمات سرور", href: D + "Upserver.txt", format: "TXT" },
    ],
  },
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
  { n: 1, title: "آموزش امکانات نسخه ۱۴۰۰", href: "https://www.aparat.com/v/u28fhl8" },
  { n: 2, title: "آموزش نحوه آپدیت نسخه‌های جدید", href: "https://www.aparat.com/v/m92g53z" },
  { n: 3, title: "آموزش نصب و راه‌اندازی حسابداری", href: "https://www.aparat.com/v/U69nj" },
  { n: 4, title: "آموزش نصب و فعال‌سازی قفل نرم‌افزاری", href: "https://www.aparat.com/v/p56cklp" },
  { n: 5, title: "آموزش تنظیم زبان فارسی در ویندوز", href: "https://www.aparat.com/v/v80791r" },
];

export const messengers = [
  { name: "واتس‌اپ", color: "#25d366" },
  { name: "تلگرام", color: "#229ed9" },
  { name: "بله", color: "#e5534b" },
  { name: "ایتا", color: "#f59e0b" },
  { name: "روبیکا", color: "#8b5cf6" },
];

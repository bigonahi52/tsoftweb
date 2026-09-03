/* داده‌های محصولات، ارزها، جلسات آموزشی و فایل‌های دانلود */

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
  features: { icon: string; title: string; desc: string }[];
  specs: [string, string][];
  modules?: { name: string; featured?: boolean; badge?: string; items: string[] }[];
  quote?: { text: string; author: string; role: string };
};

export const products: Product[] = [
  {
    id: "tisaft",
    name: "تیسافت",
    latin: "TSOFT",
    en: "TSOFT Retail",
    tagline: "نرم‌افزار حسابداری و مدیریت فروشگاه و کسب‌وکار — برای بازار ایران",
    accent: "#16b87f",
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=60",
    imgPos: "50% 30%",
    short:
      "تیسافت یک نرم‌افزار حسابداری فروشگاهی کامل برای بازار ایران است؛ از صندوق و فاکتور تا انبار، چک و گزارش‌های سود و زیان — با ماژول نقره‌ای و طلایی.",
    overview: [
      "تیسافت برای فروشگاه‌ها و کسب‌وکارهای ایرانی ساخته شده است؛ جایی که سرعت صندوق، دقت انبار و شفافیت حساب‌ها هم‌زمان اهمیت دارند.",
      "با تیسافت فاکتور خرید و فروش ثبت می‌کنید، موجودی انبار را لحظه‌ای کنترل می‌کنید، چک‌ها و دریافت و پرداخت را مدیریت می‌کنید و در پایان روز گزارش دقیق سود و زیان دارید.",
      "ماژول طلایی علاوه بر همه‌ی امکانات نقره‌ای، حسابداری کامل با کدینگ دلخواه، ترازنامه و گزارش‌های حرفه‌ای را هم در اختیار شما می‌گذارد.",
    ],
    features: [
      { icon: "receipt", title: "فاکتور خرید و فروش", desc: "ثبت سریع فاکتور با بارکدخوان، تخفیف و هزینه." },
      { icon: "box", title: "انبار و موجودی", desc: "موجودی لحظه‌ای، کسری و مغایرت انبار." },
      { icon: "users", title: "حساب مشتریان", desc: "مانده‌حساب، گردش حساب و گزارش بدهکاران." },
      { icon: "ledger", title: "چک و دریافت/پرداخت", desc: "مدیریت چک‌های صیادی و سررسیدها." },
      { icon: "report", title: "گزارش سود و زیان", desc: "گزارش روزانه، ماهانه و سالانه." },
      { icon: "barcode", title: "اتصال به بارکدخوان", desc: "ثبت کالا با اسکن بارکد در چند ثانیه." },
      { icon: "scale", title: "کدینگ دلخواه (طلایی)", desc: "تعریف ساختار حساب‌ها متناسب با کسب‌وکار شما." },
      { icon: "cloud", title: "بکاپ خودکار", desc: "پشتیبان‌گیری زمان‌بندی‌شده و بکاپ ابری." },
    ],
    specs: [
      ["نسخه‌ها", "نقره‌ای (فروشگاهی) و طلایی (حسابداری کامل)"],
      ["سیستم‌عامل", "ویندوز ۱۰ و ۱۱"],
      ["اجرا", "تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["پشتیبان‌گیری", "بکاپ ابری و ایمیلی خودکار"],
      ["پشتیبانی", "یک سال رایگان همراه خرید"],
    ],
    modules: [
      {
        name: "ماژول نقره‌ای",
        items: [
          "فاکتور خرید و فروش",
          "مدیریت انبار و موجودی",
          "حساب مشتریان و تأمین‌کنندگان",
          "چک‌ها و دریافت و پرداخت",
          "گزارش‌های فروش روزانه و ماهانه",
        ],
      },
      {
        name: "ماژول طلایی",
        featured: true,
        badge: "حسابداری کامل",
        items: [
          "همه‌ی امکانات ماژول نقره‌ای",
          "تعریف کدینگ درختی دلخواه",
          "ترازنامه و تراز آزمایشی",
          "گزارش سود و زیان بر اساس کدینگ شما",
          "کارت حساب اشخاص",
        ],
      },
    ],
    quote: {
      text: "از روزی که تیسافت گذاشتیم، انبار و صندوق هیچ‌وقت با هم اختلاف نداشته‌اند.",
      author: "صاحب سوپرمارکت زنجیره‌ای",
      role: "مشتری از سال ۱۳۸۸ — تیسافت",
    },
  },
  {
    id: "capital",
    name: "کپیتال",
    latin: "CAPITAL",
    en: "Capital Multi-Currency",
    tagline: "نرم‌افزار حسابداری چندارزی و مدیریت سرمایه",
    accent: "#eaa63b",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=60",
    imgPos: "50% 35%",
    short:
      "کپیتال نرم‌افزار حسابداری چندارزی برای بازرگانی و واردات است؛ با ارز پایه، نرخ‌دهی روزانه، واحد ارز مشتری و گزارش‌های ارزی دقیق — مناسب بازار ایران و افغانستان.",
    overview: [
      "کپیتال برای کسب‌وکارهایی ساخته شده که با چند ارز کار می‌کنند؛ واردکنندگان، بازرگانان و صرافی‌ها. همه‌چیز بر پایه‌ی یک ارز پایه ارزش‌گذاری می‌شود و نرخ هر ارز به‌صورت روزانه مدیریت می‌شود.",
      "هنگام ثبت هر عملیات، نرخ ارز جاری/لحظه‌ای نمایش داده می‌شود و در صورت نیاز همان‌جا قابل تغییر است؛ یعنی مبلغ نهایی همیشه با نرخ واقعی معامله محاسبه می‌شود.",
      "برای هر مشتری می‌توانید واحد ارز مشخص کنید تا مانده‌حساب و صورتحساب او به ارز خودش نمایش داده شود و تبدیل مانده به هر ارز ثبت‌شده ممکن است.",
    ],
    features: [
      { icon: "coins", title: "ارز پایه سیستم", desc: "یک ارز مشترک به‌عنوان مبنای همه‌ی محاسبات." },
      { icon: "update", title: "نرخ‌دهی روزانه", desc: "نرخ همه‌ی ارزها هر روز نسبت به ارز پایه." },
      { icon: "scale", title: "نرخ لحظه‌ای در فرم", desc: "نمایش نرخ هنگام ثبت و امکان اصلاح همان‌جا." },
      { icon: "users", title: "واحد ارز مشتری", desc: "مانده‌حساب هر مشتری به ارز خودش." },
      { icon: "receipt", title: "فاکتور چندارزی", desc: "خرید، فروش و پیش‌فاکتور با هر ارز." },
      { icon: "report", title: "گزارش‌های ارزی", desc: "گزارش عملیات ارزی و گردش به هر ارز." },
      { icon: "box", title: "انبار و موجودی", desc: "موجودی کالا با ارزش‌گذاری ارزی." },
      { icon: "ledger", title: "صندوق و بانک", desc: "انتقال صندوق و تبدیل ارز." },
    ],
    specs: [
      ["نوع", "حسابداری چندارزی و مدیریت سرمایه"],
      ["سیستم‌عامل", "ویندوز ۱۰ و ۱۱"],
      ["اجرا", "تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["پشتیبان‌گیری", "بکاپ ابری و ایمیلی خودکار"],
      ["پشتیبانی", "یک سال رایگان همراه خرید"],
    ],
    quote: {
      text: "با کپیتال دیگر نگران نوسان نرخ نیستم؛ مانده‌ی هر مشتری به ارز خودش دقیق است.",
      author: "مدیر بازرگانی واردات",
      role: "مشتری از سال ۱۳۹۶ — کپیتال",
    },
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

/* ── ارزها (با پرچم) ── */
export const currencies = [
  { code: "USD", name: "دلار", country: "آمریکا" },
  { code: "EUR", name: "یورو", country: "اتحادیه اروپا" },
  { code: "AED", name: "درهم", country: "امارات" },
  { code: "AFN", name: "افغانی", country: "افغانستان" },
  { code: "IRR", name: "تومان", country: "ایران" },
  { code: "TRY", name: "لیر", country: "ترکیه" },
  { code: "IQD", name: "دینار", country: "عراق" },
];

/* ── پیام‌رسان‌ها ── */
export const messengers = [
  { name: "واتس‌اپ", color: "#25D366" },
  { name: "تلگرام", color: "#2AABEE" },
  { name: "بله", color: "#E14B4B" },
  { name: "ایتا", color: "#F5820D" },
  { name: "روبیکا", color: "#8B5CF6" },
];

/* ── جلسات آموزشی ── */
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
  { n: 1, title: "جلسه اول آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/aogu281" },
  { n: 2, title: "جلسه دوم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/yeftc78" },
  { n: 3, title: "جلسه سوم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/sdp6u1g" },
  { n: 4, title: "جلسه چهارم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/gnz84sh" },
];

export const extraVideos: Session[] = [
  { n: 1, title: "آموزش امکانات نسخه ۱۴۰۰", href: "https://www.aparat.com/v/u28fhl8" },
  { n: 2, title: "آموزش نحوه آپدیت نسخه‌های جدید تیسافت", href: "https://www.aparat.com/v/m92g53z" },
  { n: 3, title: "آموزش نصب و راه‌اندازی حسابداری تیسافت", href: "https://www.aparat.com/v/U69nj" },
  { n: 4, title: "آموزش نصب و فعال‌سازی قفل نرم‌افزاری", href: "https://www.aparat.com/v/p56cklp" },
  { n: 5, title: "آموزش تنظیم زبان فارسی در ویندوز", href: "https://www.aparat.com/v/v80791r" },
];

/* ── فایل‌های دانلود ── */
export type DownloadFile = { name: string; note: string; href: string; format: string };
export type DownloadGroup = { id: string; title: string; desc: string; items: DownloadFile[] };

const D = "https://dl.tsoft20.ir/Download/";

export const downloadGroups: DownloadGroup[] = [
  {
    id: "install",
    title: "نصب و به‌روزرسانی محصولات",
    desc: "نصب کامل و آخرین آپدیت‌های تیسافت و کپیتال",
    items: [
      { name: "CapitalUpdate 1405-06-09.exe", note: "آپدیت جدید کپیتال — نسخه ۱۴۰۵/۰۶/۰۹", href: D + "CapitalUpdate 1405-06-09.exe", format: "EXE" },
      { name: "CapitalUpdate 1405-01-31.exe", note: "آپدیت قبلی کپیتال", href: D + "CapitalUpdate 1405-01-31.exe", format: "EXE" },
      { name: "capital.zip", note: "نصب کامل کپیتال", href: D + "capital.zip", format: "ZIP" },
      { name: "TsoftUpdate 1405-01-31.exe", note: "آخرین آپدیت تیسافت", href: D + "TsoftUpdate 1405-01-31.exe", format: "EXE" },
      { name: "TsoftUpdate 14011210.exe", note: "آپدیت قدیمی تیسافت", href: D + "TsoftUpdate 14011210.exe", format: "EXE" },
      { name: "TSOFT Setup", note: "نصب کامل تیسافت", href: D + "TSOFT Setup.zip", format: "ZIP" },
      { name: "TSOFT Install Files", note: "فایل‌های نصب تیسافت", href: D + "TSOFT Install Files.zip", format: "ZIP" },
      { name: "TSOFT EXE 140503", note: "فایل اجرایی تیسافت", href: D + "Amoot.rar", format: "RAR" },
      { name: "Tsoft & Fastdetach", note: "تیسافت به همراه Fastdetach", href: D + "Tsoft_FastDetach.zip", format: "ZIP" },
      { name: "SendEmailTray.exe", note: "ارسال‌کننده‌ی بکاپ ایمیلی", href: D + "SendEmailTray.exe", format: "EXE" },
      { name: "Report Factor file change", note: "تغییر فایل گزارش فاکتور", href: D + "Report Factor file change.zip", format: "ZIP" },
    ],
  },
  {
    id: "remote",
    title: "ابزارهای اتصال از راه دور",
    desc: "برای پشتیبانی و اتصال امن به سیستم شما",
    items: [
      { name: "Any Desk", note: "اتصال از راه دور", href: D + "AnyDesk.exe", format: "EXE" },
      { name: "Supremo", note: "اتصال از راه دور", href: D + "Supremo.exe", format: "EXE" },
      { name: "TeamViewer", note: "نسخه ۱۵", href: D + "TeamViewer.15.13.6_ TSOFT20.ir.exe", format: "EXE" },
      { name: "UltraViewer", note: "نسخه ۶.۲", href: D + "UltraViewer.6.2.0 Toft20.ir.exe", format: "EXE" },
      { name: "Dorsan Desk", note: "اتصال از راه دور ایرانی", href: D + "DorsanDesk.msi", format: "MSI" },
      { name: "Dorsan Desk (32Bit)", note: "فقط میزبان", href: D + "DorsanDesk-x32.msi", format: "MSI" },
      { name: "Alpemix", note: "اتصال از راه دور", href: D + "Alpemix.exe", format: "EXE" },
    ],
  },
  {
    id: "db",
    title: "SQL Server و پیش‌نیازها",
    desc: "پایگاه داده و پیش‌نیازهای نصب",
    items: [
      { name: "Sql Server 2008 R2 Express", note: "پیشنهادی برای نصب", href: D + "SQL 2008 R2_x86_ENU.exe", format: "EXE" },
      { name: "Sql Server 2000 Personal Edition", note: "نسخه سبک", href: D + "Personal Edition.exe.zip", format: "ZIP" },
      { name: "Sql Server 2000 For Win10", note: "سازگار با ویندوز ۱۰", href: D + "SQL Server 2000 Win10.zip", format: "ZIP" },
      { name: "Microsoft SQL Server 2014 (32-bit)", note: "نسخه ۳۲ بیتی", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2032BIT/SQLEXPRWT_x86_ENU.exe", format: "EXE" },
      { name: "Microsoft SQL Server 2014 (64-bit)", note: "نسخه ۶۴ بیتی", href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2064BIT/SQLEXPRWT_x64_ENU.exe", format: "EXE" },
      { name: "sql 2008-01", note: "پارت ۱ از ۱۱ — SQL 2008 R2 SP3 Standard", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part01.rar", format: "RAR" },
      { name: "sql 2008-02", note: "پارت ۲ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part02.rar", format: "RAR" },
      { name: "sql 2008-03", note: "پارت ۳ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part03.rar", format: "RAR" },
      { name: "sql 2008-04", note: "پارت ۴ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part04.rar", format: "RAR" },
      { name: "sql 2008-05", note: "پارت ۵ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part05.rar", format: "RAR" },
      { name: "sql 2008-06", note: "پارت ۶ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part06.rar", format: "RAR" },
      { name: "sql 2008-07", note: "پارت ۷ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part07.rar", format: "RAR" },
      { name: "sql 2008-08", note: "پارت ۸ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part08.rar", format: "RAR" },
      { name: "sql 2008-09", note: "پارت ۹ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part09.rar", format: "RAR" },
      { name: "sql 2008-10", note: "پارت ۱۰ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part10.rar", format: "RAR" },
      { name: "sql 2008-11", note: "پارت ۱۱ از ۱۱", href: D + "sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part11.rar", format: "RAR" },
      { name: "Net Frame work 3.5 sp1", note: "پیش‌نیاز دات‌نت", href: D + "dotNetFx35_WX_9_x86_x64.exe", format: "EXE" },
    ],
  },
  {
    id: "tools",
    title: "ابزارهای کمکی",
    desc: "فشرده‌سازی، فونت، PDF و آفیس",
    items: [
      { name: "Win Rar", note: "نسخه ۶.۲۰", href: D + "WinRAR.6.20 TSOFT20.ir.zip", format: "ZIP" },
      { name: "Fonts", note: "فونت‌های موردنیاز", href: D + "font.zip", format: "ZIP" },
      { name: "Upserver", note: "فایل متنی", href: D + "Upserver.txt", format: "TXT" },
      { name: "Foxit PDF Creator win 32", note: "سازنده PDF — ۳۲ بیتی", href: D + "Foxit PDF Creator Win 32.zip", format: "ZIP" },
      { name: "Foxit PDF Creator win 64", note: "سازنده PDF — ۶۴ بیتی", href: D + "Foxit PDF Creator  Win 64.zip", format: "ZIP" },
      { name: "فیلم راهنمای نصب Foxit PDF Creator", note: "ویدیوی آموزشی", href: D + "Foxit Pdf Creator Install.mp4", format: "MP4" },
      { name: "Office 2003 #1", note: "پارت ۱ از ۴", href: D + "office2003.part1.rar", format: "RAR" },
      { name: "Office 2003 #2", note: "پارت ۲ از ۴", href: D + "office2003.part2.rar", format: "RAR" },
      { name: "Office 2003 #3", note: "پارت ۳ از ۴", href: D + "office2003.part3.rar", format: "RAR" },
      { name: "Office 2003 #4", note: "پارت ۴ از ۴", href: D + "office2003.part4.rar", format: "RAR" },
    ],
  },
];

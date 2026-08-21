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
    accent: "#0f948b",
    image: "https://image.qwenlm.ai/generated-images/c429f312-cbfa-4c6e-bce8-b261b660cb78/_result.png",
    imgPos: "50% 38%",
    short:
      "نرم‌افزار حسابداری فروشگاهی ویندوز که هم به‌صورت تک‌کاربره و هم تحت شبکه اجرا می‌شود؛ از صندوق فروشگاه تا گزارش‌های کامل انبار و فروش.",
    overview: [
      "تیسافت برای فروشگاه‌ها، سوپرمارکت‌ها و کسب‌وکارهای خرد ساخته شده؛ جایی که سرعت صندوق و دقت انبار، هر دو حیاتی‌اند.",
      "با ماژول طلایی، حسابداری کامل در اختیار شماست: سند دستی، تعریف کدینگ دلخواه، تراز آزمایشی و گزارش‌هایی که دقیقاً بر اساس کدینگ خودتان تنظیم می‌شوند.",
    ],
    features: [
      { title: "صندوق فروش سریع", desc: "ثبت فاکتور با بارکدخوان در چند ثانیه، با پشتیبانی از ترازو و کارت‌خوان.", icon: "receipt" },
      { title: "انبارداری دقیق", desc: "موجودی لحظه‌ای، نقطه‌ی سفارش، و کنترل کالاهای تاریخ‌دار.", icon: "box" },
      { title: "تک‌کاربره و شبکه", desc: "یک نسخه برای فروشگاه کوچک، نسخه‌ی شبکه برای فروشگاه‌های زنجیره‌ای.", icon: "network" },
      { title: "سند دستی و کدینگ", desc: "در ماژول طلایی؛ کدینگ خودتان را بسازید و گزارش همان کدینگ را بگیرید.", icon: "ledger" },
      { title: "تراز آزمایشی", desc: "کنترل بدهکار و بستانکار در یک نگاه، با تشخیص مغایرت.", icon: "scale" },
      { title: "گزارش‌های متنوع", desc: "فروش روزانه، سود کالا، پرگردش‌ها و صدها گزارش آماده.", icon: "report" },
    ],
    modules: [
      {
        name: "ماژول نقره‌ای",
        items: [
          "صندوق فروش و صدور فاکتور",
          "مدیریت کالا و انبار",
          "حساب مشتریان و طرف‌حساب‌ها",
          "گزارش‌های فروش و موجودی",
          "اتصال به بارکدخوان و فیش‌پرینتر",
        ],
      },
      {
        name: "ماژول طلایی",
        badge: "پیشنهاد ویژه",
        featured: true,
        items: [
          "همه‌ی امکانات ماژول نقره‌ای",
          "صدور سند دستی حسابداری",
          "تعریف کدینگ حسابداری دلخواه",
          "تراز آزمایشی و گزارش‌های کدینگ‌محور",
          "مغایرت‌گیری و بستن حساب‌ها",
          "چک و بانک به‌صورت کامل",
        ],
      },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز (۷ به بالا)"],
      ["نحوه اجرا", "تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["بانک اطلاعاتی", "Microsoft SQL Server"],
      ["پشتیبان‌گیری", "فضای ابری و ارسال خودکار با ایمیل"],
      ["پشتیبانی", "یک سال رایگان همراه خرید — تلفنی و ریموت"],
    ],
    quote: {
      text: "از روزی که تیسافت آوردیم، انبارگردانی که دو روز طول می‌کشید، الان دو ساعته تمام می‌شود.",
      author: "آقای رضایی",
      role: "مدیر فروشگاه زنجیره‌ای البرز",
    },
  },
  {
    id: "capital",
    name: "کپیتال",
    latin: "CAPITAL",
    en: "Capital Multi-Currency",
    tagline: "به نرخِ روز، حسابِ چند ارز",
    accent: "#e5a93d",
    image: "https://image.qwenlm.ai/generated-images/fea90904-225f-4eca-adb2-d0fb53e4ee4d/_result.png",
    imgPos: "50% 8%",
    short:
      "حسابداری فروشگاهی چندارزی برای واردکنندگان و بازرگانی‌ها؛ ارز پایه را معرفی می‌کنید و بقیه ارزها هر روز به نرخ آن قیمت می‌گیرند.",
    overview: [
      "در کپیتال، ارز پایه را یک‌بار تعریف می‌کنید؛ دلار، یورو، درهم، افغانی و بقیه ارزها هر روز به نرخ ارز پایه به‌روز می‌شوند.",
      "هنگام ثبت اطلاعات، اگر نرخ ارز تغییر کرده باشد همان‌جا و داخل همان فرم اصلاحش می‌کنید — بدون خروج از سند و بدون دوباره‌کاری. گزارش‌های انبار و حسابداری هم به ریال و هم به ارز قابل دریافت‌اند.",
      "کپیتال در بازار افغانستان جایگاه ویژه‌ای پیدا کرده است؛ از کابل و هرات تا قندهار و مزار شریف، بازرگانان افغان حساب‌هایشان را با کپیتال نگه می‌دارند.",
    ],
    features: [
      { title: "تعریف ارز پایه", desc: "یک ارز مرجع؛ بقیه ارزها هر روز به نرخ آن قیمت می‌گیرند.", icon: "coins" },
      { title: "نرخ‌دهی روزانه", desc: "جدول نرخ ارزها با تاریخ؛ تاریخچه‌ی کامل تغییرات نرخ.", icon: "clock" },
      { title: "اصلاح نرخ در سند", desc: "هنگام ثبت فاکتور، نرخ همان‌جا قابل ویرایش است.", icon: "edit" },
      { title: "گزارش‌های دوگانه", desc: "انبار و حسابداری هم به ریال، هم به ارز گزارش می‌شوند.", icon: "report" },
      { title: "بهای تمام‌شده ارزی", desc: "سود واقعی هر کالا با درنظرگرفتن نوسان ارز.", icon: "scale" },
      { title: "چند فروشگاه", desc: "چند شعبه با انبارها و گزارش‌های مجزا.", icon: "store" },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز"],
      ["نحوه اجرا", "تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["ارزهای پیش‌فرض", "دلار، یورو، درهم، افغانی، تومان، لیر، دینار"],
      ["پشتیبان‌گیری", "فضای ابری و ارسال خودکار با ایمیل"],
      ["پشتیبانی", "یک سال رایگان همراه خرید — تلفنی و ریموت"],
    ],
    quote: {
      text: "قبلاً هر فاکتور ارزی را دستی حساب می‌کردیم؛ حالا کپیتال خودش به نرخ روز تبدیل می‌کند و سود واقعی را نشان می‌دهد.",
      author: "حاجی نعمت‌الله",
      role: "بازرگان واردات — هرات",
    },
  },
  {
    id: "shiorder",
    name: "شی‌اوردر",
    latin: "SHIORDER",
    en: "ShiOrder Glass Automation",
    tagline: "از ثبت سفارش تا نصب، شیشه‌ای شفاف",
    accent: "#43c9bf",
    image: "https://image.qwenlm.ai/generated-images/4e27b83d-ab18-488a-bc63-910716a1a0b7/_result.png",
    imgPos: "50% 35%",
    short:
      "سیستم جامع مدیریت تولید و اتوماسیون سالن شیشه و سکوریت؛ مدیریت هوشمند از ثبت سفارش و نقشه تا انبار، تولید و حسابداری یکپارچه.",
    overview: [
      "شی‌اوردر جدیدترین محصول تیسافت است؛ حاصل بیست سال تجربه‌ی ما در صنعت نرم‌افزار، که این‌بار برای کارگاه‌های شیشه، سکوریت و پنجره‌سازی طراحی شده.",
      "سفارش که ثبت و تأیید شود، بارکد تولید می‌شود؛ در سالن، با ثبت هر بارکد نقشه‌ی همان شیشه روی مانیتور اپراتور باز می‌شود و اگر بارکد اشتباه باشد، سیستم با صدا هشدار می‌دهد.",
    ],
    features: [
      { title: "اتوماسیون سالن (MES)", desc: "ثبت بارکد در هر ایستگاه، متناسب با نوع کاربر.", icon: "barcode" },
      { title: "نمایش خودکار نقشه", desc: "به محض اسکن بارکد، نقشه اول و دوم روی مانیتور باز می‌شود.", icon: "monitor" },
      { title: "هشدار صوتی", desc: "بارکد اشتباه یا غیرمجاز؟ پخش صدا و پیام اخطار.", icon: "bell" },
      { title: "قیمت‌گذاری پیشرفته", desc: "بر اساس ضخامت، رنگ و سختی کار — تعدادی، متراژی، درصدی، محیطی.", icon: "coins" },
      { title: "انبار جام و یراق", desc: "موجودی لحظه‌ای و کنترل مصرف بر اساس سفارشات تأییدشده.", icon: "box" },
      { title: "حسابداری یکپارچه", desc: "سند خودکار پس از تأیید سفارش، چک صیادی و صورتحساب هوشمند.", icon: "ledger" },
    ],
    specs: [
      ["سیستم‌عامل", "ویندوز"],
      ["نحوه اجرا", "تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["بانک اطلاعاتی", "Microsoft SQL Server — پایدار برای داده‌ی بالا"],
      ["سبک و سریع", "Low-Resource؛ روی سخت‌افزار معمولی سالن هم پرسرعت"],
      ["پشتیبان‌گیری", "چند سال مالی فشرده + فضای ابری و ایمیل"],
    ],
    quote: {
      text: "اولین بار است که می‌دانم هر سفارش دقیقاً در کدام مرحله‌ی سالن است؛ نقشه‌های کاغذی هم برای همیشه جمع شد.",
      author: "مهندس کریمی",
      role: "مدیر کارگاه شیشه و سکوریت آذین",
    },
  },
  {
    id: "sazehyar",
    name: "سازه‌یار",
    latin: "SAZEHYAR",
    en: "Sazehyar Building Manager",
    tagline: "ساختمان، بی‌حساب نمی‌ماند",
    accent: "#7fa9b5",
    image: "https://image.qwenlm.ai/generated-images/28d7ec72-e302-4907-97c8-b52ba1939be5/_result.png",
    imgPos: "50% 30%",
    short:
      "نرم‌افزار مدیریت شارژ ساختمان؛ اطلاعات ساکنین، مالکین و مستأجرین، ثبت هزینه‌ها، بدهکار کردن واحدها و مدیریت کامل شارژ.",
    overview: [
      "سازه‌یار برای مدیران ساختمان و شرکت‌های مدیریت مجتمع ساخته شده؛ از تعریف واحدها و ساکنین تا صدور قبض شارژ و گزارش هیأت‌مدیره.",
      "هزینه‌های ساختمان را ثبت می‌کنید، فرمول تقسیم را انتخاب می‌کنید (متراژ، نفرات یا سهم ثابت) و واحدها به‌صورت خودکار بدهکار می‌شوند.",
    ],
    features: [
      { title: "ثبت ساکنین", desc: "مالک، مستأجر و اعضای هر واحد با اطلاعات کامل.", icon: "users" },
      { title: "ثبت هزینه‌ها", desc: "هر خرج ساختمان با تاریخ و سند؛ تفکیک هزینه‌های مشترک.", icon: "receipt" },
      { title: "بدهکار کردن واحدها", desc: "تقسیم خودکار هزینه‌ها بر اساس فرمول انتخابی.", icon: "scale" },
      { title: "صدور قبض شارژ", desc: "قبض چاپی برای هر واحد؛ تاریخچه‌ی کامل پرداخت‌ها.", icon: "printer" },
      { title: "گزارش هیأت‌مدیره", desc: "تراز ساختمان و ریز درآمدها و هزینه‌ها.", icon: "report" },
      { title: "یادآوری پیامکی", desc: "اطلاع‌رسانی سررسید شارژ به ساکنین.", icon: "bell" },
    ],
    specs: [
      ["مخاطب", "مدیران ساختمان و شرکت‌های مدیریت مجتمع"],
      ["فرمول تقسیم", "متراژ، نفرات، سهم ثابت یا ترکیبی"],
      ["نحوه اجرا", "ویندوز — تک‌کاربره و تحت شبکه"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["پشتیبان‌گیری", "فضای ابری و ارسال خودکار با ایمیل"],
      ["خروجی", "چاپ قبض، اکسل و PDF"],
    ],
    quote: {
      text: "قبلاً هر ماه برای جمع‌آوری شارژ دعوا بود؛ الان قبض چاپ می‌شود و همه می‌دانند چه کسی پرداخت کرده.",
      author: "آقای موسوی",
      role: "مدیر مجتمع مسکونی نگین — ۴۸ واحد",
    },
  },
  {
    id: "pisoft",
    name: "پیسافت",
    latin: "PSOFT",
    en: "PSOFT Enterprise Suite",
    tagline: "مالیه‌ی شرکت، یکپارچه و دقیق",
    accent: "#1d424e",
    image: "https://image.qwenlm.ai/generated-images/90a5982d-921d-4f47-80d3-990535dcdcde/_result.png",
    imgPos: "50% 32%",
    short:
      "حسابداری یکپارچه مالی برای شرکت‌ها و کارخانجات؛ همه‌ی ماژول‌ها روی یک پایگاه داده — از خرید و فروش تا بهای تمام‌شده و صورت‌های مالی.",
    overview: [
      "پیسافت برای شرکت‌ها و کارخانجاتی ساخته شده که به یک حسابداری یکپارچه و کامل نیاز دارند؛ همان عمق راهکارهای سازمانی بزرگ، اما سبک‌تر، چابک‌تر و با هزینه‌ای منطقی.",
      "یک پایگاه داده، همه‌ی ماژول‌ها: حسابداری مالی، انبار، خرید و فروش، حقوق و دستمزد، تولید و بهای تمام‌شده، خزانه‌داری و گزارش‌های قانونی.",
    ],
    features: [
      { title: "حسابداری مالی", desc: "کدینگ چندسطحی، سند اتوماتیک و دستی، تراز و دفاتر.", icon: "ledger" },
      { title: "بهای تمام‌شده", desc: "محاسبه‌ی دقیق هزینه‌ی تولید برای کارخانجات.", icon: "factory" },
      { title: "حقوق و دستمزد", desc: "کارکرد، اضافه‌کار و لیست بیمه و مالیات.", icon: "users" },
      { title: "خزانه‌داری", desc: "چک صیادی، بانک‌ها و مغایرت‌گیری خودکار.", icon: "coins" },
      { title: "خرید و فروش", desc: "چرخه‌ی کامل بازرگانی با کنترل اعتبار.", icon: "receipt" },
      { title: "گزارش‌های قانونی", desc: "اظهارنامه، ارزش افزوده و صورت‌های مالی استاندارد.", icon: "report" },
    ],
    specs: [
      ["معماری", "یکپارچه — یک پایگاه داده، همه ماژول‌ها"],
      ["ساختار", "چند شرکتی، چند شعبه‌ای، چند ارزی"],
      ["نحوه اجرا", "ویندوز — تک‌کاربره، تحت شبکه و ترمینال سرور"],
      ["فعال‌سازی", "پین‌کد نرم‌افزاری — بدون قفل سخت‌افزاری"],
      ["پشتیبان‌گیری", "فضای ابری و ارسال خودکار با ایمیل"],
      ["پیاده‌سازی", "استقرار توسط کارشناسان تیسافت + آموزش تیم مالی"],
    ],
    quote: {
      text: "ماه‌ها مقایسه کردیم و پیسافت را انتخاب کردیم؛ همان گزارش‌های سازمانی، همان دقت — و پشتیبانی‌ای که واقعاً جواب می‌دهد.",
      author: "خانم دکتر احمدی",
      role: "مدیر مالی شرکت تولیدی پارس‌پلیمر",
    },
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const messengers = [
  { name: "واتس‌اپ", color: "#25D366" },
  { name: "تلگرام", color: "#2AABEE" },
  { name: "بله", color: "#E8483F" },
  { name: "ایتا", color: "#F5A623" },
  { name: "روبیکا", color: "#8E44AD" },
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
  { n: 1, title: "جلسه اول آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/aogu281" },
  { n: 2, title: "جلسه دوم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/yeftc78" },
  { n: 3, title: "جلسه سوم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/sdp6u1g" },
  { n: 4, title: "جلسه چهارم آموزش حسابداری چند ارزی کپیتال", href: "https://www.aparat.com/v/gnz84sh" },
];

export const extraVideos: Session[] = [
  { n: 1, title: "آموزش نصب و راه اندازی حسابداری تیسافت", href: "https://www.aparat.com/v/U69nj" },
  { n: 2, title: "آموزش نصب و فعال سازی قفل نرم افزاری", href: "https://www.aparat.com/v/p56cklp" },
  { n: 3, title: "آموزش نحوه آپدیت نسخه های جدید تیسافت", href: "https://www.aparat.com/v/m92g53z" },
  { n: 4, title: "آموزش امکانات نسخه ۱۴۰۰", href: "https://www.aparat.com/v/u28fhl8" },
  { n: 5, title: "آموزش تنظیم زبان فارسی در ویندوز", href: "https://www.aparat.com/v/v80791r" },
];

export type DownloadItem = { name: string; note: string; href: string; format: string };
export type DownloadGroup = { id: string; title: string; icon: string; desc: string; items: DownloadItem[] };

const D = "https://tsoft20.ir/Download/";

export const downloadGroups: DownloadGroup[] = [
  {
    id: "products",
    title: "نصب و به‌روزرسانی محصولات",
    icon: "download",
    desc: "فایل نصب و آپدیت تیسافت، کپیتال و ابزارهای همراه",
    items: [
      { name: "TSOFT Install Files", note: "فایل‌های نصب کامل تیسافت", href: D + "TSOFT Install Files.zip", format: "ZIP" },
      { name: "TSOFT Setup", note: "بسته‌ی نصب تیسافت", href: D + "TSOFT Setup.zip", format: "ZIP" },
      { name: "TSOFT EXE 140503", note: "نسخه‌ی اجرایی ۱۴۰۵/۰۳", href: D + "Amoot.rar", format: "RAR" },
      { name: "TsoftUpdate 1405-01-31", note: "آپدیت تیسافت — ۱۴۰۵/۰۱/۳۱", href: D + "TsoftUpdate 1405-01-31.exe", format: "EXE" },
      { name: "TsoftUpdate 14011210", note: "آپدیت تیسافت — ۱۴۰۱/۱۲/۱۰", href: D + "TsoftUpdate 14011210.exe", format: "EXE" },
      { name: "Capital Instal Files", note: "فایل‌های نصب کامل کپیتال", href: D + "capital.zip", format: "ZIP" },
      { name: "Capital Update 1405-01-31", note: "آپدیت کپیتال — ۱۴۰۵/۰۱/۳۱", href: D + "CapitalUpdate 1405-01-31.exe", format: "EXE" },
      { name: "Capital Update 1404-01-03", note: "آپدیت کپیتال — ۱۴۰۴/۰۱/۰۳", href: D + "CapitalUpdate 1404-01-03.exe", format: "EXE" },
      { name: "TSOFT & FastDetach", note: "تیسافت به‌همراه ابزار جداسازی سریع", href: D + "Tsoft_FastDetach.zip", format: "ZIP" },
      { name: "Report Factor File Change", note: "ابزار تغییر فایل فاکتور گزارش", href: D + "Report Factor file change.zip", format: "ZIP" },
      { name: "TSOFT Backup Sender", note: "ارسال خودکار بکاپ با ایمیل — نسخه ۰۴.۰۹", href: D + "SendEmailTray.exe", format: "EXE" },
    ],
  },
  {
    id: "remote",
    title: "ابزارهای اتصال از راه دور",
    icon: "headset",
    desc: "برای پشتیبانی ریموت — یکی از این ابزارها را نصب کنید",
    items: [
      { name: "AnyDesk", note: "پیشنهاد ما برای اتصال سریع", href: D + "AnyDesk.exe", format: "EXE" },
      { name: "Supremo", note: "ابزار جایگزین اتصال از راه دور", href: D + "Supremo.exe", format: "EXE" },
      { name: "TeamViewer", note: "نسخه ۱۵.۱۳.۶", href: D + "TeamViewer.15.13.6_ TSOFT20.ir.exe", format: "EXE" },
      { name: "UltraViewer", note: "نسخه ۶.۲.۰", href: D + "UltraViewer.6.2.0 Toft20.ir.exe", format: "EXE" },
      { name: "Dorsan Desk", note: "نسخه ۶۴ بیتی", href: D + "DorsanDesk.msi", format: "MSI" },
      { name: "Dorsan Desk (32Bit)", note: "فقط میزبان — نسخه ۳۲ بیتی", href: D + "DorsanDesk-x32.msi", format: "MSI" },
      { name: "Alpemix", note: "ابزار سبک اتصال از راه دور", href: D + "Alpemix.exe", format: "EXE" },
    ],
  },
  {
    id: "sql",
    title: "SQL Server و پیش‌نیازها",
    icon: "server",
    desc: "پایگاه داده و پیش‌نیازهای اجرای نرم‌افزارها",
    items: [
      { name: "SQL Server 2008 R2 Express", note: "نسخه‌ی رایگان — پیشنهادی برای اکثر سیستم‌ها", href: D + "SQL 2008 R2_x86_ENU.exe", format: "EXE" },
      { name: "SQL Server 2000 Personal Edition", note: "برای سیستم‌های قدیمی", href: D + "Personal Edition.exe.zip", format: "ZIP" },
      { name: "SQL Server 2000 For Win10", note: "سازگار با ویندوز ۱۰", href: D + "SQL Server 2000 Win10.zip", format: "ZIP" },
      {
        name: "SQL Server 2014 (32-bit)",
        note: "نسخه‌ی رسمی مایکروسافت",
        href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2032BIT/SQLEXPRWT_x86_ENU.exe",
        format: "EXE",
      },
      {
        name: "SQL Server 2014 (64-bit)",
        note: "نسخه‌ی رسمی مایکروسافت",
        href: "https://download.microsoft.com/download/E/A/E/EAE6F7FC-767A-4038-A954-49B8B05D04EB/ExpressAndTools%2064BIT/SQLEXPRWT_x64_ENU.exe",
        format: "EXE",
      },
      { name: ".NET Framework 3.5 SP1", note: "پیش‌نیاز اجرای نرم‌افزارها", href: D + "dotNetFx35_WX_9_x86_x64.exe", format: "EXE" },
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => ({
        name: `SQL 2008 R2 SP3 Standard — Part ${n}`,
        note: "پارت " + faNum(n) + " از ۱۱ — همه پارت‌ها را دانلود و با WinRAR باز کنید",
        href: `${D}sql2008/Microsoft.SQL.Server.2008R2 SP3.Standard.x86.x64.part${String(n).padStart(2, "0")}.rar`,
        format: "RAR",
      })),
    ],
  },
  {
    id: "tools",
    title: "ابزارهای کمکی",
    icon: "wrench",
    desc: "فونت، آفیس، PDF و ابزارهای عمومی",
    items: [
      { name: "WinRAR 6.20", note: "برای باز کردن فایل‌های فشرده", href: D + "WinRAR.6.20 TSOFT20.ir.zip", format: "ZIP" },
      { name: "Fonts", note: "فونت‌های مورد نیاز نرم‌افزارها و فاکتورها", href: D + "font.zip", format: "ZIP" },
      { name: "UpServer", note: "فایل تنظیمات سرور", href: D + "Upserver.txt", format: "TXT" },
      { name: "Foxit PDF Creator — Win 32", note: "سازنده‌ی PDF برای ویندوز ۳۲ بیتی", href: D + "Foxit PDF Creator Win 32.zip", format: "ZIP" },
      { name: "Foxit PDF Creator — Win 64", note: "سازنده‌ی PDF برای ویندوز ۶۴ بیتی", href: D + "Foxit PDF Creator  Win 64.zip", format: "ZIP" },
      { name: "فیلم راهنمای نصب Foxit PDF Creator", note: "آموزش ویدیویی نصب", href: D + "Foxit Pdf Creator Install.mp4", format: "MP4" },
      ...[1, 2, 3, 4].map((n) => ({
        name: `Office 2003 — Part ${n}`,
        note: "پارت " + faNum(n) + " از ۴ — همه پارت‌ها را دانلود کنید",
        href: `${D}office2003.part${n}.rar`,
        format: "RAR",
      })),
    ],
  },
];

function faNum(n: number): string {
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  return String(n).replace(/[0-9]/g, (d) => faDigits[Number(d)]);
}

import { useState } from "react";
import { fa, useRevealAll } from "../lib";
import type { NavFn } from "../lib";
import { Icon } from "./Icons";

/* ───────── داده‌های فصل‌ها ───────── */
const chapters = [
  {
    id: "intro",
    icon: "book",
    title: "آشنایی با Capital",
    desc: "معرفی نرم‌افزار و ساختار کلی",
    content: `نرم‌افزار Capital یک سیستم جامع حسابداری و مدیریت عملیات مالی است که برای ثبت و مدیریت خرید، فروش، کالا، موجودی، مشتریان، بانک، صندوق، دریافت و پرداخت و همچنین عملیات چندارزی استفاده می‌شود.

یکی از ویژگی‌های مهم Capital، مدیریت عملیات با ارزهای مختلف است. در این سیستم، ارز پایه، قیمت کالا، واحد ارزی معامله و نرخ ارز در زمان ثبت عملیات با یکدیگر ارتباط دارند.

در این آموزش، ساختار نرم‌افزار به‌صورت مرحله‌به‌مرحله و با مثال‌های عملی توضیح داده می‌شود.`,
  },
  {
    id: "currency-logic",
    icon: "coins",
    title: "منطق ارز در Capital",
    desc: "درک مفاهیم پایه‌ی ارزی",
    content: `قبل از یادگیری فاکتور، خرید، فروش، صندوق و بانک، باید منطق ارز در سیستم را به‌خوبی بشناسیم. این موضوع در Capital بسیار مهم است و تقریباً در تمام عملیات مالی باید به آن توجه شود.`,
    sections: [
      {
        title: "۱. ارز پایه سیستم",
        content: `در Capital یک ارز پایه یا واحد پول مشترک برای سیستم تعریف می‌شود. این ارز، مبنای محاسبات سیستم است.

برای مثال، اگر ارز پایه سیستم دلار باشد، ارزش‌گذاری و تبدیل مبالغ مختلف در سیستم بر اساس این واحد انجام می‌شود.`,
      },
      {
        title: "۲. قیمت کالا بر اساس ارز پایه",
        content: `هنگام معرفی کالا، قیمت کالا بر اساس ارز پایه سیستم ثبت می‌شود. بنابراین قیمت کالا در زمان تعریف آن، یک قیمت پایه محسوب می‌شود.

اما این موضوع به این معنی نیست که تمام معاملات بعدی حتماً با همان ارز انجام می‌شود. هنگام ثبت معامله، سیستم می‌تواند ارزش معامله را بر اساس ارز انتخاب‌شده و نرخ ارز همان معامله محاسبه کند.`,
      },
      {
        title: "۳. نرخ ارز در Capital",
        content: `نکته بسیار مهم: در تمام فرم‌های ورود و ثبت عملیات که با ارز سروکار دارند، قسمت مربوط به نرخ ارز وجود دارد. بنابراین هنگام آموزش هر فرم ارزی، باید نرخ ارز آن فرم نیز بررسی شود.

نرخ ارز در زمان ثبت عملیات در فرم نمایش داده می‌شود و کاربر می‌تواند آن را متناسب با معامله بررسی و در صورت نیاز تغییر دهد.

این موضوع فقط مربوط به یک فاکتور خاص نیست؛ بلکه باید در تمام فرم‌های مربوط به عملیات ارزی مورد توجه قرار گیرد.`,
      },
      {
        title: "۴. نرخ ارز لحظه‌ای در فرم‌های ثبت",
        content: `در زمان ورود اطلاعات و ثبت عملیات، نرخ ارز جاری/لحظه‌ای مربوط به ارز انتخاب‌شده در فرم نمایش داده می‌شود.

بنابراین کاربر هنگام ثبت هر عملیات ارزی باید به قسمت نرخ ارز توجه کند.

فرآیند کلی به این صورت است:
انتخاب ارز → نمایش نرخ ارز → بررسی نرخ → در صورت نیاز اصلاح نرخ → ثبت عملیات

نکته مهم برای کاربران: نرخ نمایش داده‌شده را قبل از ثبت نهایی معامله کنترل کنید، زیرا نرخ ارز مورد استفاده در همان عملیات بر محاسبات و مبلغ تبدیل‌شده تأثیر می‌گذارد.`,
      },
      {
        title: "۵. نرخ ارز قابل تغییر است",
        content: `نرخ نمایش داده‌شده در فرم، لزوماً نرخ نهایی معامله نیست. اگر نرخ واقعی معامله با نرخ نمایش داده‌شده متفاوت باشد، کاربر می‌تواند نرخ ارز همان عملیات را تغییر دهد و سپس عملیات را ثبت کند.

مثلاً:
فرض کنید نرخ ارز نمایش داده‌شده در زمان ثبت فاکتور: ۱۰۰
باشد.

اما معامله واقعی با نرخ: ۱۰۵
انجام شده است.

کاربر می‌تواند نرخ مربوط به همان فاکتور را اصلاح کند و معامله را با نرخ صحیح ثبت نماید.`,
      },
    ],
  },
  {
    id: "currency-example",
    icon: "scale",
    title: "مثال ساده از منطق ارزی",
    desc: "درک عملی با مثال",
    content: `فرض کنیم:

• ارز پایه سیستم: دلار
• قیمت پایه کالا: ۱۰۰ دلار
• ارز معامله: ریال
• نرخ ارز هنگام ثبت معامله: ۱۰۰ واحد ریال به ازای هر دلار

سیستم هنگام ثبت فاکتور، با استفاده از واحد ارزی انتخاب‌شده و نرخ ارز همان فرم، مبلغ را به واحد پول مشترک سیستم تبدیل و محاسبه می‌کند.

اگر نرخ واقعی معامله تغییر کند، کاربر می‌تواند نرخ موجود در فرم را اصلاح کند.

بنابراین:
قیمت کالا ≠ نرخ ارز معامله

این دو مفهوم باید کاملاً از یکدیگر تفکیک شوند.`,
  },
  {
    id: "products",
    icon: "box",
    title: "معرفی کالا",
    desc: "تعریف محصولات در سیستم",
    content: `برای شروع کار، ابتدا کالاهای مورد استفاده در سیستم باید تعریف شوند. در زمان معرفی کالا، اطلاعات مربوط به کالا از جمله قیمت پایه آن ثبت می‌شود.

نکته مهم: قیمت کالا در مرحله معرفی، بر اساس ارز پایه سیستم تعریف می‌شود. در زمان معامله، این قیمت در کنار اطلاعات ارزی همان معامله مورد استفاده قرار می‌گیرد.

بنابراین کاربر نباید قیمت کالا را با نرخ ارز اشتباه بگیرد.`,
  },
  {
    id: "bank-accounts",
    icon: "server",
    title: "حساب‌های بانکی",
    desc: "مدیریت حساب‌های بانکی",
    content: `برای ثبت عملیات بانکی ابتدا باید حساب‌های بانکی در سیستم تعریف شوند.

در بخش معرفی حساب‌های بانکی، اطلاعاتی مانند:
• شماره حساب
• تفصیلی
• نام بانک
• شعبه
• واحد ارزی

ثبت می‌شود. هر حساب می‌تواند بر اساس واحد ارزی مربوط به خود تعریف شود.`,
  },
  {
    id: "customers",
    icon: "users",
    title: "مشتریان و اشخاص",
    desc: "مدیریت طرف‌های حساب",
    content: `مشتریان و اشخاصی که معاملات با آنها انجام می‌شود باید در سیستم معرفی شوند.

پس از تعریف مشتری می‌توان عملیات مختلفی مانند:
• خرید
• فروش
• دریافت
• پرداخت
• گردش حساب
• مانده حساب

را برای او ثبت و پیگیری کرد.`,
  },
  {
    id: "purchase-invoice",
    icon: "receipt",
    title: "فاکتور خرید",
    desc: "ثبت عملیات خرید",
    content: `برای ثبت خرید کالا، وارد قسمت فاکتور خرید شوید. در بالای فرم اطلاعات اصلی فاکتور قرار دارد. از جمله:
• شماره
• تاریخ
• فروشنده
• عنوان
• واحد ارزی
• نرخ ارز
• واحد ارزی فاکتور

واحد ارزی مشخص می‌کند معامله با چه ارزی انجام شده است. برای مثال: دلار (USD)

پس از انتخاب واحد ارزی، نرخ ارز جاری/لحظه‌ای مربوط به آن ارز در فرم نمایش داده می‌شود.`,
    sections: [
      {
        title: "کنترل نرخ ارز",
        content: `قبل از ثبت فاکتور:
• واحد ارزی را بررسی کنید.
• نرخ ارز نمایش‌داده‌شده را بررسی کنید.
• در صورت تفاوت با نرخ واقعی معامله، نرخ را اصلاح کنید.
• سپس فاکتور را ثبت کنید.`,
      },
      {
        title: "ثبت کالا در فاکتور خرید",
        content: `پس از تکمیل سربرگ فاکتور، کالا را وارد جدول کنید. اطلاعاتی مانند:
• کد
• عنوان کالا
• انبار
• تعداد
• واحد
• مقدار
• فی
• مبلغ
• تخفیف

قابل ثبت هستند. پس از ورود اطلاعات، مبلغ فاکتور محاسبه می‌شود.`,
      },
    ],
  },
  {
    id: "sales-invoice",
    icon: "receipt",
    title: "فاکتور فروش",
    desc: "ثبت عملیات فروش",
    content: `ثبت فاکتور فروش نیز بر اساس همین منطق انجام می‌شود. اطلاعات اصلی شامل:
• شماره
• تاریخ
• خریدار
• عنوان خریدار
• واحد ارزی
• نرخ ارز
• کالا
• انبار
• تعداد
• قیمت
• تخفیف
• هزینه
• مبلغ قابل پرداخت

است.

نکته ارزی: در فاکتور فروش نیز نرخ ارز جاری/لحظه‌ای در فرم نمایش داده می‌شود و باید قبل از ثبت نهایی کنترل شود. در صورت نیاز، نرخ ارز همان معامله قابل اصلاح است.`,
  },
  {
    id: "proforma",
    icon: "file",
    title: "پیش‌فاکتور فروش",
    desc: "صدور پیش‌فاکتور",
    content: `در پیش‌فاکتور نیز اطلاعات ارزی باید کنترل شود. اطلاعات اصلی شامل:
• تاریخ
• شماره
• خریدار
• عنوان خریدار
• واحد ارزی
• نرخ ارز
• کالا
• انبار
• تعداد
• قیمت
• تخفیف
• هزینه
• مبلغ نهایی

است.

نکته مهم: در فرم پیش‌فاکتور نیز نرخ ارز مربوط به عملیات نمایش داده می‌شود و باید هنگام ثبت بررسی شود.`,
  },
  {
    id: "payments",
    icon: "coins",
    title: "دریافت و پرداخت",
    desc: "مدیریت عملیات مالی",
    content: `در ثبت دریافت و پرداخت نیز در صورت ارزی بودن عملیات، اطلاعات ارز اهمیت زیادی دارد.

هنگام ثبت عملیات باید موارد زیر کنترل شوند:
• تاریخ
• طرف حساب
• حساب
• مبلغ
• واحد ارزی
• نرخ ارز
• توضیحات
• نرخ ارز

در فرم‌های ثبت عملیات ارزی، نرخ ارز جاری/لحظه‌ای نمایش داده می‌شود. کاربر باید نرخ را کنترل کرده و در صورت نیاز قبل از ثبت تغییر دهد.`,
  },
  {
    id: "cashbox",
    icon: "box",
    title: "صندوق",
    desc: "مدیریت صندوق‌ها",
    content: `Capital امکان انتقال وجه بین صندوق‌ها را فراهم می‌کند.

در فرم انتقال صندوق اطلاعاتی مانند:
• تاریخ
• صندوق مبدأ
• صندوق مقصد
• مبلغ
• واحد ارزی
• نرخ ارز
• توضیحات

ثبت می‌شود.

در صورت ارزی بودن انتقال، نرخ ارز موجود در فرم باید کنترل شود. اگر نرخ معامله با نرخ نمایش‌داده‌شده متفاوت باشد، نرخ مربوط به عملیات را اصلاح کنید.`,
  },
  {
    id: "currency-conversion",
    icon: "swap",
    title: "تبدیل ارز",
    desc: "عملیات تبدیل ارز",
    content: `در عملیات تبدیل ارز، توجه به نرخ ارز اهمیت ویژه‌ای دارد.

در این عملیات معمولاً دو طرف تبدیل وجود دارد:
ارز پرداخت‌شده ← تبدیل ← ارز دریافت‌شده

کاربر باید:
• ارز مربوطه
• مبلغ
• نرخ ارز
• حساب یا صندوق
• توضیحات

را کنترل کند.

نرخ ارز جاری مربوط به عملیات در فرم نمایش داده می‌شود و در صورت نیاز قابل اصلاح است.`,
  },
  {
    id: "inventory",
    icon: "box",
    title: "موجودی کالا",
    desc: "مدیریت انبار",
    content: `فاکتورهای خرید و فروش می‌توانند روی موجودی کالا تأثیر داشته باشند.

هنگام ثبت فاکتور باید موارد زیر با دقت وارد شوند:
• کالا
• انبار
• تعداد
• واحد
• مقدار
• قیمت
• مبلغ

اشتباه در اطلاعات کالا یا تعداد می‌تواند باعث مغایرت موجودی شود.`,
  },
  {
    id: "edit-documents",
    icon: "edit",
    title: "ویرایش اسناد",
    desc: "اصلاح اسناد ثبت‌شده",
    content: `در صورت اشتباه در یک سند، اطلاعات آن قابل بررسی و در صورت مجاز بودن عملیات، قابل ویرایش است.

هنگام بررسی یک سند ارزی، حتماً این موارد را کنترل کنید:
• مبلغ + واحد ارز + نرخ ارز

به‌خصوص نرخ ارز بسیار مهم است، زیرا ممکن است مشکل ایجادشده در مبلغ نهایی ناشی از نرخ اشتباه باشد.`,
  },
  {
    id: "reports",
    icon: "report",
    title: "گزارش‌ها",
    desc: "گزارش‌گیری و تحلیل",
    content: `پس از ثبت عملیات، گزارش‌ها برای کنترل عملکرد سیستم استفاده می‌شوند. از جمله:
• گزارش روزانه
• گزارش خرید
• گزارش فروش
• گزارش مشتریان
• گزارش بانک
• گزارش صندوق
• گزارش موجودی
• گزارش گردش حساب
• گزارش عملیات ارزی

گزارش‌ها به کاربر کمک می‌کنند اطلاعات ثبت‌شده را کنترل و مغایرت‌ها را شناسایی کند.`,
  },
];

const goldenRule = {
  title: "اصل طلایی کار با ارز در Capital",
  content: `در آموزش نرم‌افزار باید همیشه این چهار مفهوم از هم جدا شوند:

۱. ارز پایه سیستم
واحد پول مشترک و مبنای محاسبات سیستم.

۲. قیمت پایه کالا
قیمتی که هنگام معرفی کالا بر اساس ارز پایه ثبت می‌شود.

۳. واحد ارزی معامله
ارزی که در فرم ثبت عملیات انتخاب می‌شود.

۴. نرخ ارز عملیات
نرخ جاری/لحظه‌ای که در فرم ثبت عملیات نمایش داده می‌شود و در صورت نیاز قابل تغییر است.`,
  flow: [
    "تعریف ارز پایه سیستم",
    "معرفی کالا و ثبت قیمت پایه",
    "ورود به فرم عملیات",
    "انتخاب واحد ارزی",
    "نمایش نرخ ارز جاری/لحظه‌ای",
    "کنترل نرخ ارز",
    "در صورت نیاز تغییر نرخ",
    "ثبت مبلغ و سایر اطلاعات",
    "محاسبه و تبدیل مبلغ بر اساس اطلاعات معامله",
    "ثبت نهایی",
  ],
  checklist: [
    "تاریخ",
    "طرف حساب",
    "حساب یا صندوق",
    "کالا و انبار",
    "تعداد و مقدار",
    "مبلغ",
    "واحد ارزی",
    "نرخ ارز جاری/لحظه‌ای",
    "درستی نرخ نسبت به معامله واقعی",
    "تخفیف و هزینه‌ها",
    "مبلغ نهایی",
  ],
  tip: "در تمام فرم‌های ارزی Capital، قبل از ثبت نهایی حتماً قسمت «نرخ ارز» را بررسی کنید. نرخ نمایش‌داده‌شده مربوط به عملیات جاری است و در صورت نیاز می‌توان آن را برای همان معامله تغییر داد.",
};

const structure = [
  { icon: "book", title: "فصل ۱ — آشنایی با Capital" },
  { icon: "gear", title: "فصل ۲ — تنظیمات و اطلاعات پایه" },
  { icon: "coins", title: "فصل ۳ — ارز پایه و مدیریت ارزها" },
  { icon: "box", title: "فصل ۴ — معرفی کالا" },
  { icon: "users", title: "فصل ۵ — مشتریان و اشخاص" },
  { icon: "server", title: "فصل ۶ — بانک و حساب‌های بانکی" },
  { icon: "receipt", title: "فصل ۷ — فاکتور خرید" },
  { icon: "receipt", title: "فصل ۸ — فاکتور فروش" },
  { icon: "file", title: "فصل ۹ — پیش‌فاکتور" },
  { icon: "coins", title: "فصل ۱۰ — دریافت و پرداخت" },
  { icon: "box", title: "فصل ۱۱ — صندوق" },
  { icon: "swap", title: "فصل ۱۲ — انتقال صندوق" },
  { icon: "coins", title: "فصل ۱۳ — تبدیل ارز" },
  { icon: "box", title: "فصل ۱۴ — موجودی کالا و انبار" },
  { icon: "report", title: "فصل ۱۵ — گزارش‌ها" },
  { icon: "edit", title: "فصل ۱۶ — ویرایش و اصلاح اسناد" },
  { icon: "spark", title: "فصل ۱۷ — مثال‌های واقعی و سناریوهای کاربردی" },
];

/* ───────── کامپوننت فصل ───────── */
function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="reveal" style={{ "--rv-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
      <div className="card-pro overflow-hidden">
        {/* هدر فصل */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start gap-4 p-6 text-right transition-colors hover:bg-paper/50"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500/12 text-teal-600 transition-transform duration-300 group-hover:scale-110">
            <Icon name={chapter.icon} className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-latin text-xs font-bold text-gold-500" dir="ltr">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl text-ink-900">{chapter.title}</h3>
            </div>
            <p className="mt-1 text-sm text-mist-500">{chapter.desc}</p>
          </div>
          <Icon
            name="arrow"
            className={`h-5 w-5 shrink-0 text-teal-600 transition-transform duration-300 ${expanded ? "rotate-90" : "-rotate-90"}`}
          />
        </button>

        {/* محتوای فصل */}
        {expanded && (
          <div className="border-t border-ink-50 bg-paper/30 p-6">
            <div className="prose prose-sm max-w-none leading-8 text-mist-500">
              {chapter.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </div>

            {/* زیربخش‌ها */}
            {"sections" in chapter && chapter.sections && (
              <div className="mt-6 space-y-4">
                {chapter.sections.map((section, i) => (
                  <div key={i} className="rounded-xl border border-ink-50 bg-white p-5">
                    <h4 className="mb-3 font-display text-lg text-ink-900">{section.title}</h4>
                    <div className="prose prose-sm max-w-none leading-8 text-mist-500">
                      {section.content.split("\n\n").map((para, j) => (
                        <p key={j} className="mb-3">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── صفحه اصلی ───────── */
export default function CapitalGuide({ nav }: { nav: NavFn }) {
  const ref = useRevealAll<HTMLDivElement>();
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  return (
    <div ref={ref} className="bg-paper">
      {/* سربرگ */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-gold-500/12 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="reveal font-latin text-xs tracking-[0.35em] text-gold-400">CAPITAL GUIDE</p>
          <h1 className="mt-4">
            <span className="line-mask">
              <span className="font-display text-6xl leading-none text-white sm:text-7xl">راهنمای جامع</span>
            </span>
            <span className="line-mask" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
              <span className="font-display text-6xl leading-none text-gold-400 sm:text-7xl">نرم‌افزار Capital</span>
            </span>
          </h1>
          <p className="reveal mt-5 max-w-2xl leading-9 text-mist-300">
            آموزش کامل حسابداری چندارزی — از مفاهیم پایه تا عملیات پیشرفته، با مثال‌های واقعی و چک‌لیست‌های کاربردی
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-900/50 px-4 py-2 text-xs font-bold text-mist-300">
              <Icon name="book" className="h-4 w-4 text-gold-400" />
              {chapters.length} فصل آموزشی
            </span>
            <span className="flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-900/50 px-4 py-2 text-xs font-bold text-mist-300">
              <Icon name="spark" className="h-4 w-4 text-gold-400" />
              با مثال‌های عملی
            </span>
            <span className="flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-900/50 px-4 py-2 text-xs font-bold text-mist-300">
              <Icon name="check" className="h-4 w-4 text-gold-400" />
              چک‌لیست‌های کاربردی
            </span>
          </div>
        </div>
      </section>

      {/* ساختار دوره */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal mb-10">
            <p className="font-latin text-xs tracking-[0.3em] text-teal-600">COURSE STRUCTURE</p>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">ساختار آموزش</h2>
          </div>

          <div className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {structure.map((item, i) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-md"
                style={{ "--rv-delay": `${(i % 3) * 60}ms` } as React.CSSProperties}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/12 text-teal-600">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-ink-900">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* فصل‌های آموزشی */}
      <section className="border-t border-ink-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="reveal mb-10">
            <p className="font-latin text-xs tracking-[0.3em] text-teal-600">CHAPTERS</p>
            <h2 className="mt-3 font-display text-4xl text-ink-900 sm:text-5xl">فصل‌های آموزشی</h2>
            <p className="mt-4 text-sm leading-8 text-mist-500">
              روی هر فصل کلیک کنید تا محتوای کامل آن باز شود. می‌توانید فصل‌ها را به ترتیب بخوانید یا مستقیماً به بخش مورد نظر بروید.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, i) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* اصل طلایی */}
      <section className="grid-lines grid-lines-fade noise relative overflow-hidden bg-ink-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-24 top-0 h-[400px] w-[400px] rounded-full bg-gold-500/12 blur-[130px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="reveal">
            <p className="font-latin text-xs tracking-[0.3em] text-gold-400">GOLDEN RULE</p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">{goldenRule.title}</h2>
          </div>

          <div className="reveal mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur" style={{ "--rv-delay": "120ms" } as React.CSSProperties}>
            <div className="prose prose-invert prose-sm max-w-none leading-8 text-mist-300">
              {goldenRule.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* فرآیند کلی */}
          <div className="reveal mt-10" style={{ "--rv-delay": "240ms" } as React.CSSProperties}>
            <h3 className="mb-6 font-display text-2xl text-white">فرآیند کلی عملیات ارزی</h3>
            <div className="space-y-3">
              {goldenRule.flow.map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 font-latin text-sm font-bold text-gold-400">
                    {fa(i + 1)}
                  </span>
                  <span className="text-sm text-mist-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* چک‌لیست */}
          <div className="reveal mt-10" style={{ "--rv-delay": "360ms" } as React.CSSProperties}>
            <h3 className="mb-6 font-display text-2xl text-white">چک‌لیست قبل از ثبت هر عملیات ارزی</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {goldenRule.checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <Icon name="check" className="h-5 w-5 shrink-0 text-teal-400" />
                  <span className="text-sm text-mist-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* نکته مهم */}
          <div className="reveal mt-10 rounded-3xl border border-gold-500/40 bg-gold-500/10 p-6" style={{ "--rv-delay": "480ms" } as React.CSSProperties}>
            <p className="flex items-start gap-3">
              <Icon name="spark" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
              <span className="text-sm leading-7 text-gold-100">
                <b>توصیه مهم:</b> {goldenRule.tip}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="reveal">
            <span className="line-mask">
              <span className="font-display text-4xl text-ink-900 sm:text-5xl">آماده‌ی شروع هستید؟</span>
            </span>
          </h2>
          <p className="reveal mx-auto mt-4 max-w-xl leading-9 text-mist-500">
            نسخه‌ی آزمایشی کپیتال رایگان است. نصب کنید، با داده‌های خودتان تست کنید و بعد تصمیم بگیرید.
          </p>
          <div className="reveal mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => nav({ page: "downloads" })}
              className="btn-primary group"
            >
              <Icon name="download" className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              دانلود کپیتال
            </button>
            <button
              onClick={() => nav({ page: "contact" })}
              className="btn-ghost-light"
            >
              مشاوره با کارشناس
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

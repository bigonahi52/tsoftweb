import type { Invoice } from "../store";
import { getUserById, invoiceTotal } from "../store";
import { fa, faDate, money } from "../lib";
import { Icon, Logo } from "./Icons";

/** برگه‌ی فاکتور — تمیز و آماده‌ی چاپ */
export default function InvoiceSheet({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const customer = getUserById(inv.userId);
  const total = invoiceTotal(inv);

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <button aria-label="بستن" onClick={onClose} className="absolute inset-0 cursor-default bg-ink-950/85 backdrop-blur-sm" />

      <div className="player-pop relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)]">
        {/* نوار ابزار */}
        <div className="flex items-center justify-between gap-3 border-b border-ink-700/70 px-5 py-3.5">
          <p className="flex items-center gap-2 font-display text-lg text-white">
            <Icon name="invoice" className="h-5 w-5 text-gold-400" />
            {inv.kind === "sale" ? "فاکتور فروش نرم‌افزار" : "فاکتور خدمات پشتیبانی"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-shine flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-ink-950 transition-colors hover:bg-teal-400"
            >
              <Icon name="printer" className="h-4 w-4" />
              چاپ فاکتور
            </button>
            <button onClick={onClose} aria-label="بستن" className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-ink-100 transition-colors hover:border-[#e5695e] hover:text-[#ff9d94]">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* برگه‌ی فاکتور — قابل چاپ */}
        <div className="overflow-y-auto bg-mist-300/10 p-4 sm:p-6">
          <div className="print-area mx-auto rounded-xl bg-white p-7 text-ink-900 shadow-2xl sm:p-9" dir="rtl">
            {/* سربرگ */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink-900 pb-5">
              <div className="flex items-center gap-3">
                <Logo className="h-12 w-12" />
                <div>
                  <p className="font-display text-2xl leading-6 text-ink-900">گروه نرم‌افزاری تیسافت</p>
                  <p className="font-latin text-[10px] tracking-[0.3em] text-mist-500">TSOFT GROUP · EST. 2006</p>
                </div>
              </div>
              <div className="text-left">
                <p className="font-display text-xl text-ink-900">{inv.kind === "sale" ? "فاکتور فروش" : "فاکتور پشتیبانی"}</p>
                <p className="mt-1 text-xs text-mist-500">
                  شماره: <b className="font-latin" dir="ltr">{inv.no}</b>
                </p>
                <p className="text-xs text-mist-500">تاریخ: {faDate(inv.time)}</p>
              </div>
            </div>

            {/* خریدار */}
            <div className="mt-5 grid gap-3 rounded-lg bg-ink-50 p-4 text-sm sm:grid-cols-2">
              <p>
                <span className="text-mist-500">خریدار: </span>
                <b>{customer ? `${customer.firstName} ${customer.lastName}` : "—"}</b>
              </p>
              <p>
                <span className="text-mist-500">تماس: </span>
                <b className="font-latin" dir="ltr">{customer?.phone ?? "—"}</b>
              </p>
            </div>

            {/* اقلام */}
            <table className="mt-5 w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900 text-right">
                  <th className="py-2.5 pr-1 font-bold">ردیف</th>
                  <th className="py-2.5 font-bold">شرح کالا / خدمات</th>
                  <th className="py-2.5 text-left font-bold">مبلغ (ریال)</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((it, i) => (
                  <tr key={i} className="border-b border-ink-100">
                    <td className="py-3 pr-1 text-mist-500">{fa(i + 1)}</td>
                    <td className="py-3">{it.title}</td>
                    <td className="py-3 text-left font-latin font-semibold" dir="ltr">{money(it.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="py-4 text-left font-display text-lg">جمع کل</td>
                  <td className="py-4 text-left font-latin text-lg font-bold text-teal-600" dir="ltr">{money(total)}</td>
                </tr>
              </tfoot>
            </table>

            {inv.note && (
              <p className="mt-3 rounded-lg border border-dashed border-ink-100 p-3 text-xs leading-6 text-mist-500">
                <b className="text-ink-900">توضیحات: </b>
                {inv.note}
              </p>
            )}

            {/* وضعیت */}
            <div className="mt-5 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${
                  inv.status === "paid" ? "bg-teal-500/15 text-teal-600" : "bg-gold-500/20 text-gold-600"
                }`}
              >
                <Icon name={inv.status === "paid" ? "check" : "clock"} className="h-4 w-4" />
                {inv.status === "paid" ? "پرداخت شده" : "در انتظار پرداخت"}
              </span>
              <p className="text-[11px] text-mist-500">
                همراه هر خرید، <b>یک سال پشتیبانی رایگان</b> · تلفن: <span className="phone-number text-teal-600">۰۹۱۵۳۱۳۳۷۲۶</span>
              </p>
            </div>

            <p className="mt-6 border-t border-ink-100 pt-4 text-center text-[11px] text-mist-500">
              از اعتماد شما سپاسگزاریم — تیسافت، ۲۰ سال حسابِ روشن · tsoft20.ir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

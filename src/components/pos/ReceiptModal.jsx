import React from 'react';
import { CheckCircle2, Printer, Share2, X } from 'lucide-react';
import useLang from '../../hooks/useLang';

export default function ReceiptModal({ open, sale, onClose, onNewSale }) {
  const { lang } = useLang();
  if (!open || !sale) return null;

  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem('biasharapro_profile')) || {};
    } catch {
      return {};
    }
  })();

  const shopName = profile.shopName || 'BiasharaPro Store';
  const shopLocation = profile.location || 'Nairobi, Kenya';
  const shopPhone = profile.phone || '+254 700 000 000';

  const dateFormatted = new Date().toLocaleString(lang === 'en' ? 'en-KE' : 'sw-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🧾 *${shopName} - RISITI*\n` +
      `Nambari: ${sale.receiptNumber}\n` +
      `Tarehe: ${dateFormatted}\n\n` +
      (sale.items || []).map(it => `• ${it.product_name} x${it.qty} = KSh ${it.unit_price * it.qty}`).join('\n') +
      `\n\n*JUMLA: KSh ${sale.totalAmount}*\n` +
      `Njia: ${sale.payment_method || 'M-Pesa'}\n` +
      `Asante kwa kutuunga mkono! 🙏`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#006948] px-5 sm:px-6 py-4 sm:py-5 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-[#9ef01a]" />
              <h2 className="text-base sm:text-lg font-bold">
                {lang === 'en' ? 'Sale Completed!' : 'Mauzo Yamekamilika!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-white/80">
            {lang === 'en' ? 'Stock has been automatically updated' : 'Stoki imepunguzwa kiotomatiki'}
          </p>
        </div>

        {/* Paper Receipt Body */}
        <div id="printable-receipt" className="p-4 sm:p-6 font-mono text-xs text-[#171d19] overflow-y-auto flex-1">
          <div className="text-center border-b border-dashed border-[#bccac0] pb-4 mb-4">
            <h3 className="font-bold text-base uppercase tracking-wider text-[#006948]">{shopName}</h3>
            <p className="text-gray-500 mt-0.5">{shopLocation}</p>
            <p className="text-gray-500">Simu: {shopPhone}</p>
            <div className="mt-2 text-[11px] text-gray-400">
              <span>{sale.receiptNumber}</span> • <span>{dateFormatted}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-b border-dashed border-[#bccac0] pb-4 mb-4">
            <div className="grid grid-cols-12 font-bold text-gray-500 pb-1">
              <span className="col-span-6">BIDHAA</span>
              <span className="col-span-2 text-center">QTY</span>
              <span className="col-span-4 text-right">BEI (KSH)</span>
            </div>
            {(sale.items || []).map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 py-1 items-center">
                <span className="col-span-6 font-sans font-medium text-[#171d19] truncate">{it.product_name}</span>
                <span className="col-span-2 text-center text-gray-600">{it.qty}</span>
                <span className="col-span-4 text-right font-semibold">{(it.unit_price * it.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-b border-dashed border-[#bccac0] pb-4 mb-4 text-sm font-sans">
            <div className="flex justify-between font-extrabold text-base text-[#171d19]">
              <span>JUMLA (TOTAL):</span>
              <span className="text-[#006948]">KSh {Number(sale.totalAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 pt-1">
              <span>Njia ya Malipo:</span>
              <span className="font-semibold text-gray-700 uppercase">{sale.payment_method || 'Cash'}</span>
            </div>
            {sale.mpesa_reference && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>M-Pesa Ref:</span>
                <span className="font-mono text-gray-700 font-bold">{sale.mpesa_reference}</span>
              </div>
            )}
            {sale.changeGiven > 0 && (
              <div className="flex justify-between text-xs text-emerald-700 font-bold">
                <span>Chenji / Change:</span>
                <span>KSh {sale.changeGiven.toLocaleString()}</span>
              </div>
            )}
          </div>

          <p className="text-center text-[11px] text-gray-400 font-sans">
            {lang === 'en' ? 'Thank you for your business!' : 'Asante sana! Karibu tena.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#eff5ef] px-6 py-4 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#006948] bg-white py-2.5 text-xs font-bold text-[#006948] hover:bg-emerald-50 active:scale-95 transition"
            >
              <Printer className="h-4 w-4" />
              {lang === 'en' ? 'Print Receipt' : 'Chapisha'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white hover:bg-[#20ba5a] active:scale-95 transition"
            >
              <Share2 className="h-4 w-4" />
              WhatsApp
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onNewSale) onNewSale();
            }}
            className="w-full rounded-xl bg-[#006948] py-3 text-sm font-bold text-white shadow-md hover:bg-[#00553a] active:scale-98 transition"
          >
            {lang === 'en' ? '+ Record Another Sale' : '+ Rekodi Mauzo Mengine'}
          </button>
        </div>
      </div>
    </div>
  );
}

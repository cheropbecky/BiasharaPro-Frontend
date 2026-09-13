import React, { useState } from 'react';
import { X, ArrowUpDown, PlusCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { adjustStock } from '../../db/sqlite';
import useLang from '../../hooks/useLang';

export default function StockAdjustmentModal({ open, product, onClose, onSuccess }) {
  const { lang } = useLang();
  const [adjustmentType, setAdjustmentType] = useState('RESTOCK'); // RESTOCK, DAMAGE, LOSS, AUDIT
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !product) return null;

  const currentStock = Number(product.stock || 0);
  const qtyNum = Number(quantity || 0);

  let resultingStock = currentStock;
  if (adjustmentType === 'RESTOCK') {
    resultingStock = currentStock + qtyNum;
  } else if (adjustmentType === 'DAMAGE' || adjustmentType === 'LOSS') {
    resultingStock = Math.max(0, currentStock - qtyNum);
  } else if (adjustmentType === 'AUDIT') {
    resultingStock = Math.max(0, qtyNum);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(qtyNum) || qtyNum < 0) {
      setError(lang === 'en' ? 'Please enter a valid quantity' : 'Weka kiasi sahihi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let delta = 0;
      if (adjustmentType === 'RESTOCK') delta = qtyNum;
      else if (adjustmentType === 'DAMAGE' || adjustmentType === 'LOSS') delta = -qtyNum;
      else if (adjustmentType === 'AUDIT') delta = qtyNum - currentStock;

      await adjustStock(product.id, {
        type: adjustmentType,
        qtyChanged: delta,
        reason: reason || (adjustmentType === 'RESTOCK' ? 'Mzigo Mpya' : adjustmentType),
        recordedBy: 'Owner',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Hitilafu ya kurekebisha stoki');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#bccac0]/40 px-5 sm:px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#006948]">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#171d19]">
                {lang === 'en' ? 'Adjust Stock' : 'Rekebisha Stoki'}
              </h2>
              <p className="text-xs text-gray-500">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Current Stock Banner */}
          <div className="flex items-center justify-between rounded-2xl bg-[#eff5ef] p-4 border border-[#bccac0]/30">
            <div>
              <span className="text-xs text-gray-500 block">Stoki ya Sasa (Current)</span>
              <span className="text-xl font-black text-[#171d19]">
                {currentStock} <span className="text-xs font-semibold text-gray-500">{product.unit || 'pcs'}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Itakayokuwa (New)</span>
              <span className={`text-xl font-black ${resultingStock < currentStock ? 'text-amber-600' : 'text-[#006948]'}`}>
                {resultingStock} <span className="text-xs font-semibold text-gray-500">{product.unit || 'pcs'}</span>
              </span>
            </div>
          </div>

          {/* Reason / Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Sababu ya Marekebisho / Reason Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'RESTOCK', label: lang === 'en' ? 'Stock In (+)' : 'Mzigo Mpya (+)' },
                { id: 'DAMAGE', label: lang === 'en' ? 'Damaged (-)' : 'Imeharibika (-)' },
                { id: 'LOSS', label: lang === 'en' ? 'Lost / Expired (-)' : 'Imeibwa / Imeisha (-)' },
                { id: 'AUDIT', label: lang === 'en' ? 'Count Audit (=)' : 'Hesabu ya Duka (=)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAdjustmentType(opt.id)}
                  className={`rounded-xl border p-2.5 text-xs font-bold transition text-left ${
                    adjustmentType === opt.id
                      ? 'border-[#006948] bg-emerald-50 text-[#006948] shadow-sm'
                      : 'border-[#bccac0]/60 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              {adjustmentType === 'AUDIT'
                ? (lang === 'en' ? 'Actual Counted Stock' : 'Kiasi Kilichohesabiwa Dukan')
                : (lang === 'en' ? 'Quantity' : 'Kiasi cha Bidhaa')}
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-sm font-bold text-[#171d19] focus:outline-none focus:border-[#006948]"
            />
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              {lang === 'en' ? 'Additional Notes (Optional)' : 'Maelezo ya Ziada (Hiari)'}
            </label>
            <input
              type="text"
              placeholder={lang === 'en' ? 'e.g. Broken packaging, supplier restock' : 'mfano: Imevunjika mfuko, mzigo kutoka kwa msambazaji'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-xs text-[#171d19] focus:outline-none focus:border-[#006948]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#bccac0] bg-white py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              {lang === 'en' ? 'Cancel' : 'Ghairi'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#006948] py-3 text-xs font-bold text-white shadow hover:bg-[#00553a] active:scale-98 transition"
            >
              {loading ? 'Inahifadhi...' : (lang === 'en' ? 'Save Changes' : 'Hifadhi')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

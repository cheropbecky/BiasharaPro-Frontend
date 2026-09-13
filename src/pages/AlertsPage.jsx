import React, { useMemo, useState, useEffect } from 'react';
import {
  AlertTriangle, Package, CheckCircle2, ArrowUpDown, Plus, DollarSign
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import { getProducts, addExpense, DB_CHANGE_EVENT } from '../db/sqlite';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';

const categories = [
  { emoji: '⚡', label: 'Umeme', cat: 'Umeme' },
  { emoji: '🏠', label: 'Kodi', cat: 'Kodi' },
  { emoji: '📦', label: 'Bidhaa', cat: 'Bidhaa' },
  { emoji: '👤', label: 'Mishahara', cat: 'Mishahara' },
  { emoji: '🚗', label: 'Usafiri', cat: 'Usafiri' },
  { emoji: '➕', label: 'Nyingine', cat: 'Nyingine' },
];

const inputClass =
  'w-full rounded-xl border border-[#bccac0] bg-white px-4 py-2.5 text-xs sm:text-sm text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

export default function AlertsPage() {
  const { t, lang } = useLang();
  const { collapsed } = useSidebar();

  const [products, setProducts] = useState([]);
  const [selectedProductForRestock, setSelectedProductForRestock] = useState(null);

  // Quick Expense state
  const [selectedCategory, setSelectedCategory] = useState('Umeme');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [expenseSaved, setExpenseSaved] = useState(false);

  const loadData = async () => {
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      console.error('Error loading products for alerts', e);
    }
  };

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener(DB_CHANGE_EVENT, handler);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handler);
  }, []);

  const outOfStockItems = useMemo(
    () => products.filter(p => p.status === 'out-of-stock' || Number(p.stock) <= 0),
    [products]
  );

  const lowStockItems = useMemo(
    () => products.filter(p => p.status === 'low-stock'),
    [products]
  );

  const handleQuickExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    try {
      await addExpense({
        description: formData.description.trim(),
        category: selectedCategory,
        amount: Number(formData.amount),
        payment_method: 'Cash',
        date: formData.date,
      });

      setExpenseSaved(true);
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
      });
      setTimeout(() => setExpenseSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const totalAlertCount = outOfStockItems.length + lowStockItems.length;

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-24 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-12 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#171d19] lg:text-3xl">
              {lang === 'en' ? 'Stock Alerts & Urgent Restocks' : 'Tahadhari za Stoki na Mzigo'}
            </h1>
            <p className="mt-1 text-sm text-[#3d4a42]">
              {lang === 'en'
                ? 'Actionable alerts for products running out or empty in your store'
                : 'Bidhaa zinazoelekea kuisha au zilizokwisha kabisa dukan mwako'}
            </p>
          </div>

          <div className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold ${totalAlertCount > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
            {totalAlertCount} {lang === 'en' ? 'urgent items' : 'bidhaa zinazohitaji mzigo'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Alerts List (8 cols) */}
          <section className="lg:col-span-8 space-y-6">
            {/* Out of Stock */}
            <article className="overflow-hidden rounded-3xl border border-[#bccac0]/40 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-red-100 bg-red-50/50">
                <div className="flex items-center gap-2 text-sm font-black text-red-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span>{lang === 'en' ? `Out of Stock (${outOfStockItems.length})` : `Zimekwisha Kabisa (${outOfStockItems.length})`}</span>
                </div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Hauwezi Kuuza</span>
              </div>

              <div className="divide-y divide-gray-100">
                {outOfStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#171d19]">{item.name}</p>
                        <p className="text-xs text-red-600 font-semibold">
                          Zimebaki: 0 {item.unit || 'pcs'} (Kiwango cha chini: {item.min_stock || item.min})
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProductForRestock(item)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#006948] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-[#00553a] active:scale-95 transition"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>{lang === 'en' ? 'Restock' : '+ Weka Mzigo'}</span>
                    </button>
                  </div>
                ))}

                {outOfStockItems.length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400">
                    <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500 mb-2" />
                    Hakuna bidhaa iliyokwisha kabisa. Hongera!
                  </div>
                )}
              </div>
            </article>

            {/* Low Stock */}
            <article className="overflow-hidden rounded-3xl border border-[#bccac0]/40 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-2 text-sm font-black text-amber-800">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span>{lang === 'en' ? `Low Stock (${lowStockItems.length})` : `Zinaelekea Kuisha (${lowStockItems.length})`}</span>
                </div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Agiza Mapema</span>
              </div>

              <div className="divide-y divide-gray-100">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#171d19]">{item.name}</p>
                        <p className="text-xs text-amber-700 font-semibold">
                          Zimebaki: <strong>{item.stock} {item.unit || 'pcs'}</strong> (Kiwango cha chini: {item.min_stock || item.min})
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProductForRestock(item)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#006948] px-3.5 py-2 text-xs font-bold text-[#006948] hover:bg-emerald-50 active:scale-95 transition"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>{lang === 'en' ? 'Add Stock' : '+ Ongeza Mzigo'}</span>
                    </button>
                  </div>
                ))}

                {lowStockItems.length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400">
                    <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500 mb-2" />
                    Bidhaa zote ziko katika viwango vya kutosha.
                  </div>
                )}
              </div>
            </article>
          </section>

          {/* Right Column: Quick Expense Logger (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-extrabold text-[#171d19]">
                {lang === 'en' ? 'Quick Expense Logger' : 'Rekodi Haraka Gharama ya Duka'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {lang === 'en' ? 'Save daily expenses on the go' : 'Hifadhi gharama bila kutoka kwenye skrini hii'}
              </p>

              {expenseSaved && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 font-bold border border-emerald-200">
                  ✓ Gharama imehifadhiwa kikamilifu!
                </div>
              )}

              <form onSubmit={handleQuickExpenseSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {categories.map(item => {
                    const selected = selectedCategory === item.cat;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedCategory(item.cat)}
                        className={`rounded-xl p-2 text-center transition border text-xs font-bold ${
                          selected
                            ? 'border-[#006948] bg-emerald-50 text-[#006948]'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-lg leading-none">{item.emoji}</div>
                        <div className="mt-1 text-[10px]">{item.label}</div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Maelezo
                  </label>
                  <input
                    required
                    className={inputClass}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="mfano: Boda kuleta stoki, Tokens..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Kiasi (KSh)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className={inputClass}
                    value={formData.amount}
                    onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Tarehe
                  </label>
                  <input
                    type="date"
                    required
                    className={inputClass}
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-[#006948] py-3 text-xs font-bold text-white transition hover:bg-[#00583c] active:scale-98 shadow"
                >
                  {lang === 'en' ? 'Save Expense' : 'Hifadhi Gharama'}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>

      {/* Stock Adjustment Modal */}
      {selectedProductForRestock && (
        <StockAdjustmentModal
          open={!!selectedProductForRestock}
          product={selectedProductForRestock}
          onClose={() => setSelectedProductForRestock(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}

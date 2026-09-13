import React, { useMemo, useState, useEffect } from 'react';
import {
  Plus, Trash2, Calendar, Filter, DollarSign,
  TrendingDown, Zap, Home, Package, Users, Truck, MoreHorizontal, X, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import { getExpenses, addExpense, deleteExpense, DB_CHANGE_EVENT } from '../db/sqlite';

const categoryMeta = {
  Kodi: { icon: Home, bg: '#ede9fe', text: '#6d28d9', labelSw: 'Kodi', labelEn: 'Rent' },
  Umeme: { icon: Zap, bg: '#fef9c3', text: '#854d0e', labelSw: 'Umeme/Maji', labelEn: 'Utilities' },
  Bidhaa: { icon: Package, bg: '#dcfce7', text: '#15803d', labelSw: 'Kununua Bidhaa', labelEn: 'Stock' },
  Mishahara: { icon: Users, bg: '#fee2e2', text: '#b91c1c', labelSw: 'Mishahara', labelEn: 'Salaries' },
  Usafiri: { icon: Truck, bg: '#e0f2fe', text: '#0369a1', labelSw: 'Usafiri / Boda', labelEn: 'Transport' },
  Nyingine: { icon: MoreHorizontal, bg: '#f3f4f6', text: '#6b7280', labelSw: 'Nyingine', labelEn: 'Other' },
};

const inputClass =
  'h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

export default function ExpensesPage() {
  const { lang, t } = useLang();
  const [activeFilter, setActiveFilter] = useState('all'); // all, today, week, month
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    category: 'Umeme',
    amount: '',
    payment_method: 'M-Pesa',
    mpesa_reference: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const { collapsed } = useSidebar();

  const loadExpensesData = async () => {
    try {
      const items = await getExpenses({ period: 'all' });
      setExpenses(items);
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  useEffect(() => {
    loadExpensesData();
    const handleDbChange = () => loadExpensesData();
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, []);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return expenses.filter(e => {
      const dateStr = (e.created_at || '').slice(0, 10);
      if (activeFilter === 'today' && dateStr !== todayStr) return false;
      if (activeFilter === 'week' && dateStr < weekAgo) return false;
      if (activeFilter === 'month' && dateStr < monthAgo) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, activeFilter, categoryFilter]);

  // Aggregate Metrics
  const summary = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const todayItems = expenses.filter(e => (e.created_at || '').slice(0, 10) === todayStr);
    const weekItems = expenses.filter(e => (e.created_at || '').slice(0, 10) >= weekAgo);
    const monthItems = expenses.filter(e => (e.created_at || '').slice(0, 10) >= monthAgo);

    const todaySum = todayItems.reduce((s, e) => s + Number(e.amount || 0), 0);
    const weekSum = weekItems.reduce((s, e) => s + Number(e.amount || 0), 0);
    const monthSum = monthItems.reduce((s, e) => s + Number(e.amount || 0), 0);

    return {
      today: { sum: todaySum, count: todayItems.length },
      week: { sum: weekSum, count: weekItems.length },
      month: { sum: monthSum, count: monthItems.length },
    };
  }, [expenses]);

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      setError(lang === 'en' ? 'Please fill in all required fields' : 'Tafadhali jaza sehemu zote zinazohitajika');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addExpense({
        description: formData.description.trim(),
        category: formData.category,
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        mpesa_reference: formData.mpesa_reference.trim().toUpperCase(),
        date: formData.date,
      });

      setShowModal(false);
      setFormData({
        description: '',
        category: 'Umeme',
        amount: '',
        payment_method: 'M-Pesa',
        mpesa_reference: '',
        date: new Date().toISOString().slice(0, 10),
      });
      loadExpensesData();
    } catch (err) {
      setError(err.message || 'Hitilafu ya kurekodi gharama');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Header */}
        <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#171d19] lg:text-3xl">
              {lang === 'en' ? 'Operating Expenses' : 'Gharama na Matumizi'}
            </h1>
            <p className="mt-1 text-sm text-[#3d4a42]">
              {lang === 'en'
                ? 'Record and categorize daily shop expenses to know your exact profits'
                : 'Rekodi matumizi ya kila siku ili kujua faida halisi ya biashara'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#006948] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:bg-[#00553a] active:scale-98 transition"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'en' ? 'Record Expense' : '+ Ongeza Gharama'}</span>
          </button>
        </div>

        {/* Expense Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? 'Today' : 'Leo'}
              </span>
              <span className="rounded-full bg-red-100 p-1.5 text-red-600">
                <TrendingDown className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-[#171d19]">
              KSh {summary.today.sum.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {summary.today.count} {lang === 'en' ? 'transactions' : 'matumizi'}
            </div>
          </div>

          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? 'This Week' : 'Wiki Hii'}
              </span>
              <span className="rounded-full bg-amber-100 p-1.5 text-amber-700">
                <Calendar className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-[#171d19]">
              KSh {summary.week.sum.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {summary.week.count} {lang === 'en' ? 'transactions' : 'matumizi'}
            </div>
          </div>

          <div className="rounded-2xl border border-[#bccac0]/40 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {lang === 'en' ? 'This Month' : 'Mwezi Huu'}
              </span>
              <span className="rounded-full bg-blue-100 p-1.5 text-blue-700">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-[#171d19]">
              KSh {summary.month.sum.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {summary.month.count} {lang === 'en' ? 'transactions' : 'matumizi'}
            </div>
          </div>
        </div>

        {/* Filter Chips & Category Dropdown */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: lang === 'en' ? 'All' : 'Zote' },
              { id: 'today', label: lang === 'en' ? 'Today' : 'Leo' },
              { id: 'week', label: lang === 'en' ? 'This Week' : 'Wiki Hii' },
              { id: 'month', label: lang === 'en' ? 'This Month' : 'Mwezi Huu' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-full px-4 py-1.5 font-bold transition ${
                  activeFilter === f.id
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'bg-white border border-[#bccac0]/60 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`${inputClass} font-semibold text-xs`}
            >
              <option value="all">{lang === 'en' ? 'All Categories' : 'Jamii Zote'}</option>
              <option value="Umeme">Umeme / Maji (Utilities)</option>
              <option value="Kodi">Kodi ya Duka (Rent)</option>
              <option value="Bidhaa">Bidhaa / Stock</option>
              <option value="Mishahara">Mishahara (Salaries)</option>
              <option value="Usafiri">Usafiri / Boda (Transport)</option>
              <option value="Nyingine">Nyingine (Other)</option>
            </select>
          </div>
        </div>

        {/* Expense List Card */}
        <div className="overflow-hidden rounded-2xl border border-[#bccac0]/40 bg-white shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-[#171d19]">
              <thead className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Maelezo / Description</th>
                  <th className="px-4 py-3.5">Jamii</th>
                  <th className="px-4 py-3.5">Tarehe</th>
                  <th className="px-4 py-3.5">Njia ya Malipo</th>
                  <th className="px-4 py-3.5 text-right">Kiasi (KSh)</th>
                  <th className="px-6 py-3.5 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredExpenses.map(item => {
                  const meta = categoryMeta[item.category] || categoryMeta.Nyingine;
                  const Icon = meta.icon;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-[#171d19]">{item.description}</div>
                        {item.mpesa_reference && (
                          <span className="font-mono text-[10px] text-gray-400">
                            Ref: {item.mpesa_reference}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                          style={{ backgroundColor: meta.bg, color: meta.text }}
                        >
                          <Icon className="h-3 w-3" />
                          {lang === 'en' ? meta.labelEn : meta.labelSw}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-gray-500">
                        {new Date(item.created_at).toLocaleDateString(lang === 'en' ? 'en-KE' : 'sw-KE', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-gray-600">
                        {item.payment_method || 'Cash'}
                      </td>
                      <td className="px-4 py-4 text-right text-base font-black text-red-600">
                        -KSh {Number(item.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="divide-y divide-[#f3f4f6] md:hidden">
            {filteredExpenses.map(item => {
              const meta = categoryMeta[item.category] || categoryMeta.Nyingine;
              const Icon = meta.icon;

              return (
                <div key={item.id} className="p-4 bg-white flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.text }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#171d19]">{item.description}</h4>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(item.created_at).toLocaleDateString()} • {item.payment_method}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-red-600">
                      -KSh {Number(item.amount || 0).toLocaleString()}
                    </div>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="text-[10px] text-gray-400 hover:text-red-500 mt-1"
                    >
                      Futa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-600">Hakuna gharama zilizorekodiwa</p>
              <p className="text-xs mt-1">Bofya kitufe cha "+ Ongeza Gharama" hapo juu kuanza.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#bccac0]/40 px-5 sm:px-6 py-4 shrink-0">
              <h2 className="text-base sm:text-lg font-bold text-[#171d19]">
                {lang === 'en' ? 'Record Shop Expense' : 'Rekodi Gharama ya Duka'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Maelezo / Description *
                </label>
                <input
                  required
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className={inputClass}
                  placeholder="mfano: Bili ya tokens, Boda mzigo, Kodi..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Jamii ya Gharama / Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className={inputClass}
                >
                  <option value="Umeme">Umeme / Maji (Utilities)</option>
                  <option value="Kodi">Kodi ya Duka (Rent)</option>
                  <option value="Bidhaa">Bidhaa / Stock</option>
                  <option value="Mishahara">Mishahara (Salaries)</option>
                  <option value="Usafiri">Usafiri / Boda (Transport)</option>
                  <option value="Nyingine">Nyingine (Other)</option>
                </select>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Kiasi (KSh) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                    className={inputClass}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Tarehe / Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Njia ya Malipo / Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['M-Pesa', 'Cash', 'Other'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, payment_method: method }))}
                      className={`rounded-xl py-2 text-xs font-bold transition ${
                        formData.payment_method === method
                          ? 'bg-[#006948] text-white shadow-sm'
                          : 'bg-white border border-[#bccac0]/60 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {formData.payment_method === 'M-Pesa' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    M-Pesa Ref Code (Hiari)
                  </label>
                  <input
                    value={formData.mpesa_reference}
                    onChange={e => setFormData(p => ({ ...p, mpesa_reference: e.target.value }))}
                    className={inputClass}
                    placeholder="mfano: QKH123984"
                  />
                </div>
              )}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-[#bccac0] py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#006948] py-3 text-xs font-bold text-white shadow hover:bg-[#00553a] active:scale-98 transition"
                >
                  {loading ? 'Inahifadhi...' : (lang === 'en' ? 'Save Expense' : 'Hifadhi Gharama')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#171d19]">
              {lang === 'en' ? 'Delete Expense?' : 'Futa Rekodi ya Gharama?'}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Rekodi hii itafutwa kabisa kutoka kwa hifadhidata ya duka lako.
            </p>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteExpense(deleteId);
                  setDeleteId(null);
                  loadExpensesData();
                }}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Ndio, Futa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

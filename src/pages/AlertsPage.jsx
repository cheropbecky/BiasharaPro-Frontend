import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import image3 from '../assets/image3.jpg';
import heroImage from '../assets/hero.jpg';
const categoryColors = {
  Kodi: { bg: '#ede9fe', text: '#6d28d9' },
  Umeme: { bg: '#fef9c3', text: '#854d0e' },
  Bidhaa: { bg: '#dcfce7', text: '#15803d' },
  Mishahara: { bg: '#fee2e2', text: '#b91c1c' },
  Usafiri: { bg: '#e0f2fe', text: '#0369a1' },
  Ukarabati: { bg: '#f3e8ff', text: '#7e22ce' },
  Chakula: { bg: '#ffedd5', text: '#c2410c' },
  Nyingine: { bg: '#f3f4f6', text: '#6b7280' },
};

const outOfStockItems = [
  { name: 'Sukari Mumias 1kg', qty: 0, badge: 'out-of-stock' },
  { name: 'Siagi Blue Band 250g', qty: 0, badge: 'out-of-stock' },
];

const lowStockItems = [
  { name: 'Mafuta Elianto 2L', left: 4, min: 10, badge: 'low-stock' },
  { name: 'Unga Pembe 2kg', left: 3, min: 20, badge: 'low-stock' },
  { name: 'Sabuni Omo 1kg', left: 7, min: 10, badge: 'low-stock' },
];

const categories = [
  { emoji: '🏠', label: 'Kodi' },
  { emoji: '⚡', label: 'Umeme' },
  { emoji: '📦', label: 'Bidhaa' },
  { emoji: '👤', label: 'Mishahara' },
  { emoji: '🚗', label: 'Usafiri' },
  { emoji: '🔧', label: 'Ukarabati' },
  { emoji: '🍽️', label: 'Chakula' },
  { emoji: '➕', label: 'Nyingine' },
];

const inputClass =
  'w-full rounded-xl border border-[#bccac0] bg-white px-4 py-3 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

function ProductIconBox() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#fee2e2] text-[#dc2626]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h16M7 8V5h10v3M6 8l1 12h10l1-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AlertsPage() {
  const { t, lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState('Kodi');
  const [expenseType, setExpenseType] = useState('paid');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const recentAlerts = useMemo(
    () => ({
      outOfStock: outOfStockItems,
      lowStock: lowStockItems,
    }),
    [],
  );

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.92), rgba(239,245,239,0.92)), url(${image3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className="px-4 pb-20 pt-20 lg:px-8 lg:pl-63 lg:pb-8">
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#171d19]">{t('alerts')}</h1>
            <p className="mt-1 text-[16px] text-[#3d4a42]">{t('alertsSubtitle')}</p>
          </div>

          <div className="rounded-full bg-[#fee2e2] px-4 py-2 text-[14px] font-bold text-[#dc2626]">
            {t('alertsCount')}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-5">
            <article className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
              <div className="flex items-center gap-2 px-5 py-4 text-[16px] font-bold text-[#b91c1c]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                {lang === 'en' ? 'Out of Stock (2)' : 'Zimekwisha / Out of Stock (2)'}
              </div>
              <div className="border-l-4 border-l-[#dc2626]">
                {recentAlerts.outOfStock.map((item, index) => (
                  <div key={item.name} className={`flex items-center justify-between gap-4 px-5 py-4 ${index < recentAlerts.outOfStock.length - 1 ? 'border-b border-[#f3f4f6]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <ProductIconBox />
                      <div>
                        <p className="text-[14px] font-semibold text-[#171d19]">{item.name}</p>
                        <p className="text-[12px] text-[#6b7280]">{lang === 'en' ? 'Qty: 0' : 'Kiasi: 0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" className="rounded-lg border border-[#006948] px-3 py-1.5 text-[12px] font-semibold text-[#006948]">
                        {lang === 'en' ? 'Restock' : 'Eka'}
                      </button>
                      <Badge status={item.badge}>Out of stock</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
              <div className="flex items-center gap-2 px-5 py-4 text-[16px] font-bold text-[#854d0e]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                {lang === 'en' ? 'Low Stock (3)' : 'Stoki Chini / Low Stock (3)'}
              </div>
              <div className="border-l-4 border-l-[#f59e0b]">
                {recentAlerts.lowStock.map((item, index) => (
                  <div key={item.name} className={`flex items-center justify-between gap-4 px-5 py-4 ${index < recentAlerts.lowStock.length - 1 ? 'border-b border-[#f3f4f6]' : ''}`}>
                    <div className="flex items-center gap-3">
                      <ProductIconBox />
                      <div>
                        <p className="text-[14px] font-semibold text-[#171d19]">{item.name}</p>
                        <p className="text-[12px] text-[#6b7280]">
                          {lang === 'en' ? `Left: ${item.left} / Min: ${item.min}` : `Kiasi: ${item.left} / min ${item.min}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" className="rounded-lg border border-[#006948] px-3 py-1.5 text-[12px] font-semibold text-[#006948]">
                        {lang === 'en' ? 'Restock' : 'Eka'}
                      </button>
                      <Badge status={item.badge}>Low stock</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <aside>
            <div className="rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white overflow-hidden">
              <img src={heroImage} alt="Alerts illustration" className="w-full h-32 object-cover" />
              <div className="p-6">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[18px] font-bold text-[#171d19]">{lang === 'en' ? 'Record Expense' : 'Ingiza Gharama'}</h2>
                    <p className="mt-1 text-[14px] text-[#6b7280]">{lang === 'en' ? 'Save your expenses right here.' : 'Hifadhi matumizi yako hapa hapa.'}</p>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2">
                  {categories.map(item => {
                    const selected = selectedCategory === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedCategory(item.label)}
                        className="rounded-xl border bg-white p-3 text-center transition-colors"
                        style={{
                          borderColor: selected ? '#006948' : '#e5e7eb',
                          borderWidth: selected ? '2px' : '1px',
                          backgroundColor: selected ? '#eff5ef' : '#fff',
                          color: selected ? '#006948' : '#3d4a42',
                        }}
                      >
                        <div className="text-[24px] leading-none">{item.emoji}</div>
                        <div className="mt-1 text-[11px] font-semibold uppercase">{item.label}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">MAELEZO / DESCRIPTION</label>
                    <input
                      className={inputClass}
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={lang === 'en' ? 'Description' : 'Maelezo'}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">KIASI / AMOUNT (KSH)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={formData.amount}
                      onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">TAREHE / DATE</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">HALI / STATUS</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setExpenseType('paid')}
                        className="rounded-xl border px-3 py-2 text-[13px] font-semibold"
                        style={{ borderColor: expenseType === 'paid' ? '#006948' : '#e5e7eb', backgroundColor: expenseType === 'paid' ? '#eff5ef' : '#fff', color: expenseType === 'paid' ? '#006948' : '#3d4a42' }}
                      >
                        {lang === 'en' ? 'Paid' : 'Imelipwa'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseType('pending')}
                        className="rounded-xl border px-3 py-2 text-[13px] font-semibold"
                        style={{ borderColor: expenseType === 'pending' ? '#006948' : '#e5e7eb', backgroundColor: expenseType === 'pending' ? '#eff5ef' : '#fff', color: expenseType === 'pending' ? '#006948' : '#3d4a42' }}
                      >
                        {lang === 'en' ? 'Pending' : 'Inangoja'}
                      </button>
                    </div>
                  </div>

                  <button type="button" className="mt-2 w-full rounded-xl bg-[#006948] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#00583c]">
                    {lang === 'en' ? 'Save Expense' : 'Hifadhi Gharama'}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

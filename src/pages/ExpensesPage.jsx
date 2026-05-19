import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';

const expenseRows = [
  { date: 'Oct 24', description: 'Unga wa jumla — Githurai', category: 'Bidhaa', amount: '-Ksh 45,000', status: 'paid' },
  { date: 'Oct 24', description: 'Bili ya umeme — KPLC', category: 'Umeme', amount: '-Ksh 3,500', status: 'paid' },
  { date: 'Oct 23', description: 'Kodi ya duka', category: 'Kodi', amount: '-Ksh 30,000', status: 'paid' },
  { date: 'Oct 23', description: 'Mshahara — Kamau', category: 'Mishahara', amount: '-Ksh 8,000', status: 'paid' },
  { date: 'Oct 22', description: 'Maji — NCWSC', category: 'Nyingine', amount: '-Ksh 1,200', status: 'paid' },
  { date: 'Oct 22', description: 'Vinywaji vya jumla', category: 'Bidhaa', amount: '-Ksh 88,200', status: 'paid' },
  { date: 'Oct 21', description: 'Ukarabati wa friji', category: 'Nyingine', amount: '-Ksh 4,500', status: 'pending' },
  { date: 'Oct 21', description: 'Unga — mgao wa pili', category: 'Bidhaa', amount: '-Ksh 12,000', status: 'paid' },
  { date: 'Oct 20', description: 'Mshahara — Akinyi', category: 'Mishahara', amount: '-Ksh 8,000', status: 'paid' },
  { date: 'Oct 20', description: 'Sabuni ya jumla', category: 'Bidhaa', amount: '-Ksh 7,600', status: 'paid' },
];

const categoryPill = {
  Kodi: { bg: '#ede9fe', text: '#6d28d9' },
  Umeme: { bg: '#fef9c3', text: '#854d0e' },
  Bidhaa: { bg: '#dcfce7', text: '#15803d' },
  Mishahara: { bg: '#fee2e2', text: '#b91c1c' },
  Nyingine: { bg: '#f3f4f6', text: '#6b7280' },
};

const inputClass =
  'h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ExpensesPage() {
  const { lang, t } = useLang();
  const [activeChip, setActiveChip] = useState('today');
  const [showModal, setShowModal] = useState(false);
  const [pickedCategory, setPickedCategory] = useState('Kodi');
  const [expenseStatus, setExpenseStatus] = useState('paid');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const summary = useMemo(() => {
    if (lang === 'en') {
      return [
        { key: 'today', label: 'Today', amount: 'Ksh 1,200', sub: '5 expenses' },
        { key: 'week', label: 'This Week', amount: 'Ksh 8,450', sub: '17 expenses' },
        { key: 'month', label: 'This Month', amount: 'Ksh 42,300', sub: '62 expenses' },
      ];
    }

    return [
      { key: 'today', label: 'Leo', amount: 'Ksh 1,200', sub: '5 matumizi' },
      { key: 'week', label: 'Wiki Hii', amount: 'Ksh 8,450', sub: '17 matumizi' },
      { key: 'month', label: 'Mwezi Huu', amount: 'Ksh 42,300', sub: '62 matumizi' },
    ];
  }, [lang]);

  const categories = [
    { emoji: '🏠', labelSw: 'Kodi', labelEn: 'Rent' },
    { emoji: '⚡', labelSw: 'Umeme', labelEn: 'Electricity' },
    { emoji: '📦', labelSw: 'Bidhaa', labelEn: 'Stock' },
    { emoji: '👤', labelSw: 'Mishahara', labelEn: 'Salary' },
  ];

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.90), rgba(239,245,239,0.90)), url(${image1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className="px-4 pb-20 pt-20 lg:px-8 lg:pl-60 lg:pb-8 relative">
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-extrabold text-[#171d19] lg:text-[28px]">{lang === 'en' ? 'Expenses' : 'Matumizi'}</h1>
            <p className="mt-1 text-[14px] text-[#3d4a42] lg:text-[16px]">{lang === 'en' ? 'Track all your expenses.' : 'Fuatilia matumizi yako yote.'}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-[#006948] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#00583c]"
          >
            {lang === 'en' ? 'Add Expense' : 'Ongeza Gharama'}
          </button>
        </div>

        <div className="mb-5 flex gap-3 overflow-x-auto pb-1">
          {summary.map(chip => {
            const active = activeChip === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => setActiveChip(chip.key)}
                className="min-w-47.5 cursor-pointer rounded-xl border px-5 py-3 text-left"
                style={{
                  borderColor: active ? '#006948' : '#e5e7eb',
                  backgroundColor: active ? '#006948' : '#fff',
                  color: active ? '#fff' : '#171d19',
                }}
              >
                <p className="text-[12px] font-semibold opacity-90">{chip.label}</p>
                <p className="mt-0.5 text-[16px] font-bold">{chip.amount}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: active ? '#d1fae5' : '#6b7280' }}>{chip.sub}</p>
              </button>
            );
          })}
        </div>

        <div className="mb-5 hidden sm:block">
          <img src={image2} alt="Expense tracking" className="w-full h-32 object-cover rounded-2xl shadow-sm" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] bg-[#f9fafb] px-5 py-4">
            <h2 className="text-[16px] font-bold text-[#171d19]">
              {lang === 'en' ? 'Expense History' : 'Historia ya Matumizi'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#bccac0] bg-white px-3 py-1.5 text-[13px] font-medium text-[#3d4a42]"
              >
                <FilterIcon />
                {lang === 'en' ? 'Filter' : 'Chuja'}
              </button>
              <div className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-[12px] text-[#6b7280]">
                Oct 20 - Oct 24
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 border-b border-[#e5e7eb] px-8 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
              <div className="col-span-1">TAREHE / DATE</div>
              <div className="col-span-4">MAELEZO / DESCRIPTION</div>
              <div className="col-span-2">JAMII / CATEGORY</div>
              <div className="col-span-2">KIASI / AMOUNT</div>
              <div className="col-span-3">HALI / STATUS</div>
            </div>

            <div className="divide-y divide-[#f3f4f6]">
              {expenseRows.map(row => {
                const style = categoryPill[row.category] || categoryPill.Nyingine;
                return (
                  <div key={`${row.date}-${row.description}`} className="grid grid-cols-12 gap-4 px-8 py-4 text-[14px] text-[#171d19] transition-colors hover:bg-[#f9fafb]">
                    <div className="col-span-1 text-[#6b7280]">{row.date}</div>
                    <div className="col-span-4 font-medium">{row.description}</div>
                    <div className="col-span-2">
                      <span
                        className="inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {row.category}
                      </span>
                    </div>
                    <div className="col-span-2 font-bold text-[#dc2626]">{row.amount}</div>
                    <div className="col-span-3">
                      <Badge status={row.status === 'paid' ? 'income' : 'low-stock'}>
                        {row.status === 'paid' ? (lang === 'en' ? 'Paid' : 'Imelipwa') : (lang === 'en' ? 'Pending' : 'Inangoja')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-[#f3f4f6] px-8 py-4">
              <p className="text-[13px] text-[#6b7280]">{lang === 'en' ? 'Showing 10 of 32' : 'Inaonyesha 10 kati ya 32'}</p>
              <div className="flex items-center gap-2">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]">‹</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#006948] px-2 text-white">1</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#e5e7eb] px-2 text-[#6b7280]">2</button>
                <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#e5e7eb] px-2 text-[#6b7280]">3</button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280]">›</button>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {expenseRows.map(row => {
              const style = categoryPill[row.category] || categoryPill.Nyingine;
              return (
                <article key={`${row.description}-mobile`} className="rounded-xl border border-[#e5e7eb] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] text-[#6b7280]">{row.date}</p>
                      <h3 className="mt-1 text-[14px] font-semibold text-[#171d19]">{row.description}</h3>
                    </div>
                    <Badge status={row.status === 'paid' ? 'income' : 'low-stock'}>
                      {row.status === 'paid' ? (lang === 'en' ? 'Paid' : 'Imelipwa') : (lang === 'en' ? 'Pending' : 'Inangoja')}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.text }}>
                      {row.category}
                    </span>
                    <p className="text-[16px] font-bold text-[#dc2626]">{row.amount}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-120 rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-[20px] font-bold text-[#171d19]">
                {lang === 'en' ? 'Add Expense' : 'Ongeza Gharama'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#9ca3af] hover:text-[#171d19]" aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                className={inputClass}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={lang === 'en' ? 'Description' : 'MAELEZO'}
              />

              <div>
                <p className="mb-2 text-[13px] font-semibold text-[#3d4a42]">{lang === 'en' ? 'Category' : 'JAMII'}</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(item => {
                    const value = item.labelSw;
                    const selected = pickedCategory === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPickedCategory(value)}
                        className="rounded-xl border px-3 py-2 text-left"
                        style={{ borderColor: selected ? '#006948' : '#e5e7eb', backgroundColor: '#fff' }}
                      >
                        <div className="text-[20px]">{item.emoji}</div>
                        <div className="mt-1 text-[13px] font-semibold text-[#171d19]">{lang === 'en' ? item.labelEn : item.labelSw}</div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setPickedCategory('Nyingine')}
                  className="mt-2 text-[13px] font-medium text-[#3d4a42] underline"
                >
                  {lang === 'en' ? 'Other' : 'Nyingine'}
                </button>
              </div>

              <input
                className={inputClass}
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder={lang === 'en' ? 'Amount (KSH)' : 'KIASI (KSH)'}
                type="number"
              />

              <input
                className={inputClass}
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                type="date"
              />

              <div>
                <p className="mb-2 text-[13px] font-semibold text-[#3d4a42]">{lang === 'en' ? 'Status' : 'HALI'}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExpenseStatus('paid')}
                    className="rounded-xl border px-3 py-2 text-[13px] font-semibold"
                    style={{ borderColor: expenseStatus === 'paid' ? '#006948' : '#e5e7eb', color: expenseStatus === 'paid' ? '#006948' : '#3d4a42' }}
                  >
                    {lang === 'en' ? 'Paid' : 'Imelipwa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpenseStatus('pending')}
                    className="rounded-xl border px-3 py-2 text-[13px] font-semibold"
                    style={{ borderColor: expenseStatus === 'pending' ? '#006948' : '#e5e7eb', color: expenseStatus === 'pending' ? '#006948' : '#3d4a42' }}
                  >
                    {lang === 'en' ? 'Pending' : 'Inangoja'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[#bccac0] px-4 py-2.5 text-[14px] font-semibold text-[#3d4a42]"
              >
                {lang === 'en' ? 'Cancel' : 'Ghairi'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-[#006948] px-4 py-2.5 text-[14px] font-semibold text-white"
              >
                {lang === 'en' ? 'Save' : 'Hifadhi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

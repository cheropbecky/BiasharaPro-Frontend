import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import image2 from '../assets/image2.jpg';
import image1 from '../assets/image1.jpg';
import useSidebar from '../hooks/useSidebar';

const categoryPill = {
  Mauzo: { bg: '#dcfce7', text: '#15803d' },
  Bidhaa: { bg: '#dcfce7', text: '#15803d' },
  Umeme: { bg: '#fef9c3', text: '#854d0e' },
  Kodi: { bg: '#ede9fe', text: '#6d28d9' },
  Mishahara: { bg: '#fee2e2', text: '#b91c1c' },
  Nyingine: { bg: '#f3f4f6', text: '#6b7280' },
};

const transactions = [
  { date: 'Oct 24', description: 'Mauzo ya jumla', category: 'Mauzo', amount: 12400, type: 'income' },
  { date: 'Oct 24', description: 'Unga wa jumla', category: 'Bidhaa', amount: 45000, type: 'expense' },
  { date: 'Oct 23', description: 'Kinywaji cha jumla', category: 'Bidhaa', amount: 88200, type: 'income' },
  { date: 'Oct 23', description: 'Bili ya umeme', category: 'Umeme', amount: 3500, type: 'expense' },
  { date: 'Oct 22', description: 'Mauzo ya kawaida', category: 'Mauzo', amount: 15300, type: 'income' },
  { date: 'Oct 22', description: 'Kodi ya duka', category: 'Kodi', amount: 30000, type: 'expense' },
];

function TrendingUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16l6-6 4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendingDownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8l6 6 4-4 6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17h4v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h13a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IncomeCircle({ children }) {
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006948] text-white">{children}</div>;
}

function ExpenseCircle({ children }) {
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dc2626] text-white">{children}</div>;
}

function GoldCircle({ children }) {
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f59e0b] text-white">{children}</div>;
}

export default function BookkeepingPage() {
  const { t, lang } = useLang();
  const { collapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.92), rgba(239,245,239,0.92)), url(${image2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-20 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-8 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-extrabold text-[#171d19] lg:text-[28px]">{t('bookkeeping')}</h1>
            <p className="mt-1 text-[14px] text-[#3d4a42] lg:text-[16px]">{t('bookkeepingSubtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-[#006948] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#006948]"
            >
              {t('downloadReport')}
            </button>
            <div className="rounded-lg bg-[#eff5ef] px-3 py-2 text-[12px] font-semibold text-[#006948]">LAST 30 DAYS</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border-t-[3px] border-t-[#006948] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">{lang === 'en' ? 'TOTAL INCOME' : 'JUMLA YA MAPATO'}</p>
                <h2 className="mt-3 text-[32px] font-extrabold text-[#171d19]">Ksh 428,500</h2>
                <p className="mt-2 text-[14px] text-[#16a34a]">↑ 12% {lang === 'en' ? 'vs last month' : 'vs mwezi uliopita'}</p>
              </div>
              <IncomeCircle><TrendingUpIcon /></IncomeCircle>
            </div>
          </section>

          <section className="rounded-2xl border-t-[3px] border-t-[#dc2626] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">{lang === 'en' ? 'TOTAL EXPENSES' : 'JUMLA YA MATUMIZI'}</p>
                <h2 className="mt-3 text-[32px] font-extrabold text-[#dc2626]">Ksh 154,200</h2>
                <p className="mt-2 text-[14px] text-[#dc2626]">↑ 4% {lang === 'en' ? 'increase' : 'ongezeko'}</p>
              </div>
              <ExpenseCircle><TrendingDownIcon /></ExpenseCircle>
            </div>
          </section>

          <section className="rounded-2xl border-t-[3px] border-t-[#f59e0b] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">{lang === 'en' ? 'NET PROFIT' : 'FAIDA HALISI'}</p>
                <h2 className="mt-3 text-[32px] font-extrabold text-[#171d19]">Ksh 274,300</h2>
                <p className="mt-2 text-[14px] text-[#3d4a42]">{lang === 'en' ? 'Margin: 64%' : 'Asilimia: 64%'}</p>
              </div>
              <GoldCircle><WalletIcon /></GoldCircle>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] px-6 py-4">
              <h3 className="text-[16px] font-semibold uppercase tracking-wide text-[#3d4a42]">
                {lang === 'en' ? 'TRANSACTION HISTORY' : 'HISTORIA YA MIAMALA'}
              </h3>
              <p className="text-[12px] text-[#9ca3af]">{t('allAmountsKes')}</p>
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-4 border-b border-[#e5e7eb] bg-[#f9fafb] px-8 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                <div className="col-span-2">TAREHE</div>
                <div className="col-span-5">MAELEZO</div>
                <div className="col-span-2">JAMII</div>
                <div className="col-span-3 text-right">KIASI</div>
              </div>

              <div className="divide-y divide-[#f3f4f6]">
                {transactions.map(row => {
                  const pill = categoryPill[row.category] || categoryPill.Nyingine;
                  return (
                    <div key={`${row.date}-${row.description}`} className="grid grid-cols-12 gap-4 px-8 py-4 text-[14px] hover:bg-[#f9fafb]">
                      <div className="col-span-2 font-medium text-[#171d19]">{row.date}</div>
                      <div className="col-span-5 font-semibold text-[#171d19]">{row.description}</div>
                      <div className="col-span-2">
                        <span className="inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap" style={{ backgroundColor: pill.bg, color: pill.text }}>
                          {row.category}
                        </span>
                      </div>
                      <div className="col-span-3 text-right font-semibold" style={{ color: row.type === 'income' ? '#16a34a' : '#dc2626' }}>
                        {row.type === 'income' ? '+ ' : '- '}Ksh {row.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-[#f3f4f6] px-8 py-4">
                <p className="text-[13px] text-[#6b7280]">{lang === 'en' ? 'Showing 6 of 124' : 'Inaonyesha 6 kati ya 124'}</p>
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
              {transactions.map(row => {
                const pill = categoryPill[row.category] || categoryPill.Nyingine;
                return (
                  <article key={`${row.date}-${row.description}-mobile`} className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] text-[#6b7280]">{row.date}</p>
                        <h4 className="mt-1 text-[14px] font-semibold text-[#171d19]">{row.description}</h4>
                      </div>
                      <span className="inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap" style={{ backgroundColor: pill.bg, color: pill.text }}>
                        {row.category}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[13px] text-[#6b7280]">{lang === 'en' ? 'Amount' : 'Kiasi'}</span>
                      <span className="text-[14px] font-semibold" style={{ color: row.type === 'income' ? '#16a34a' : '#dc2626' }}>
                        {row.type === 'income' ? '+ ' : '- '}Ksh {row.amount.toLocaleString()}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-4">
              <img src={image1} alt="Financial overview" className="w-full h-40 object-cover rounded-2xl shadow-sm" />
              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[16px] font-semibold text-[#171d19]">{t('currentBalance')}</h3>
                  <Badge status="income">Live</Badge>
                </div>

                <div className="mt-4 text-[36px] font-extrabold text-[#006948]">Ksh 274,300</div>

                <div className="mt-6 flex h-28 items-end gap-2 rounded-2xl bg-[#eff5ef] p-4">
                  {[42, 58, 36, 64, 47, 74, 61].map((height, index) => (
                    <div key={height} className="flex-1 rounded-t-lg" style={{ height: `${height}px`, backgroundColor: index % 3 === 1 ? '#fee2e2' : '#006948' }} />
                  ))}
                </div>

                <button type="button" className="mt-5 text-[14px] font-semibold text-[#006948]">
                  {t('viewFullReport')} →
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

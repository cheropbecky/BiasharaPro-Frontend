import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';

const paymentHistory = [
  { date: 'Nov 24, 2024', amount: 'Ksh 500', mpesa: 'QJH5K9', status: 'Paid' },
  { date: 'Oct 24, 2024', amount: 'Ksh 500', mpesa: 'P8X2ZT', status: 'Paid' },
  { date: 'Sep 24, 2024', amount: 'Ksh 500', mpesa: 'M4K7LD', status: 'Paid' },
];

const includedFeatures = [
  'Usimamizi wa Stoki / Stock Management',
  'Rekodi ya Mauzo / Sales Recording',
  'Gharama na Vitabu / Expenses & Bookkeeping',
  'Kazi bila Mtandao / Works Offline',
  'Kifaa kimoja / Single Device',
];

const lockedFeatures = [
  'Usawazishaji wa vifaa vingi / Multi-device sync (Pro)',
  'Hifadhi ya wingu / Cloud backup (Pro)',
  'Ripoti za PDF / PDF Reports (Pro)',
  'Tawi nyingi / Multi-branch (Pro)',
];

const includedTiles = [
  { icon: '📦', label: 'Stoki' },
  { icon: '💰', label: 'Mauzo' },
  { icon: '📋', label: 'Vitabu' },
  { icon: '📵', label: 'Offline' },
];

function CheckIcon() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[12px] text-[#16a34a]">✓</span>
  );
}

function LockedIcon() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[12px] text-[#d1d5db]">○</span>
  );
}

function TrendUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16l6-6 4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownIcon() {
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

function IconBubble({ children, colorClass }) {
  return <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}>{children}</div>;
}

export default function AccountPage() {
  const { t, lang } = useLang();

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.92), rgba(239,245,239,0.92)), url(${image1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top right',
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
            <h1 className="text-[28px] font-extrabold text-[#171d19]">{t('account')}</h1>
            <p className="mt-1 text-[16px] text-[#3d4a42]">{t('accountSubtitle')}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-2xl border-t-[3px] border-t-[#006948] bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#006948] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {lang === 'en' ? 'Basic Plan' : 'Mpango wa Msingi'}
                </span>
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#16a34a]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                  {lang === 'en' ? 'Active' : 'Amilifu'}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-2">
                <div className="text-[48px] font-extrabold leading-none text-[#171d19]">Ksh 500</div>
                <div className="pb-1 text-[20px] text-[#6b7280]">/mwezi / /month</div>
              </div>
              <p className="mt-2 text-[14px] text-[#6b7280]">{lang === 'en' ? 'Valid until' : 'Halali hadi'}: Nov 24, 2024</p>

              <div className="mt-7 space-y-3">
                {includedFeatures.map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-[14px] text-[#3d4a42]">
                    <CheckIcon />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {lockedFeatures.map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-[14px] text-[#9ca3af]">
                    <LockedIcon />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="my-7 border-t border-[#e5e7eb]" />

              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-[#16a34a]">LIPA VIA M-PESA</div>
                <p className="mt-3 text-[14px] leading-relaxed text-[#3d4a42]">
                  {lang === 'en'
                    ? "Tap the button below. You'll receive an M-Pesa prompt on your registered phone to confirm your Ksh 500 payment."
                    : 'Bonyeza kitufe hapa chini. Utapata ujumbe wa M-Pesa kwenye simu yako uliosajiliwa kuthibitisha malipo ya Ksh 500.'}
                </p>

                <button
                  type="button"
                  className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#4caf50] px-4 text-[18px] font-bold text-white shadow-[0_10px_15px_-3px_rgba(76,175,80,0.3)] transition-colors hover:bg-[#3f9b43]"
                >
                  {lang === 'en' ? 'Pay Now — Ksh 500' : 'Lipa Sasa / Pay Now — Ksh 500'}
                </button>
                <p className="mt-2 text-center text-[10px] text-[#9ca3af]">Inaendeshwa na Safaricom M-Pesa Daraja API</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
              <div className="px-5 py-5 text-[18px] font-bold text-[#171d19]">
                {lang === 'en' ? 'Payment History' : 'Historia ya Malipo / Payment History'}
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-12 gap-3 border-y border-[#e5e7eb] bg-[#f9fafb] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  <div className="col-span-3">TAREHE</div>
                  <div className="col-span-3">KIASI</div>
                  <div className="col-span-3">NAMBARI YA MPESA</div>
                  <div className="col-span-3">HALI</div>
                </div>
                <div className="divide-y divide-[#f3f4f6]">
                  {paymentHistory.map(row => (
                    <div key={row.mpesa} className="grid grid-cols-12 gap-3 px-5 py-4 text-[14px] text-[#171d19]">
                      <div className="col-span-3 font-medium text-[#3d4a42]">{row.date}</div>
                      <div className="col-span-3 font-semibold">{row.amount}</div>
                      <div className="col-span-3 font-medium text-[#6b7280]">{row.mpesa}</div>
                      <div className="col-span-3"><Badge status="income">{lang === 'en' ? 'Paid' : 'Imelipwa'}</Badge></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 p-3 md:hidden">
                {paymentHistory.map(row => (
                  <article key={`${row.mpesa}-mobile`} className="rounded-xl border border-[#e5e7eb] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] text-[#6b7280]">{row.date}</p>
                        <p className="mt-1 text-[14px] font-semibold text-[#171d19]">{row.amount}</p>
                      </div>
                      <Badge status="income">{lang === 'en' ? 'Paid' : 'Imelipwa'}</Badge>
                    </div>
                    <p className="mt-2 text-[12px] text-[#6b7280]">{row.mpesa}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
              <img src={image2} alt="BiasharaPro features" className="w-full h-40 object-cover" />
              <div className="p-6">
                <h2 className="text-[16px] font-bold text-[#171d19]">{lang === 'en' ? "What's Included" : 'Imejumuishwa / What\'s Included'}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {includedTiles.map(tile => (
                    <div key={tile.label} className="rounded-xl bg-[#eff5ef] p-4 text-center">
                      <div className="text-[24px]">{tile.icon}</div>
                      <div className="mt-2 text-[12px] font-semibold uppercase text-[#171d19]">{tile.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-[#bccac0] bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#171d19]">{lang === 'en' ? 'Upgrade to Pro' : 'Panda kwa Pro'}</h3>
              <p className="mt-2 text-[20px] font-bold text-[#006948]">Ksh 1,200/mwezi</p>
              <div className="mt-4 space-y-3">
                {[
                  'Vifaa vingi / Multi-device',
                  'Wingu / Cloud backup',
                  'Ripoti / PDF reports',
                ].map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-[13px] text-[#3d4a42]">
                    <CheckIcon />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-[#006948] px-4 py-3 text-[14px] font-semibold text-[#006948]"
              >
                {lang === 'en' ? 'Learn More' : 'Jifunze Zaidi'}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

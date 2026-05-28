import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import OfflineBanner from '../components/OfflineBanner';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import { useNavigationSystem } from '../components/navigation/NavigationProvider';

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5h2l2 10h10l2-7H7" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" fill="#006948" />
      <circle cx="18" cy="20" r="1.5" fill="#006948" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h10v16l-2-1.5L13 20l-2-1.5L9 20l-2-1.5L5 20V6a2 2 0 0 1 2-2Z" stroke="#006948" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16l6-6 4 4 6-7" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7h4v4" stroke="#006948" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2.5 20h19L12 3Z" fill="#ef4444" opacity="0.18" />
      <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="#ef4444" />
    </svg>
  );
}

function ProductIconBox() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#fee2e2] text-[#ef4444]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 8h16M7 8V5h10v3M6 8l1 12h10l1-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const recentActivity = [
  ['Unga Pembe iliuzwa × 2', 'dakika 5 zilizopita', '#006948'],
  ['Gharama ya umeme ilisajiliwa', 'saa 1 iliyopita', '#3d4a42'],
  ['Akaunti imesawazishwa', 'saa 2 zilizopita', '#16a34a'],
  ['Sukari iliongezwa stokini', 'saa 3 zilizopita', '#f59e0b'],
  ['Mauzo ya jumla: Ksh 2,840', 'jana', '#6b7280'],
];

const salesRows = [
  ['08:14', 'Unga Pembe 2kg', '2', 'Ksh 310', 'Cash'],
  ['09:32', 'Sukari 1kg', '1', 'Ksh 128', 'M-Pesa'],
  ['10:01', 'Mafuta 2L', '3', 'Ksh 1,260', 'M-Pesa'],
  ['11:45', 'Mkate', '5', 'Ksh 300', 'Cash'],
  ['13:20', 'Maziwa 500ml', '2', 'Ksh 136', 'Airtel'],
];

import useSidebar from '../hooks/useSidebar';

export default function DashboardPage() {
  const { profile } = useNavigationSystem();
  const storeName = profile?.shopName || 'Wanjiku Stores';
  const { collapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(239,245,239,0.84),rgba(239,245,239,0.78))]" />
        <img
          src={image2}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 hidden h-full w-full object-cover object-bottom-right opacity-35 lg:block"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.56),transparent_42%)]" />
      </div>
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-20 pt-16 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-8 relative transition-all duration-200 ease-in-out`}>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">BiasharaPro Overview</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">Live</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">Today</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="min-w-0">
            <OfflineBanner />

            <div className="mb-6 rounded-3xl border border-[rgba(226,232,240,0.5)] bg-[rgba(255,255,255,0.55)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-[6px]">
              <h1 className="text-[24px] font-extrabold leading-tight text-[#171d19] lg:text-[28px]">Habari ya asubuhi, Wanjiku 👋</h1>
              <p className="mt-1 text-[14px] text-[#3d4a42] lg:text-[16px]">Hapa kuna muhtasari wa biashara yako leo.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Leo</div>
                  <div className="text-[18px] font-extrabold text-[#006948]">Ksh 4,500</div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Faida</div>
                  <div className="text-[18px] font-extrabold text-[#171d19]">Ksh 3,300</div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">Stoki Chini</div>
                  <div className="text-[18px] font-extrabold text-[#dc2626]">3</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <StatCard title="MAUZO YA LEO" value="Ksh 4,500" trend="+12% vs jana" trendUp icon={<CartIcon />} />
              <StatCard title="GHARAMA" value="Ksh 1,200" subtitle="Matumizi 5 tofauti" trendUp={false} icon={<ReceiptIcon />} />
              <StatCard title="FAIDA" value="Ksh 3,300" trend="Ufanisi mzuri" trendUp icon={<TrendingIcon />} />
              <StatCard
                title="TAHADHARI YA STOKI"
                value="3 Bidhaa"
                subtitle="Zinahitaji umakini"
                trendUp={false}
                icon={<AlertIcon />}
                borderColor="rgba(239,68,68,0.3)"
              />
            </div>

            <section className="mt-8">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-[18px] font-extrabold text-[#171d19] sm:text-[20px]">Mauzo ya Leo</h2>
                    <span className="text-[12px] text-[#3d4a42] sm:text-[14px]">(Today's Sales)</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl border border-[#006948] bg-white px-4 py-2 text-[12px] font-semibold text-[#006948] sm:w-auto sm:text-[13px]"
                >
                  Ongeza Mauzo
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
                <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 sm:px-5 sm:py-3">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] sm:gap-3 sm:text-[12px]">
                    <div className="col-span-2">WAKATI</div>
                    <div className="col-span-2">BIDHAA</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2">JUMLA</div>
                    <div className="col-span-2">MALIPO</div>
                    <div className="col-span-2">HALI</div>
                  </div>
                </div>

                <div className="divide-y divide-[#f3f4f6]">
                  {salesRows.map(([time, product, qty, total, payment]) => (
                    <div key={`${time}-${product}`} className="grid grid-cols-12 gap-2 px-3 py-2.5 text-[11px] text-[#171d19] sm:gap-3 sm:px-4 sm:py-3.5 sm:text-[14px]">
                      <div className="col-span-2 font-medium text-[#3d4a42]">{time}</div>
                      <div className="col-span-2 font-medium">{product}</div>
                      <div className="col-span-1 text-center">{qty}</div>
                      <div className="col-span-2 font-semibold text-[#006948]">{total}</div>
                      <div className="col-span-2">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-semibold whitespace-nowrap sm:px-4 sm:py-1.5 sm:text-[11px]"
                          style={{
                            backgroundColor: payment === 'Cash' ? '#eef2f7' : 'rgba(0, 105, 72, 0.10)',
                            color: payment === 'Cash' ? '#3d4a42' : '#006948',
                          }}
                        >
                          {payment}
                        </span>
                      </div>
                      <div className="col-span-2 text-sm">
                        <Badge status="income">Imehifadhiwa</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#f3f4f6] px-5 py-4 text-center">
                  <button type="button" className="text-[13px] font-semibold text-[#006948] sm:text-[14px]">
                    Angalia mauzo yote →
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-[20px] font-extrabold text-[#171d19]">Bidhaa Zinazokwisha</h2>
                <Badge status="default">3</Badge>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white">
                <div className="divide-y divide-[#f3f4f6]">
                  {[
                    ['Sukari 1kg', 'Zimebaki: 0', 'out-of-stock'],
                    ['Unga 2kg', 'Zimebaki: 3', 'low-stock'],
                    ['Mafuta', 'Zimebaki: 4', 'low-stock'],
                  ].map(([name, stock, status]) => (
                    <div key={name} className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProductIconBox />
                        <div>
                          <div className="text-[14px] font-semibold text-[#171d19]">{name}</div>
                          <div className="text-[12px] text-[#6b7280]">{stock}</div>
                        </div>
                      </div>
                      <Badge status={status}>{status === 'out-of-stock' ? 'Out of stock' : 'Low stock'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-4">
              <section className="rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white overflow-hidden shadow-sm">
                <figure className="relative aspect-16/10 w-full overflow-hidden bg-[#eef5ef]">
                  <img
                    src={image3}
                    alt="Dashboard illustration"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                </figure>
                <div className="p-5">
                  <h3 className="text-[16px] font-bold text-[#171d19]">Hali ya Mtandao</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#16a34a]" />
                    <span className="text-[14px] font-medium text-[#16a34a]">Unaendesha mtandao</span>
                  </div>
                  <p className="mt-2 text-[12px] text-[#6b7280]">Duka: {storeName}</p>
                  <p className="mt-1 text-[12px] text-[#6b7280]">Mwisho kusawazisha: Leo 14:32</p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-[#006948] bg-white px-4 py-2 text-[13px] font-semibold text-[#006948]"
                  >
                    Sawazisha Sasa
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-[rgba(226,232,240,0.5)] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#171d19]">Shughuli za Hivi Karibuni</h3>
                <div className="mt-4 space-y-3">
                  {recentActivity.map(([description, time, color]) => (
                    <div key={description} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-[#3d4a42]">{description}</p>
                      </div>
                      <span className="shrink-0 text-right text-[11px] text-[#9ca3af]">{time}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="h-45 overflow-hidden rounded-2xl border border-[rgba(226,232,240,0.5)] bg-[linear-gradient(180deg,#eff5ef_0%,#f7faf8_100%)] p-5">
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#bccac0] bg-[rgba(255,255,255,0.45)] text-center">
                  <div>
                    <div className="text-[18px] font-extrabold text-[#006948]">BiasharaPro</div>
                    <p className="mt-2 text-[13px] text-[#3d4a42]">Eneo la mchoro wa duka</p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
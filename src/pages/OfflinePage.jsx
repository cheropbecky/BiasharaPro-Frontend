import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import Badge from '../components/Badge';
import useLang from '../hooks/useLang';
import heroImage from '../assets/hero.jpg';
import image3 from '../assets/image3.jpg';
import useSidebar from '../hooks/useSidebar';

const paymentMethods = ['Pesa Taslimu', 'M-Pesa', 'Airtel Money', 'Deni'];
const products = ['Unga Pembe 2kg', 'Sukari Mumias 1kg', 'Mafuta Elianto 2L', 'Maziwa 500ml'];

const inputClass =
  'w-full rounded-xl border border-[#bccac0] bg-white px-4 py-3 text-[14px] text-[#171d19] placeholder:text-[#6b7280] focus:outline-none focus:border-[#006948]';

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2.5 20h19L12 3Z" fill="#f59e0b" opacity="0.18" />
      <path d="M12 8v5" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="#854d0e" />
    </svg>
  );
}

function WifiIcon({ offline = false }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {offline ? (
        <>
          <path d="M3 8.5a15 15 0 0 1 18 0" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M6.5 12a10 10 0 0 1 11 0" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 15.5a5 5 0 0 1 4 0" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 19h0" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M4 4l16 16" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M3 8.5a15 15 0 0 1 18 0" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <path d="M6.5 12a10 10 0 0 1 11 0" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 15.5a5 5 0 0 1 4 0" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="19" r="1" fill="#16a34a" />
        </>
      )}
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OfflinePage() {
  const { t, lang } = useLang();
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(155);
  const [product, setProduct] = useState(products[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const selectedOnline = false;

  const total = useMemo(() => quantity * unitPrice, [quantity, unitPrice]);
  const syncProgress = 70;
  const pendingItems = [
    'Mauzo — Unga × 2',
    'Gharama — Umeme',
    'Mauzo — Sukari × 1',
  ];

  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));
  const increment = () => setQuantity(prev => prev + 1);
  const { collapsed } = useSidebar();

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        backgroundImage: `linear-gradient(180deg, rgba(239,245,239,0.92), rgba(239,245,239,0.92)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-20 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-8 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        <div className="mb-6 mt-4">
          <h1 className="text-[24px] font-extrabold text-[#171d19] lg:text-[28px]">{t('offline')}</h1>
          <p className="mt-1 text-[14px] text-[#3d4a42] lg:text-[16px]">{t('offlineSubtitle')}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border-2 border-[#bccac0] bg-white p-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#fef9c3] px-3 py-2 text-[14px] font-bold text-[#854d0e]">
              <WarningIcon />
              <span>{t('offlineWorking')} / {lang === 'en' ? 'Kazi inaendelea' : 'Kazi inaendelea'}</span>
            </div>

            <h2 className="mt-5 text-[20px] font-bold text-[#171d19]">{t('newSale')}</h2>
            <p className="mt-2 text-[13px] italic text-[#6b7280]">
              {lang === 'en'
                ? 'Data saved locally, will sync when connected.'
                : 'Data itahifadhiwa hapa hapa na kusawazishwa baadaye.'}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">BIDHAA / PRODUCT</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                >
                  {products.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">IDADI / QUANTITY</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={decrement} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bccac0] bg-white text-[18px] font-bold text-[#3d4a42]">−</button>
                  <input
                    type="number"
                    className={`${inputClass} text-center`}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                  />
                  <button type="button" onClick={increment} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bccac0] bg-white text-[18px] font-bold text-[#3d4a42]">+</button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">BEI YA KITENGO / UNIT PRICE</label>
                <input
                  type="number"
                  className={inputClass}
                  value={unitPrice}
                  onChange={e => setUnitPrice(Number(e.target.value || 0))}
                />
              </div>

              <div className="rounded-xl bg-[#f9fafb] px-4 py-3 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">JUMLA / TOTAL</p>
                <div className="mt-1 text-[28px] font-extrabold text-[#171d19]">Ksh {total.toLocaleString()}</div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#3d4a42]">MALIPO / PAYMENT METHOD</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {paymentMethods.map(method => {
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className="rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors whitespace-nowrap"
                        style={{
                          backgroundColor: active ? '#006948' : '#fff',
                          borderColor: active ? '#006948' : '#bccac0',
                          color: active ? '#fff' : '#3d4a42',
                        }}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" className="rounded-xl px-4 py-3 text-[14px] font-semibold text-[#3d4a42]">
                {lang === 'en' ? 'Cancel' : 'Ghairi'}
              </button>
              <button type="button" className="rounded-xl bg-[#006948] px-5 py-3 text-[14px] font-semibold text-white">
                {t('saveOffline')}
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <img src={image3} alt="Offline mode illustration" className="w-full h-40 object-cover rounded-2xl shadow-sm" />

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fee2e2]">
                  <WifiIcon offline={!selectedOnline} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#171d19]">
                    {selectedOnline ? (lang === 'en' ? 'Online' : 'Mtandaoni') : (lang === 'en' ? 'Offline' : 'Huna Mtandao')}
                  </h2>
                  <p className="mt-1 text-[14px] text-[#6b7280]">
                    {lang === 'en' ? '2 devices on local network' : 'Vifaa 2 vilivyounganishwa / 2 devices on local network'}
                  </p>
                  <p className="mt-1 text-[13px] text-[#6b7280]">
                    {lang === 'en' ? 'Today at 14:32' : 'Leo saa 8:32 / Today at 14:32'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-[16px] font-bold text-[#171d19]">{t('syncQueue')}</h3>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {lang === 'en'
                  ? '12 transactions waiting to sync'
                  : 'Miamala 12 inangoja kusawazishwa / 12 transactions waiting to sync'}
              </p>

              <div className="mt-4 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                <div className="h-1.5 rounded-full bg-[#006948]" style={{ width: `${syncProgress}%` }} />
              </div>
              <p className="mt-2 text-[12px] text-[#9ca3af]">
                {lang === 'en'
                  ? 'Will sync when connected'
                  : 'Itasawazishwa unapounganishwa / Will sync when connected'}
              </p>

              <div className="mt-4 space-y-2">
                {pendingItems.map(item => (
                  <div key={item} className="flex items-center justify-between gap-3 rounded-xl border border-[#f3f4f6] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <ClockIcon />
                      <span className="text-[13px] text-[#3d4a42]">{item}</span>
                    </div>
                    <span className="rounded-full bg-[#fef9c3] px-3 py-1.5 text-[11px] font-semibold text-[#854d0e] whitespace-nowrap">
                      {lang === 'en' ? 'Pending' : 'Inasubiri'}
                    </span>
                  </div>
                ))}
              </div>

              <button type="button" className="mt-5 w-full rounded-xl bg-[#006948] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#00583c]">
                {t('syncNow')}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

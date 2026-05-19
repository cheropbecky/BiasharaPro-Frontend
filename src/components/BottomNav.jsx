import React, { useMemo, useState } from 'react';
import { useNavigationSystem } from './navigation/NavigationProvider';
import { mobileNavItems, moreDrawerTiles } from './navigation/navConfig';
import useLang from '../hooks/useLang';

function HomeIcon({ filled = false }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11 12 4l9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BoxesIcon({ filled = false }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8h16M7 8V5h10v3M6 8l1 12h10l1-12" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon({ filled = false }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V4Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function CloudOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 17a4 4 0 1 1 .7-7.94A5.5 5.5 0 0 1 18.5 11H19a3 3 0 1 1 0 6H6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5l14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SaleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 7h11l1.5 8H8L6 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 7V5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon({ color = 'currentColor' }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2.5 20h19L12 3Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CashIcon({ color = 'currentColor' }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16v10H4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.2" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon({ color = 'currentColor' }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.8" />
      <path d="M5 20c1.7-3.8 4.7-5.8 7-5.8s5.3 2 7 5.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ color = 'currentColor' }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8.5A3.5 3.5 0 1 1 12 15.5 3.5 3.5 0 0 1 12 8.5Zm7 3.5-.8 1.4.8 1.4-1.4 2.4-1.6-.2-1.1 1.1.2 1.6-2.4 1.4-1.4-.8-1.4.8-2.4-1.4.2-1.6-1.1-1.1-1.6.2-1.4-2.4.8-1.4-.8-1.4 1.4-2.4 1.6.2 1.1-1.1-.2-1.6 2.4-1.4 1.4.8 1.4-.8 2.4 1.4-.2 1.6 1.1 1.1 1.6-.2 1.4 2.4Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ToastIcon({ type }) {
  if (type === 'offline') return <CloudOffIcon />;
  if (type === 'error') return <span className="text-[16px] font-bold">✗</span>;
  if (type === 'sync') return <span className="text-[16px] font-bold">⟳</span>;
  return <span className="text-[16px] font-bold">✓</span>;
}

function getNavIcon(name, active) {
  const color = active ? '#2D6A4F' : '#9CA3AF';
  switch (name) {
    case 'home':
      return <HomeIcon filled={active} />;
    case 'boxes':
      return <BoxesIcon filled={active} />;
    case 'book':
      return <BookIcon filled={active} />;
    case 'grid':
      return <GridIcon />;
    case 'sale':
      return <SaleIcon />;
    default:
      return <HomeIcon filled={active} />;
  }
}

function getMoreIcon(name, accent) {
  if (name === 'alert') return <AlertIcon color={accent === 'red' ? '#dc2626' : '#1A1A1A'} />;
  if (name === 'cash') return <CashIcon color={accent === 'terracotta' ? '#c4622d' : '#1A1A1A'} />;
  if (name === 'user') return <UserIcon color="#1A1A1A" />;
  return <SettingsIcon color="#1A1A1A" />;
}

function QuickSheet({ open, title, subtitle, onClose, onSave, saveLabel, children, offlineLabel, toastTone = 'success' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 px-3 lg:px-6">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Close sheet" />
      <div className="relative z-[81] w-full max-w-[520px] rounded-t-[24px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e5e7eb]" />
        <h3 className="text-[18px] font-bold text-[#1A1A1A]">{title}</h3>
        {subtitle ? <p className="mt-1 text-[13px] text-[#6b7280]">{subtitle}</p> : null}
        <div className="mt-4 space-y-3">{children}</div>
        <button
          type="button"
          onClick={onSave}
          className="mt-5 w-full rounded-2xl bg-[#2D6A4F] px-4 py-3 text-[14px] font-bold text-white shadow-[0_10px_18px_rgba(45,106,79,0.18)]"
        >
          {saveLabel}
        </button>
        {offlineLabel ? <p className="mt-2 text-center text-[11px] text-[#6b7280]">{offlineLabel}</p> : null}
      </div>
      {toastTone ? null : null}
    </div>
  );
}

function MoreDrawer() {
  const { moreDrawerOpen, closeMoreDrawer, navigate } = useNavigationSystem();
  const { lang } = useLang();

  if (!moreDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[78] lg:hidden">
      <button type="button" className="absolute inset-0 bg-black/30" onClick={closeMoreDrawer} aria-label="Close more menu" />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#e5e7eb]" />
        <div className="px-5 py-5">
          <h3 className="text-[18px] font-bold text-[#1A1A1A]">Mengi Zaidi / More Options</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
            {moreDrawerTiles.map(tile => (
              <button
                key={tile.to}
                type="button"
                onClick={() => {
                  navigate(tile.to);
                  closeMoreDrawer();
                }}
                className="rounded-[16px] p-5 text-center"
                style={{ backgroundColor: '#F7F3EE' }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-[#1A1A1A]">
                  {getMoreIcon(tile.icon, tile.accent)}
                </div>
                <div className="mt-2 text-[14px] font-bold text-[#1A1A1A]">
                  {lang === 'en' ? tile.labelEn : tile.labelSw}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipLayer() {
  // Tooltip disabled
  return null;
}

function ToastLayer() {
  const { toast } = useNavigationSystem();

  if (!toast) return null;

  const tone = toast.type === 'offline' ? 'bg-[#5C3A1E] text-[#F4C97A]' : toast.type === 'error' ? 'bg-[#8B2500] text-white' : toast.type === 'sync' ? 'bg-[#1B3A2D] text-white' : 'bg-[#2D6A4F] text-white';

  return (
    <div className="fixed bottom-[88px] left-1/2 z-[95] w-auto max-w-[320px] -translate-x-1/2 px-4 lg:bottom-6">
      <div className={`flex h-12 items-center gap-2 rounded-[12px] px-5 text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.15)] ${tone}`}>
        <ToastIcon type={toast.type} />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function InventorySpeedDial() {
  const { location, inventorySpeedDialOpen, setInventorySpeedDialOpen, openProductSheet, showToast } = useNavigationSystem();

  if (location.pathname !== '/inventory' || !inventorySpeedDialOpen) return null;

  const actionClass = 'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]';

  return (
    <div className="fixed bottom-[92px] right-4 z-[85] lg:hidden">
      <button type="button" className="absolute inset-0 -z-10 bg-black/30" onClick={() => setInventorySpeedDialOpen(false)} aria-label="Close speed dial" />
      <div className="relative flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#1A1A1A] shadow-sm">Scan Barcode</span>
          <button type="button" onClick={() => showToast('Kipengele cha skena hakijawashwa bado', 'sync')} className={`${actionClass} bg-[#c4622d]`}>
            📷
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#1A1A1A] shadow-sm">Ongeza Bidhaa</span>
          <button type="button" onClick={() => openProductSheet()} className={`${actionClass} bg-[#2D6A4F]`}>
            📦
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#1A1A1A] shadow-sm">Restock</span>
          <button type="button" onClick={() => showToast('Restock itafunguliwa kwenye bidhaa', 'success')} className={`${actionClass} bg-[#E9C46A] text-[#1B1A1A]`}>
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BottomNav() {
  const { lang } = useLang();
  const {
    location,
    navigate,
    openMoreDrawer,
    openSaleSheet,
    openExpenseSheet,
    saveSale,
    isOnline,
    saleSheetOpen,
    expenseSheetOpen,
    productSheetOpen,
    setSaleSheetOpen,
    setExpenseSheetOpen,
    setProductSheetOpen,
    setInventorySpeedDialOpen,
    inventorySpeedDialOpen,
    showToast,
    alertsCount,
  } = useNavigationSystem();

  const activePath = location.pathname;

  const handlePrimaryAction = () => {
    if (activePath === '/inventory') {
      setInventorySpeedDialOpen(!inventorySpeedDialOpen);
      return;
    }

    if (activePath === '/expenses' || activePath === '/bookkeeping' || activePath === '/alerts') {
      openExpenseSheet();
      return;
    }

    openSaleSheet();
  };

  const saveExpense = () => {
    setExpenseSheetOpen(false);
    if (!isOnline) {
      showToast('☁ Imehifadhiwa offline — itasawazishwa baadaye', 'offline');
      return;
    }
    showToast('✓ Gharama imehifadhiwa', 'success');
  };

  const saveProduct = () => {
    setProductSheetOpen(false);
    if (!isOnline) {
      showToast('☁ Imehifadhiwa offline — itasawazishwa baadaye', 'offline');
      return;
    }
    showToast('✓ Bidhaa imeongezwa', 'success');
  };

  const navLabels = useMemo(
    () => mobileNavItems.map(item => ({ ...item, label: lang === 'en' ? item.labelEn : item.labelSw })),
    [lang],
  );

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8E2DA] bg-white px-2 pt-2 shadow-[0_-4px_20px_rgba(45,106,79,0.08)] lg:hidden pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <div className="relative mx-auto flex max-w-screen-sm items-end justify-between gap-1">
          {navLabels.map(item => {
            const active = item.center ? false : activePath === item.to;

            if (item.center) {
              return (
                <div key={item.to} className="flex flex-1 flex-col items-center">
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    className={`-mt-7 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#2D6A4F] text-white shadow-[0_-4px_16px_rgba(45,106,79,0.35)] transition-transform active:scale-105 ${isOnline ? '' : 'bg-[#E9C46A] text-[#5C3A1E]'}`}
                    aria-label="New Sale"
                  >
                    {isOnline ? <PlusIcon /> : <CloudOffIcon />}
                  </button>
                  <div className="mt-1 text-[10px] font-semibold text-[#2D6A4F]">Mauzo</div>
                </div>
              );
            }

            if (item.to === 'more') {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={openMoreDrawer}
                  className="flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold"
                  style={{ color: active ? '#2D6A4F' : '#9CA3AF' }}
                >
                  <GridIcon />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold"
                style={{ color: active ? '#2D6A4F' : '#9CA3AF' }}
              >
                <span className="relative flex items-center justify-center">
                  {active ? <span className="absolute -top-3 h-1 w-1 rounded-full bg-[#2D6A4F]" /> : null}
                  <span className="relative">
                    {getNavIcon(item.icon, active)}
                    {item.badge && alertsCount ? <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#dc2626]" /> : null}
                  </span>
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <MoreDrawer />
      <TooltipLayer />
      <ToastLayer />
      <InventorySpeedDial />

      <QuickSheet
        open={saleSheetOpen}
        title="Rekodi Mauzo / New Sale"
        subtitle="Mauzo yako mapya yanaweza kuhifadhiwa offline au kusawazishwa baadaye."
        onClose={() => setSaleSheetOpen(false)}
        onSave={saveSale}
        saveLabel={isOnline ? 'Hifadhi Mauzo' : 'Hifadhi Offline'}
        offlineLabel={isOnline ? '' : 'Kazi itaendelea hata bila intaneti.'}
      >
        <input className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Jina la bidhaa" />
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Kiasi" />
          <input className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Bei" />
        </div>
        <select className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]">
          <option>M-Pesa</option>
          <option>Cash</option>
          <option>Airtel Money</option>
        </select>
      </QuickSheet>

      <QuickSheet
        open={expenseSheetOpen}
        title="Ongeza Gharama"
        subtitle="Hii ni njia ya haraka ya kurekodi matumizi yako."
        onClose={() => setExpenseSheetOpen(false)}
        onSave={saveExpense}
        saveLabel={isOnline ? 'Hifadhi Gharama' : 'Hifadhi Offline'}
        offlineLabel={isOnline ? '' : 'Hifadhi itasubiri usawazishaji.'}
      >
        <input className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Maelezo" />
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Kiasi" />
          <select className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]">
            <option>Kodi</option>
            <option>Bidhaa</option>
            <option>Umeme</option>
          </select>
        </div>
        <input type="date" className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" />
      </QuickSheet>

      <QuickSheet
        open={productSheetOpen}
        title="Ongeza Bidhaa"
        subtitle="Ongeza bidhaa mpya moja kwa moja kutoka kwa navigation ya haraka."
        onClose={() => setProductSheetOpen(false)}
        onSave={saveProduct}
        saveLabel={isOnline ? 'Hifadhi Bidhaa' : 'Hifadhi Offline'}
        offlineLabel={isOnline ? '' : 'Bidhaa itawekwa kwenye foleni ya offline.'}
      >
        <input className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Jina la bidhaa" />
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Bei ya kuuza" />
          <input className="rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]" placeholder="Stoki ya mwanzo" />
        </div>
        <select className="w-full rounded-2xl border border-[#d4c9be] bg-[#fcf9f4] px-4 py-3 text-[14px]">
          <option>Chakula</option>
          <option>Vinywaji</option>
          <option>Usafi</option>
        </select>
      </QuickSheet>
    </>
  );
}
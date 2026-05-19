import React from 'react';
import { useNavigationSystem } from './navigation/NavigationProvider';
import { desktopNavGroups, PROFILE_KEY } from './navigation/navConfig';
import useLang from '../hooks/useLang';
import image1 from '../assets/image1.jpg';

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 17H9m7-4V9a4 4 0 1 0-8 0v4l-2 2v1h12v-1l-2-2Zm-5 6a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavIcon({ name }) {
  const stroke = 'currentColor';
  const icons = {
    chart: <path d="M4 17h16M6 13l3-3 3 2 5-7" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
    cash: <><path d="M4 7h16v10H4z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.2" stroke={stroke} strokeWidth="1.9" /></>,
    box: <path d="M4 8h16M7 8V5h10v3M6 8l1 12h10l1-12" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
    book: <path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V4Z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />,
    alert: <path d="M12 3 2.5 20h19L12 3Z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />,
    user: <><circle cx="12" cy="8" r="3" stroke={stroke} strokeWidth="1.9" /><path d="M5 20c1.7-3.8 4.7-5.8 7-5.8s5.3 2 7 5.8" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" /></>,
    settings: <path d="M12 8.5A3.5 3.5 0 1 1 12 15.5 3.5 3.5 0 0 1 12 8.5Zm7 3.5-.8 1.4.8 1.4-1.4 2.4-1.6-.2-1.1 1.1.2 1.6-2.4 1.4-1.4-.8-1.4.8-2.4-1.4.2-1.6-1.1-1.1-1.6.2-1.4-2.4.8-1.4-.8-1.4 1.4-2.4 1.6.2 1.1-1.1-.2-1.6 2.4-1.4 1.4.8 1.4-.8 2.4 1.4-.2 1.6 1.1 1.1 1.6-.2 1.4 2.4Z" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />,
  };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function getProfile() {
  if (typeof window === 'undefined') return null;

  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

export default function TopBar() {
  const { lang } = useLang();
  const {
    location,
    navigate,
    pageMeta,
    profile: storedProfile,
    mobileDrawerOpen,
    openMobileDrawer,
    closeMobileDrawer,
    isOnline,
    alertsCount,
  } = useNavigationSystem();

  const profile = storedProfile || getProfile();
  const storeName = profile?.shopName || 'Wanjiku Stores';
  const title = lang === 'en' ? pageMeta.enTitle : pageMeta.title;
  const showBack = location.pathname !== '/dashboard' && location.pathname !== '/onboarding';

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-30 flex  h-[60px] items-center justify-between border-b border-[#E8E2DA] bg-white px-0 shadow-[0_1px_6px_rgba(45,106,79,0.06)] lg:left-60 lg:right-0 lg:px-8">
        <div className="flex items-center gap-3 px-4 lg:px-0">
          <button
            type="button"
            onClick={showBack ? goBack : openMobileDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#5C5346] lg:hidden"
            aria-label={showBack ? 'Back' : 'Open menu'}
          >
            {showBack ? <BackIcon /> : <MenuIcon />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-[18px] font-extrabold text-[#1A1A1A]">{title}</h1>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1a2e1a] text-[12px] font-extrabold text-white">BP</div>
            <div>
              <div className="text-[18px] font-extrabold text-[#1A1A1A]">BiasharaPro</div>
              <div className="text-[12px] text-[#6b7280]">{storeName}</div>
            </div>
          </div>

          <div className="mx-auto hidden"></div>

          <div className="lg:hidden">
            <h1 className="text-[18px] font-extrabold text-[#1A1A1A]">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 lg:px-0">
          {!isOnline ? (
            <button
              type="button"
              onClick={() => navigate('/offline')}
              className="rounded-[6px] bg-[#FEF9C3] px-3 py-1.5 text-[10px] font-semibold text-[#854D0E]"
            >
              ● Offline
            </button>
          ) : null}

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3f1ef] text-[#5C5346]"
            aria-label="Notifications"
            onClick={() => navigate('/alerts')}
          >
            <BellIcon />
            {alertsCount ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> : null}
          </button>

          <button
            type="button"
            onClick={() => navigate('/account')}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#2D6A4F]"
            aria-label="Account"
          >
            <img src={image1} alt="Account avatar" className="h-full w-full object-cover" />
          </button>
        </div>
      </header>

      {mobileDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/35" onClick={closeMobileDrawer} aria-label="Close menu" />
            <div className="absolute left-0 top-0 h-full w-[60%] max-w-[220px] bg-[#1a2e1a] text-[#fcf9f4] shadow-2xl">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/10 text-[11px] font-extrabold text-white">BP</div>
                <div>
                  <div className="text-[15px] font-bold">BiasharaPro</div>
                  <div className="mt-0.5 text-[11px] text-[#A8C4B8]">{storeName}</div>
                </div>
              </div>
            </div>

            <div className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {desktopNavGroups.map(group => (
                <div key={group.labelEn} className="mb-4 last:mb-0">
                  <div className="px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#A8C4B8]">
                    {lang === 'en' ? group.labelEn : group.labelSw}
                  </div>
                  <div className="mt-1.5 space-y-0.5">
                    {group.items.map(item => (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => {
                          navigate(item.to);
                          closeMobileDrawer();
                        }}
                        className="flex w-full items-center gap-2 rounded-r-[8px] border-l-4 px-2 py-2.5 text-left text-[13px] font-medium text-[#A8C4B8]"
                      >
                        <NavIcon name={item.icon} />
                        <span>{lang === 'en' ? item.labelEn : item.labelSw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-white/15 p-4">
              <div className="flex items-center gap-2">
                <img src={image1} alt="Mama Wanjiku" className="h-8 w-8 rounded-full border-2 border-white/30 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-bold text-white">Mama Wanjiku</div>
                  <div className="mt-0.5 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/90">Msingi</div>
                </div>
              </div>
              <button type="button" className="mt-2 inline-flex rounded-full bg-[#c4622d] px-3 py-1 text-[10px] font-semibold text-white">Lipa Ksh 500</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
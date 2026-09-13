import React from 'react';
import { useNavigationSystem } from './navigation/NavigationProvider';
import { desktopNavGroups, PROFILE_KEY } from './navigation/navConfig';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
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

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  const { collapsed } = useSidebar();
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
  const ownerName = profile?.ownerName || 'Mama Wanjiku';
  const avatarUrl = profile?.avatarUrl || image1;
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
      <header
        className={`fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-[#E8E2DA] bg-white px-3 sm:px-4 lg:px-8 shadow-[0_1px_6px_rgba(45,106,79,0.06)] ${collapsed ? 'lg:left-20' : 'lg:left-60'} transition-all duration-200 ease-in-out`}
        style={{ height: '60px' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={showBack ? goBack : openMobileDrawer}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#5C5346] hover:bg-gray-100 lg:hidden"
            aria-label={showBack ? 'Back' : 'Open menu'}
          >
            {showBack ? <BackIcon /> : <MenuIcon />}
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-[#1A1A1A] truncate">{title}</h1>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-semibold text-gray-500 truncate">{storeName}</span>
          </div>

          <div className="lg:hidden min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-[#1A1A1A] truncate">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isOnline ? (
            <button
              type="button"
              onClick={() => navigate('/offline')}
              className="rounded-md bg-[#FEF9C3] px-2.5 py-1 text-[11px] font-bold text-[#854D0E]"
            >
              ● Offline
            </button>
          ) : null}

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3f1ef] text-[#5C5346] hover:bg-[#e7e4e0] transition"
            aria-label="Notifications"
            onClick={() => navigate('/alerts')}
          >
            <BellIcon />
            {alertsCount ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#ef4444] animate-pulse" /> : null}
          </button>

          <button
            type="button"
            onClick={() => navigate('/account')}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#2D6A4F] hover:opacity-90 transition"
            aria-label="Account"
          >
            <img src={avatarUrl} alt="Account avatar" className="h-full w-full object-cover" />
          </button>
        </div>
      </header>

      {mobileDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeMobileDrawer}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-[#1a2e1a] text-[#fcf9f4] shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-black text-white">
                  BP
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">BiasharaPro</div>
                  <div className="text-[11px] text-[#A8C4B8] truncate">{storeName}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMobileDrawer}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close drawer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {desktopNavGroups.map(group => (
                <div key={group.labelEn}>
                  <div className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8C4B8]">
                    {lang === 'en' ? group.labelEn : group.labelSw}
                  </div>
                  <div className="mt-1 space-y-1">
                    {group.items.map(item => {
                      const isActive = location.pathname === item.to;
                      return (
                        <button
                          key={item.to}
                          type="button"
                          onClick={() => {
                            navigate(item.to);
                            closeMobileDrawer();
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-3 py-2.5 text-left text-xs sm:text-sm font-semibold transition ${
                            isActive
                              ? 'border-[#9ef01a] bg-[#2d6a4f] text-white shadow-sm'
                              : 'border-transparent text-[#A8C4B8] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <NavIcon name={item.icon} />
                          <span className="truncate">{lang === 'en' ? item.labelEn : item.labelSw}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 p-4 bg-black/20">
              <div className="flex items-center gap-3">
                <img src={avatarUrl} alt={ownerName} className="h-9 w-9 rounded-full border-2 border-white/30 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-white">{ownerName}</div>
                  <div className="inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
                    Msingi
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate('/account');
                  closeMobileDrawer();
                }}
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#c4622d] py-2 text-xs font-bold text-white shadow hover:bg-[#b05322] transition"
              >
                Lipa KSh 500 (M-Pesa)
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
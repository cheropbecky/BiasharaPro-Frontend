import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import image1 from '../assets/image1.jpg';
import { desktopNavGroups, PROFILE_KEY } from './navigation/navConfig';
import { useNavigationSystem } from './navigation/NavigationProvider';
import { useNavigate } from 'react-router-dom';
import { clearStoredProfile } from '../utils/preferences';
import useLang from '../hooks/useLang';

function NavIcon({ name, className = 'text-inherit' }) {
  const stroke = 'currentColor';

  const icons = {
    chart: (
      <path d="M4 17h16M6 13l3-3 3 2 5-7" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    ),
    cash: (
      <>
        <path d="M4 7h16v10H4z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.2" stroke={stroke} strokeWidth="1.9" />
      </>
    ),
    box: (
      <path d="M4 8h16M7 8V5h10v3M6 8l1 12h10l1-12" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    ),
    book: (
      <path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 0-2 2V4Z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />
    ),
    alert: (
      <path d="M12 3 2.5 20h19L12 3Z" stroke={stroke} strokeWidth="1.9" strokeLinejoin="round" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3" stroke={stroke} strokeWidth="1.9" />
        <path d="M5 20c1.7-3.8 4.7-5.8 7-5.8s5.3 2 7 5.8" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
    settings: (
      <path d="M12 8.5A3.5 3.5 0 1 1 12 15.5 3.5 3.5 0 0 1 12 8.5Zm7 3.5-.8 1.4.8 1.4-1.4 2.4-1.6-.2-1.1 1.1.2 1.6-2.4 1.4-1.4-.8-1.4.8-2.4-1.4.2-1.6-1.1-1.1-1.6.2-1.4-2.4.8-1.4-.8-1.4 1.4-2.4 1.6.2 1.1-1.1-.2-1.6 2.4-1.4 1.4.8 1.4-.8 2.4 1.4-.2 1.6 1.1 1.1 1.6-.2 1.4 2.4Z" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
    ),
  };

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

export default function Sidebar() {
  const location = useLocation();
  const { lang } = useLang();
  const { profile: storedProfile } = useNavigationSystem();
  const navigate = useNavigate();
  const profile = storedProfile || getProfile();
  const shopName = profile?.shopName || 'Wanjiku Stores';
  const ownerName = profile?.ownerName || 'Mama Wanjiku';
  const avatarUrl = profile?.avatarUrl || image1;
  const renewLabel = lang === 'en' ? 'Pay Ksh 500 / Renew' : 'Lipa Ksh 500 / Renew';

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      setCollapsed(saved === 'true');
    } catch {
      // ignore
    }
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('sidebarCollapsed', String(next)); } catch {}
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden bg-[#1a2e1a] text-[#fcf9f4] lg:flex transition-width duration-200 ${collapsed ? 'w-20' : 'w-60'}`}
      aria-expanded={!collapsed}
    >
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10 text-[12px] font-extrabold text-white">
              BP
            </div>
            {!collapsed && (
              <div>
                <div className="text-[18px] font-bold text-[#fcf9f4]">BiasharaPro</div>
                <div className="mt-0.5 text-[12px] text-[#A8C4B8]">{shopName}</div>
              </div>
            )}
          </div>

          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
            onClick={toggleCollapsed}
            className="ml-2 rounded-md bg-white/5 p-2 text-white hover:bg-white/10"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 6l8 6-8 6V6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 6 8 12l8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5">
        {desktopNavGroups.map(group => (
          <div key={group.labelEn} className="mb-5 last:mb-0">
            <div className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8C4B8]">
              {!collapsed && (lang === 'en' ? group.labelEn : group.labelSw)}
            </div>
            <div className="mt-2 space-y-1">
              {group.items.map(item => {
                const active = location.pathname === item.to;
                const color = active ? '#fcf9f4' : '#A8C4B8';

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={lang === 'en' ? item.labelEn : item.labelSw}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-r-[10px] border-l-4 px-3 py-3 text-[14px] font-medium transition-colors`} 
                    style={{
                      backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                      borderLeftColor: active ? '#E9C46A' : 'transparent',
                      color,
                    }}
                  >
                    <NavIcon name={item.icon} className="shrink-0" />
                    {!collapsed && (
                      <span className="flex-1">
                        {lang === 'en' ? item.labelEn : item.labelSw}
                      </span>
                    )}
                    {item.badge ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c4622d] px-1 text-[10px] font-bold text-white">
                        5
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-dashed border-white/15 p-6">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={ownerName}
            className="h-9 w-9 rounded-full border-2 border-white/30 object-cover"
          />
          <div className="min-w-0 flex-1">
            {!collapsed && (
              <>
                <div className="truncate text-[13px] font-bold text-white">{ownerName}</div>
                <div className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/90">
                  {lang === 'en' ? 'Basic' : 'Msingi'} / Basic
                </div>
              </>
            )}
          </div>
        </div>

        {!collapsed && (
          <>
            <button
              type="button"
              className="mt-3 inline-flex rounded-full bg-[#c4622d] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm"
            >
              {renewLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                clearStoredProfile();
                if (typeof window !== 'undefined') {
                  // force full reload to ensure providers reset
                  window.location.replace('/');
                } else {
                  navigate('/onboarding');
                }
              }}
              className="mt-3 ml-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-white px-3 py-2 text-[13px] font-semibold text-[#1a2e1a]"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
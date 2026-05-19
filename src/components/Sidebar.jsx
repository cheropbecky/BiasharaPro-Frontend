import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import image1 from '../assets/image1.jpg';
import { desktopNavGroups, PROFILE_KEY } from './navigation/navConfig';
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
  const profile = getProfile();
  const shopName = profile?.shopName || 'Wanjiku Stores';
  const ownerName = profile?.ownerName || 'Mama Wanjiku';
  const renewLabel = lang === 'en' ? 'Pay Ksh 500 / Renew' : 'Lipa Ksh 500 / Renew';

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col overflow-hidden bg-[#1a2e1a] text-[#fcf9f4] lg:flex"
    >
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10 text-[12px] font-extrabold text-white">
            BP
          </div>
          <div>
            <div className="text-[18px] font-bold text-[#fcf9f4]">BiasharaPro</div>
            <div className="mt-0.5 text-[12px] text-[#A8C4B8]">{shopName}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5">
        {desktopNavGroups.map(group => (
          <div key={group.labelEn} className="mb-5 last:mb-0">
            <div className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8C4B8]">
              {lang === 'en' ? group.labelEn : group.labelSw}
            </div>
            <div className="mt-2 space-y-1">
              {group.items.map(item => {
                const active = location.pathname === item.to;
                const color = active ? '#fcf9f4' : '#A8C4B8';

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 rounded-r-[10px] border-l-4 px-3 py-3 text-[14px] font-medium transition-colors"
                    style={{
                      backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                      borderLeftColor: active ? '#E9C46A' : 'transparent',
                      color,
                    }}
                  >
                    <NavIcon name={item.icon} className="shrink-0" />
                    <span className="flex-1">
                      {lang === 'en' ? item.labelEn : item.labelSw}
                    </span>
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
            src={image1}
            alt={ownerName}
            className="h-9 w-9 rounded-full border-2 border-white/30 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-white">{ownerName}</div>
            <div className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/90">
              {lang === 'en' ? 'Basic' : 'Msingi'} / Basic
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-3 inline-flex rounded-full bg-[#c4622d] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm"
        >
          {renewLabel}
        </button>
      </div>
    </aside>
  );
}
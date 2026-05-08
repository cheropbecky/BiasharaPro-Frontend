import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard' },
  { to: '/dashboard2', label: 'Dashboard 2' },
  { to: '/stock', label: 'Stock' },
  { to: '/sales', label: 'Sales' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/ledger', label: 'Ledger' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/bookkeeping', label: 'Bookkeeping' },
  { to: '/account', label: 'Account' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/offline', label: 'Offline' },
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/data-modals', label: 'Data Modals' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-55 flex-col border-r border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.72)] px-4 py-5 backdrop-blur-[6px] lg:flex"
      style={{ color: '#171d19' }}
    >
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006948] text-[12px] font-extrabold text-white">
          BP
        </div>
        <div className="text-[18px] font-extrabold text-[#006948]">BiasharaPro</div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl px-4 py-3 text-[14px] font-semibold transition-colors"
              style={{
                backgroundColor: active ? 'rgba(0, 105, 72, 0.10)' : 'transparent',
                color: active ? '#006948' : '#3d4a42',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
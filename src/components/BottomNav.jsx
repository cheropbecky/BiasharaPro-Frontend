import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home' },
  { to: '/sales', label: 'Sales' },
  { to: '/inventory', label: 'Stock' },
  { to: '/ledger', label: 'Ledger' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(226,232,240,0.8)] bg-[rgba(255,255,255,0.92)] px-3 py-2 backdrop-blur-[10px] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        {items.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-1 flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-semibold"
              style={{ color: active ? '#006948' : '#6b7280' }}
            >
              <span className="mb-1 h-2 w-2 rounded-full" style={{ backgroundColor: active ? '#006948' : '#bccac0' }} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
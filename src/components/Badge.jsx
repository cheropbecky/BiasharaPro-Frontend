import React from 'react';

const badgeStyles = {
  income: {
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    color: '#16a34a',
  },
  'low-stock': {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#d97706',
  },
  'out-of-stock': {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: '#dc2626',
  },
  default: {
    backgroundColor: 'rgba(61, 74, 66, 0.10)',
    color: '#3d4a42',
  },
};

export default function Badge({ status = 'default', children }) {
  const style = badgeStyles[status] || badgeStyles.default;

  return (
    <span
      className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold whitespace-nowrap"
      style={style}
    >
      {children}
    </span>
  );
}
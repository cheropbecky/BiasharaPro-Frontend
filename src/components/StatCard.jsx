import React from 'react';

export default function StatCard({
  title,
  value,
  trend,
  subtitle,
  trendUp = true,
  icon,
  borderColor,
}) {
  return (
    <div
      className="rounded-[20px] border bg-[rgba(255,255,255,0.7)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-[6px]"
      style={{ borderColor: borderColor || 'rgba(226,232,240,0.5)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">{title}</p>
          <div className="mt-3 text-[28px] font-extrabold leading-none text-[#171d19]">{value}</div>
          {trend ? (
            <p className="mt-2 text-[13px] font-medium" style={{ color: trendUp ? '#16a34a' : '#dc2626' }}>
              {trend}
            </p>
          ) : null}
          {subtitle ? <p className="mt-1 text-[13px] text-[#3d4a42]">{subtitle}</p> : null}
        </div>

        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'rgba(0, 105, 72, 0.10)' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
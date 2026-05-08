import React from 'react';

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 17H9m7-4V9a4 4 0 1 0-8 0v4l-2 2v1h12v-1l-2-2Zm-5 6a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TopBar() {
  return (
    <header
      className="fixed top-0 z-30 flex h-16 items-center justify-between border-b border-[rgba(226,232,240,0.75)] bg-[rgba(239,245,239,0.92)] px-4 backdrop-blur-[10px] lg:left-55 lg:right-0 lg:px-8"
      style={{ left: 0, right: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#006948] text-[13px] font-extrabold text-white">
          BP
        </div>
        <div className="text-[18px] font-extrabold text-[#006948]">BiasharaPro</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#bccac0] bg-white text-[#3d4a42]"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>

        <div className="rounded-full border border-[#bccac0] bg-[#eff5ef] px-4 py-2 text-[13px] font-medium text-[#3d4a42]">
          Wanjiku Stores
        </div>

        <div className="h-8 w-8 rounded-full bg-[#bccac0]" aria-label="User avatar" />
      </div>
    </header>
  );
}
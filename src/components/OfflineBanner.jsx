import React, { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));

  useEffect(() => {
    const updateOnlineState = () => setIsOffline(!navigator.onLine);

    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);

    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#bccac0] bg-white px-4 py-3 text-[13px] font-medium text-[#3d4a42] shadow-sm">
      Uko offline. Data itasawazishwa utakaporejea mtandaoni.
    </div>
  );
}
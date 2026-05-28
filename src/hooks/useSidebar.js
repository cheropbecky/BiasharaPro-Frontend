import { useEffect, useState } from 'react';

export default function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('sidebarCollapsed');
      setCollapsed(v === 'true');
    } catch {
      setCollapsed(false);
    }

    function onStorage(e) {
      if (e.key === 'sidebarCollapsed') setCollapsed(e.newValue === 'true');
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { collapsed };
}

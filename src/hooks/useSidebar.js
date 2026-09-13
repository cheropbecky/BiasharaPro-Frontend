import { useEffect, useState } from 'react';

export default function useSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    function update() {
      try {
        const v = localStorage.getItem('sidebarCollapsed');
        setCollapsed(v === 'true');
      } catch {
        setCollapsed(false);
      }
    }

    window.addEventListener('storage', update);
    window.addEventListener('sidebarCollapsedChange', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('sidebarCollapsedChange', update);
    };
  }, []);

  return { collapsed };
}

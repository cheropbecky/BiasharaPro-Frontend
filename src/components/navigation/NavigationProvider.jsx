import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ALERTS_COUNT_KEY, PROFILE_KEY, routeMeta } from './navConfig';
import { PROFILE_UPDATED_EVENT, readStoredProfile } from '../../utils/preferences';

const NavigationContext = createContext(null);

const TOAST_DURATION = 2500;
const TOOLTIP_KEY = 'biasharapro_nav_tooltips_seen';
const ONBOARDING_COMPLETE_KEY = 'biasharapro_onboarding_complete';

function safeParse(value) {
  try {
    return JSON.parse(value || 'null');
  } catch {
    return null;
  }
}

export function NavigationProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [saleSheetOpen, setSaleSheetOpen] = useState(false);
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false);
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [inventorySpeedDialOpen, setInventorySpeedDialOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [tooltipStep, setTooltipStep] = useState(0);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('biasharapro_sidebar_collapsed') === 'true';
  });

  const [profile, setProfile] = useState(() => readStoredProfile());

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    setMobileDrawerOpen(false);
    setMoreDrawerOpen(false);
    setSaleSheetOpen(false);
    setInventorySpeedDialOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const refresh = () => {
      if (localStorage.getItem(ONBOARDING_COMPLETE_KEY) !== 'true') return;
      if (localStorage.getItem(TOOLTIP_KEY) === 'true') return;

      if (window.matchMedia('(max-width: 1023px)').matches && location.pathname === '/dashboard') {
        setTooltipStep(1);
      }
    };

    const timer = window.setTimeout(refresh, 700);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const syncProfile = () => setProfile(readStoredProfile());
    const handleStorage = (event) => {
      if (event.key === PROFILE_KEY) syncProfile();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfile);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfile);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    toastTimerRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  useEffect(() => {
    const onOpenAddProduct = () => setToast({ type: 'success', message: '✓ Bidhaa imeongezwa' });
    const onOpenExpense = () => setToast({ type: 'success', message: '✓ Gharama imehifadhiwa' });
    const onOpenSale = () => setSaleSheetOpen(true);

    window.addEventListener('biashara:open-add-product', onOpenAddProduct);
    window.addEventListener('biashara:open-expense', onOpenExpense);
    window.addEventListener('biashara:open-sale', onOpenSale);

    return () => {
      window.removeEventListener('biashara:open-add-product', onOpenAddProduct);
      window.removeEventListener('biashara:open-expense', onOpenExpense);
      window.removeEventListener('biashara:open-sale', onOpenSale);
    };
  }, []);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const openSaleSheet = () => setSaleSheetOpen(true);
  const openExpenseSheet = () => setExpenseSheetOpen(true);
  const openProductSheet = () => setProductSheetOpen(true);

  const saveSale = () => {
    if (typeof window !== 'undefined') {
      if (!isOnline) {
        showToast('☁ Imehifadhiwa offline — itasawazishwa baadaye', 'offline');
      } else {
        showToast('✓ Mauzo imehifadhiwa', 'success');
      }
    }
    setSaleSheetOpen(false);
  };

  const openMoreDrawer = () => setMoreDrawerOpen(true);
  const closeMoreDrawer = () => setMoreDrawerOpen(false);
  const openMobileDrawer = () => setMobileDrawerOpen(true);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);
  const toggleSidebarCollapse = () => {
    setIsDesktopSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') localStorage.setItem('biasharapro_sidebar_collapsed', String(next));
      return next;
    });
  };

  const markTooltipsComplete = () => {
    if (typeof window !== 'undefined') localStorage.setItem(TOOLTIP_KEY, 'true');
    setTooltipStep(0);
  };

  const nextTooltipStep = () => {
    if (tooltipStep === 1) {
      setTooltipStep(2);
      return;
    }
    markTooltipsComplete();
  };

  const pageMeta = routeMeta[location.pathname] || { title: 'BiasharaPro', enTitle: 'BiasharaPro', group: 'daily' };

  const value = {
    location,
    navigate,
    profile,
    pageMeta,
    mobileDrawerOpen,
    moreDrawerOpen,
    saleSheetOpen,
    expenseSheetOpen,
    productSheetOpen,
    inventorySpeedDialOpen,
    toast,
    tooltipStep,
    isOnline,
    isDesktopSidebarCollapsed,
    alertsCount: ALERTS_COUNT_KEY,
    showToast,
    setSaleSheetOpen,
    setInventorySpeedDialOpen,
    openSaleSheet,
    openExpenseSheet,
    openProductSheet,
    saveSale,
    openMoreDrawer,
    closeMoreDrawer,
    openMobileDrawer,
    closeMobileDrawer,
    toggleSidebarCollapse,
    nextTooltipStep,
    markTooltipsComplete,
    setMobileDrawerOpen,
    setMoreDrawerOpen,
    setExpenseSheetOpen,
    setProductSheetOpen,
    setInventorySpeedDialOpen,
    setToast,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationSystem() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigationSystem must be used within NavigationProvider');
  return context;
}

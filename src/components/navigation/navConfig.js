export const PROFILE_KEY = 'biasharapro_profile';
export const ALERTS_COUNT_KEY = 5;

export const routeMeta = {
  '/dashboard': { title: 'Nyumbani', enTitle: 'Home', group: 'daily' },
  '/expenses': { title: 'Gharama', enTitle: 'Expenses', group: 'daily' },
  '/inventory': { title: 'Bidhaa', enTitle: 'Inventory', group: 'daily' },
  '/bookkeeping': { title: 'Vitabu', enTitle: 'Bookkeeping', group: 'finance' },
  '/alerts': { title: 'Tahadhari', enTitle: 'Alerts', group: 'finance' },
  '/account': { title: 'Akaunti', enTitle: 'Account', group: 'account' },
  '/offline': { title: 'Sync Status', enTitle: 'Sync Status', group: 'account' },
  '/onboarding': { title: 'Onboarding', enTitle: 'Onboarding', group: 'account' },
};

export const desktopNavGroups = [
  {
    labelSw: 'KAZI YA KILA SIKU',
    labelEn: 'DAILY WORK',
    items: [
      { to: '/dashboard', labelSw: 'Dashibodi', labelEn: 'Dashboard', icon: 'chart' },
      { to: '/expenses', labelSw: 'Gharama', labelEn: 'Expenses', icon: 'cash' },
      { to: '/inventory', labelSw: 'Bidhaa', labelEn: 'Inventory', icon: 'box' },
      { to: '/bookkeeping', labelSw: 'Vitabu', labelEn: 'Bookkeeping', icon: 'book' },
    ],
  },
  {
    labelSw: 'HESABU',
    labelEn: 'FINANCE',
    items: [
      { to: '/alerts', labelSw: 'Tahadhari', labelEn: 'Alerts', icon: 'alert', badge: true },
    ],
  },
  {
    labelSw: 'AKAUNTI',
    labelEn: 'ACCOUNT',
    items: [
      { to: '/account', labelSw: 'Akaunti', labelEn: 'Account', icon: 'user' },
      { to: '/offline', labelSw: 'Mipangilio', labelEn: 'Settings', icon: 'settings' },
    ],
  },
];

export const mobileNavItems = [
  { to: '/dashboard', labelSw: 'Nyumbani', labelEn: 'Home', icon: 'home' },
  { to: '/inventory', labelSw: 'Bidhaa', labelEn: 'Stock', icon: 'boxes', badge: true },
  { to: 'sale', labelSw: 'Mauzo', labelEn: 'Sale', icon: 'sale', center: true },
  { to: '/bookkeeping', labelSw: 'Vitabu', labelEn: 'Books', icon: 'book' },
  { to: 'more', labelSw: 'Zaidi', labelEn: 'More', icon: 'grid' },
];

export const moreDrawerTiles = [
  { to: '/alerts', labelSw: 'Tahadhari', labelEn: 'Alerts', icon: 'alert', accent: 'red' },
  { to: '/expenses', labelSw: 'Gharama', labelEn: 'Expenses', icon: 'cash', accent: 'green' },
  { to: '/account', labelSw: 'Akaunti', labelEn: 'Account', icon: 'user', accent: 'green' },
  { to: '/offline', labelSw: 'Mipangilio', labelEn: 'Settings', icon: 'settings', accent: 'terracotta' },
];

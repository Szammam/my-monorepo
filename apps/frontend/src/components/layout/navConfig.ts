export interface NavItem {
  to: string;
  label: string;
  showInMobileBar?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Start', showInMobileBar: true },
  { to: '/vendors', label: 'Sprzedawcy', showInMobileBar: true },
  { to: '/cart', label: 'Koszyk', showInMobileBar: true },
  { to: '/orders', label: 'Zamówienia', showInMobileBar: true },
  { to: '/profile', label: 'Profil', showInMobileBar: true },
  { to: '/login', label: 'Zaloguj się', showInMobileBar: false },
];

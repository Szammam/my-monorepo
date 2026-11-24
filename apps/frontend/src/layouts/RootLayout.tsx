import { Outlet } from 'react-router-dom';
import { AppFooter } from '../components/layout/AppFooter';
import { AppHeader } from '../components/layout/AppHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import '../components/layout/layout.css';

export function RootLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-shell__main">
        <Outlet />
      </main>
      <AppFooter />
      <MobileBottomNav />
    </div>
  );
}

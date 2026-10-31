import { useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RequireAdmin from './RequireAdmin';
import TopNav from './TopNav';
import DesktopSidebar from './DesktopSidebar';
import '../../styles/dashboard.css';
import MobileDrawer from './MobileDrawer';
import BottomMobileNav from './BottomMobileNav';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Reinicia el desplazamiento antes de mostrar una nueva sección.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <RequireAdmin>
      <div className="admin-shell app-bg font-sans text-ink antialiased min-h-screen">
        <TopNav onOpenMenu={() => setMobileOpen(true)} />
        <DesktopSidebar />
        <BottomMobileNav />

        {/* Siempre montado (no solo cuando mobileOpen) para poder animar su
            opacidad al abrir/cerrar, igual que el overlay del menú móvil
            público — antes aparecía/desaparecía de golpe sin transición. */}
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-ink/30 z-30 lg:hidden transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className="admin-content admin-workspace-content">
          <Outlet />
        </main>
      </div>
    </RequireAdmin>
  );
}

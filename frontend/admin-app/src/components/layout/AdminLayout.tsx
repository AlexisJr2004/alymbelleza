import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RequireAdmin from './RequireAdmin';
import TopNav from './TopNav';
import IconRail from './IconRail';
import MobileDrawer from './MobileDrawer';
import ChatPanel from './ChatPanel';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="app-bg font-sans text-ink antialiased min-h-screen">
        <TopNav onToggleMobile={() => setMobileOpen((v) => !v)} />
        <IconRail />

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
        <ChatPanel />

        <main className="max-w-[1600px] mx-auto p-4 lg:pl-[104px] lg:pr-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </RequireAdmin>
  );
}

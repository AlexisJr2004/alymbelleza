import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RequireAdmin from './RequireAdmin';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="bg-white font-body min-h-screen">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        {/* Siempre montado (no solo cuando sidebarOpen) para poder animar su
            opacidad al abrir/cerrar, igual que el overlay del menú móvil
            público — antes aparecía/desaparecía de golpe sin transición. */}
        <div
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 bg-gray-900/40 z-30 lg:hidden transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div className="relative z-10 lg:pl-64">
          <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="p-4 lg:p-6 max-w-[1920px] mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
}

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

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

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

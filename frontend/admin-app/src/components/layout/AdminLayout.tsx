import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import RequireAdmin from './RequireAdmin';
import TopNav from './TopNav';
import IconRail from './IconRail';
import MobileDrawer from './MobileDrawer';
import BottomMobileNav from './BottomMobileNav';
import ChatPanel from './ChatPanel';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="app-bg min-h-screen font-sans text-ink antialiased">
        <TopNav onOpenMenu={() => setMobileOpen(true)} />
        <IconRail />
        <BottomMobileNav />

        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className={`glass-overlay fixed inset-0 z-30 transition-opacity duration-300 xl:hidden ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className="mx-auto max-w-[2000px] px-4 pb-[calc(108px+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-5 xl:pb-8 xl:pl-[100px] xl:pr-6 xl:pt-5">
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div id="admin-content" className="min-w-0">
              <Outlet />
            </div>
            <ChatPanel />
          </div>
        </main>
      </div>
    </RequireAdmin>
  );
}

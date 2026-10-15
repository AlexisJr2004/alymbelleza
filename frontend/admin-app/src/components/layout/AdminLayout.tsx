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
      <div className="app-bg font-sans text-ink antialiased min-h-screen">
        <TopNav />
        <IconRail />
        <BottomMobileNav onOpenMore={() => setMobileOpen(true)} />

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

        {/* Grid de 2 columnas: contenido a la izquierda (la que manda en
            ancho) + panel de IA a la derecha, siempre visible, sin botón
            para abrirlo. El quiebre a columna única se da en 2xl (no en xl,
            que es donde los grids internos de cada página -- KpiRow, etc. --
            ya pasan a su propio máximo de columnas) para que esos grids
            internos no compitan por ancho con la columna del chat en el
            mismo breakpoint. max-w subido de 1800 a 2000: con 1800, en
            pantallas de 1920px+ el mx-auto dejaba un margen muerto a cada
            lado que empujaba el contenido lejos del riel de iconos y el
            chat lejos del borde derecho -- de ahí el pedido de "mover
            contenido a la izquierda / chat a la derecha". pl/pr también se
            reducen un poco para acercar ambas columnas a sus bordes. */}
        <main className="max-w-[2000px] mx-auto p-4 pb-28 lg:pb-8 lg:pl-[96px] lg:pr-4 lg:py-8">
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

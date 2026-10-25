import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GoTopButton from './GoTopButton';
import AccessibilityWidget from './AccessibilityWidget';

// GoTopButton y AccessibilityWidget viven acá (no en HomePage) porque el sitio
// viejo los repetía idénticos en cada página de contenido (mismo #goTopBtn /
// #dropdownDefaultButton en productos.html, etc.), no solo en index.html.
export default function PublicLayout() {
  const isHome = useLocation().pathname === '/';
  return (
    <div className={`bg-white font-body ${isHome ? 'bb-home-layout' : ''}`}>
      {!isHome && <Header />}
      <Outlet />
      {!isHome && <Footer />}
      <GoTopButton />
      <AccessibilityWidget />
    </div>
  );
}

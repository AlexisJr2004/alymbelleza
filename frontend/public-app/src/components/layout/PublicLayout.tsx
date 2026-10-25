import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GoTopButton from './GoTopButton';
import AccessibilityWidget from './AccessibilityWidget';
import StoreHeader from '../home/StoreHeader';
import StoreFooter from '../home/StoreFooter';
import '../../styles/storefront.css';

// GoTopButton y AccessibilityWidget viven acá (no en HomePage) porque el sitio
// viejo los repetía idénticos en cada página de contenido (mismo #goTopBtn /
// #dropdownDefaultButton en productos.html, etc.), no solo en index.html.
export default function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isStorePage = pathname === '/perfil' || pathname === '/productos';
  return (
    <div className={`bg-white font-body ${isHome || isStorePage ? 'bb-home-layout' : ''} ${isStorePage ? 'bb-storefront' : ''}`}>
      {isStorePage ? <StoreHeader /> : !isHome && <Header />}
      <Outlet />
      {isStorePage ? <StoreFooter /> : !isHome && <Footer />}
      <GoTopButton />
      <AccessibilityWidget />
    </div>
  );
}

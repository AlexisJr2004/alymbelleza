import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GoTopButton from './GoTopButton';
import AccessibilityWidget from './AccessibilityWidget';

// GoTopButton y AccessibilityWidget viven acá (no en HomePage) porque el sitio
// viejo los repetía idénticos en cada página de contenido (mismo #goTopBtn /
// #dropdownDefaultButton en productos.html, etc.), no solo en index.html.
export default function PublicLayout() {
  return (
    <div className="bg-white font-body">
      <Header />
      <Outlet />
      <Footer />
      <GoTopButton />
      <AccessibilityWidget />
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredUser } from '../../lib/auth';
import { BarsIcon, XIcon } from '../icons';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
import CartBadge from './CartBadge';
import MobileMenu from './MobileMenu';

function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative flex items-center space-x-2 group">
      <button
        type="button"
        onClick={toggle}
        className="text-purple-600 hover:text-purple-700 transition duration-300 p-2 rounded-full hover:bg-purple-50 focus:outline-none"
      >
        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
      </button>
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white bg-purple-600 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Activar pantalla completa
      </div>
    </div>
  );
}

export default function Header() {
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Information Bar */}
        <div className="hidden md:flex justify-between items-center py-3 border-b border-purple-100 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-map-marker-alt text-purple-600" />
              <a href="#" className="text-gray-700 hover:text-purple-700 transition duration-300">
                Av. Principal 123, Ciudad
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-envelope text-purple-600" />
              <a href="mailto:info@bellabeauty.com" className="text-gray-700 hover:text-purple-700 transition duration-300">
                info@bellabeauty.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-clock text-purple-600" />
              <span className="text-gray-700">Lun - Dom: 9:00 - 20:00</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FullscreenToggle />
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-purple-400" />
              </div>
              <input
                type="search"
                placeholder="Buscar en el sitio..."
                className="pl-10 pr-4 py-2 text-sm text-gray-900 border-none bg-purple-50 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <NotificationBell />
              <CartBadge />
              <a
                href="https://www.tiktok.com/@merly_macias?lang=es"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:text-purple-700 transition duration-200 p-2 rounded-full hover:bg-purple-50"
              >
                <i className="fab fa-tiktok" />
              </a>
              <a
                href="https://www.facebook.com/HairdresserandSpa?mibextid=LQQJ4d"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:text-purple-700 transition duration-200 p-2 rounded-full hover:bg-purple-50"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <Link
                to={user ? '/citas' : '/login'}
                title={user ? undefined : 'Debes iniciar sesión para reservar'}
                className={`text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-200 px-4 py-2 rounded-full shadow hover:shadow-md ${
                  user ? '' : 'opacity-50 pointer-events-none cursor-not-allowed'
                }`}
              >
                Reserva Online
              </Link>
            </div>
          </div>

          <UserDropdown />
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-5">
            <Link
              to="/"
              className="font-display text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Bella Beauty
            </Link>
            <p className="text-sm text-purple-600 hidden md:block">Tu belleza, nuestra pasión</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-700">
            <Link to="/" className="px-3 py-2 rounded-md hover:text-purple-700 hover:bg-purple-50 transition duration-300">
              Inicio
            </Link>
            <div className="relative group">
              <a
                href="/#servicios"
                className="px-4 py-2 rounded-md hover:text-purple-700 hover:bg-purple-50 transition duration-300 flex items-center"
              >
                Servicios
                <i className="fas fa-chevron-down ml-2 text-sm" />
              </a>
              <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-lg border border-purple-100 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-2 transition-all duration-300">
                <a href="/#servicios" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition duration-300">
                  Tratamientos Faciales
                </a>
                <a href="/#servicios" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition duration-300">
                  Manicure &amp; Pedicure
                </a>
                <a href="/#servicios" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition duration-300">
                  Masajes
                </a>
              </div>
            </div>
            <Link to="/productos" className="px-3 py-2 rounded-md hover:text-purple-700 hover:bg-purple-50 transition duration-300">
              Productos
            </Link>
            <a href="/#contacto" className="px-3 py-2 rounded-md hover:text-purple-700 hover:bg-purple-50 transition duration-300">
              Contacto
            </a>
            <Link to="/galeria" className="px-3 py-2 rounded-md hover:text-purple-700 hover:bg-purple-50 transition duration-300">
              Galeria
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-purple-600 hover:text-purple-700 focus:outline-none"
          >
            {mobileOpen ? <XIcon className="h-8 w-8" strokeWidth={2} /> : <BarsIcon className="h-8 w-8" strokeWidth={2} />}
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

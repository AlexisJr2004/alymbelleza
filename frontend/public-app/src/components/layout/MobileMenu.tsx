import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, isAdmin, logout } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { confirmAction, notifySuccess } from '../../lib/sweetalert';
import {
  ChevronDownIcon,
  ClockIcon,
  CogIcon,
  EnvelopeIcon,
  FacebookIcon,
  HomeIcon,
  LogoutIcon,
  MapPinIcon,
  PhotoIcon,
  SearchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TiktokIcon,
  UserCircleIcon,
} from '../icons';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

// Entrada escalonada de cada sección al abrir el menú (fade + slide-up con
// delay creciente). Al cerrar, el delay se anula para que todo desaparezca
// junto en vez de terminar de desvanecerse después de que el panel ya se
// deslizó fuera de pantalla.
function reveal(open: boolean, index: number) {
  return {
    className: `transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`,
    style: { transitionDelay: open ? `${index * 60}ms` : '0ms' } as const,
  };
}

function cx(...classes: string[]) {
  return classes.join(' ');
}

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de tu cuenta?',
      confirmText: 'Sí, cerrar sesión',
      icon: 'question',
    });
    if (!confirmed) return;
    logout();
    notifySuccess('Sesión cerrada', 'Has cerrado sesión correctamente');
    onClose();
    navigate('/');
  };

  // Portal a document.body: el <header> es sticky con backdrop-blur-md, y
  // backdrop-filter (igual que filter) crea un containing block para los
  // hijos position:fixed — sin el portal, el overlay/aside fixed quedaban
  // encajonados dentro de la caja del header en vez de cubrir el viewport.
  return createPortal(
    <>
      {/* Fondo oscurecido tipo modal — siempre montado (no solo cuando open)
          para poder animar su opacidad tanto al abrir como al cerrar. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[1001] bg-gray-900/40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-[1002] h-screen w-80 bg-white/95 backdrop-blur-md rounded-r-3xl border-r border-purple-100 shadow-lg overflow-y-auto transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div style={reveal(open, 0).style} className={cx('p-4 mb-6 border-b border-purple-100', reveal(open, 0).className)}>
          <h2 className="text-xl font-display bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Bella Beauty</h2>
          <p className="text-sm text-purple-600">Tu belleza, nuestra pasión</p>
        </div>

        {user ? (
          <div style={reveal(open, 1).style} className={cx('px-4 py-4 mb-4 border-b border-purple-100', reveal(open, 1).className)}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  className="w-14 h-14 rounded-full border-2 border-purple-100 object-cover shadow-sm"
                  src={resolveProfileImage(user)}
                  alt="Foto de perfil"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    isAdmin(user) ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="block text-base font-semibold text-gray-900 truncate max-w-[140px]">{user.name || 'Usuario'}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-white/90 transition-colors"
                  >
                    <LogoutIcon className="h-5 w-5" />
                  </button>
                </div>
                <span className="block text-sm text-gray-600 truncate max-w-[160px]">{user.email || ''}</span>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {isAdmin(user) ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              {isAdmin(user) && (
                <a
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                >
                  <CogIcon className="w-5 h-5 shrink-0 text-gray-500" />
                  Panel Administrador
                </a>
              )}
              <Link
                to="/perfil"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors duration-200"
              >
                <UserCircleIcon className="w-5 h-5 shrink-0 text-gray-500" />
                Perfil
              </Link>
            </div>
          </div>
        ) : (
          <div style={reveal(open, 1).style} className={cx('px-4 py-4 mb-4 border-b border-purple-100', reveal(open, 1).className)}>
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full text-center py-2.5 text-sm font-medium text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors duration-200"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full text-center py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}

        <div style={reveal(open, 2).style} className={cx('px-4 mb-6 space-y-4 border-b border-purple-100 pb-4', reveal(open, 2).className)}>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-4 h-4 shrink-0 text-gray-500" />
            <a href="#" className="text-sm text-gray-700 hover:text-purple-700 transition duration-300">
              Av. Principal 123, Ciudad
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="w-4 h-4 shrink-0 text-gray-500" />
            <a href="mailto:info@bellabeauty.com" className="text-sm text-gray-700 hover:text-purple-700 transition duration-300">
              info@bellabeauty.com
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="w-4 h-4 shrink-0 text-gray-500" />
            <span className="text-sm text-gray-700">Lun - Dom: 9:00 - 20:00</span>
          </div>
        </div>

        <div style={reveal(open, 3).style} className={cx('px-4 mb-6', reveal(open, 3).className)}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Buscar en el sitio..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border-none bg-purple-50 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300"
            />
          </div>
        </div>

        <div style={reveal(open, 4).style} className={cx('mb-6 px-2', reveal(open, 4).className)}>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-900 hover:bg-purple-50 transition-colors duration-200"
              >
                <HomeIcon className="w-5 h-5 shrink-0 text-gray-500 mr-3" />
                Inicio
              </Link>
            </li>
            <li className="relative">
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-900 hover:bg-purple-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <SparklesIcon className="w-5 h-5 shrink-0 text-gray-500 mr-3" />
                  Servicios
                </div>
                <ChevronDownIcon
                  className={`w-4 h-4 shrink-0 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${servicesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <ul className="overflow-hidden pl-12 py-0.5 space-y-1">
                  <li>
                    <a
                      href="/#servicios"
                      onClick={onClose}
                      className="block py-2 text-sm text-gray-700 hover:text-purple-700 transition-colors duration-200"
                    >
                      Tratamientos Faciales
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#servicios"
                      onClick={onClose}
                      className="block py-2 text-sm text-gray-700 hover:text-purple-700 transition-colors duration-200"
                    >
                      Manicure &amp; Pedicure
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#servicios"
                      onClick={onClose}
                      className="block py-2 text-sm text-gray-700 hover:text-purple-700 transition-colors duration-200"
                    >
                      Masajes
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <Link
                to="/productos"
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-900 hover:bg-purple-50 transition-colors duration-200"
              >
                <ShoppingBagIcon className="w-5 h-5 shrink-0 text-gray-500 mr-3" />
                Productos
              </Link>
            </li>
            <li>
              <a
                href="/#contacto"
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-900 hover:bg-purple-50 transition-colors duration-200"
              >
                <EnvelopeIcon className="w-5 h-5 shrink-0 text-gray-500 mr-3" />
                Contacto
              </a>
            </li>
            <li>
              <Link
                to="/galeria"
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-900 hover:bg-purple-50 transition-colors duration-200"
              >
                <PhotoIcon className="w-5 h-5 shrink-0 text-gray-500 mr-3" />
                Galeria
              </Link>
            </li>
          </ul>
        </div>

        <div style={reveal(open, 5).style} className={cx('px-4 space-y-4 mb-6', reveal(open, 5).className)}>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://www.tiktok.com/@merly_macias?lang=es"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
            >
              <TiktokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/HairdresserandSpa?mibextid=LQQJ4d"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>
          <Link
            to={user ? '/citas' : '/login'}
            onClick={onClose}
            className={`block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition duration-300 shadow-md hover:shadow-lg ${
              user ? '' : 'opacity-50 pointer-events-none cursor-not-allowed'
            }`}
          >
            Reserva Online
          </Link>
        </div>
      </aside>
    </>,
    document.body
  );
}

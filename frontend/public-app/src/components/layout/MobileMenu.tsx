import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, isAdmin, logout } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { confirmAction, notifySuccess } from '../../lib/sweetalert';
import { LogoutIcon } from '../icons';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

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

  return (
    <aside
      className={`${
        open ? '' : 'hidden'
      } fixed left-0 top-0 z-50 h-screen w-80 bg-white/95 backdrop-blur-md rounded-r-3xl border-r border-purple-100 shadow-lg overflow-y-auto`}
    >
      <div className="p-4 mb-6 border-b border-purple-100">
        <h2 className="text-xl font-display bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Bella Beauty</h2>
        <p className="text-sm text-purple-600">Tu belleza, nuestra pasión</p>
      </div>

      {user ? (
        <div className="px-4 py-4 mb-4 border-b border-purple-100">
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
                <button type="button" onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors">
                  <LogoutIcon className="h-5 w-5" />
                </button>
              </div>
              <span className="block text-sm text-gray-600 truncate max-w-[160px]">{user.email || ''}</span>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                {isAdmin(user) ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>

          {isAdmin(user) && (
            <div className="mt-3">
              <a href="/admin" className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 font-medium">
                <i className="fa-solid fa-gear mr-1 text-sm" />
                Panel Administrador
              </a>
            </div>
          )}
          <div className="mt-3">
            <Link to="/perfil" onClick={onClose} className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 font-medium">
              <i className="fa-solid fa-user-circle mr-1 text-sm" />
              Perfil
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 mb-4 border-b border-purple-100">
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

      <div className="px-4 mb-6 space-y-4 border-b border-purple-100 pb-4">
        <div className="flex items-center space-x-3">
          <i className="fas fa-map-marker-alt text-purple-600" />
          <a href="#" className="text-sm text-gray-700 hover:text-purple-700 transition duration-300">
            Av. Principal 123, Ciudad
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <i className="fas fa-envelope text-purple-600" />
          <a href="mailto:info@bellabeauty.com" className="text-sm text-gray-700 hover:text-purple-700 transition duration-300">
            info@bellabeauty.com
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <i className="fas fa-clock text-purple-600" />
          <span className="text-sm text-gray-700">Lun - Dom: 9:00 - 20:00</span>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-purple-400" />
          </div>
          <input
            type="search"
            placeholder="Buscar en el sitio..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border-none bg-purple-50 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300"
          />
        </div>
      </div>

      <div className="mb-6">
        <ul className="space-y-1">
          <li>
            <Link to="/" onClick={onClose} className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50">
              <i className="fas fa-home w-5 h-5 text-purple-500 mr-3" />
              Inicio
            </Link>
          </li>
          <li className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50"
            >
              <div className="flex items-center">
                <i className="fas fa-spa w-5 h-5 text-purple-500 mr-3" />
                Servicios
              </div>
              <i className="fas fa-chevron-down text-sm" />
            </button>
            <ul className={`${servicesOpen ? '' : 'hidden'} pl-12 py-2 space-y-1`}>
              <li>
                <a href="/#servicios" onClick={onClose} className="block py-2 text-sm text-gray-700 hover:text-purple-700">
                  Tratamientos Faciales
                </a>
              </li>
              <li>
                <a href="/#servicios" onClick={onClose} className="block py-2 text-sm text-gray-700 hover:text-purple-700">
                  Manicure &amp; Pedicure
                </a>
              </li>
              <li>
                <a href="/#servicios" onClick={onClose} className="block py-2 text-sm text-gray-700 hover:text-purple-700">
                  Masajes
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/productos" onClick={onClose} className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50">
              <i className="fas fa-shopping-bag w-5 h-5 text-purple-500 mr-3" />
              Productos
            </Link>
          </li>
          <li>
            <a href="/#contacto" onClick={onClose} className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50">
              <i className="fas fa-envelope w-5 h-5 text-purple-500 mr-3" />
              Contacto
            </a>
          </li>
          <li>
            <Link to="/galeria" onClick={onClose} className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 hover:bg-purple-50">
              <i className="fas fa-images w-5 h-5 text-purple-500 mr-3" />
              Galeria
            </Link>
          </li>
        </ul>
      </div>

      <div className="px-4 space-y-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <a
            href="https://www.tiktok.com/@merly_macias?lang=es"
            target="_blank"
            rel="noreferrer"
            className="text-purple-600 hover:text-purple-700 transition duration-300 p-2 rounded-full hover:bg-purple-50"
          >
            <i className="fab fa-tiktok" />
          </a>
          <a
            href="https://www.facebook.com/HairdresserandSpa?mibextid=LQQJ4d"
            target="_blank"
            rel="noreferrer"
            className="text-purple-600 hover:text-purple-700 transition duration-300 p-2 rounded-full hover:bg-purple-50"
          >
            <i className="fab fa-facebook-f" />
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
  );
}

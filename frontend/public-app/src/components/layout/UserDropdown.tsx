import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, isAdmin, logout } from '../../lib/auth';
import { resolveProfileImage } from '../../lib/format';
import { confirmAction, notifySuccess } from '../../lib/sweetalert';
import { LogoutIcon } from '../icons';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

export default function UserDropdown() {
  const user = getStoredUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="ml-6 flex items-center space-x-4">
        <Link
          to="/login"
          className="text-sm font-medium text-purple-700 hover:text-purple-900 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-purple-50 border border-purple-200"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Registrarse
        </Link>
      </div>
    );
  }

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
    navigate('/');
  };

  const avatarUrl = resolveProfileImage(user);

  return (
    <div className="flex items-center relative" ref={containerRef}>
      <button
        type="button"
        className="flex rounded-full focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        <span className="sr-only">Abrir menú de usuario</span>
        <img
          className="w-9 h-9 rounded-full border border-gray-200 object-cover"
          src={avatarUrl}
          alt="Foto de perfil"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
      </button>

      <div
        className={`absolute top-full right-0 mt-2 w-80 origin-top-right transition-all duration-200 ease-out transform ${
          open ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
        }`}
      >
        <div className="z-50 bg-white rounded-md shadow-lg border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <img
                className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                src={avatarUrl}
                alt="Foto de perfil"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <div className="min-w-0">
                <span className="block text-base font-medium text-gray-900 truncate max-w-[220px]">{user.name || 'Usuario'}</span>
                <span className="block text-sm text-gray-500 truncate max-w-[220px]">{user.email || ''}</span>
              </div>
            </div>
          </div>

          <ul className="py-1">
            {isAdmin(user) && (
              <li>
                <a href="/admin" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">
                  Panel Administrador
                </a>
              </li>
            )}
            <li>
              <Link to="/perfil" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">
                Perfil
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <LogoutIcon className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

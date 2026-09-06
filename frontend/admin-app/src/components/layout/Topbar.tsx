import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, BellIcon } from '../icons';
import { getStoredUser } from '../../lib/auth';
import { formatoFechaLarga, resolveProfileImage } from '../../lib/format';

const FALLBACK_AVATAR = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const user = getStoredUser();
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    setFecha(formatoFechaLarga(new Date()));
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -ml-2 shrink-0"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        <span className="hidden md:block text-sm text-gray-500 capitalize">{fecha}</span>
        {/* El punto rojo de citas pendientes se conecta cuando exista useAppointments (sub-fase 5) */}
        <Link
          to="/citas"
          title="Citas pendientes"
          className="relative w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
        >
          <BellIcon className="w-5 h-5" />
        </Link>
        <div className="w-px h-6 bg-gray-200 hidden md:block" />
        <div className="flex items-center gap-3">
          <img
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
            src={resolveProfileImage(user)}
            alt="Foto de perfil"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}

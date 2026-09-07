import { useEffect, useRef, useState } from 'react';
import { BellNotificationIcon, EmptyBellIcon, XIcon } from '../icons';
import { useAppointmentsQuery } from '../../hooks/useAppointments';

const ESTADO_STYLES = {
  pendiente: { color: 'text-yellow-500', bg: 'bg-blue-100', icon: 'fa-clock', label: 'Pendiente' },
  realizada: { color: 'text-emerald-500', bg: 'bg-emerald-100', icon: 'fa-check-circle', label: 'Realizada' },
  cancelada: { color: 'text-rose-500', bg: 'bg-rose-100', icon: 'fa-times-circle', label: 'Cancelada' },
} as const;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: appointments = [] } = useAppointmentsQuery();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title="Notificaciones"
        className="text-purple-600 hover:text-purple-700 transition duration-200 p-2 rounded-full hover:bg-purple-50 relative"
      >
        <i className="fas fa-bell" />
        {appointments.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {appointments.length}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 mt-3 w-96 max-w-[90vw] bg-white rounded-3xl z-50 border border-gray-200 overflow-hidden transition-all duration-200 origin-top-right transform ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="px-5 py-4 bg-white/60 backdrop-blur-md flex justify-between items-center rounded-t-3xl border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100/60 p-2 rounded-2xl">
              <BellNotificationIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-900 text-lg tracking-tight">Notificaciones</h4>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-blue-400 hover:text-blue-700 transition-colors rounded-full p-2 focus:outline-none"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <ul id="notification-dropdown" className="divide-y divide-gray-100 max-h-96 overflow-y-auto bg-white px-2 py-3 space-y-2">
          {appointments.length === 0 ? (
            <li className="px-8 py-12 text-center">
              <EmptyBellIcon className="h-14 w-14 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500 font-semibold text-lg">No hay notificaciones</p>
              <p className="text-sm text-gray-400 mt-1">Cuando tengas nuevas citas, aparecerán aquí</p>
            </li>
          ) : (
            appointments.map((app) => {
              const estado = ESTADO_STYLES[app.status || 'pendiente'];
              const fechaStr = new Date(app.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              return (
                <li
                  key={app._id}
                  className="bg-white rounded-2xl flex items-center gap-4 px-5 py-4 mb-2 border border-gray-200 hover:bg-blue-50 transition"
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl ${estado.bg}`}>
                    <span className={`text-2xl ${estado.color}`}>
                      <i className={`fas ${estado.icon}`} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-lg ${estado.color}`}>{estado.label}</span>
                      <span className="text-xs text-gray-400 ml-2">{fechaStr}</span>
                    </div>
                    <div className="text-gray-700 text-sm mt-1">
                      Tienes una reservación con tu estilista el <span className="font-semibold">{fechaStr}</span>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

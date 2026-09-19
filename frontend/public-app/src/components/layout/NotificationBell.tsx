import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CheckIcon, ClockIcon, EmptyBellIcon, XCircleIcon, XIcon } from '../icons';
import { useAppointmentsQuery } from '../../hooks/useAppointments';

const ESTADO_STYLES = {
  pendiente: { color: 'text-amber-500', bg: 'bg-amber-50', icon: ClockIcon, label: 'Pendiente' },
  realizada: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckIcon, label: 'Realizada' },
  cancelada: { color: 'text-rose-500', bg: 'bg-rose-50', icon: XCircleIcon, label: 'Cancelada' },
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
        className="shrink-0 relative w-10 h-10 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white/90 transition-colors"
      >
        <BellIcon className="w-5 h-5" />
        {appointments.length > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Mismo patrón que UserDropdown.tsx (el otro desplegable del header):
          rounded-md, shadow-lg, border-gray-100 — con la campana usando el
          mismo ícono de línea (BellIcon) que el botón de citas pendientes
          del admin en vez del glifo sólido de Font Awesome que tenía antes. */}
      <div
        className={`absolute right-0 mt-2 w-80 max-w-[90vw] origin-top-right transition-all duration-200 ease-out transform ${
          open ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
        }`}
      >
        <div className="z-50 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <BellIcon className="w-4 h-4 text-purple-600" />
              </span>
              <h4 className="text-sm font-semibold text-gray-900">Notificaciones</h4>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 focus:outline-none"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <ul className="notification-dropdown divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {appointments.length === 0 ? (
              <li className="px-5 py-10 text-center">
                <EmptyBellIcon className="h-10 w-10 mx-auto text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-500">No hay notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">Cuando tengas nuevas citas, aparecerán aquí</p>
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
                  <li key={app._id} className="mx-2 my-1 rounded-xl">
                    <div className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${estado.bg}`}>
                        <estado.icon className={`w-4 h-4 ${estado.color}`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${estado.color}`}>{estado.label}</span>
                          <span className="text-xs text-gray-400">{fechaStr}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          Tienes una reservación con tu estilista el <span className="font-medium text-gray-800">{fechaStr}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          {appointments.length > 0 && (
            <Link
              to="/citas"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-center text-sm font-medium text-purple-700 border-t border-gray-100 hover:bg-purple-50 transition-colors"
            >
              Ver todas las citas
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

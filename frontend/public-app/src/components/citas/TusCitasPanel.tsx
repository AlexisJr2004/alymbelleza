import type { Appointment } from '../../types/models';
import { formatoFechaLarga } from '../../lib/format';

interface TusCitasPanelProps {
  appointments: Appointment[] | undefined;
  isLoading: boolean;
  onMarkRealizada: (id: string) => void;
  onCancelar: (id: string) => void;
  onEliminar: (id: string) => void;
}

const ESTADO_STYLES = {
  pendiente: { color: 'text-yellow-500', bg: 'bg-yellow-50', icon: 'fa-clock', label: 'Pendiente' },
  realizada: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'fa-check-circle', label: 'Realizada' },
  cancelada: { color: 'text-rose-500', bg: 'bg-rose-50', icon: 'fa-times-circle', label: 'Cancelada' },
} as const;

// Panel "Tus Citas" — puerto de renderAppointmentsPanel() de citas.html. Los
// botones "Realizada"/"Cancelar" solo se muestran en citas pendientes, igual
// que el original; "Eliminar" está disponible en cualquier estado.
export default function TusCitasPanel({ appointments, isLoading, onMarkRealizada, onCancelar, onEliminar }: TusCitasPanelProps) {
  const isEmpty = !isLoading && (appointments?.length ?? 0) === 0;

  return (
    <div className="flex-1 min-w-0 w-full">
      <section aria-labelledby="appointments-heading" className="flex flex-col bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <header className="flex items-center mb-6">
          <h3 id="appointments-heading" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-list-check text-pink-500" />
            <span>Tus Citas</span>
          </h3>
        </header>
        <div className="max-h-[480px] overflow-y-auto -mr-2 pr-2">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-purple-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-400">Cargando citas...</p>
            </div>
          )}

          {!isLoading && !isEmpty && (
            <ul className="space-y-2" aria-live="polite">
              {(appointments ?? []).map((app) => {
                const estado = ESTADO_STYLES[app.status || 'pendiente'];
                const fechaStr = formatoFechaLarga(new Date(app.date));
                const esPendiente = (app.status || 'pendiente') === 'pendiente';
                return (
                  <li
                    key={app._id}
                    className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${estado.bg}`}>
                        <span className={`text-2xl ${estado.color}`}>
                          <i className={`fas ${estado.icon}`} />
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{fechaStr}</div>
                        <div className={`text-xs mt-1 ${estado.color}`}>{estado.label}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {esPendiente && (
                        <>
                          <button
                            type="button"
                            onClick={() => onMarkRealizada(app._id)}
                            className="realizada-btn px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold text-xs hover:bg-emerald-200 transition"
                          >
                            <i className="fas fa-check mr-1" /> Realizada
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelar(app._id)}
                            className="cancelar-btn px-3 py-1 rounded-lg bg-rose-100 text-rose-700 font-semibold text-xs hover:bg-rose-200 transition"
                          >
                            <i className="fas fa-times mr-1" /> Cancelar
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => onEliminar(app._id)}
                        className="eliminar-btn px-3 py-1 rounded-lg bg-gray-100 text-gray-500 font-semibold text-xs hover:bg-gray-200 transition"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {isEmpty && (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-calendar-times text-3xl mb-3" aria-hidden="true" />
              <p className="font-medium text-gray-500">No tienes citas agendadas</p>
              <p className="text-sm mt-1">Selecciona una fecha para agregar una nueva cita</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

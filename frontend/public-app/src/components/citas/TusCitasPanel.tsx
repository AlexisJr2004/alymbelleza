import { Link } from 'react-router-dom';
import type { Appointment } from '../../types/models';
import { formatoFechaLarga } from '../../lib/format';
import StoreIcon from '../home/StoreIcon';

interface TusCitasPanelProps {
  appointments: Appointment[] | undefined;
  isLoading: boolean;
  isError: boolean;
  loggedIn: boolean;
  busy: boolean;
  onRetry: () => void;
  onMarkRealizada: (id: string) => void;
  onCancelar: (id: string) => void;
  onEliminar: (id: string) => void;
}
const STATUS_LABELS = { pendiente: 'Pendiente', realizada: 'Realizada', cancelada: 'Cancelada' };
export default function TusCitasPanel({ appointments, isLoading, isError, loggedIn, busy, onRetry, onMarkRealizada, onCancelar, onEliminar }: TusCitasPanelProps) {
  return <section className="bb-commerce-panel" aria-labelledby="appointments-heading">
    <header className="bb-panel-heading"><h2 id="appointments-heading">Tus citas</h2><span>{appointments?.length ?? 0} registradas</span></header>
    {!loggedIn ? <div className="bb-commerce-empty"><StoreIcon name="user" /><h3>Tu momento empieza aquí</h3><p>Inicia sesión para agendar una cita y consultar tus reservas.</p><Link className="bb-button" to="/login">Iniciar sesión<StoreIcon name="arrow" /></Link></div>
      : isLoading ? <div className="bb-commerce-empty" role="status"><p>Cargando citas...</p></div>
      : isError ? <div className="bb-commerce-empty" role="alert"><p>No pudimos cargar tus citas.</p><button className="bb-button bb-button-outline" type="button" onClick={onRetry}>Reintentar</button></div>
      : !appointments?.length ? <div className="bb-commerce-empty"><StoreIcon name="calendar" /><h3>Un momento solo para ti</h3><p>No tienes citas agendadas. Selecciona una fecha en el calendario para reservar tu próxima visita.</p></div>
      : <ul className="bb-appointment-list" aria-live="polite" aria-busy={busy}>
        {appointments.map(app => {
          const date = new Date(app.date);
          const status = app.status || 'pendiente';
          const dateLabel = formatoFechaLarga(date);
          return <li key={app._id} className="bb-appointment">
            <div className="bb-date-badge" aria-hidden="true"><strong>{date.getDate()}</strong><span>{date.toLocaleString('es-ES', { month: 'short' })}</span></div>
            <div><p className="bb-appointment-date">{dateLabel}</p><span className={`bb-appointment-status bb-status-${status}`}>{STATUS_LABELS[status]}</span></div>
            <div className="bb-appointment-actions">
              {status === 'pendiente' && <><button type="button" disabled={busy} onClick={() => onMarkRealizada(app._id)}>Realizada</button><button type="button" disabled={busy} onClick={() => onCancelar(app._id)}>Cancelar</button></>}
              <button type="button" disabled={busy} aria-label={`Eliminar cita del ${dateLabel}`} onClick={() => onEliminar(app._id)}><StoreIcon name="trash" /></button>
            </div>
          </li>;
        })}
      </ul>}
  </section>;
}

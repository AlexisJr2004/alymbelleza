import StoreIcon from '../home/StoreIcon';

interface CalendarioProps {
  currentDate: Date;
  selectedDate: Date | null;
  busy?: boolean;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}
const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
function isSameDate(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}
export default function Calendario({ currentDate, selectedDate, busy, onDateClick, onPrevMonth, onNextMonth, onToday }: CalendarioProps) {
  const today = new Date();
  const monthYearLabel = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const cells: Array<Date | null> = Array(new Date(year, month, 1).getDay()).fill(null);
  for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) cells.push(new Date(year, month, day));
  return <aside className="bb-commerce-panel bb-calendar" aria-labelledby="calendar-heading">
    <header><h2 id="calendar-heading"><StoreIcon name="calendar" />Elige tu día</h2></header>
    <div className="bb-calendar-navigation">
      <button type="button" onClick={onPrevMonth} aria-label="Mes anterior"><StoreIcon name="chevron" /></button>
      <span aria-live="polite">{monthYearLabel}</span>
      <button type="button" onClick={onNextMonth} aria-label="Mes siguiente"><StoreIcon name="chevron" /></button>
    </div>
    <div className="bb-calendar-days bb-calendar-weekdays" aria-hidden="true">{WEEKDAY_LABELS.map((label, i) => <span key={i}>{label}</span>)}</div>
    <div className="bb-calendar-days" aria-label="Fechas del mes" aria-busy={busy}>
      {cells.map((date, i) => date ? <button
        key={i} type="button" disabled={busy} onClick={() => onDateClick(date)}
        aria-label={date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        aria-pressed={!!selectedDate && isSameDate(date, selectedDate)}
        aria-current={isSameDate(date, today) ? 'date' : undefined}
        className={date.getDay() === 0 || date.getDay() === 6 ? 'is-weekend' : undefined}
      >{date.getDate()}</button> : <span key={i} />)}
    </div>
    <div className="bb-calendar-footer"><span>{busy ? 'Agendando tu cita...' : 'Selecciona una fecha para agendar'}</span><button className="bb-button bb-button-outline" type="button" onClick={onToday} aria-label="Volver al día actual">Hoy</button></div>
    <p className="bb-commerce-note"><StoreIcon name="headset" />Al elegir el día, podrás coordinar los detalles de tu cita por WhatsApp.</p>
  </aside>;
}

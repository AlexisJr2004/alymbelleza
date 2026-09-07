interface CalendarioProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function isSameDate(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Calendario mensual — puerto de generateCalendar()/createDateCell() de
// citas.html. Componente controlado y presentacional: currentDate/selectedDate
// y toda la navegación viven en CitasPage (que también decide qué hacer con un
// click de día: gate de sesión, alta de la cita, WhatsApp), así este widget se
// puede reutilizar sin arrastrar esa lógica.
export default function Calendario({ currentDate, selectedDate, onDateClick, onPrevMonth, onNextMonth, onToday }: CalendarioProps) {
  const today = new Date();
  const monthYearLabel = currentDate
    .toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ day: number; date: Date } | null> = [];
  for (let i = 0; i < startingDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push({ day, date: new Date(year, month, day) });

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <section aria-labelledby="calendar-heading" className="flex flex-col bg-white rounded-2xl border border-gray-200 p-5">
        <header className="flex items-center mb-5">
          <h3 id="calendar-heading" className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-calendar-alt text-purple-500" />
            <span>Calendario</span>
          </h3>
        </header>
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Mes anterior"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 id="monthYear" className="text-sm font-semibold text-gray-900 tracking-wide capitalize" aria-live="polite">
            {monthYearLabel}
          </h2>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            aria-label="Mes siguiente"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2" role="rowgroup">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={`${label}-${i}`} className="text-center text-gray-400 font-medium py-1 text-[10px] uppercase tracking-wider">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1" role="grid">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} className="h-9" />;
            const { day, date } = cell;
            let stateClasses = '';
            if (selectedDate && isSameDate(date, selectedDate)) {
              stateClasses = 'bg-purple-600 text-white font-medium';
            } else if (isSameDate(date, today)) {
              stateClasses = 'border border-purple-300 text-purple-700 font-medium';
            } else if (isWeekend(date)) {
              stateClasses = 'text-gray-400';
            }
            return (
              <div
                key={day}
                role="gridcell"
                onClick={() => onDateClick(date)}
                className={`h-9 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-xs ${stateClasses}`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-center">
          <button
            type="button"
            onClick={onToday}
            className="px-4 py-1.5 text-purple-700 font-medium rounded-full hover:bg-purple-50 transition-colors duration-200 border border-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
            aria-label="Volver al día actual"
          >
            Hoy
          </button>
        </div>
      </section>
    </aside>
  );
}

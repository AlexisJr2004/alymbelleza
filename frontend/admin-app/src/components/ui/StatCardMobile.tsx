import ProgressRing from './ProgressRing';

interface StatCardMobileProps {
  icon: React.ReactNode;
  percent: number;
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

// Tarjeta de estadística con anillo de progreso para la vista móvil de las
// páginas del admin-app — colores y proporciones copiados literalmente de
// surveys-app.html (.stat-card/.icon-c/.ring/.stat-label/.stat-value), que el
// usuario compartió como el archivo fuente real de la plantilla de
// referencia (ver feedback-match-reference-design-literally). El anillo
// representa, cuando existe, la fracción de esta métrica sobre el total de
// su propia fila de KPIs — cuando la métrica ES el total (o es un valor
// monetario sin una fracción natural dentro de esa misma fila), el llamador
// pasa percent=100. `highlighted` replica la 2.ª tarjeta rellena de lilac de
// la plantilla (las otras 3 quedan blancas).
export default function StatCardMobile({ icon, percent, label, value, highlighted }: StatCardMobileProps) {
  return (
    <div
      className={`flex h-[155px] flex-col justify-between rounded-[22px] p-[13px] shadow-sm ${
        highlighted ? 'bg-lilac' : 'border border-black/5 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-[37px] w-[37px] place-items-center rounded-full text-ink ${highlighted ? 'bg-white/55' : 'bg-mist'}`}>
          {icon}
        </span>
        <div className="relative grid h-10 w-10 place-items-center">
          <ProgressRing
            percent={percent}
            size={40}
            strokeWidth={3}
            color={highlighted ? '#1b1b1f' : '#8b78ee'}
            trackColor={highlighted ? 'rgba(255,255,255,0.5)' : '#ececf2'}
          />
          <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-ink">{percent}%</span>
        </div>
      </div>
      <div className="pl-[2px]">
        <p className={`text-[13.5px] ${highlighted ? 'text-[#3d3a4d]' : 'text-[#55555d]'}`}>{label}</p>
        <p className="mt-1 truncate text-[22px] font-bold leading-7 tracking-[-0.01em] text-ink">{value}</p>
      </div>
    </div>
  );
}

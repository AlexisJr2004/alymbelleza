import ProgressRing from './ProgressRing';

// Mismo morado/lavanda y la misma lógica "una tarjeta resaltada de cada 4"
// que la plantilla de referencia que compartió el usuario — a pedido
// explícito de copiar colores y distribución literalmente, no adaptarlos al
// ink/sky/coral del resto del admin-app (ver feedback-match-reference-design-literally).
const ACCENT = '#8B7FE0';
const ACCENT_FILL = '#C7BBF5';

interface StatCardMobileProps {
  icon: React.ReactNode;
  percent: number;
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

// Tarjeta de estadística con anillo de progreso para la vista móvil de las
// páginas del admin-app. El anillo representa, cuando existe, la fracción de
// esta métrica sobre el total de su propia fila de KPIs — cuando la métrica
// ES el total (o es un valor monetario sin una fracción natural dentro de
// esa misma fila), el llamador pasa percent=100. `highlighted` replica la
// 2.ª tarjeta rellena de morado de la plantilla (las otras 3 quedan blancas).
export default function StatCardMobile({ icon, percent, label, value, highlighted }: StatCardMobileProps) {
  return (
    <div
      className={`rounded-[28px] p-4 ${highlighted ? 'shadow-sm' : 'border border-black/5 bg-white shadow-sm'}`}
      style={highlighted ? { backgroundColor: ACCENT_FILL } : undefined}
    >
      <div className="flex items-center justify-between">
        <div
          className="grid h-9 w-9 place-items-center rounded-xl text-ink"
          style={{ backgroundColor: highlighted ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.05)' }}
        >
          {icon}
        </div>
        <div className="relative h-10 w-10 shrink-0">
          <ProgressRing
            percent={percent}
            size={40}
            strokeWidth={4}
            color={highlighted ? '#2c2440' : ACCENT}
            trackColor={highlighted ? 'rgba(0,0,0,0.12)' : 'rgba(139,127,224,0.15)'}
          />
          <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-ink">{percent}%</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink/60">{label}</p>
      <p className="text-lg font-bold text-ink leading-tight">{value}</p>
    </div>
  );
}

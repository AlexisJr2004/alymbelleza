import ProgressRing from './ProgressRing';

interface StatCardMobileProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  ringColor: string;
  percent: number;
  label: string;
  value: React.ReactNode;
}

// Tarjeta de estadística con anillo de progreso para la vista móvil de las
// páginas del admin-app (antes vivía solo dentro de ResumenPage.tsx como
// ResumenStatCardMobile; se comparte acá porque el mismo patrón se repite en
// cada página con KpiRow). El anillo representa, cuando existe, la fracción
// de esta métrica sobre el total de su propia fila de KPIs — cuando la
// métrica ES el total (o es un valor monetario sin una fracción natural
// dentro de esa misma fila), el llamador pasa percent=100.
export default function StatCardMobile({ icon, iconBg, iconColor, ringColor, percent, label, value }: StatCardMobileProps) {
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${iconBg} ${iconColor}`}>{icon}</div>
        <div className="relative h-10 w-10 shrink-0">
          <ProgressRing percent={percent} size={40} strokeWidth={4} color={ringColor} />
          <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-ink">{percent}%</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-ink leading-tight">{value}</p>
    </div>
  );
}

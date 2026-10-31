interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  note: string;
  valueClassName?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export function KpiCard({ label, value, note, valueClassName = 'text-ink', iconBg, iconColor, icon }: KpiCardProps) {
  return (
    <div className="admin-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
          <p className={`mt-1 text-2xl font-semibold tracking-tight tabular-nums ${valueClassName}`}>{value}</p>
          <p className="mt-1 text-xs text-muted">{note}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Oculto bajo lg: — cada página que usa KpiRow trae su propia grilla
// lg:hidden de StatCardMobile (ícono + anillo de progreso) como reemplazo en
// móvil, igual que se hizo primero en ResumenPage.tsx.
export function KpiRow({ children }: { children: React.ReactNode }) {
  return <div className="hidden lg:grid lg:grid-cols-4 gap-3 mb-4">{children}</div>;
}

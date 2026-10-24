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
    <div className="glass min-w-0 p-5 xl:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className={`mt-3 break-words text-3xl font-semibold tracking-tight tabular-nums ${valueClassName}`}>{value}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>
        </div>
        <div className={`w-11 h-11 rounded-2xl border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(40,54,89,0.05)] ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
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
  return <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-6">{children}</div>;
}

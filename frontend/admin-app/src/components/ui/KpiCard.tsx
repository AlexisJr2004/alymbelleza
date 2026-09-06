interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  note: string;
  valueClassName?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export function KpiCard({ label, value, note, valueClassName = 'text-gray-900', iconBg, iconColor, icon }: KpiCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</p>
          <p className="mt-1 text-xs text-gray-400">{note}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function KpiRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">{children}</div>;
}

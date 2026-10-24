import ProgressRing from './ProgressRing';

interface StatCardMobileProps {
  icon: React.ReactNode;
  percent: number;
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

// El anillo representa la fracción de la métrica dentro de su fila. Para
// totales o importes sin una fracción natural, el llamador pasa percent=100.
export default function StatCardMobile({ icon, percent, label, value, highlighted }: StatCardMobileProps) {
  return (
    <div
      className={`glass flex min-h-[155px] min-w-0 flex-col justify-between gap-5 p-4 ${
        highlighted ? 'bg-lilac/55' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="glass-inset grid h-10 w-10 place-items-center rounded-2xl text-ink">
          {icon}
        </span>
        <div className="relative grid h-10 w-10 place-items-center">
          <ProgressRing
            percent={percent}
            size={40}
            strokeWidth={3}
            color={highlighted ? '#293954' : '#8271c6'}
            trackColor="rgba(111,125,156,0.14)"
          />
          <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-ink">{percent}%</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium leading-relaxed text-muted">{label}</p>
        <p className="mt-1 break-words text-[22px] font-semibold leading-7 tracking-tight tabular-nums text-ink">{value}</p>
      </div>
    </div>
  );
}

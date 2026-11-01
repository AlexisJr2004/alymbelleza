import ProgressRing from './ProgressRing';

interface StatCardMobileProps {
  icon: React.ReactNode;
  percent: number;
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

// Indicadores compactos con los acentos rosa de la tienda.
export default function StatCardMobile({ icon, percent, label, value, highlighted }: StatCardMobileProps) {
  return (
    <div
      className={`flex min-w-0 min-h-[98px] flex-col justify-between rounded-2xl p-3 border border-rose-100 ${
        highlighted ? 'bg-lilac' : 'border border-black/5 bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-8 w-8 place-items-center rounded-full text-ink ${highlighted ? 'bg-white/55' : 'bg-mist'}`}>
          {icon}
        </span>
        <div className="relative grid h-9 w-9 place-items-center">
          <ProgressRing
            percent={percent}
            size={36}
            strokeWidth={3}
            color={highlighted ? '#a83a65' : '#c33060'}
            trackColor={highlighted ? 'rgba(255,255,255,0.5)' : '#f5e3eb'}
          />
          <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-ink">{percent}%</span>
        </div>
      </div>
      <div className="pl-[2px]">
        <p className={`text-xs ${highlighted ? 'text-[#3d3a4d]' : 'text-[#55555d]'}`}>{label}</p>
        <p className="mt-1 truncate text-lg font-bold leading-6 tracking-[-0.01em] text-ink">{value}</p>
      </div>
    </div>
  );
}

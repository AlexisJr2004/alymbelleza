export interface AnnularDonutGroup {
  label: string;
  count: number;
  color: string;
}

interface AnnularDonutProps {
  groups: AnnularDonutGroup[];
  centerPct: number;
  centerCaption: string;
  size?: number;
  thickness?: number;
}

// El único donut SVG real (stroke-dasharray) de todo el panel — reservado para
// Resumen. Puerto directo del cálculo de arcos de renderizarResumen().
export default function AnnularDonut({ groups, centerPct, centerCaption, size = 160, thickness = 26 }: AnnularDonutProps) {
  const total = groups.reduce((sum, g) => sum + g.count, 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let acumulado = 0;

  return (
    <div className="relative mx-auto sm:mx-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
        {groups.map((g) => {
          if (g.count <= 0) return null;
          const dash = (g.count / total) * circ;
          const offset = -acumulado;
          acumulado += dash;
          return (
            <circle
              key={g.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={g.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900">{centerPct}%</span>
        <span className="text-xs text-gray-500">{centerCaption}</span>
      </div>
    </div>
  );
}

import { useId, useState } from 'react';
import type { MonthlyBucket } from '../../lib/monthly';

interface TrendChartProps {
  data: MonthlyBucket[];
  formatValue: (v: number) => string;
  color?: string;
}

const W = 600;
const H = 170;
const PXL = 40;
const PXR = 10;
const PY = 18;

// Gráfico de línea en SVG con tooltip al pasar el mouse. Puerto directo de
// renderizarGraficoBarras(), reemplazando los listeners de DOM a mano por
// estado de React para el índice sobre el que está el mouse.
export default function TrendChart({ data, formatValue, color = '#9333ea' }: TrendChartProps) {
  const gradId = useId();
  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) {
    return <div className="flex items-center justify-center h-full text-gray-400 text-sm">Sin datos</div>;
  }

  const max = Math.max(...data.map((m) => m.total), 1);
  const pts = data.map((m, i) => ({
    x: PXL + (i / Math.max(data.length - 1, 1)) * (W - PXL - PXR),
    y: PY + (1 - m.total / max) * (H - PY * 2),
    label: m.label,
    valor: m.total,
  }));
  const linea = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${linea} L${pts[pts.length - 1].x.toFixed(1)},${H - PY} L${pts[0].x.toFixed(1)},${H - PY} Z`;

  const lineasGuia = [0, 0.5, 1].map((f) => {
    const y = PY + (1 - f) * (H - PY * 2);
    return { y, texto: formatValue(Math.round(max * f)) };
  });

  const cadaEtiqueta = Math.max(1, Math.ceil(pts.length / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {lineasGuia.map((g, i) => (
        <g key={i}>
          <line x1={PXL} y1={g.y} x2={W - PXR} y2={g.y} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3,3" />
          <text x={PXL - 6} y={g.y + 3} textAnchor="end" fontSize={9} fill="#94a3b8">
            {g.texto}
          </text>
        </g>
      ))}

      <path d={area} fill={`url(#${gradId})`} />
      <path d={linea} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {hover !== null && (
        <line x1={pts[hover].x} y1={PY} x2={pts[hover].x} y2={H - PY} stroke={color} strokeWidth={1} strokeDasharray="2,2" opacity={0.5} />
      )}

      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hover === i ? 5 : 3.5} fill={color} stroke="#fff" strokeWidth={1.5} />
      ))}

      {pts.map(
        (p, i) =>
          (i % cadaEtiqueta === 0 || i === pts.length - 1) && (
            <text key={i} x={p.x} y={H - 3} textAnchor="middle" fontSize={9} fill="#94a3b8" className="capitalize">
              {p.label}
            </text>
          )
      )}

      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={12}
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        />
      ))}

      {pts.map((p, i) => {
        if (hover !== i) return null;
        const tipW = 66;
        const tipX = Math.min(Math.max(p.x - tipW / 2, 2), W - tipW - 2);
        const arriba = p.y - 34 >= 0;
        const tipY = arriba ? p.y - 34 : p.y + 12;
        return (
          <g key={i} style={{ pointerEvents: 'none' }}>
            <rect x={tipX} y={tipY} width={tipW} height={26} rx={6} fill="#1f2937" opacity={0.95} />
            <text x={tipX + tipW / 2} y={tipY + 11} textAnchor="middle" fontSize={8.5} fill="#cbd5e1" className="capitalize">
              {p.label}
            </text>
            <text x={tipX + tipW / 2} y={tipY + 21} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
              {formatValue(p.valor)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

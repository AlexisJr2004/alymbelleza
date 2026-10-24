import { useId } from 'react';
import type { MonthlyBucket } from '../../lib/monthly';

interface AreaTrendCardMobileProps {
  data: MonthlyBucket[];
  formatValue: (v: number) => string;
  title: string;
  description: string;
  totalLabel: string;
}

const W = 600;
const H = 150;
const PXL = 8;
const PXR = 8;
const PY = 18;
const ACCENT = '#8b78ee';

// Curva suave entre puntos (control en el punto medio horizontal de cada
// tramo) — técnica simple de suavizado, en vez de los segmentos rectos de
// TrendChart.tsx (que sigue intacto para escritorio). Evita traer una
// librería de charts solo para esto.
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = ((p0.x + p1.x) / 2).toFixed(1);
    d += ` C${midX},${p0.y.toFixed(1)} ${midX},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }
  return d;
}

// Tarjeta de gráfico de tendencia para la vista móvil del Resumen —
// curva suave con relleno degradado y una burbuja fija sobre el mes actual
// (en vez de un tooltip al pasar el mouse, que no aplica en táctil), más una
// tarjeta de total del mes con insignia de cambio %. Proporciones/colores
// inspirados en la plantilla de referencia que compartió el usuario (acento
// violet/lilac, igual que StatCardMobile/BottomMobileNav), con datos reales
// -- nada de "Exportar PDF/Excel" ni desglose por canal (Website/Instagram/
// etc.) de la referencia: no hay una función de exportación real ni una
// dimensión de canal en los datos de Bella Beauty, y este proyecto evita UI
// decorativa sin función real detrás.
export default function AreaTrendCardMobile({ data, formatValue, title, description, totalLabel }: AreaTrendCardMobileProps) {
  const gradId = useId();

  const actual = data[5]?.total ?? 0;
  const anterior = data[4]?.total ?? 0;
  const cambioPct = anterior > 0 ? Math.round(((actual - anterior) / anterior) * 100) : null;

  if (!data.length) {
    return (
      <div className="rounded-[22px] border border-black/5 bg-white p-[13px] shadow-sm">
        <p className="text-sm text-dim">Sin datos todavía.</p>
      </div>
    );
  }

  const max = Math.max(...data.map((m) => m.total), 1);
  const pts = data.map((m, i) => ({
    x: PXL + (i / Math.max(data.length - 1, 1)) * (W - PXL - PXR),
    y: PY + (1 - m.total / max) * (H - PY * 2),
    label: m.label,
    valor: m.total,
  }));
  const linea = smoothPath(pts);
  const area = `${linea} L${pts[pts.length - 1].x.toFixed(1)},${H - PY} L${pts[0].x.toFixed(1)},${H - PY} Z`;

  const actualPt = pts[5];
  const tipW = 72;
  const tipX = Math.min(Math.max(actualPt.x - tipW / 2, 2), W - tipW - 2);
  const tipArriba = actualPt.y - 38 >= 0;
  const tipY = tipArriba ? actualPt.y - 38 : actualPt.y + 18;

  return (
    <div className="rounded-[22px] border border-black/5 bg-white p-[13px] shadow-sm">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-0.5 text-xs text-dim">{description}</p>

      <div className="mt-3 h-[120px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>

          <path d={area} fill={`url(#${gradId})`} />
          <path d={linea} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === 5 ? 4.5 : 3}
              fill={i === 5 ? ACCENT : '#fff'}
              stroke={ACCENT}
              strokeWidth={1.5}
            />
          ))}

          {pts.map(
            (p, i) =>
              (i === 0 || i === pts.length - 1 || i === 2) && (
                <text key={i} x={p.x} y={H - 2} textAnchor="middle" fontSize={10} fill="#9a9aa2" className="capitalize">
                  {p.label}
                </text>
              )
          )}

          <g style={{ pointerEvents: 'none' }}>
            <rect x={tipX} y={tipY} width={tipW} height={26} rx={13} fill={ACCENT} />
            <text x={tipX + tipW / 2} y={tipY + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
              {formatValue(actualPt.valor)}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-2 flex items-end justify-between border-t border-black/5 pt-3">
        <div>
          <p className="text-xs text-dim">{totalLabel}</p>
          <p className="mt-0.5 text-xl font-bold leading-tight text-ink">{formatValue(actual)}</p>
        </div>
        {cambioPct !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              cambioPct >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {cambioPct >= 0 ? '↗' : '↘'} {Math.abs(cambioPct)}%
          </span>
        )}
      </div>
    </div>
  );
}

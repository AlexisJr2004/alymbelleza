export interface DonutGroup {
  label: string;
  count: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  groups: DonutGroup[];
  centerCaption: string;
  emptyMessage?: string;
}

// Donut conic-gradient (sin librería de gráficos), igual técnica que el panel viejo:
// un <div> circular con background conic-gradient + un círculo blanco absoluto más
// chico encima ("el agujero") + una leyenda con puntos de color. El porcentaje del
// centro siempre corresponde al primer grupo de la lista, igual que en el original.
export default function DonutChart({ title, groups, centerCaption, emptyMessage = 'Sin datos todavía.' }: DonutChartProps) {
  const total = groups.reduce((sum, g) => sum + g.count, 0);

  let background = '#e5e7eb';
  let centerPct = 0;
  if (total > 0) {
    let acumulado = 0;
    const stops = groups
      .map((g) => {
        const inicio = acumulado;
        acumulado += (g.count / total) * 100;
        return `${g.color} ${inicio}% ${acumulado}%`;
      })
      .join(', ');
    background = `conic-gradient(${stops})`;
    centerPct = Math.round((groups[0].count / total) * 100);
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">{title}</h3>
      <div className="flex justify-center">
        <div className="relative">
          <div className="relative w-32 h-32 rounded-full" style={{ background }}>
            <div className="absolute inset-[13px] bg-white rounded-full" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-900">{total > 0 ? `${centerPct}%` : '0%'}</span>
            <span className="text-[10px] text-gray-500">{centerCaption}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {total === 0 ? (
          <p className="text-sm text-gray-400 text-center">{emptyMessage}</p>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
              <span className="text-gray-600">{g.label}</span>
              <span className="ml-auto font-medium text-gray-800">{g.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

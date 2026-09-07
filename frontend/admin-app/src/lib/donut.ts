import type { DonutGroup } from '../components/ui/DonutChart';

export function computeConicGradient(groups: DonutGroup[]): { background: string; total: number } {
  const total = groups.reduce((sum, g) => sum + g.count, 0);
  if (total === 0) return { background: '#e5e7eb', total: 0 };

  let acumulado = 0;
  const stops = groups
    .map((g) => {
      const inicio = acumulado;
      acumulado += (g.count / total) * 100;
      return `${g.color} ${inicio}% ${acumulado}%`;
    })
    .join(', ');
  return { background: `conic-gradient(${stops})`, total };
}

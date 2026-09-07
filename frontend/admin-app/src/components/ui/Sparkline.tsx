// Mini gráfico de línea del hero de ingresos. Puerto directo de renderizarSparkline().
export default function Sparkline({ data }: { data: { total: number }[] }) {
  const valores = data.map((m) => m.total);
  const max = Math.max(...valores, 1);
  const min = Math.min(...valores, 0);
  const rango = max - min || 1;
  const puntos = valores
    .map((v, i) => {
      const x = (i / (valores.length - 1)) * 116 + 2;
      const y = 36 - ((v - min) / rango) * 32;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 120 40" className="w-28 h-12 shrink-0">
      <polyline points={`2,38 ${puntos} 118,38`} fill="#a855f7" fillOpacity={0.12} stroke="none" />
      <polyline points={puntos} fill="none" stroke="#9333ea" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

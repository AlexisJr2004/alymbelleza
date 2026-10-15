interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

// Anillo de progreso circular (stroke-dasharray + linecap redondeado) para
// las tarjetas de estadística del Resumen en móvil — inspirado en la
// plantilla de referencia que compartió el usuario. Un solo valor (no multi-
// segmento como AnnularDonut/computeConicGradient), así que se resuelve con
// un <circle> simple en vez de reusar la lógica de conic-gradient de los
// donuts existentes, que no da puntas redondeadas.
export default function ProgressRing({
  percent,
  size = 40,
  strokeWidth = 4,
  color = '#16181d',
  trackColor = 'rgba(22,24,29,0.1)',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

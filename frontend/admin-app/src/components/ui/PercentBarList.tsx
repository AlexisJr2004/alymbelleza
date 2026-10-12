export interface PercentBarRow {
  label: string;
  value: number;
  pct: number;
  colorClass: string;
  borderClass: string;
}

// Variante de "Distribución" sin donut — usada solo en Usuarios, que muestra
// conteo + porcentaje por fila en vez de un anillo conic-gradient.
export default function PercentBarList({ title, rows }: { title: string; rows: PercentBarRow[] }) {
  return (
    <div className="glass p-5 mt-6">
      <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">{title}</h3>
      <div className="space-y-3">
        {rows.map((f) => (
          <div key={f.label} className={`rounded-2xl border bg-white/40 ${f.borderClass} px-3 py-2.5 flex items-center justify-between`}>
            <div>
              <p className="text-xs text-muted">{f.label}</p>
              <p className={`text-base font-semibold ${f.colorClass} mt-0.5`}>{f.value}</p>
            </div>
            <span className={`text-sm font-medium ${f.colorClass}`}>{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

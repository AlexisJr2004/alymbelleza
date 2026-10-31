export interface MonthlyBucket {
  year: number;
  month: number;
  label: string;
  total: number;
}

// Agrupa el mes de referencia y los cinco meses anteriores.
export function construirSerieMensual<T>(
  items: T[],
  fechaGetter: (item: T) => string | Date | undefined,
  valorGetter: (item: T) => number,
  referenceDate: Date = new Date()
): MonthlyBucket[] {
  const hoy = referenceDate;
  const meses: MonthlyBucket[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('es-ES', { month: 'short' }), total: 0 });
  }
  items.forEach((item) => {
    const raw = fechaGetter(item);
    if (!raw) return;
    const f = new Date(raw);
    const mes = meses.find((m) => m.year === f.getFullYear() && m.month === f.getMonth());
    if (mes) mes.total += valorGetter(item);
  });
  return meses;
}

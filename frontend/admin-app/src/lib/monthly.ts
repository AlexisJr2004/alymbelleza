export interface MonthlyBucket {
  year: number;
  month: number;
  label: string;
  total: number;
}

// Agrupa una lista en 6 cubetas mensuales (mes actual y los 5 anteriores).
// Puerto directo de construirSerieMensual() del panel viejo.
export function construirSerieMensual<T>(
  items: T[],
  fechaGetter: (item: T) => string | Date | undefined,
  valorGetter: (item: T) => number
): MonthlyBucket[] {
  const hoy = new Date();
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

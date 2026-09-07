import { useState } from 'react';

// Puerto de admin-app/src/hooks/useSwitchFilter.ts (duplicado a propósito: las
// dos apps no comparten código). Mismo patrón de switches independientes:
// ninguno marcado = sin filtro (se muestra todo), uno o más marcados = coincide
// con cualquiera de los marcados (OR inclusivo).
export function useSwitchFilter() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (value: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

  const isChecked = (value: string) => selected.has(value);
  const clear = () => setSelected(new Set());

  return { selected, toggle, isChecked, clear };
}

import { useMemo, useState } from 'react';
import type { Product } from '../types/models';
import { useSwitchFilter } from './useSwitchFilter';

// Puerto exacto de filtrarYRenderizar() en productos.html (líneas ~1238-1265),
// como estado derivado en vez de reconstrucción manual del DOM. Categoría y
// tipo usan useSwitchFilter (Set-based, OR inclusivo); un producto sin `type`
// cuenta como "otro", igual que el original.
export function useProductFilters(products: Product[], initial: { search?: string; category?: string; offers?: boolean } = {}) {
  const [search, setSearch] = useState(initial.search ?? '');
  const categoria = useSwitchFilter(initial.category ? [initial.category] : []);
  const tipo = useSwitchFilter();
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloDestacados, setSoloDestacados] = useState(false);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [soloOfertas, setSoloOfertas] = useState(initial.offers ?? false);

  const filtrados = useMemo(() => {
    const texto = search.trim().toLowerCase();
    let lista = products.filter((p) => p.name.toLowerCase().includes(texto));

    if (categoria.selected.size > 0) {
      lista = lista.filter((p) => categoria.selected.has(p.category));
    }
    if (tipo.selected.size > 0) {
      lista = lista.filter((p) => tipo.selected.has(p.type || 'otro'));
    }
    if (soloDestacados) {
      lista = lista.filter((p) => p.featured);
    }
    if (soloDisponibles) {
      lista = lista.filter((p) => p.availability);
    }
    if (soloOfertas) {
      lista = lista.filter((p) => p.originalPrice != null && p.originalPrice > p.price);
    }

    const min = precioMin === '' ? null : Number(precioMin);
    const max = precioMax === '' ? null : Number(precioMax);
    if (min !== null && !Number.isNaN(min)) {
      lista = lista.filter((p) => p.price >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      lista = lista.filter((p) => p.price <= max);
    }

    return lista;
  }, [products, search, categoria.selected, tipo.selected, soloDestacados, soloDisponibles, soloOfertas, precioMin, precioMax]);

  const clear = () => {
    setSearch('');
    categoria.clear();
    tipo.clear();
    setPrecioMin('');
    setPrecioMax('');
    setSoloDestacados(false);
    setSoloDisponibles(false);
    setSoloOfertas(false);
  };

  return {
    search,
    setSearch,
    categoria,
    tipo,
    precioMin,
    setPrecioMin,
    precioMax,
    setPrecioMax,
    soloDestacados,
    setSoloDestacados,
    soloDisponibles,
    setSoloDisponibles,
    soloOfertas,
    setSoloOfertas,
    filtrados,
    clear,
  };
}

export type ProductFilters = ReturnType<typeof useProductFilters>;

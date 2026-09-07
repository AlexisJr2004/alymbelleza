import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../../types/models';
import ProductQuickViewModal from './ProductQuickViewModal';

interface ProductQuickViewContextValue {
  openQuickView: (product: Product) => void;
}

const ProductQuickViewContext = createContext<ProductQuickViewContextValue | null>(null);

// Envuelve cualquier página que use <ProductCard> (Home, y más adelante
// Productos) para compartir un único modal de vista rápida entre todas las
// tarjetas, en vez de que cada una gestione su propio estado de modal.
export function ProductQuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <ProductQuickViewContext.Provider value={{ openQuickView: setProduct }}>
      {children}
      <ProductQuickViewModal product={product} onClose={() => setProduct(null)} />
    </ProductQuickViewContext.Provider>
  );
}

export function useProductQuickView(): ProductQuickViewContextValue {
  const ctx = useContext(ProductQuickViewContext);
  if (!ctx) throw new Error('useProductQuickView debe usarse dentro de <ProductQuickViewProvider>');
  return ctx;
}

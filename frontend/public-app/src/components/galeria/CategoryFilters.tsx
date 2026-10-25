import type { useSwitchFilter } from '../../hooks/useSwitchFilter';
import { GALLERY_CATEGORIES } from '../../lib/galleryCategories';
import StoreIcon from '../home/StoreIcon';

export default function CategoryFilters({ filter }: { filter: ReturnType<typeof useSwitchFilter> }) {
  return <div className="bb-gallery-filters" role="group" aria-label="Filtrar galería por categoría">
    <button type="button" aria-pressed={filter.selected.size === 0} onClick={filter.clear}>Toda la galería</button>
    {GALLERY_CATEGORIES.map(category => <button key={category.value} type="button" aria-pressed={filter.isChecked(category.value)} onClick={() => filter.toggle(category.value, !filter.isChecked(category.value))}>{category.label}</button>)}
    {filter.selected.size > 0 && <button type="button" className="bb-gallery-clear" onClick={filter.clear}><StoreIcon name="close" />Limpiar</button>}
  </div>;
}

export const GALLERY_CATEGORIES = [
  { value: 'tratamiento_capilar', label: 'Tratamientos capilares' },
  { value: 'tratamiento_facial', label: 'Tratamientos faciales' },
  { value: 'especialidades', label: 'Especialidades' },
  { value: 'local', label: 'Nuestro espacio' },
];

export function galleryCategoryLabel(category: string) {
  return GALLERY_CATEGORIES.find(item => item.value === category)?.label ?? 'Momentos Bella Beauty';
}

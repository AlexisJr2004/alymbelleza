import { useState } from 'react';
import Switch from '../ui/Switch';
import { CuponesIcon, DollarIcon, ListIcon, BeakerIcon, UploadIcon, XIcon, CheckIcon, ChevronDownIcon } from '../icons';
import type { Product } from '../../types/models';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  submitting: boolean;
}

const TIPOS = [
  { value: 'shampoo', label: 'Shampoo' },
  { value: 'acondicionador', label: 'Acondicionador' },
  { value: 'mascarilla', label: 'Mascarilla' },
  { value: 'crema', label: 'Crema' },
  { value: 'serum', label: 'Sérum' },
  { value: 'aceite', label: 'Aceite' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'otro', label: 'Otro' },
];

const inputClass =
  'w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all';
const plainInputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent';

// El componente se remonta con un `key` distinto cada vez que se abre el modal
// (ver ProductosPage), así que el estado local siempre arranca desde
// initialData sin necesitar lógica de reseteo por separado.
export default function ProductForm({ initialData, onSubmit, onCancel, submitting }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [price, setPrice] = useState(initialData ? String(initialData.price) : '');
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice != null ? String(initialData.originalPrice) : '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [type, setType] = useState(initialData?.type ?? 'otro');
  const [rating, setRating] = useState(initialData?.rating != null ? String(initialData.rating) : '');
  const [stock, setStock] = useState(initialData?.stock != null ? String(initialData.stock) : '');
  const [featured, setFeatured] = useState(!!initialData?.featured);
  const [disponible, setDisponible] = useState(initialData ? !!initialData.availability : true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', name);
    formData.set('price', price);
    if (originalPrice) formData.set('originalPrice', originalPrice);
    formData.set('description', description);
    formData.set('category', category);
    formData.set('type', type);
    formData.set('rating', rating);
    formData.set('stock', stock);
    formData.set('featured', String(featured));
    formData.set('availability', String(disponible));
    if (imageFile) formData.set('image', imageFile);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <div className="relative">
            <CuponesIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Camiseta Premium"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <div className="relative">
            <DollarIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Precio Anterior (opcional)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Precio anterior si está en oferta"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada del producto..."
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <div className="relative">
            <ListIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Seleccione categoría</option>
              <option value="capilar">Productos Capilares</option>
              <option value="facial">Productos Faciales</option>
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Tipo de producto</label>
          <div className="relative">
            <BeakerIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputClass} appearance-none`}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Calificación</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="0-5"
            className={plainInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Unidades disponibles (opcional)</label>
          <input
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Déjalo vacío para no controlar stock"
            className={plainInputClass}
          />
        </div>

        <div className="sm:col-span-2 pt-3 mt-1 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">Estado del producto</label>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <Switch checked={featured} onChange={setFeatured} label="Destacado" />
            <Switch
              checked={disponible}
              onChange={(v) => setDisponible(v)}
              label="Disponible"
            />
            <Switch
              checked={!disponible}
              onChange={(v) => setDisponible(!v)}
              label="Agotado"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
          <label
            htmlFor="imagen-producto"
            className="flex items-center gap-3 w-full px-3 py-2.5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <UploadIcon className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500">Click para subir o arrastra la imagen (PNG/JPG, máx. 5MB)</span>
            <input id="imagen-producto" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          {previewUrl && (
            <div>
              <img src={previewUrl} alt="Vista previa" className="h-20 rounded-lg border" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
        >
          <XIcon className="w-4 h-4 mr-1.5" /> Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-60"
        >
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}

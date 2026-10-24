import { useId, useState } from 'react';
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
  'glass-input w-full pl-10 pr-4 py-2.5 text-sm';
const plainInputClass =
  'glass-input w-full px-4 py-2.5 text-sm';

// El componente se remonta con un `key` distinto cada vez que se abre el modal
// (ver ProductosPage), así que el estado local siempre arranca desde
// initialData sin necesitar lógica de reseteo por separado.
export default function ProductForm({ initialData, onSubmit, onCancel, submitting }: ProductFormProps) {
  const formId = useId();
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
          <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-ink">Nombre del producto</label>
          <div className="relative">
            <CuponesIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              id={`${formId}-name`}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Shampoo hidratante"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-price`} className="block text-sm font-medium text-ink">Precio</label>
          <div className="relative">
            <DollarIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <input
              id={`${formId}-price`}
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
          <label htmlFor={`${formId}-original-price`} className="block text-sm font-medium text-ink">Precio anterior (opcional)</label>
          <input
            id={`${formId}-original-price`}
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
          <label htmlFor={`${formId}-description`} className="block text-sm font-medium text-ink">Descripción</label>
          <textarea
            id={`${formId}-description`}
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada del producto..."
            className="glass-input w-full min-h-24 px-4 py-3 text-sm rounded-2xl resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-category`} className="block text-sm font-medium text-ink">Categoría</label>
          <div className="relative">
            <ListIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <select
              id={`${formId}-category`}
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              className={`${inputClass} appearance-none pr-9`}
            >
              <option value="">Seleccione categoría</option>
              <option value="capilar">Productos Capilares</option>
              <option value="facial">Productos Faciales</option>
            </select>
            <ChevronDownIcon className="pointer-events-none w-3.5 h-3.5 absolute right-3.5 top-3.5 text-muted" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-type`} className="block text-sm font-medium text-ink">Tipo de producto</label>
          <div className="relative">
            <BeakerIcon className="pointer-events-none w-4 h-4 absolute left-3.5 top-3 text-muted" />
            <select id={`${formId}-type`} value={type} onChange={(e) => setType(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none w-3.5 h-3.5 absolute right-3.5 top-3.5 text-muted" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-rating`} className="block text-sm font-medium text-ink">Calificación</label>
          <input
            id={`${formId}-rating`}
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
          <label htmlFor={`${formId}-stock`} className="block text-sm font-medium text-ink">Unidades disponibles (opcional)</label>
          <input
            id={`${formId}-stock`}
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Déjalo vacío para no controlar stock"
            className={plainInputClass}
          />
        </div>

        <fieldset className="glass-inset sm:col-span-2 min-w-0 rounded-2xl p-4 mt-1">
          <legend className="px-1 text-sm font-medium text-ink">Estado del producto</legend>
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
        </fieldset>

        <div className="space-y-1.5 sm:col-span-2">
          <p className="block text-sm font-medium text-ink">Imagen del producto</p>
          <label
            htmlFor={`${formId}-image`}
            className="glass-inset relative flex items-center gap-3 w-full px-4 py-5 border-dashed rounded-2xl cursor-pointer hover:bg-white/70 transition-colors focus-within:ring-2 focus-within:ring-sky/50 focus-within:ring-offset-2"
          >
            <UploadIcon className="w-6 h-6 shrink-0 text-sky" />
            <span className="text-sm text-muted">Seleccionar imagen del producto</span>
            <input id={`${formId}-image`} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
          </label>
          {previewUrl && (
            <div>
              <img src={previewUrl} alt="Vista previa del producto" className="mt-3 h-24 rounded-2xl border border-white/90 shadow-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2.5 pt-5 mt-6 border-t border-slate-400/15">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="glass-button px-4 py-2.5 text-sm font-medium flex items-center"
        >
          <XIcon className="w-4 h-4 mr-1.5" /> Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="glass-button-primary px-5 py-2.5 text-sm font-medium flex items-center justify-center"
        >
          <CheckIcon className="w-4 h-4 mr-1.5" /> {submitting ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}

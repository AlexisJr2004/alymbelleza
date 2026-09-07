import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { notifyError } from '../../lib/sweetalert';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

// Copiado verbatim del orden/labels de <option> en galeria.html ~511-516
// (distinto del orden de los botones de filtro, ver CategoryFilters.tsx).
const CATEGORY_OPTIONS = [
  { value: '', label: 'Seleccionar categoría...' },
  { value: 'local', label: 'Local' },
  { value: 'especialidades', label: 'Especialidades' },
  { value: 'tratamiento_capilar', label: 'Tratamientos capilares' },
  { value: 'tratamiento_facial', label: 'Tratamientos faciales' },
];

type PreviewState = { type: 'image' | 'video'; src: string } | null;

// Puerto del modal "Subir Contenido a Galería" (galeria.html ~494-557 +
// script ~858-971). Se desmonta por completo cuando `open` es false en vez de
// animarse con las clases hidden/opacity-0 del original (mismo resultado
// visual final, sin depender de los helpers showModal/hideModal de main.js
// que no forman parte de esta migración).
export default function UploadModal({ open, onClose, onSubmit, isSubmitting }: UploadModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<PreviewState>(null);
  const [fileInfo, setFileInfo] = useState('');

  if (!open) return null;

  function handleClose() {
    onClose();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      notifyError('Archivo muy grande', `El archivo es muy grande. Máximo ${isVideo ? '50MB' : '10MB'}.`);
      e.target.value = '';
      setPreview(null);
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileInfo(`${file.name} (${sizeMB} MB)`);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview({ type: isVideo ? 'video' : 'image', src: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    onSubmit(new FormData(formRef.current));
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Subir Contenido a Galería</h3>
          <button type="button" onClick={handleClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 transition-colors">
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 space-y-5">
          <div>
            <label htmlFor="galleryCategory" className="block text-xs font-medium text-gray-500 mb-1">
              Categoría
            </label>
            <select
              id="galleryCategory"
              name="category"
              required
              defaultValue=""
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-sm transition"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="galleryFile" className="block text-xs font-medium text-gray-500 mb-1">
              Archivo
            </label>
            <input
              type="file"
              name="file"
              id="galleryFile"
              accept="image/*,video/*"
              required
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-sm transition file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-purple-100 file:text-purple-700 file:font-medium file:rounded-md hover:file:bg-purple-200"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Imágenes: JPG, PNG, GIF, WEBP (máx. 10MB)
              <br />
              Videos: MP4, MOV, AVI (máx. 50MB)
            </p>
          </div>

          {preview && (
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1">Vista previa</span>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                {preview.type === 'image' ? (
                  <img src={preview.src} alt="Vista previa del archivo seleccionado" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                ) : (
                  <video src={preview.src} controls className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                )}
                <div className="text-sm text-gray-600 mt-2">{fileInfo}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm font-semibold text-gray-600 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Subiendo...
                </span>
              ) : (
                <span>Subir</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

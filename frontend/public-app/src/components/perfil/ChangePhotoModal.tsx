import { useEffect, useState, type ChangeEvent } from 'react';
import { notifyError } from '../../lib/sweetalert';
import Sheet from '../ui/Sheet';

interface ChangePhotoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File, previewUrl: string) => void;
}

// Modal "Cambiar foto de perfil", calcado del "Subir Contenido a Galería"
// de UploadModal.tsx: mismo input de archivo con estilos file:*, misma
// vista previa dentro de una tarjeta gris, mismos botones Cancelar/confirmar
// en píldora. A diferencia de Galería, confirmar acá no sube nada al
// servidor todavía — solo deja el archivo listo dentro del formulario de
// ProfileEditForm, que sigue guardándose junto al resto de campos con
// "Guardar cambios" (mismo comportamiento de antes, ahora con vista previa
// y confirmación en vez de un swap instantáneo sin aviso).
export default function ChangePhotoModal({ open, onClose, onConfirm }: ChangePhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mismo motivo que en UploadModal.tsx: este modal nunca se desmonta, así
  // que sin limpiar al ABRIRSE la próxima vez mostraría la foto elegida (o
  // descartada) la vez anterior.
  useEffect(() => {
    if (!open) return;
    setPreview(null);
    setFileInfo('');
    setSelectedFile(null);
  }, [open]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      notifyError('Archivo inválido', 'Por favor selecciona una imagen válida.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notifyError('Archivo muy grande', 'La imagen es demasiado grande (máx. 2MB).');
      e.target.value = '';
      return;
    }
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileInfo(`${file.name} (${sizeMB} MB)`);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedFile(file);
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleConfirm() {
    if (!selectedFile || !preview) return;
    onConfirm(selectedFile, preview);
  }

  return (
    <Sheet open={open} onClose={onClose} desktopMaxWidthClassName="md:max-w-md" labelledBy="change-photo-title">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 id="change-photo-title" className="text-lg font-semibold text-gray-900">
          Cambiar foto de perfil
        </h3>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 transition-colors">
          <i className="fas fa-times text-xl" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label htmlFor="newProfilePhoto" className="block text-xs font-medium text-gray-500 mb-1">
            Archivo
          </label>
          <input
            type="file"
            id="newProfilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-sm transition file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-purple-100 file:text-purple-700 file:font-medium file:rounded-md hover:file:bg-purple-200"
          />
          <p className="text-xs text-gray-500 mt-1.5">Formatos: JPG, PNG (máx. 2MB)</p>
        </div>

        {preview && (
          <div>
            <span className="block text-xs font-medium text-gray-500 mb-1">Vista previa</span>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <img src={preview} alt="Vista previa de la nueva foto de perfil" className="w-32 h-32 object-cover rounded-full mx-auto" />
              <div className="text-sm text-gray-600 mt-2 text-center">{fileInfo}</div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedFile}
            className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Usar esta foto
          </button>
        </div>
      </div>
    </Sheet>
  );
}

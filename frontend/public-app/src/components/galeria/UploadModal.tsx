import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { formatDuration } from '../../lib/format';
import { notifyError } from '../../lib/sweetalert';
import Sheet from '../ui/Sheet';

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
// script ~858-971), ahora con un mini editor exclusivo para video: elegir el
// fotograma de portada (se sube como un segundo dato — el segundo exacto — y
// Cloudinary genera la miniatura al vuelo a partir de ese instante, sin
// re-procesar ni re-subir nada) y recortar opcionalmente el rango que se
// reproduce (misma idea: Cloudinary sirve el tramo pedido on-demand).
export default function UploadModal({ open, onClose, onSubmit, isSubmitting }: UploadModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<PreviewState>(null);
  const [fileInfo, setFileInfo] = useState('');

  const [videoDuration, setVideoDuration] = useState(0);
  const [posterSeconds, setPosterSeconds] = useState(0);
  const [posterFrame, setPosterFrame] = useState<string | null>(null);
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  function resetVideoEditorState() {
    setVideoDuration(0);
    setPosterSeconds(0);
    setPosterFrame(null);
    setTrimEnabled(false);
    setTrimStart(0);
    setTrimEnd(0);
  }

  function handleClose() {
    onClose();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    resetVideoEditorState();
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

  function handleVideoLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;
    setVideoDuration(v.duration);
    setTrimEnd(v.duration);
  }

  // Captura el fotograma actual en un <canvas> solo para mostrarlo como
  // confirmación visual acá mismo — es un data URL local, no se sube; la
  // portada real que ve la galería la genera Cloudinary a partir del segundo
  // elegido cuando el video ya está subido.
  function capturePosterFrame() {
    const v = videoRef.current;
    if (!v) return;
    setPosterSeconds(v.currentTime);
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    setPosterFrame(canvas.toDataURL('image/jpeg', 0.8));
  }

  function handleTrimStartChange(value: number) {
    const next = Math.min(Math.max(0, value), trimEnd);
    setTrimStart(next);
  }

  function handleTrimEndChange(value: number) {
    const next = Math.max(Math.min(videoDuration, value), trimStart);
    setTrimEnd(next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    onSubmit(new FormData(formRef.current));
  }

  return (
    <Sheet open={open} onClose={handleClose} desktopMaxWidthClassName="md:max-w-md" labelledBy="upload-modal-title">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 id="upload-modal-title" className="text-lg font-semibold text-gray-900">
          Subir Contenido a Galería
        </h3>
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
                <video
                  ref={videoRef}
                  src={preview.src}
                  controls
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  className="max-w-full h-48 rounded-lg mx-auto bg-black"
                />
              )}
              <div className="text-sm text-gray-600 mt-2">{fileInfo}</div>
            </div>

            {preview.type === 'video' && videoDuration > 0 && (
              <div className="mt-3 space-y-4 border border-gray-200 rounded-lg p-3 bg-white">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-500">Portada en la galería</span>
                    <span className="text-xs font-semibold text-purple-600">{formatDuration(posterSeconds)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Mueve el video arriba hasta el fotograma que quieras usar como portada y confírmalo.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={capturePosterFrame}
                      className="shrink-0 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <i className="fas fa-camera mr-1.5" />
                      Usar este momento
                    </button>
                    {posterFrame && (
                      <img src={posterFrame} alt="Portada seleccionada" className="w-16 h-11 object-cover rounded border border-purple-200" />
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trimEnabled}
                      onChange={(e) => {
                        setTrimEnabled(e.target.checked);
                        if (e.target.checked) {
                          setTrimStart(0);
                          setTrimEnd(videoDuration);
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-400"
                    />
                    Recortar el video
                  </label>
                  {trimEnabled && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={0}
                        max={trimEnd}
                        step={0.1}
                        value={Number(trimStart.toFixed(1))}
                        onChange={(e) => handleTrimStartChange(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-purple-400 focus:outline-none"
                      />
                      <span className="text-gray-400 text-sm">a</span>
                      <input
                        type="number"
                        min={trimStart}
                        max={videoDuration}
                        step={0.1}
                        value={Number(trimEnd.toFixed(1))}
                        onChange={(e) => handleTrimEndChange(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-purple-400 focus:outline-none"
                      />
                      <span className="text-xs text-gray-400">segundos (de {formatDuration(videoDuration)})</span>
                    </div>
                  )}
                </div>

                <input type="hidden" name="posterSeconds" value={posterSeconds} />
                <input type="hidden" name="duration" value={videoDuration} />
                {trimEnabled && (
                  <>
                    <input type="hidden" name="trimStart" value={trimStart} />
                    <input type="hidden" name="trimEnd" value={trimEnd} />
                  </>
                )}
              </div>
            )}
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
    </Sheet>
  );
}

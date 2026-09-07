import { useState, type FormEvent } from 'react';
import { getStoredUser } from '../../lib/auth';
import { notifyError, notifySuccess } from '../../lib/sweetalert';
import { useCreateTestimonial } from '../../hooks/useTestimonials';

interface TestimonialModalProps {
  open: boolean;
  onClose: () => void;
}

// Puerto del modal "Nuevo Testimonio" (setupTestimonialModal en js/main.js).
export default function TestimonialModal({ open, onClose }: TestimonialModalProps) {
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const createTestimonial = useCreateTestimonial();

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user) {
      notifyError('Error', 'Debes iniciar sesión para dejar un testimonio.');
      return;
    }
    createTestimonial.mutate(
      { role, comment, name: user.name || '', avatar: user.profileImage || '' },
      {
        onSuccess: (res) => {
          onClose();
          setRole('');
          setComment('');
          notifySuccess('¡Éxito!', res.message || 'Testimonio agregado correctamente');
        },
        onError: (err) => notifyError('Error', err instanceof Error ? err.message : 'Error al enviar testimonio'),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 opacity-100 z-[9999] flex items-center justify-center transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-enter bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Nuevo Testimonio</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-gray-500 mb-1">
              Tipo de testimonio
            </label>
            <select
              id="role"
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-sm transition"
            >
              <option value="" disabled hidden>
                Selecciona una opción
              </option>
              <option value="CLIENTE SATISFECHO">Cliente satisfecho</option>
              <option value="RECOMENDACIÓN">Recomendación</option>
              <option value="PÉSIMO SERVICIO">Pésimo servicio</option>
            </select>
          </div>
          <div>
            <label htmlFor="comment" className="block text-xs font-medium text-gray-500 mb-1">
              Tu experiencia
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos tu experiencia..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-sm transition"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={createTestimonial.isPending}
              className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow transition-all disabled:opacity-60"
            >
              {createTestimonial.isPending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

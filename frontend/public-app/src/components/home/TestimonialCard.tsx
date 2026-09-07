import { useEffect, useRef, useState } from 'react';
import type { Testimonial } from '../../types/models';
import { getStoredUser } from '../../lib/auth';
import { formatImageUrl } from '../../lib/format';
import { confirmAction, notifyError, notifySuccess } from '../../lib/sweetalert';
import { useDeleteTestimonial, useUpdateTestimonial } from '../../hooks/useTestimonials';

const FALLBACK_AVATAR =
  'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de.jpg?ver=6';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

// Puerto de la tarjeta individual generada dentro de loadTestimonials() en
// js/main.js, con el menú de opciones (editar/eliminar) visible solo para el
// dueño del testimonio.
export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const user = getStoredUser();
  const isOwner = !!(user?._id && testimonial.userId && String(testimonial.userId) === String(user._id));

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(testimonial.comment);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fecha = new Date(testimonial.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  const hora = new Date(testimonial.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // La edición inline solo cambia el comentario, pero igual que el sitio
  // viejo (updateTestimonialInline) reenvía name/avatar del usuario actual
  // logueado (no los originales del testimonio) y conserva el "role" tal cual.
  const handleSaveEdit = () => {
    if (!user) return;
    updateTestimonial.mutate(
      { id: testimonial._id, comment: editValue, role: testimonial.role, name: user.name || '', avatar: user.profileImage || '' },
      {
        onSuccess: (res) => {
          notifySuccess('¡Éxito!', res.message || 'Testimonio editado correctamente');
          setIsEditing(false);
        },
        onError: (err) => notifyError('Error al editar testimonio', err instanceof Error ? err.message : 'Error desconocido'),
      }
    );
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    const confirmed = await confirmAction({
      title: '¿Seguro que quieres borrar este testimonio?',
      text: 'Esta acción no se puede deshacer.',
      confirmText: 'Sí, borrar',
    });
    if (!confirmed) return;
    deleteTestimonial.mutate(testimonial._id, {
      onSuccess: (res) => notifySuccess('¡Éxito!', res.message || 'Testimonio eliminado'),
      onError: (err) => notifyError('Error al borrar testimonio', err instanceof Error ? err.message : 'Error desconocido'),
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-xl p-8 shadow-sm transition-all duration-300 h-full flex flex-col relative group">
      <div className="relative flex-grow">
        <svg className="absolute -top-4 -left-4 h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z" />
        </svg>
        <br />
        {isEditing ? (
          <div className="mb-8">
            <textarea
              className="w-full text-gray-600 italic border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              rows={4}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={updateTestimonial.isPending}
              aria-label="Guardar"
              className="save-edit-btn float-right -mt-2 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none disabled:opacity-60"
            >
              <i className="fas fa-play text-xl text-gray-500" />
            </button>
          </div>
        ) : (
          <p className="text-gray-600 italic mb-8 comment-text">{testimonial.comment}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Publicado el <span>{fecha}</span> a las <span>{hora}</span>
        </p>
      </div>
      <div className="flex items-center mt-auto">
        <img
          src={formatImageUrl(testimonial.avatar)}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
      {isOwner && (
        <div className="absolute top-4 right-4">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Opciones"
              className="testimonial-menu-btn w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none"
            >
              <span className="text-2xl font-bold text-gray-600">⋮</span>
            </button>
            {menuOpen && (
              <div className="testimonial-menu absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditValue(testimonial.comment);
                    setIsEditing(true);
                  }}
                  className="edit-testimonial-btn block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button type="button" onClick={handleDelete} className="delete-testimonial-btn block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

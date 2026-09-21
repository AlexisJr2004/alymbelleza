import { useEffect, useRef, useState } from 'react';
import type { ProductComment, ReactionType } from '../../types/models';
import { getStoredUser, isLoggedIn } from '../../lib/auth';
import { formatImageUrl } from '../../lib/format';
import { confirmAction, notifyError } from '../../lib/sweetalert';
import {
  useCreateProductComment,
  useDeleteProductComment,
  useReactToComment,
  useUpdateProductComment,
} from '../../hooks/useProductComments';

const FALLBACK_AVATAR =
  'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de.jpg?ver=6';

interface ProductCommentItemProps {
  comment: ProductComment;
  productId: string;
  isReply?: boolean;
  replyingTo: string | null;
  onStartReply: (id: string) => void;
  onCancelReply: () => void;
}

// Una fila de comentario o de respuesta (isReply=true les quita el botón de
// "Responder" — solo se permite un nivel de anidado, ver productComment.js).
// Reacciones, edición y borrado son mutaciones propias de esta fila, igual
// que TestimonialCard.tsx; el composer de respuesta vive acá también en vez
// de en el padre, para que aparezca pegado al comentario que se respondió.
export default function ProductCommentItem({
  comment,
  productId,
  isReply = false,
  replyingTo,
  onStartReply,
  onCancelReply,
}: ProductCommentItemProps) {
  const user = getStoredUser();
  const isOwner = !!(user?._id && String(comment.userId) === String(user._id));
  const myReaction = comment.reactions.find((r) => String(r.userId) === String(user?._id))?.type;
  const heartCount = comment.reactions.filter((r) => r.type === 'heart').length;
  const likeCount = comment.reactions.filter((r) => r.type === 'like').length;
  const dislikeCount = comment.reactions.filter((r) => r.type === 'dislike').length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const [replyValue, setReplyValue] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const react = useReactToComment(productId);
  const updateComment = useUpdateProductComment(productId);
  const deleteComment = useDeleteProductComment(productId);
  const createReply = useCreateProductComment();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fecha = new Date(comment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  function requireLogin() {
    if (isLoggedIn()) return true;
    notifyError('Inicia sesión', 'Debes iniciar sesión para continuar.');
    return false;
  }

  function handleReact(type: ReactionType) {
    if (!requireLogin()) return;
    react.mutate({ id: comment._id, type });
  }

  function handleSaveEdit() {
    if (!editValue.trim()) return;
    updateComment.mutate(
      { id: comment._id, comment: editValue.trim() },
      {
        onSuccess: () => setIsEditing(false),
        onError: (err) => notifyError('Error al editar', err instanceof Error ? err.message : 'Error desconocido'),
      }
    );
  }

  async function handleDelete() {
    setMenuOpen(false);
    const confirmed = await confirmAction({
      title: '¿Eliminar comentario?',
      text: isReply ? 'Esta acción no se puede deshacer.' : 'Se eliminará junto con todas sus respuestas. Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    deleteComment.mutate(comment._id, {
      onError: (err) => notifyError('Error al eliminar', err instanceof Error ? err.message : 'Error desconocido'),
    });
  }

  function handleSubmitReply() {
    if (!requireLogin()) return;
    if (!replyValue.trim()) return;
    createReply.mutate(
      { productId, comment: replyValue.trim(), parentId: comment._id },
      {
        onSuccess: () => {
          setReplyValue('');
          onCancelReply();
        },
        onError: (err) => notifyError('Error al responder', err instanceof Error ? err.message : 'Error desconocido'),
      }
    );
  }

  const isReplyingHere = replyingTo === comment._id;

  return (
    <div className="relative group" data-comment-id={comment._id}>
      <div className="flex items-start gap-2.5">
        <img
          src={formatImageUrl(comment.avatar) || FALLBACK_AVATAR}
          alt={comment.name}
          className="w-8 h-8 rounded-full object-cover shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900 truncate">{comment.name}</span>
            </div>
            {isEditing ? (
              <div className="mt-1">
                <textarea
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  rows={2}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditValue(comment.comment);
                    }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={updateComment.isPending}
                    className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full px-3 py-1 disabled:opacity-60"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.comment}</p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 px-1">
            <span className="text-xs text-gray-400">
              {fecha}
              {comment.editedAt ? ' · editado' : ''}
            </span>
            <button
              type="button"
              onClick={() => handleReact('heart')}
              className={`flex items-center gap-1 text-xs transition-colors ${myReaction === 'heart' ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
            >
              <i className={myReaction === 'heart' ? 'fas fa-heart' : 'far fa-heart'} />
              {heartCount > 0 && <span>{heartCount}</span>}
            </button>
            <button
              type="button"
              onClick={() => handleReact('like')}
              className={`flex items-center gap-1 text-xs transition-colors ${myReaction === 'like' ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
            >
              <i className={myReaction === 'like' ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            <button
              type="button"
              onClick={() => handleReact('dislike')}
              className={`flex items-center gap-1 text-xs transition-colors ${myReaction === 'dislike' ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <i className={myReaction === 'dislike' ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'} />
              {dislikeCount > 0 && <span>{dislikeCount}</span>}
            </button>
            {!isReply && (
              <button
                type="button"
                onClick={() => (isReplyingHere ? onCancelReply() : onStartReply(comment._id))}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
              >
                <i className="fas fa-reply" />
                Responder
              </button>
            )}
          </div>

          {isReplyingHere && (
            <div className="mt-2 flex items-start gap-2">
              <textarea
                className="flex-1 text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                rows={2}
                placeholder={`Responder a ${comment.name}...`}
                value={replyValue}
                onChange={(e) => setReplyValue(e.target.value)}
                maxLength={500}
                autoFocus
              />
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleSubmitReply}
                  disabled={createReply.isPending || !replyValue.trim()}
                  className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full px-3 py-1.5 disabled:opacity-60"
                >
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCancelReply();
                    setReplyValue('');
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {isOwner && !isEditing && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Opciones"
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <span className="text-base font-bold leading-none">⋮</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditValue(comment.comment);
                    setIsEditing(true);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="block w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { ProductComment } from '../../types/models';
import { getStoredUser, isLoggedIn } from '../../lib/auth';
import { formatImageUrl } from '../../lib/format';
import { notifyError } from '../../lib/sweetalert';
import { useCreateProductComment, useProductCommentsQuery } from '../../hooks/useProductComments';
import ProductCommentItem from './ProductCommentItem';

const FALLBACK_AVATAR =
  'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de.jpg?ver=6';

interface ProductReviewsProps {
  productId: string;
}

// Panel de reseñas/comentarios del quick-view de producto (a la derecha del
// resto del contenido, ver ProductQuickViewModal.tsx). GET /api/product-comments
// devuelve un arreglo plano (top-level + respuestas mezclados); se agrupa
// acá: top-level más nuevos primero, respuestas de cada uno en orden
// cronológico (se leen como una conversación de arriba hacia abajo).
export default function ProductReviews({ productId }: ProductReviewsProps) {
  const user = getStoredUser();
  const { data: comments = [], isLoading, isError } = useProductCommentsQuery(productId);
  const createComment = useCreateProductComment();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { topLevel, repliesByParent } = useMemo(() => {
    const top = comments
      .filter((c) => !c.parentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const byParent = new Map<string, ProductComment[]>();
    comments
      .filter((c): c is ProductComment & { parentId: string } => !!c.parentId)
      .forEach((c) => {
        const list = byParent.get(c.parentId) ?? [];
        list.push(c);
        byParent.set(c.parentId, list);
      });
    byParent.forEach((list) => list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    return { topLevel: top, repliesByParent: byParent };
  }, [comments]);

  function handleSubmit() {
    if (!isLoggedIn()) {
      notifyError('Inicia sesión', 'Debes iniciar sesión para comentar.');
      return;
    }
    const text = newComment.trim();
    if (!text) return;
    createComment.mutate(
      { productId, comment: text },
      {
        onSuccess: () => setNewComment(''),
        onError: (err) => notifyError('Error al comentar', err instanceof Error ? err.message : 'Error desconocido'),
      }
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 shrink-0">Reseñas y comentarios</h3>

      <div className="flex items-start gap-2.5 mb-4 shrink-0">
        <img
          src={formatImageUrl(user?.profileImage || '') || FALLBACK_AVATAR}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="flex-1">
          <textarea
            className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
            rows={2}
            placeholder="Escribe un comentario sobre este producto..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createComment.isPending || !newComment.trim()}
              className="text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full px-4 py-1.5 disabled:opacity-60 transition-colors"
            >
              Comentar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 -mr-1">
        {isLoading && <p className="text-sm text-gray-400 text-center py-6">Cargando comentarios...</p>}
        {!isLoading && isError && <p className="text-sm text-red-500 text-center py-6">No se pudieron cargar los comentarios.</p>}
        {!isLoading && !isError && topLevel.length === 0 && (
          <div className="text-center py-8">
            <i className="far fa-comments text-2xl text-gray-300" />
            <p className="text-sm text-gray-400 mt-2">Sé el primero en comentar este producto</p>
          </div>
        )}
        {!isLoading &&
          !isError &&
          topLevel.map((comment) => (
            <div key={comment._id}>
              <ProductCommentItem
                comment={comment}
                productId={productId}
                replyingTo={replyingTo}
                onStartReply={setReplyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
              {(repliesByParent.get(comment._id) ?? []).length > 0 && (
                <div className="mt-3 ml-9 space-y-3 border-l-2 border-gray-100 pl-3">
                  {(repliesByParent.get(comment._id) ?? []).map((reply) => (
                    <ProductCommentItem
                      key={reply._id}
                      comment={reply}
                      productId={productId}
                      isReply
                      replyingTo={replyingTo}
                      onStartReply={setReplyingTo}
                      onCancelReply={() => setReplyingTo(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

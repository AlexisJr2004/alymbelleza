// Wrapper de diálogos del sitio — antes usaba SweetAlert2, ahora usa el
// modal propio (ver modalStore.ts + components/ui/Modal.tsx). Se mantienen
// las mismas firmas exportadas a propósito: los ~18 sitios que llaman a
// estas funciones en todo el sitio no necesitan cambiar.
import { showModal } from './modalStore';

export async function confirmAction(opts: { title: string; text: string; confirmText: string; icon?: 'warning' | 'question' }) {
  return showModal({
    kind: 'confirm',
    title: opts.title,
    text: opts.text,
    confirmText: opts.confirmText,
    cancelText: 'Cancelar',
    tone: opts.icon === 'question' ? 'brand' : 'danger',
  });
}

export function notifySuccess(title: string, text?: string) {
  showModal({ kind: 'success', title, text, autoCloseMs: 1500 });
}

export function notifyError(title: string, text?: string) {
  showModal({ kind: 'error', title, text, confirmText: 'Entendido' });
}

// Aviso neutro con botón de confirmación (a diferencia de notifySuccess, que
// se auto-cierra) — usado por el carrito cuando un cupón se quita solo porque
// la compra ya no alcanza el mínimo requerido (ver carrito.html ~1391-1396).
export function notifyInfo(title: string, text?: string) {
  showModal({ kind: 'info', title, text, confirmText: 'Entendido' });
}

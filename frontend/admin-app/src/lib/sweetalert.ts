// Wrapper de diálogos del panel — antes usaba SweetAlert2, ahora usa el
// modal propio (ver modalStore.ts + components/ui/Modal.tsx). Se mantienen
// las mismas firmas exportadas a propósito: los sitios que llaman a estas
// funciones en todo el panel no necesitan cambiar.
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
  showModal({ kind: 'success', title, text, autoCloseMs: 1200 });
}

export function notifyError(title: string, text?: string) {
  showModal({ kind: 'error', title, text, confirmText: 'Entendido' });
}

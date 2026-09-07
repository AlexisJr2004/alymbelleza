import Swal from 'sweetalert2';

export async function confirmAction(opts: { title: string; text: string; confirmText: string; icon?: 'warning' | 'question' }) {
  const result = await Swal.fire({
    title: opts.title,
    text: opts.text,
    icon: opts.icon ?? 'warning',
    showCancelButton: true,
    confirmButtonColor: opts.icon === 'question' ? '#7e22ce' : '#e11d48',
    cancelButtonColor: '#6b7280',
    confirmButtonText: opts.confirmText,
    cancelButtonText: 'Cancelar',
  });
  return result.isConfirmed;
}

export function notifySuccess(title: string, text?: string) {
  Swal.fire({ title, text, icon: 'success', timer: 1500, showConfirmButton: false });
}

export function notifyError(title: string, text?: string) {
  Swal.fire({ title, text, icon: 'error' });
}

// Aviso neutro con botón de confirmación (a diferencia de notifySuccess, que
// se auto-cierra) — usado por el carrito cuando un cupón se quita solo porque
// la compra ya no alcanza el mínimo requerido (ver carrito.html ~1391-1396).
export function notifyInfo(title: string, text?: string) {
  Swal.fire({ title, text, icon: 'info' });
}

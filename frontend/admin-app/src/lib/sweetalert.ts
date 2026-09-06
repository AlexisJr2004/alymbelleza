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
  Swal.fire({ title, text, icon: 'success', timer: 1200, showConfirmButton: false });
}

export function notifyError(title: string, text?: string) {
  Swal.fire({ title, text, icon: 'error' });
}

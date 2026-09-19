// Reemplazo propio de SweetAlert2: un store mínimo fuera de React (mismo
// patrón que un event emitter) para poder llamar showModal(...) desde
// cualquier lado —igual que antes Swal.fire(...)— y que <ModalHost/>
// (montado una sola vez en main.tsx) reaccione y muestre el modal actual.
export type ModalKind = 'confirm' | 'success' | 'error' | 'info';
export type ModalTone = 'brand' | 'danger';

export interface ModalOptions {
  kind: ModalKind;
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ModalTone;
  /** Si se define, el modal se autocierra (resolviendo `true`) pasado este tiempo — usado por notifySuccess. */
  autoCloseMs?: number;
}

export interface ActiveModal extends ModalOptions {
  id: number;
}

type Listener = (modal: ActiveModal | null) => void;

let current: (ActiveModal & { resolve: (value: boolean) => void }) | null = null;
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  const snapshot = current ? { ...current } : null;
  listeners.forEach((listener) => listener(snapshot));
}

export function subscribeModal(listener: Listener): () => void {
  listeners.add(listener);
  listener(current ? { ...current } : null);
  return () => {
    listeners.delete(listener);
  };
}

export function showModal(options: ModalOptions): Promise<boolean> {
  return new Promise((resolve) => {
    // Solo se sostiene un modal a la vez: si ya había uno abierto, se
    // resuelve como cancelado antes de reemplazarlo por el nuevo.
    current?.resolve(false);
    current = { ...options, id: nextId++, resolve };
    emit();
  });
}

export function resolveModal(id: number, result: boolean): void {
  if (current && current.id === id) {
    current.resolve(result);
    current = null;
    emit();
  }
}

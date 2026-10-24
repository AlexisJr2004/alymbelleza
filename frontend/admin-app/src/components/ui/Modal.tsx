import { useEffect, useRef, useState } from 'react';
import { resolveModal, subscribeModal, type ActiveModal } from '../../lib/modalStore';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '../icons';
import Sheet from './Sheet';

// El ícono/color de un modal 'confirm' depende del tono, no solo del kind
// —igual que SweetAlert2 antes mostraba el triángulo de advertencia (rojo)
// para acciones destructivas y el signo de pregunta (morado) para
// confirmaciones neutras como cerrar sesión.
function iconFor(modal: ActiveModal): { Icon: typeof CheckCircleIcon; bg: string; fg: string } {
  if (modal.kind === 'success') return { Icon: CheckCircleIcon, bg: 'bg-emerald-100', fg: 'text-emerald-600' };
  if (modal.kind === 'error') return { Icon: XCircleIcon, bg: 'bg-rose-100', fg: 'text-rose-600' };
  if (modal.kind === 'info') return { Icon: InformationCircleIcon, bg: 'bg-blue-100', fg: 'text-blue-600' };
  // kind === 'confirm'
  if (modal.tone === 'brand') return { Icon: QuestionMarkCircleIcon, bg: 'bg-purple-100', fg: 'text-purple-600' };
  return { Icon: ExclamationTriangleIcon, bg: 'bg-rose-100', fg: 'text-rose-600' };
}

function ModalCard({ modal }: { modal: ActiveModal }) {
  const [open, setOpen] = useState(true);
  const resultRef = useRef(false);

  const requestClose = (result: boolean) => {
    resultRef.current = result;
    setOpen(false);
  };

  useEffect(() => {
    if (!modal.autoCloseMs) return undefined;
    const t = window.setTimeout(() => requestClose(true), modal.autoCloseMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.id, modal.autoCloseMs]);

  const { Icon, bg, fg } = iconFor(modal);
  const titleId = `modal-title-${modal.id}`;

  return (
    <Sheet
      open={open}
      onClose={() => requestClose(false)}
      onFullyClosed={() => resolveModal(modal.id, resultRef.current)}
      labelledBy={titleId}
    >
      <div className="px-6 pb-6 pt-3 text-center">
        <span className={`mx-auto flex items-center justify-center w-14 h-14 rounded-full ${bg}`}>
          <Icon className={`w-7 h-7 ${fg}`} />
        </span>
        <h3 id={titleId} className="mt-4 text-lg font-semibold text-gray-900">
          {modal.title}
        </h3>
        {modal.text && <p className="mt-1.5 text-sm text-gray-500">{modal.text}</p>}
        {modal.kind !== 'success' && (
          <div className="mt-5 flex gap-3">
            {modal.kind === 'confirm' && (
              <button
                type="button"
                onClick={() => requestClose(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {modal.cancelText ?? 'Cancelar'}
              </button>
            )}
            <button
              type="button"
              onClick={() => requestClose(true)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                modal.tone === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {modal.confirmText ?? 'Entendido'}
            </button>
          </div>
        )}
      </div>
    </Sheet>
  );
}

// Montado una sola vez (ver main.tsx) — escucha modalStore y renderiza el
// modal activo, si hay uno.
export default function ModalHost() {
  const [modal, setModal] = useState<ActiveModal | null>(null);

  useEffect(() => subscribeModal(setModal), []);

  if (!modal) return null;
  return <ModalCard key={modal.id} modal={modal} />;
}

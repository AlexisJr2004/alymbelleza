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
      <div className="px-6 pb-6 pt-4 md:pt-8 text-center">
        <span className={`mx-auto flex items-center justify-center w-16 h-16 rounded-[22px] border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_20px_rgba(40,54,89,0.06)] ${bg}`}>
          <Icon className={`w-7 h-7 ${fg}`} />
        </span>
        <h3 id={titleId} className="mt-5 text-xl font-semibold tracking-tight text-ink">
          {modal.title}
        </h3>
        {modal.text && <p className="mt-2 text-sm leading-relaxed text-muted">{modal.text}</p>}
        {modal.kind !== 'success' && (
          <div className="mt-5 flex gap-3">
            {modal.kind === 'confirm' && (
              <button
                type="button"
                onClick={() => requestClose(false)}
                className="glass-button flex-1 px-4 py-2.5 text-sm font-medium"
              >
                {modal.cancelText ?? 'Cancelar'}
              </button>
            )}
            <button
              type="button"
              onClick={() => requestClose(true)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium ${
                modal.tone === 'danger'
                  ? 'glass-button-danger'
                  : 'glass-button-primary'
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

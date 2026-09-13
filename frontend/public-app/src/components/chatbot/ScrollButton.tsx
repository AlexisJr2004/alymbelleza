interface ScrollButtonProps {
  isAtTop: boolean;
  onClick: () => void;
}

// Puerto directo del "Script para la funcionalidad del ir arriba y abajo
// dentro del ChatBot" (index.html ~2642-2686): el ícono alterna entre
// chevron-up/chevron-down según la posición de scroll de #chat-messages, y el
// click desplaza al extremo contrario. El estado `isAtTop` y el listener de
// scroll viven en ChatWidget (dueño del contenedor de mensajes); este
// componente es puramente presentacional.
export default function ScrollButton({ isAtTop, onClick }: ScrollButtonProps) {
  return (
    <div className="relative">
      <button
        type="button"
        id="scroll-button"
        onClick={onClick}
        className="absolute left-1/2 -translate-x-1/2 -top-3 z-50 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center transform transition-all duration-300 border border-gray-200 hover:shadow-lg hover:scale-105"
      >
        <i className={`fas ${isAtTop ? 'fa-chevron-down' : 'fa-chevron-up'} text-gray-500 text-sm transition-transform duration-300`} />
      </button>
    </div>
  );
}

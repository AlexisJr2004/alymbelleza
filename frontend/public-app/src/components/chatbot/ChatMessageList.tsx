import type { RefObject } from 'react';

export interface ChatUiMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatMessageListProps {
  messages: ChatUiMessage[];
  containerRef: RefObject<HTMLDivElement | null>;
}

// Puerto de la parte de renderizado de addMessage()/addMessageWithOptions()
// del script principal (index.html ~1792-1842 y ~2114-2253): mismas clases de
// burbuja para usuario (bg-blue-700, alineada a la derecha) y bot (bg-gray-100,
// alineada a la izquierda). No se porta el botón de "escuchar" (text-to-speech
// vía speechSynthesis) que tenía addMessage() para los mensajes del bot: no
// está en el listado de piezas a construir de esta sub-fase y agrega una
// superficie de UI/estado (voces disponibles, toggle de reproducción) que no
// se pidió explícitamente — se documenta acá como una omisión deliberada, no
// silenciosa.
export default function ChatMessageList({ messages, containerRef }: ChatMessageListProps) {
  return (
    <div id="chat-messages" ref={containerRef} className="h-60 overflow-y-auto p-4 bg-gray-50 space-y-3 relative">
      {messages.map((message) =>
        message.sender === 'user' ? (
          <div
            key={message.id}
            className="mb-4 p-3 rounded-lg flex flex-col bg-blue-700 text-white ml-auto inline-block px-4 py-2 max-w-[60%] text-left font-semibold"
          >
            <p className="text-xs">{message.text}</p>
          </div>
        ) : (
          <div key={message.id} className="mb-4 p-3 rounded-lg flex flex-col bg-gray-100 mr-auto px-4 py-2 w-full max-w-[80%] font-semibold">
            <p className="text-xs">{message.text}</p>
          </div>
        )
      )}
    </div>
  );
}

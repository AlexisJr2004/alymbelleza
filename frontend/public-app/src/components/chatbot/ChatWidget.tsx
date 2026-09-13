import { useEffect, useRef, useState } from 'react';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { findFaqAnswer } from '../../data/chatbotFaq';
import { CHAT_MODEL_LABEL, useChatEngine } from '../../hooks/useChatEngine';
import ChatMessageList, { type ChatUiMessage } from './ChatMessageList';
import ChatInput from './ChatInput';
import ScrollButton from './ScrollButton';

const WELCOME_MESSAGE =
  '¡Hola 👋! Soy Sofía, tu asistente virtual de Bella Beauty. Estoy aquí para ayudarte con tus dudas sobre servicios, productos, citas y pagos. ¿En qué puedo ayudarte 😊?';

const ERROR_MESSAGE = 'Lo siento, ha ocurrido un error al generar la respuesta. Por favor, intenta de nuevo.';

// Puerto de typeMessage() (index.html ~2256-2272): revela el texto letra por
// letra a 50ms por carácter, igual que el original. `isCancelled` corta la
// cadena de setTimeout si el componente se desmonta a mitad de la animación
// (ej. el usuario navega a otra página del sitio), algo que el script viejo
// no necesitaba manejar porque nunca vivió dentro de un ciclo de vida de
// componente.
function typeMessage(onUpdate: (partial: string) => void, fullText: string, isCancelled: () => boolean, delay = 50): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    let current = '';
    function step() {
      if (isCancelled()) {
        resolve();
        return;
      }
      if (index >= fullText.length) {
        resolve();
        return;
      }
      current += fullText.charAt(index);
      index += 1;
      onUpdate(current);
      setTimeout(step, delay);
    }
    step();
  });
}

// Chatbot flotante — puerto de la sección "ChatBot" de frontend/index.html
// (~1481-1687 markup, ~1690-2452 y ~2599-2686 la lógica real). Solo vive en
// Home, igual que en el sitio viejo (nunca existió en las demás páginas), así
// que HomePage.tsx lo monta una única vez y sin condicionales.
//
// Cambios de contenido deliberados frente al original (pedidos explícitamente
// para esta sub-fase, no improvisados):
//
// 1. Se elimina por completo la opción de modelo "ChatGPT-3.5-turbo": en el
//    script viejo llamaba directo a la API de OpenAI desde el navegador con
//    un `apiKey` hardcodeado en blanco (nunca funcionó) — subirlo tal cual
//    sería publicar un patrón inseguro (API key de cliente) que además está
//    roto. Con un solo modelo real (LLaMA 3 vía WebLLM), también se elimina
//    el menú "Seleccionar un modelo para iniciar" y cambiar-de-modelo
//    (`changeModel()`/`showModelOptions()`): no tiene sentido un selector de
//    una sola opción. La fila "Modelo actual" se conserva visualmente (ver
//    debajo) mostrando "LLaMA 3" de forma estática, sin dropdown.
// 2. Se elimina el menú de opciones clicables (`mainMenuOptions`,
//    `handleOptionSelection`) que el original mostraba al abrir el chat: era
//    un árbol de categorías hecho a medida para el contenido de la escuela
//    ("Niveles Educativos", "Actividades Extracurriculares", etc.) que no
//    tiene equivalente en Bella Beauty y no fue pedido como parte del FAQ a
//    reescribir (que sí pide pares pregunta/respuesta planos). En su lugar,
//    al abrir se muestra un único mensaje de bienvenida y el chat queda
//    disponible de inmediato para texto libre.
// 3. El botón "escuchar" (text-to-speech) que addMessage() agregaba a cada
//    respuesta del bot no se porta — ver el comentario en ChatMessageList.tsx.
//
// Bugs conocidos del original corregidos acá (pedido explícito, documentado
// en vez de cambiado en silencio):
//
// - saveSelectedModel()/getSavedModel() (localStorage) era código muerto:
//   getSavedModel() nunca se llamaba, así que el selector de modelo volvía a
//   preguntar en cada apertura pese a "guardar" una preferencia. Al eliminar
//   el selector de modelo (ver arriba) todo ese mecanismo queda obsoleto y
//   simplemente no se porta.
// - El array `messages` que arma el contexto multi-turno para el LLM nunca
//   recibía los turnos del usuario ni las respuestas resueltas por el FAQ,
//   solo las respuestas que sí venían de una llamada real al modelo — el
//   contexto que de verdad se mandaba en cada turno estaba incompleto. Acá
//   `historyRef` recibe SIEMPRE el turno del usuario y la respuesta del bot
//   (sea del FAQ o del modelo), así el modelo recibe contexto real. El
//   mensaje de error genérico (catch de abajo) es la única excepción
//   deliberada: no se agrega a `historyRef` porque no es un turno de
//   conversación real sobre el negocio, solo un aviso de fallo técnico.
// - El historial de chat sigue siendo solo en memoria (no hay
//   localStorage/backend) — eso no es un bug, es el diseño esperado: el
//   estado vive mientras este componente esté montado (o sea, mientras la
//   página Home siga cargada) y desaparece con una recarga, sin que haya que
//   construir nada para lograrlo.
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [messages, setMessages] = useState<ChatUiMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAtTop, setIsAtTop] = useState(true);

  const { progressText, getEngine } = useChatEngine();

  const nextIdRef = useRef(0);
  const historyRef = useRef<ChatCompletionMessageParam[]>([]);
  const mountedRef = useRef(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  // Auto-scroll al fondo con cada mensaje nuevo (o cada chunk del streaming),
  // puerto de `$chatMessages.scrollTop = $chatMessages.scrollHeight` repetido
  // en cada punto donde el original agregaba/actualizaba contenido.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Puerto de updateScrollButton() (index.html ~2652-2661).
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const handleScroll = () => setIsAtTop(el.scrollTop === 0);
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  function nextId() {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    return id;
  }

  async function appendTypedBotMessage(text: string) {
    const id = nextId();
    setMessages((prev) => [...prev, { id, sender: 'bot', text: '' }]);
    await typeMessage(
      (partial) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: partial } : m))),
      text,
      () => !mountedRef.current
    );
  }

  function handleOpenClick() {
    setIsOpen(true);
    // Solo se muestra el saludo la primera vez que se abre (mientras el
    // componente siga montado): el original volvía a dispararlo en cada
    // click sobre la burbuja, acumulando saludos duplicados sobre la
    // conversación ya existente — no es un comportamiento que valga la pena
    // reproducir.
    if (messages.length === 0) {
      setIsBusy(true);
      void appendTypedBotMessage(WELCOME_MESSAGE).finally(() => {
        if (mountedRef.current) setIsBusy(false);
      });
    }
  }

  function handleCloseClick() {
    setIsOpen(false);
  }

  function handleScrollButtonClick() {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: isAtTop ? el.scrollHeight : 0, behavior: 'smooth' });
  }

  // Puerto de sendMessage() (index.html ~2325-2407): primero intenta el FAQ
  // local (instantáneo, nunca toca WebLLM), y solo si no hay coincidencia
  // recién ahí pide el engine perezoso — este es el único punto de todo el
  // widget donde @mlc-ai/web-llm llega a cargarse.
  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isBusy) return;

    setInputValue('');
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text }]);
    historyRef.current.push({ role: 'user', content: text });
    setIsBusy(true);

    try {
      const faqAnswer = findFaqAnswer(text);
      if (faqAnswer) {
        await appendTypedBotMessage(faqAnswer);
        historyRef.current.push({ role: 'assistant', content: faqAnswer });
      } else {
        const engine = await getEngine();
        const stream = await engine.chat.completions.create({ messages: historyRef.current, stream: true });

        const botId = nextId();
        setMessages((prev) => [...prev, { id: botId, sender: 'bot', text: '' }]);
        let full = '';
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (!delta) continue;
          full += delta;
          setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: full } : m)));
        }
        historyRef.current.push({ role: 'assistant', content: full });
      }
    } catch (err) {
      console.error('Error en el chatbot:', err);
      await appendTypedBotMessage(ERROR_MESSAGE);
    } finally {
      if (mountedRef.current) setIsBusy(false);
    }
  }

  return (
    <div id="chatbot-container" className="fixed bottom-4 left-8 z-[50]">
      {!isOpen && (
        <button
          type="button"
          id="open-chat"
          onClick={handleOpenClick}
          className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 z-[10000]"
        >
          <i className="fas fa-message text-xl text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      <div
        id="chatbot"
        className={`w-80 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out border border-gray-200 ${
          isOpen ? '' : 'hidden opacity-0 translate-y-5'
        }`}
      >
        <div className="text-white p-2" style={{ background: 'linear-gradient(to right, #60a5fa, #1d4ed8)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="https://img.freepik.com/vector-gratis/chatbot-mensaje-chat-vectorart_78370-4104.jpg"
                  alt="ChatBot Profile"
                  className="rounded-full w-10 h-10"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm text-blue-100 font-bold">Sofía</p>
                <p className="text-xs text-blue-100">Asistente Virtual</p>
              </div>
            </div>
            <button type="button" id="close-chat" onClick={handleCloseClick} className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300">
              <i className="fas fa-times text-lg" />
            </button>
          </div>
        </div>

        <svg width="100%" height="25%" viewBox="0 0 1440 490" xmlns="http://www.w3.org/2000/svg" className="rotate-180 mt-0 transition duration-300 ease-in-out delay-150">
          <defs>
            <linearGradient id="gradient_chat" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="5%" stopColor="#1d4ed8" />
              <stop offset="95%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path
            d="M 0,500 C 0,500 0,333 0,333 C 77.34928229665073,329.6794258373206 154.69856459330146,326.3588516746412 247,319 C 339.30143540669854,311.6411483253588 446.555023923445,300.24401913875596 540,316 C 633.444976076555,331.75598086124404 713.0813397129187,374.6650717703349 820,394 C 926.9186602870813,413.3349282296651 1061.1196172248804,409.0956937799043 1169,395 C 1276.8803827751196,380.9043062200957 1358.44019138756,356.95215311004785 1440,333 C 1440,333 1440,500 1440,500 Z"
            stroke="none"
            strokeWidth={0}
            fill="url(#gradient_chat)"
            fillOpacity={1}
            className="transition-all duration-300 ease-in-out delay-150 path-0"
          />
        </svg>

        {/* Fila "Modelo actual": en el original abría un menú para elegir entre
            LLaMA 3 y ChatGPT-3.5-turbo. Con un solo modelo real que queda tras
            esta sub-fase (ver comentario de arriba), se conserva la fila por
            fidelidad visual pero sin cursor-pointer/hover/onClick: no hay nada
            que seleccionar. */}
        <div className="mx-4 my-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">Modelo actual</p>
                <p className="text-xs text-gray-500">{CHAT_MODEL_LABEL}</p>
              </div>
            </div>
            <i className="fas fa-chevron-down text-blue-600" />
          </div>
        </div>

        <ChatMessageList messages={messages} containerRef={messagesContainerRef} />

        <ScrollButton isAtTop={isAtTop} onClick={handleScrollButtonClick} />

        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={isBusy} />

        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <i className="fas fa-shield-alt" />
              <p className="text-xs text-gray-500">Las respuestas del ChatBot son confiables</p>
            </div>
            {progressText && (
              <span id="init-progress-text" className="text-xs text-gray-400">
                {progressText}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

const EMOJIS = ['😀', '😂', '🥰', '😎', '🤔', '😊', '👍', '❤️', '✨', '🎉', '🌟', '💪', '🙌', '👏', '🤝', '👋'];

// El index.html original tenía, arriba de la grilla de emojis, una fila de 4
// botones con íconos de Font Awesome (smile/heart/hand-peace/flag) dentro del
// mismo selector `.grid button` que dispara la inserción — pero un ícono de
// Font Awesome no tiene textContent real (se pinta por ::before), así que en
// producción esos 4 botones ya insertaban una cadena vacía al hacer click: un
// no-op disfrazado de botón funcional. Se conserva la fila tal cual para la
// fidelidad visual del panel, pero sin fingir que hace algo que nunca hizo.
const DECORATIVE_ICONS = ['far fa-smile text-yellow-500', 'far fa-heart text-red-500', 'far fa-hand-peace text-blue-500', 'far fa-flag text-green-500'];

// Tipado mínimo de la Web Speech API (no forma parte de lib.dom.d.ts) para
// portar el reconocimiento de voz sin recurrir a `any`.
interface MinimalSpeechRecognitionEvent extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface MinimalSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: MinimalSpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
  }
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

// Puerto de la fila de input (index.html ~1606-1675) más los dos scripts que
// la controlan: el selector de emojis (~2599-2639) y el reconocimiento de voz
// (~2456-2596, la parte real de ese bloque — el resto de ese mismo script,
// handleSendMessage()/openChatBtn/closeChatBtn ahí adentro, es la wiring
// duplicada y muerta que ChatWidget.tsx ya explica por qué no se porta).
export default function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  // Cerrar el selector de emojis al hacer click fuera (index.html ~2632-2637).
  // El listener se agrega recién cuando emojiOpen pasa a true, dentro del
  // mismo evento de click que lo abrió — y ese mismo click TODAVÍA sigue
  // subiendo hacia `document` en ese momento, así que sin el
  // `e.stopPropagation()` de más abajo en el botón, este listener recién
  // agregado terminaría atrapando esa misma burbuja y cerrando el picker
  // apenas se abre.
  useEffect(() => {
    if (!emojiOpen) return;
    function handleDocumentClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [emojiOpen]);

  function insertEmoji(emoji: string) {
    const el = inputRef.current;
    const cursorPos = el?.selectionStart ?? value.length;
    const next = value.slice(0, cursorPos) + emoji + value.slice(cursorPos);
    onChange(next);
    requestAnimationFrame(() => {
      el?.focus();
      const newPos = cursorPos + emoji.length;
      el?.setSelectionRange(newPos, newPos);
    });
  }

  function ensureRecognition(): MinimalSpeechRecognition | null {
    if (recognitionRef.current) return recognitionRef.current;
    const Ctor = window.webkitSpeechRecognition;
    if (!Ctor) {
      setSpeechSupported(false);
      return null;
    }
    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      onChange(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    return recognition;
  }

  function toggleRecording() {
    const recognition = ensureRecognition();
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }

  function handleSend() {
    if (disabled || !value.trim()) return;
    onSend();
  }

  return (
    <div className="bg-white p-2 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            className="w-full px-5 py-2 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-xs"
            placeholder={isRecording ? 'Escuchando...' : 'Escribe tu mensaje...'}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              id="emoji-button"
              onClick={(e) => {
                e.stopPropagation();
                setEmojiOpen((open) => !open);
              }}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <i className="far fa-smile text-lg" />
            </button>
            {speechSupported && (
              <button type="button" id="voice-input" onClick={toggleRecording} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <i className={isRecording ? 'fas fa-stop text-red-500' : 'fas fa-microphone'} />
              </button>
            )}
            {isRecording && (
              // El `hidden` del original era lo que JS quitaba con
              // classList.remove('hidden') al empezar a grabar; acá el
              // isRecording && ya cumple ese rol, así que NO se porta esa clase
              // (dejarla habría vuelto el indicador imposible de ver, ya que
              // `hidden` gana sobre cualquier estado del componente).
              <div id="recording-indicator" className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="animate-pulse flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  <span className="text-xs text-red-500">Grabando...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          id="send-message"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <i className="fas fa-paper-plane" />
        </button>
      </div>

      {emojiOpen && (
        <div
          ref={pickerRef}
          id="emoji-picker"
          className="absolute bottom-20 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Emojis</h4>
            <button type="button" id="close-emoji" onClick={() => setEmojiOpen(false)} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
            <div className="col-span-8 flex space-x-2 mb-2 pb-2 border-b border-gray-200">
              {DECORATIVE_ICONS.map((iconClass) => (
                <button key={iconClass} type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <i className={iconClass} />
                </button>
              ))}
            </div>
            {EMOJIS.map((emoji) => (
              <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { SparklesIcon, PaperAirplaneIcon } from '../icons';
import { useChatEngine } from '../../hooks/useChatEngine';

interface UiMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const ERROR_MESSAGE = 'No pude generar una respuesta. Probá de nuevo en un momento.';
const MAX_CONTEXT_CHARS = 6000;

const SUGGESTIONS = [
  '¿Qué destaca de estos datos?',
  'Resume lo que estoy viendo',
  '¿Hay algo que requiera atención?',
];

// Captura el texto visible de la columna de contenido (no del panel de chat
// ni del header/rail) para poder responder preguntas sobre "lo que se ve en
// pantalla" en cualquier página del admin, sin tener que cablear a mano un
// resumen distinto por cada una de las 7 páginas: toma ese contenedor tal
// cual está renderizado en ese momento (ya filtrado por los filtros/
// búsquedas que el admin tenga aplicados), así que siempre refleja el
// estado actual.
function captureScreenContext(): string {
  const content = document.getElementById('admin-content');
  if (!content) return '';
  const text = content.innerText.replace(/\n{3,}/g, '\n\n').trim();
  return text.length > MAX_CONTEXT_CHARS ? `${text.slice(0, MAX_CONTEXT_CHARS)}…` : text;
}

function buildSystemMessage(): ChatCompletionMessageParam {
  const context = captureScreenContext();
  return {
    role: 'system',
    content:
      'Sos el asistente de datos del panel de administración de Bella Beauty. Tu única fuente de información es ' +
      'el contenido visible en la pantalla actual, pegado abajo tal cual aparece en la interfaz (textos, números, ' +
      'tablas). Respondé en español, de forma breve y concreta, basándote solo en esos datos. Si te preguntan algo ' +
      'que no se puede responder con lo que está en pantalla, decí que no tenés esa información visible.\n\n' +
      `--- CONTENIDO VISIBLE EN PANTALLA ---\n${context || '(sin contenido detectado)'}\n--- FIN ---`,
  };
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const { progressText, getEngine } = useChatEngine();
  const nextIdRef = useRef(0);
  const historyRef = useRef<ChatCompletionMessageParam[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function nextId() {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    return id;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    setInputValue('');
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text: trimmed }]);
    historyRef.current.push({ role: 'user', content: trimmed });
    setIsBusy(true);

    try {
      const engine = await getEngine();
      const payload: ChatCompletionMessageParam[] = [buildSystemMessage(), ...historyRef.current];
      const stream = await engine.chat.completions.create({ messages: payload, stream: true });

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
    } catch (err) {
      console.error('Error en el asistente del admin:', err);
      setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text: ERROR_MESSAGE }]);
    } finally {
      setIsBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(inputValue);
  }

  return (
    <aside aria-label="Asistente de datos" className="glass flex h-[560px] w-full flex-col overflow-hidden 2xl:sticky 2xl:top-[110px] 2xl:h-[calc(100dvh-142px)] 2xl:min-h-[420px]">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/60 px-5 py-5">
        <span className="glass-button-primary grid h-10 w-10 place-items-center rounded-2xl">
          <SparklesIcon className="h-[18px] w-[18px]" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Asistente IA</p>
          <p className="text-xs text-muted">Analiza lo que ves en pantalla</p>
        </div>
      </div>

      <div ref={listRef} aria-live="polite" aria-busy={isBusy} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted">
              Preguntame sobre los datos que están en esta pantalla — los números de las tarjetas, las filas de la
              tabla, lo que esté visible ahora mismo.
            </p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="glass-button block w-full rounded-2xl px-4 py-3 text-left text-sm leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-[20px] px-4 py-3 text-sm leading-relaxed ${
                  m.sender === 'user' ? 'glass-button-primary rounded-br-md' : 'glass-inset rounded-bl-md text-ink'
                }`}
              >
                {m.text || (isBusy && m.sender === 'bot' ? '…' : '')}
              </div>
            </div>
          ))
        )}
      </div>

      {progressText && <p className="shrink-0 px-5 pb-2 text-xs text-muted">{progressText}</p>}

      <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-white/60 p-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Preguntá sobre esta pantalla..."
          aria-label="Pregunta al asistente sobre esta pantalla"
          disabled={isBusy}
          className="glass-input min-w-0 flex-1 rounded-full px-4 py-3 text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isBusy || !inputValue.trim()}
          aria-label="Enviar pregunta"
          className="glass-button-primary grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-40"
        >
          <PaperAirplaneIcon className="h-[17px] w-[17px]" />
        </button>
      </form>
    </aside>
  );
}

import { useCallback, useRef, useState } from 'react';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

// Único modelo real que queda tras esta sub-fase (ver comentario largo en
// ChatWidget.tsx sobre por qué se elimina la opción "ChatGPT-3.5-turbo" del
// index.html original). Mismo model id que usaba el sitio viejo.
export const CHAT_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
export const CHAT_MODEL_LABEL = 'LLaMA 3';

export type ChatEngineStatus = 'idle' | 'loading' | 'ready' | 'error';

// Superficie mínima que ChatWidget necesita del engine — evita acoplar el
// resto del código al tipo completo `MLCEngineInterface` de @mlc-ai/web-llm
// (que solo debe conocerse dentro de este hook y del worker).
export interface ChatEngineLike {
  chat: {
    completions: {
      create: (params: {
        messages: ChatCompletionMessageParam[];
        stream: true;
      }) => Promise<AsyncIterable<{ choices: Array<{ delta: { content?: string } }> }>>;
    };
  };
}

// Seam de solo-test: crear el engine real implica descargar un modelo de
// varios cientos de MB y depender de WebGPU, algo inviable en un run de
// Playwright/CI. Los tests inyectan este override ANTES de que cargue la
// página (page.addInitScript), reemplazando la creación real por un stub que
// imita la forma de ChatEngineLike. En producción esta propiedad nunca se
// define, así que la rama real de abajo es la que siempre corre para
// usuarios reales.
declare global {
  interface Window {
    __bbChatEngineOverride?: () => Promise<ChatEngineLike>;
  }
}

export interface UseChatEngineResult {
  status: ChatEngineStatus;
  progressText: string;
  getEngine: () => Promise<ChatEngineLike>;
}

// Dueño exclusivo del ciclo de vida del engine de WebLLM: lo crea perezosamente
// (nada se descarga hasta la primera llamada a getEngine()), reporta el
// progreso de carga vía el mismo initProgressCallback que usaba el original, y
// evita una doble inicialización concurrente si el usuario dispara dos
// mensajes que necesitan el modelo antes de que la primera carga termine
// (puerto del `while (isEngineInitializing) await sleep(100)` del script
// viejo, resuelto acá con una promesa compartida en vez de polling).
export function useChatEngine(): UseChatEngineResult {
  const engineRef = useRef<ChatEngineLike | null>(null);
  const pendingRef = useRef<Promise<ChatEngineLike> | null>(null);
  const [status, setStatus] = useState<ChatEngineStatus>('idle');
  const [progressText, setProgressText] = useState('');

  const getEngine = useCallback((): Promise<ChatEngineLike> => {
    if (engineRef.current) return Promise.resolve(engineRef.current);
    if (pendingRef.current) return pendingRef.current;

    setStatus('loading');
    setProgressText('Cargando el modelo, por favor espera...');

    const initPromise = (async (): Promise<ChatEngineLike> => {
      try {
        let engine: ChatEngineLike;
        if (window.__bbChatEngineOverride) {
          engine = await window.__bbChatEngineOverride();
        } else {
          // Import dinámico: @mlc-ai/web-llm (runtime de LLM en el navegador,
          // pesado) nunca debe formar parte del bundle principal ni siquiera
          // del propio chunk de Home — solo se descarga si el usuario
          // efectivamente manda un mensaje que el FAQ local no responde.
          const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
          const worker = new Worker(new URL('../workers/chatWorker.ts', import.meta.url), { type: 'module' });
          engine = (await CreateWebWorkerMLCEngine(worker, CHAT_MODEL_ID, {
            initProgressCallback: (info) => setProgressText(info.text),
          })) as unknown as ChatEngineLike;
        }
        engineRef.current = engine;
        setStatus('ready');
        // Ajuste deliberado frente al original: hideLoadingIndicator() del
        // index.html viejo mostraba "Carga completada" incluso cuando la
        // inicialización terminaba en error (estaba en el `finally`, no en el
        // `try`). Acá ese texto solo aparece tras un éxito real; el error se
        // comunica igual que antes con el mensaje de "ha ocurrido un error"
        // en la lista de mensajes.
        setProgressText('Carga completada');
        setTimeout(() => setProgressText(''), 3000);
        return engine;
      } catch (err) {
        setStatus('error');
        setProgressText('');
        throw err;
      } finally {
        pendingRef.current = null;
      }
    })();

    pendingRef.current = initPromise;
    return initPromise;
  }, []);

  return { status, progressText, getEngine };
}

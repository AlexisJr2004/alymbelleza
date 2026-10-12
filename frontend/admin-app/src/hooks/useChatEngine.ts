import { useCallback, useRef, useState } from 'react';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

// Mismo modelo que el chatbot del sitio público (frontend/public-app/src/
// hooks/useChatEngine.ts) — corre enteramente en el navegador vía WebGPU,
// sin backend ni API key.
export const CHAT_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
export const CHAT_MODEL_LABEL = 'LLaMA 3';

export type ChatEngineStatus = 'idle' | 'loading' | 'ready' | 'error';

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

export interface UseChatEngineResult {
  status: ChatEngineStatus;
  progressText: string;
  getEngine: () => Promise<ChatEngineLike>;
}

// Carga perezosa del engine (nada se descarga hasta la primera pregunta real
// del admin) con una promesa compartida para evitar una doble inicialización
// concurrente.
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
        const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
        const worker = new Worker(new URL('../workers/chatWorker.ts', import.meta.url), { type: 'module' });
        const engine = (await CreateWebWorkerMLCEngine(worker, CHAT_MODEL_ID, {
          initProgressCallback: (info) => setProgressText(info.text),
        })) as unknown as ChatEngineLike;
        engineRef.current = engine;
        setStatus('ready');
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

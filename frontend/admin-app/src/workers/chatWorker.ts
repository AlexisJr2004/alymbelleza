import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// Mismo relay que frontend/public-app/src/workers/chatWorker.ts: mantiene
// @mlc-ai/web-llm (pesado) fuera del bundle principal del admin — Vite lo
// empaqueta en su propio chunk, que el navegador solo pide cuando
// useChatEngine.ts ejecuta `new Worker(...)`, es decir cuando el admin ya
// abrió el panel de IA y mandó una pregunta.
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};

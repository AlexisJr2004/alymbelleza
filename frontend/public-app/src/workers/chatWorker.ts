import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// Puerto de frontend/js/worker.js (6 líneas): el mismo relay de mensajes
// hacia el motor de WebLLM, ahora instanciado como Web Worker nativo de Vite
// (`new Worker(new URL('./chatWorker.ts', import.meta.url), { type: 'module' })`
// en useChatEngine.ts) en vez de un `new Worker('/js/worker.js')` que a su vez
// importaba el paquete desde la CDN esm.run.
//
// Esto es justo lo que mantiene a @mlc-ai/web-llm (el runtime de LLM en el
// navegador, pesado) fuera del bundle principal y del propio chunk de Home:
// Vite empaqueta este archivo y todo lo que importa en su propio chunk
// separado, que el navegador solo llega a pedir por red cuando
// useChatEngine.ts ejecuta `new Worker(...)` — es decir, cuando el usuario ya
// abrió el chat y mandó un mensaje que el FAQ local no pudo responder.
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};

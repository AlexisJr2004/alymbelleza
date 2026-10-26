import { useEffect, useRef, useState } from 'react';
import StoreIcon from '../home/StoreIcon';
import '../../styles/accessibility.css';

const FONTS = ['Original', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState(100);
  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem('selectedFont');
    return saved && FONTS.includes(saved) ? saved : 'Original';
  });
  const [speaking, setSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const speechAvailable = typeof window.speechSynthesis !== 'undefined';

  useEffect(() => {
    if (font === 'Original') {
      delete document.body.dataset.accessibilityFont;
      document.body.style.removeProperty('--bb-accessible-font');
      document.body.style.removeProperty('font-family');
      localStorage.removeItem('selectedFont');
    } else {
      document.body.dataset.accessibilityFont = font;
      document.body.style.setProperty('--bb-accessible-font', font);
      localStorage.setItem('selectedFont', font);
    }
  }, [font]);

  // Capture original sizes before writing so nested text is scaled only once.
  // Reapply to newly mounted content when navigating with text enlargement enabled.
  useEffect(() => {
    if (fontSize === 100) return;
    const originals = new Map<HTMLElement, { value: string; priority: string }>();
    let frame = 0;
    function restore() {
      originals.forEach(({ value, priority }, element) => {
        if (value) element.style.setProperty('font-size', value, priority);
        else element.style.removeProperty('font-size');
      });
      originals.clear();
    }
    function apply() {
      restore();
      const elements = Array.from(document.body.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,a,button,label,input,textarea,select,span,small,strong,em,li,dt,dd,output'));
      const sizes = elements.filter(element => !element.closest('.bb-accessibility') && !element.closest('svg')).map(element => ({ element, size: parseFloat(getComputedStyle(element).fontSize) }));
      sizes.forEach(({ element, size }) => {
        originals.set(element, { value: element.style.getPropertyValue('font-size'), priority: element.style.getPropertyPriority('font-size') });
        element.style.setProperty('font-size', `${size * fontSize / 100}px`, 'important');
      });
    }
    const observer = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(apply); });
    apply();
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); restore(); };
  }, [fontSize]);

  useEffect(() => {
    document.body.style.zoom = zoom === 100 ? '' : `${zoom}%`;
    return () => { document.body.style.zoom = ''; };
  }, [zoom]);

  useEffect(() => {
    function outside(event: PointerEvent) { if (!containerRef.current?.contains(event.target as Node)) setOpen(false); }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => () => { if (speechAvailable) window.speechSynthesis.cancel(); }, [speechAvailable]);

  function toggleSpeech() {
    if (!speechAvailable) return;
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(document.querySelector('main')?.innerText || document.body.innerText);
    utterance.lang = 'es-ES';
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }
  function close() { setOpen(false); triggerRef.current?.focus(); }

  return <div className="bb-accessibility" ref={containerRef} onKeyDown={event => { if (event.key === 'Escape') close(); }}>
    <button ref={triggerRef} type="button" onClick={() => setOpen(value => !value)} aria-label="Opciones de accesibilidad" aria-expanded={open} aria-controls="bb-accessibility-panel" className="bb-accessibility-trigger">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="4" r="2" /><path d="m3 8 9 2 9-2m-9 2v5m0 0-4 7m4-7 4 7" /></svg>
    </button>
    {open && <section id="bb-accessibility-panel" className="bb-accessibility-panel" aria-labelledby="bb-accessibility-title">
      <header><h2 id="bb-accessibility-title">Accesibilidad</h2><button type="button" aria-label="Cerrar accesibilidad" onClick={close}><StoreIcon name="close" /></button></header>
      <div className="bb-accessibility-group"><p>Zoom <output>{zoom}%</output></p><div>
        <button type="button" aria-label="Reducir zoom" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 10))}>−</button>
        <button type="button" aria-label="Restablecer zoom" onClick={() => setZoom(100)}>Restablecer</button>
        <button type="button" aria-label="Aumentar zoom" disabled={zoom >= 200} onClick={() => setZoom(value => Math.min(200, value + 10))}>+</button>
      </div></div>
      <div className="bb-accessibility-group"><p>Tamaño de texto <output>{fontSize}%</output></p><div>
        <button type="button" aria-label="Reducir texto" disabled={fontSize <= 80} onClick={() => setFontSize(value => Math.max(80, value - 10))}>A−</button>
        <button type="button" aria-label="Restablecer texto" onClick={() => setFontSize(100)}>Restablecer</button>
        <button type="button" aria-label="Aumentar texto" disabled={fontSize >= 200} onClick={() => setFontSize(value => Math.min(200, value + 10))}>A+</button>
      </div></div>
      <label className="bb-accessibility-font">Tipografía<select aria-label="Tipografía" value={font} onChange={event => setFont(event.target.value)}>{FONTS.map(name => <option key={name}>{name}</option>)}</select></label>
      <button type="button" className="bb-accessibility-reader" onClick={toggleSpeech} disabled={!speechAvailable} aria-pressed={speaking}><StoreIcon name="headset" />{speaking ? 'Detener lectura' : speechAvailable ? 'Leer página' : 'Lectura no disponible'}</button>
    </section>}
  </div>;
}

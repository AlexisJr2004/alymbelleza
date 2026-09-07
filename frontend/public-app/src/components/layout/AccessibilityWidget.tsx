import { useEffect, useRef, useState } from 'react';

const FONTS = ['Quicksand', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];

// Puerto del widget de accesibilidad (#dropdownDefaultButton/#dropdown en
// index.html + changeZoom/changeFont/changeFontSize/toggleTextToSpeech en
// js/main.js). Las posiciones fixed (bottom-[140px]/[200px], left-8) y el
// tamaño 50px del botón vienen de reglas por id en css/style.css que ganaban
// por especificidad a las clases w-12/h-12 del HTML original; se reproducen
// acá como valores arbitrarios de Tailwind para el mismo resultado visual.
export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [, setZoom] = useState(100);
  const [, setFontSize] = useState(100);
  const [fontIndex, setFontIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
      const idx = FONTS.indexOf(savedFont);
      setFontIndex(idx === -1 ? 0 : idx);
      document.body.style.fontFamily = savedFont;
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const changeZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      const next = Math.max(50, Math.min(direction === 'in' ? prev + 10 : prev - 10, 200));
      document.body.style.zoom = `${next}%`;
      return next;
    });
  };

  const resetZoom = () => {
    setZoom(100);
    document.body.style.zoom = '100%';
  };

  const changeFont = () => {
    const nextIndex = (fontIndex + 1) % FONTS.length;
    setFontIndex(nextIndex);
    document.body.style.fontFamily = FONTS[nextIndex];
    localStorage.setItem('selectedFont', FONTS[nextIndex]);
  };

  const changeFontSize = (action: 'increase' | 'decrease') => {
    setFontSize((prev) => {
      let next = prev;
      if (action === 'increase' && prev < 200) next = prev + 10;
      else if (action === 'decrease' && prev > 80) next = prev - 10;
      document.body.style.fontSize = `${next}%`;
      return next;
    });
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.body.style.fontSize = '100%';
  };

  const toggleTextToSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(document.body.innerText);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Opciones de accesibilidad"
        className="animate-pulse fixed z-50 bottom-[140px] left-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300 w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span className="fas fa-person text-lg text-white" />
      </button>

      <div
        className={`fixed z-50 bottom-[200px] left-8 bg-white rounded-xl shadow-lg w-72 border border-gray-100 transition-all duration-300 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
        }`}
      >
        <div className="px-4 py-3">
          <ul className="space-y-4">
            <li>
              <h4 className="text-lg font-semibold text-gray-800 text-center pb-1.5 border-b border-gray-200">Opciones de Accesibilidad</h4>
            </li>
            <li>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-600 mb-2">Zoom</p>
                <div className="flex justify-between items-center gap-2">
                  <button type="button" onClick={() => changeZoom('in')} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <i className="fas fa-search-plus text-indigo-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button type="button" onClick={() => changeZoom('out')} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <i className="fas fa-search-minus text-indigo-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button type="button" onClick={resetZoom} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <i className="fas fa-undo text-indigo-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-600 mb-2">Tamaño de texto</p>
                <div className="flex justify-between items-center gap-2">
                  <button type="button" onClick={() => changeFontSize('increase')} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <span className="text-indigo-600 font-bold group-hover:scale-110 transition-transform inline-block">A+</span>
                  </button>
                  <button type="button" onClick={() => changeFontSize('decrease')} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <span className="text-indigo-600 font-bold group-hover:scale-110 transition-transform inline-block">A-</span>
                  </button>
                  <button type="button" onClick={resetFontSize} className="flex-1 p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 group">
                    <i className="fas fa-undo text-indigo-600 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div className="space-y-2">
                <button type="button" onClick={changeFont} className="w-full p-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-indigo-600 group">
                  <i className="fas fa-font mr-1.5 group-hover:scale-110 transition-transform inline-block" />
                  <span className="font-medium text-sm current-font-name">{FONTS[fontIndex]}</span>
                </button>
                <button type="button" onClick={toggleTextToSpeech} className="w-full p-2.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-indigo-600 group">
                  <i className="fas fa-volume-up mr-1.5 group-hover:scale-110 transition-transform inline-block" />
                  <span className="font-medium text-sm">Lector de Página</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

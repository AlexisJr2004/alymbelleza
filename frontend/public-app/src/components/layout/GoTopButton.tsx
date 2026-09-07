import { useEffect, useState } from 'react';

// Puerto de setupGoTopButton() en js/main.js.
export default function GoTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 100);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="z-50 fixed bottom-36 right-4 flex flex-col space-y-6 items-center">
      <button
        type="button"
        title="Ir arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-500 ease-in-out text-white px-4 py-2 rounded-full shadow-md transform ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <i className="fas fa-caret-up" />
      </button>
    </div>
  );
}

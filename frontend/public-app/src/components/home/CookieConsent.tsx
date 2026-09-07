import { useEffect, useState, type FormEvent } from 'react';
import { notifySuccess } from '../../lib/sweetalert';

const PREFERENCE_KEYS = ['performanceCookies', 'personalizationCookies', 'thirdPartyCookies'] as const;

// Puerto de la sección de cookies (banner + modales de política/gestión) de
// index.html y setupCookieConsent() en js/main.js. Único ajuste deliberado
// frente al original: el sitio viejo mostraba el banner 1s después de CADA
// carga de página sin importar si ya se había elegido una preferencia
// (accept-all/reject-all no guardaban nada en localStorage). Acá sí se
// respeta lo ya guardado y el banner no vuelve a aparecer una vez que el
// usuario decidió algo, que es el comportamiento esperado de un banner de
// cookies real.
export default function CookieConsent() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [prefs, setPrefs] = useState({ performanceCookies: false, personalizationCookies: false, thirdPartyCookies: false });

  useEffect(() => {
    const alreadyDecided = PREFERENCE_KEYS.some((key) => localStorage.getItem(key) !== null);
    if (alreadyDecided) return;
    const timer = setTimeout(() => setBannerVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const closeBanner = () => {
    setClosing(true);
    setTimeout(() => {
      setBannerVisible(false);
      setClosing(false);
    }, 500);
  };

  const persistPrefs = (values: { performanceCookies: boolean; personalizationCookies: boolean; thirdPartyCookies: boolean }) => {
    localStorage.setItem('performanceCookies', String(values.performanceCookies));
    localStorage.setItem('personalizationCookies', String(values.personalizationCookies));
    localStorage.setItem('thirdPartyCookies', String(values.thirdPartyCookies));
  };

  const acceptAll = () => {
    persistPrefs({ performanceCookies: true, personalizationCookies: true, thirdPartyCookies: true });
    closeBanner();
  };

  const rejectAll = () => {
    persistPrefs({ performanceCookies: false, personalizationCookies: false, thirdPartyCookies: false });
    closeBanner();
  };

  const openManageCookies = () => {
    setPrefs({
      performanceCookies: localStorage.getItem('performanceCookies') === 'true',
      personalizationCookies: localStorage.getItem('personalizationCookies') === 'true',
      thirdPartyCookies: localStorage.getItem('thirdPartyCookies') === 'true',
    });
    setManageOpen(true);
    closeBanner();
  };

  const handleSavePreferences = (e: FormEvent) => {
    e.preventDefault();
    persistPrefs(prefs);
    setManageOpen(false);
    notifySuccess('Preferencias guardadas', 'Tus preferencias de cookies han sido actualizadas.');
  };

  if (!bannerVisible && !policyOpen && !manageOpen) return null;

  return (
    <>
      {bannerVisible && (
        <div className="fixed bottom-0 end-0 z-[90] sm:max-w-sm w-full mx-auto p-6">
          <div className={`p-4 bg-white/60 backdrop-blur-lg rounded-xl shadow-2xl shadow-gray-300/70 ${closing ? 'animate-slide-out-bottom' : 'animate-slide-in-bottom'}`}>
            <div className="flex justify-between gap-x-5">
              <div className="grow">
                <h2 className="font-semibold text-gray-800">Configuración de Cookies</h2>
              </div>
              <button
                type="button"
                onClick={closeBanner}
                className="inline-flex rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-800">
              Utilizamos cookies para mejorar tu experiencia. Visita nuestra{' '}
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium"
              >
                Política de Cookies
              </button>{' '}
              para más información.
            </p>
            <div className="mt-5 mb-2 w-full flex gap-x-2">
              <div className="grid w-full">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Aceptar todas
                </button>
              </div>
              <div className="grid w-full">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Rechazar todas
                </button>
              </div>
            </div>
            <div className="grid w-full">
              <button
                type="button"
                onClick={openManageCookies}
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                Gestionar cookies
              </button>
            </div>
          </div>
        </div>
      )}

      {policyOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99999] opacity-100 flex items-center justify-center transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPolicyOpen(false);
          }}
        >
          <div className="animate-fade-in bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button type="button" onClick={() => setPolicyOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none">
              &times;
            </button>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Política de Cookies</h2>
            <div className="text-gray-700 space-y-4 text-base">
              <p>
                En <strong>Bella Beauty</strong> utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico y
                personalizar el contenido. Las cookies nos permiten recordar tus preferencias y ofrecerte servicios adaptados a tus
                intereses, como la reserva online, el carrito de compras y el acceso a tu perfil.
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico del sitio, como el inicio de sesión y la
                  gestión de tu carrito.
                </li>
                <li>
                  <strong>Cookies de rendimiento:</strong> nos ayudan a entender cómo usas la web para mejorar nuestros servicios y
                  productos.
                </li>
                <li>
                  <strong>Cookies de personalización:</strong> recuerdan tus preferencias de accesibilidad, idioma y configuración de
                  usuario.
                </li>
                <li>
                  <strong>Cookies de terceros:</strong> pueden ser usadas por servicios externos como redes sociales, análisis de visitas
                  y el chatbot de asistencia.
                </li>
              </ul>
              <p>
                Puedes gestionar tus preferencias de cookies en cualquier momento desde la configuración. Para más información,
                contáctanos en{' '}
                <a href="mailto:info@bellabeauty.com" className="text-blue-600 underline">
                  info@bellabeauty.com
                </a>{' '}
                o revisa nuestra sección de{' '}
                <a href="#contacto" className="text-blue-600 underline" onClick={() => setPolicyOpen(false)}>
                  Contacto
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {manageOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99999] opacity-100 flex items-center justify-center transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setManageOpen(false);
          }}
        >
          <div className="animate-fade-in bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button type="button" onClick={() => setManageOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none">
              &times;
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4">Gestionar preferencias de cookies</h2>
            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">Cookies esenciales</span>
                  <p className="text-xs text-gray-500">Necesarias para el funcionamiento básico.</p>
                </div>
                <input type="checkbox" checked disabled className="form-checkbox h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">Cookies de rendimiento</span>
                  <p className="text-xs text-gray-500">Ayudan a mejorar nuestros servicios y productos.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.performanceCookies}
                  onChange={(e) => setPrefs((p) => ({ ...p, performanceCookies: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">Cookies de personalización</span>
                  <p className="text-xs text-gray-500">Recuerdan tus preferencias de accesibilidad, idioma y usuario.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.personalizationCookies}
                  onChange={(e) => setPrefs((p) => ({ ...p, personalizationCookies: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">Cookies de terceros</span>
                  <p className="text-xs text-gray-500">Servicios externos como redes sociales, análisis y chatbot.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.thirdPartyCookies}
                  onChange={(e) => setPrefs((p) => ({ ...p, thirdPartyCookies: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow transition-all"
                >
                  Guardar preferencias
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

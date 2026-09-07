// Puerto de "Nuestros Servicios Premium". En el sitio viejo estas pestañas
// dependen del plugin JS de Preline (atributos data-hs-tab / variantes
// hs-tab-active:*), que nunca se llegó a cargar (no hay <script> de Preline
// ni el plugin de Tailwind en frontend/tailwind.config.js). Resultado real en
// producción: los botones no reaccionan al click y solo el panel de
// "Tratamientos Faciales" se muestra (los otros dos quedan con `hidden`
// puesto a mano en el HTML). Se replica ese mismo comportamiento estático en
// vez de agregar una interactividad que nunca existió.
const TABS = [
  {
    title: 'Tratamientos Faciales',
    description: 'Rejuvenecimiento y cuidado especializado para todo tipo de piel',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </>
    ),
  },
  {
    title: 'Manicure & Pedicure',
    description: 'Técnicas profesionales para manos y pies impecables',
    icon: (
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </>
    ),
  },
  {
    title: 'Terapia de Masajes',
    description: 'Relajación profunda y tratamiento para tensiones musculares',
    icon: (
      <>
        <path d="M4 12a8 8 0 0 1 16 0z" />
        <path d="M12 4v16" />
      </>
    ),
  },
];

export default function ServicesTabsSection() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="relative p-6 md:p-16">
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
            <h2 className="text-2xl text-gray-800 font-bold sm:text-3xl">Nuestros Servicios Premium</h2>
            <p className="text-gray-600 mt-3">Descubre la excelencia en cada detalle de nuestros tratamientos de belleza</p>

            <nav className="grid gap-4 mt-5 md:mt-10" aria-label="Tabs">
              {TABS.map((tab, index) => (
                <button
                  key={tab.title}
                  type="button"
                  className={`text-start hover:bg-purple-50 focus:outline-hidden focus:bg-purple-50 p-4 md:p-5 rounded-xl border border-transparent hover:border-purple-100 transition-all ${index === 0 ? 'bg-white shadow-md' : ''}`}
                  aria-selected={index === 0}
                >
                  <span className="flex gap-x-6">
                    <svg
                      className={`shrink-0 mt-2 size-6 md:size-7 text-gray-800 ${index === 0 ? 'text-purple-600' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {tab.icon}
                    </svg>
                    <span className="grow">
                      <span className={`block text-lg font-semibold text-gray-800 ${index === 0 ? 'text-purple-600' : ''}`}>{tab.title}</span>
                      <span className="block mt-1 text-gray-800">{tab.description}</span>
                    </span>
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <img
                  className="w-full h-auto object-cover"
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Tratamiento facial profesional"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">Faciales Personalizados</h3>
                  <p className="text-sm opacity-90">Desde limpieza profunda hasta tratamientos anti-age</p>
                </div>
              </div>

              <div className="hidden absolute -bottom-8 -left-8 md:block">
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-12 size-full">
          <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-gradient-to-b from-purple-50 to-white w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full" />
        </div>
      </div>
    </div>
  );
}

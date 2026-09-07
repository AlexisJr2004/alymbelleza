import { useRef, type MouseEvent } from 'react';

const STATS = [
  { value: '15+', label: 'Consultas Expertas Diarias' },
  { value: '200+', label: 'Clientes Activos' },
  { value: '2+', label: 'Trabajos Diarios' },
  { value: '10/10', label: 'Atención' },
];

// Puerto de setupLightEffect() de js/main.js: en vez de addEventListener
// imperativo sobre .light-container/.light-follow, usa los handlers de React
// directamente sobre el contenedor.
export default function StatsSection() {
  const lightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const light = lightRef.current;
    if (!light) return;
    light.style.left = `${e.clientX - rect.left}px`;
    light.style.top = `${e.clientY - rect.top}px`;
    light.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (lightRef.current) lightRef.current.style.opacity = '0';
  };

  return (
    <section className="py-10 cursor-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl py-10 px-10 xl:py-16 xl:px-20 bg-gray-50 flex items-center justify-between flex-col gap-16 lg:flex-row relative overflow-hidden light-container"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={lightRef} className="light-follow" />

          <div className="w-full lg:w-60 relative z-10">
            <h2 className="font-manrope text-4xl font-bold text-gray-900 mb-4 text-center lg:text-left">Nuestras Estadísticas</h2>
            <p className="text-sm text-gray-500 leading-6 text-center lg:text-left">Resumen estadístico de nuestra empresa.</p>
          </div>
          <div className="w-full lg:w-4/5 relative z-10">
            <div className="grid grid-cols-2 gap-10 lg:flex lg:flex-row lg:justify-between">
              {STATS.map((stat) => (
                <div className="block" key={stat.label}>
                  <div className="font-manrope font-bold text-4xl text-indigo-600 mb-3 text-center lg:text-left">{stat.value}</div>
                  <span className="text-gray-900 text-center block lg:text-left">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

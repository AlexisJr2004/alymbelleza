import FaqAccordion from './FaqAccordion';

export default function FaqSection() {
  return (
    <section className="container mx-auto px-6 py-24 relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
      <div className="text-center mb-6 lg:mb-16">
        <div className="mb-6 flex justify-center items-center space-x-4">
          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            Preguntas frecuentes
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">¿Cómo podemos ayudarte?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Resuelve tus dudas sobre nuestros servicios, productos y políticas. Si no encuentras tu respuesta, ¡contáctanos
          directamente!
        </p>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between">
          <div className="w-full lg:w-1/2 group relative overflow-hidden rounded-3xl shadow-lg perspective-1000 animate-fade-in-right">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 z-10" />
            <div className="relative transform-gpu transition-all duration-500 group-hover:scale-105 z-20">
              <img
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Cliente recibiendo tratamiento facial"
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/70 to-transparent h-1/3 rounded-b-3xl" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 animate-fade-in-right" style={{ animationDelay: '200ms' }}>
            <div className="lg:max-w-xl">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-16 relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-right">
          <div className="mb-6 flex items-center space-x-4">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              Nueva Colección 2025
            </span>
            <div className="flex text-amber-400">
              {['', 'delay-100', 'delay-200', 'delay-300', 'delay-400'].map((delay, i) => (
                <svg key={i} className={`w-4 h-4 fill-current animate-pulse ${delay}`} viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
            Belleza Natural,
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold mt-2">
              Elegancia Atemporal
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Descubre una experiencia de belleza personalizada que realza tu elegancia natural con productos premium y
            tratamientos exclusivos.
          </p>

          <div className="flex space-x-4">
            <a
              href="#servicios"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-purple-700 hover:to-pink-700"
            >
              Explorar Servicios
            </a>
            <a
              href="#productos"
              className="bg-white/80 backdrop-blur-sm border border-purple-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Ver Productos
            </a>
          </div>
        </div>

        <div className="hidden md:block relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 z-10" />

            <img
              src="https://www.universia.net/content/dam/universia/imagenes/2020/12/estilista%20profesional%20MX-min.jpg"
              alt="Bella Beauty Treatment"
              className="relative z-20 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-3xl transform-gpu hover:rotate-1 hover:shadow-2xl"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/70 to-transparent h-1/2 rounded-b-3xl z-30" />
          </div>

          <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 animate-float z-40 border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-display text-purple-900">100 +</h3>
                <p className="text-sm text-purple-600 uppercase tracking-wider">Clientes Felices</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 animate-float z-40 border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-display text-purple-900">5 +</h3>
                <p className="text-sm text-purple-600 uppercase tracking-wider">Tratamientos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

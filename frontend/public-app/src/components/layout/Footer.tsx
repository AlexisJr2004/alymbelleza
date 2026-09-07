export default function Footer() {
  return (
    <section
      className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bella Beauty</span>
            </div>

            <div className="mt-8 lg:mt-0">
              <form className="flex flex-col sm:flex-row sm:gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  className="w-full rounded-full border-gray-300 bg-gray-100 px-5 py-3 placeholder-gray-500 focus:outline-none sm:max-w-xs"
                  placeholder="Ingresa tu email para novedades"
                />
                <button
                  type="submit"
                  className="mt-3 sm:mt-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition duration-300 px-4 py-2 shadow-md hover:shadow-lg text-white"
                >
                  Suscribirse
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Sobre Nosotros</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Transformando la belleza en una experiencia única y personalizada.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Navegación</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="/productos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/#contacto" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Servicios</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Tratamientos Faciales
                  </a>
                </li>
                <li>
                  <a href="/#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Masajes Terapéuticos
                  </a>
                </li>
                <li>
                  <a href="/#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Maquillaje Profesional
                  </a>
                </li>
                <li>
                  <a href="/#servicios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Consultoría
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">Av. Principal 123, Ciudad</li>
                <li className="text-sm text-gray-600">info@bellabeauty.com</li>
                <li className="text-sm text-gray-600">+1 234 567 890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Bella Beauty. Todos los derechos reservados.</p>
              <div className="flex space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacidad
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Términos
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150">
        <defs>
          <linearGradient id="footer-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#f7affa" />
            <stop offset="95%" stopColor="#6dd5ed" />
          </linearGradient>
        </defs>
        <path
          d="M 0,500 C 0,500 0,166 0,166 C 107.2153110047847,190.9665071770335 214.4306220095694,215.93301435406698 317,210 C 419.5693779904306,204.06698564593302 517.4928229665072,167.23444976076556 606,157 C 694.5071770334928,146.76555023923444 773.598086124402,163.12918660287082 866,164 C 958.401913875598,164.87081339712918 1064.1148325358852,150.2488038277512 1162,148 C 1259.8851674641148,145.7511961722488 1349.9425837320573,155.8755980861244 1440,166 C 1440,166 1440,500 1440,500 Z"
          stroke="none"
          strokeWidth={0}
          fill="url(#footer-gradient)"
          fillOpacity={0.53}
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        />
        <path
          d="M 0,500 C 0,500 0,333 0,333 C 77.34928229665073,329.6794258373206 154.69856459330146,326.3588516746412 247,319 C 339.30143540669854,311.6411483253588 446.555023923445,300.24401913875596 540,316 C 633.444976076555,331.75598086124404 713.0813397129187,374.6650717703349 820,394 C 926.9186602870813,413.3349282296651 1061.1196172248804,409.0956937799043 1169,395 C 1276.8803827751196,380.9043062200957 1358.44019138756,356.95215311004785 1440,333 C 1440,333 1440,500 1440,500 Z"
          stroke="none"
          strokeWidth={0}
          fill="url(#footer-gradient)"
          fillOpacity={1}
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        />
      </svg>
    </section>
  );
}

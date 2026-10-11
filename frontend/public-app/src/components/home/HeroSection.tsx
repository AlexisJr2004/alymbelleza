// Misma foto que ya usa AuthShowcasePanel (y antes, la caja chica del hero
// viejo) — se reutiliza acá en vez de sumar una imagen de stock nueva.
const HERO_IMAGE = 'https://www.universia.net/content/dam/universia/imagenes/2020/12/estilista%20profesional%20MX-min.jpg';
// pravatar.cc: mismo servicio placeholder ya usado en el flujo de auth
// (verificado que responde 200, a diferencia del fallback roto del resto
// del sitio).
const CLUSTER_AVATARS = ['https://i.pravatar.cc/80?img=47', 'https://i.pravatar.cc/80?img=5', 'https://i.pravatar.cc/80?img=9'];

// Puerto fiel de beauty-space.html (estructura de foto a pantalla completa
// con texto superpuesto, paleta cálida sand/ink tomada literal de la
// referencia) adaptado a Bella Beauty. Se deja afuera de la adaptación:
// el navbar incrustado en la tarjeta (redundante con el header real del
// sitio, que ya está arriba de esta sección) y la fila de tarjetas de
// producto (StatsSection y FeaturedProducts, que van justo debajo en
// HomePage.tsx, ya cubren esos dos trabajos con datos reales). Las dos
// tarjetas flotantes de estadística se quedan — son las mismas que ya
// tenía este hero ("100+ Clientes Felices" / "5+ Tratamientos"), solo
// reubicadas y restyladas al lenguaje visual de la referencia.
export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[32px] shadow-[0_50px_80px_-30px_rgba(60,50,40,.35)] lg:h-[660px] lg:rounded-[40px]">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_22%]" />
        <div className="absolute inset-0 bg-[#cbbcae] opacity-40 mix-blend-multiply" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#a99d91]/60 via-transparent to-[#a99d91]/30" aria-hidden="true" />

        <div className="relative z-10 flex flex-col gap-10 p-6 sm:p-10 lg:block lg:h-full lg:p-0">
          <div className="max-w-[420px] text-white lg:absolute lg:left-10 lg:top-[108px]">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              Belleza Natural,
              <span className="mt-2 block font-bold">Elegancia Atemporal</span>
            </h1>
            <p className="mt-5 max-w-[360px] text-[15px] leading-relaxed text-white/90">
              Descubre una experiencia de belleza personalizada que realza tu elegancia natural con productos premium y
              tratamientos exclusivos.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#servicios"
                className="flex h-[46px] items-center gap-3 rounded-full bg-white pl-5 pr-2 text-[14px] font-medium text-[#1a1a1a] shadow-sm transition hover:bg-white/90"
              >
                Explorar Servicios
                <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#141414] text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
              <a
                href="#productos"
                className="flex h-[46px] items-center rounded-full border border-white/40 bg-white/15 px-6 text-[14px] font-medium text-white backdrop-blur-md transition hover:bg-white/25"
              >
                Ver Productos
              </a>
            </div>
          </div>

          <div className="animate-float self-start rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgba(60,45,30,.35)] lg:absolute lg:bottom-10 lg:left-10">
            <div className="flex items-center gap-4">
              <div className="relative flex -space-x-3">
                {CLUSTER_AVATARS.map((src) => (
                  <img key={src} src={src} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                ))}
              </div>
              <div>
                <p className="text-xl font-semibold leading-none tracking-tight text-gray-900">100 +</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Clientes Felices</p>
              </div>
            </div>
          </div>

          <div className="animate-float self-end rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgba(60,45,30,.35)] lg:absolute lg:right-10 lg:top-10">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold leading-none tracking-tight text-gray-900">5 +</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Tratamientos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

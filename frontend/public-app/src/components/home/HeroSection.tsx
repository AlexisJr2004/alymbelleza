const CARD_BG = `
  radial-gradient(45% 40% at 25% 100%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%),
  radial-gradient(50% 55% at 85% 75%, rgba(255,244,236,.45), rgba(255,244,236,0) 70%),
  linear-gradient(172deg, #c4876a 0%, #d4a083 30%, #e7c7b4 62%, #f0dccf 100%)
`;

export default function HeroSection() {
  return (
    <section className="font-josefin container relative mx-auto overflow-hidden px-6 py-16">
      {/* ===================== MARCO DE VIDRIO ===================== */}
      <div className="relative rounded-[36px] border border-white/50 bg-white/20 p-2 shadow-[0_30px_60px_-30px_rgba(90,45,20,.35)] backdrop-blur-sm">
        <div
          className="relative overflow-hidden rounded-[29px] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
          style={{ background: CARD_BG }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ---------------- TEXTO ---------------- */}
            <div className="flex flex-col gap-6">
              <h1 className="text-[40px] font-normal uppercase leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
                <span className="block">Belleza Natural</span>
                <span className="block">Elegancia Atemporal</span>
              </h1>

              <p className="max-w-md text-[15px] leading-relaxed text-white/95">
                Descubre una experiencia de belleza personalizada que realza tu elegancia natural con productos
                premium y tratamientos exclusivos.
              </p>

              {/* ---------------- BOTONES ---------------- */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#servicios"
                  className="inline-flex h-[44px] items-center gap-[9px] rounded-full bg-white pl-5 pr-1.5 text-[14px] font-semibold text-[#3b2418] shadow-[0_6px_16px_-8px_rgba(80,40,20,.4)] transition hover:bg-white/90"
                >
                  Explorar Servicios
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#6b3a22] text-white">
                    <svg
                      className="h-[15px] w-[15px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
                <a
                  href="#productos"
                  className="inline-flex h-[44px] items-center gap-[9px] rounded-full border border-[#6b3a22]/80 bg-white/15 pl-5 pr-1.5 text-[14px] text-white transition hover:bg-white/35"
                >
                  Ver Productos
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white text-[#3b2418]">
                    <svg
                      className="h-[15px] w-[15px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </div>

              <p className="pt-2 text-[12px] leading-snug text-white/80">Tu belleza, nuestra pasión.</p>
            </div>

            {/* ---------------- ESCENA DEL PRODUCTO ---------------- */}
            <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
              <svg
                viewBox="0 0 470 500"
                overflow="visible"
                className="relative mx-auto w-full max-w-[360px] lg:max-w-[420px]"
                role="img"
                aria-label="Sérum Bella Beauty con hoja, gel y burbujas"
              >
                <defs>
                  <linearGradient id="leafG" x1="0" x2="1">
                    <stop offset="0" stopColor="#2f5520" />
                    <stop offset=".5" stopColor="#5d8a3a" />
                    <stop offset="1" stopColor="#3b6626" />
                  </linearGradient>
                  <linearGradient id="glassG" x1="0" x2="1">
                    <stop offset="0" stopColor="#e3e0dc" />
                    <stop offset=".3" stopColor="#fbfaf8" />
                    <stop offset=".7" stopColor="#f1efec" />
                    <stop offset="1" stopColor="#d4cfc9" />
                  </linearGradient>
                  <linearGradient id="metalG" x1="0" x2="1">
                    <stop offset="0" stopColor="#7f776f" />
                    <stop offset=".25" stopColor="#d8d2ca" />
                    <stop offset=".45" stopColor="#9c938a" />
                    <stop offset=".7" stopColor="#ebe6df" />
                    <stop offset="1" stopColor="#857c73" />
                  </linearGradient>
                  <linearGradient id="bulbG" x1="0" x2="1">
                    <stop offset="0" stopColor="#e2ded9" />
                    <stop offset=".4" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#d6d1cb" />
                  </linearGradient>
                  <linearGradient id="gelG" x1="0" x2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity=".75" />
                    <stop offset=".5" stopColor="#fff" stopOpacity=".2" />
                    <stop offset="1" stopColor="#fff" stopOpacity=".6" />
                  </linearGradient>
                  <radialGradient id="bubbleG">
                    <stop offset=".6" stopColor="#fff" stopOpacity="0" />
                    <stop offset=".92" stopColor="#fff" stopOpacity=".35" />
                    <stop offset="1" stopColor="#fff" stopOpacity=".8" />
                  </radialGradient>
                  <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="16" />
                  </filter>
                  <g id="bubble">
                    <circle r="1" fill="url(#bubbleG)" stroke="#fff" strokeOpacity=".7" strokeWidth=".03" />
                    <ellipse
                      cx="-.38"
                      cy="-.42"
                      rx=".22"
                      ry=".12"
                      transform="rotate(-35 -.38 -.42)"
                      fill="#fff"
                      opacity=".85"
                    />
                    <path d="M.55.45A.7.7 0 0 1-.1.8" stroke="#fff" strokeWidth=".05" fill="none" opacity=".6" />
                  </g>
                </defs>

                {/* Hoja */}
                <g transform="translate(41 79) rotate(43.4)">
                  <path d="M500 0L532 5" stroke="#3b6626" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0 0Q180-150 500 0Q200 125 0 0Z" fill="url(#leafG)" />
                  <path d="M0 0Q250-12 500 0" stroke="#a9c07a" strokeWidth="2" fill="none" opacity=".7" />
                  <g stroke="#86a65c" strokeWidth="1.2" fill="none" opacity=".55">
                    <path d="M90-6Q120-50 150-70" />
                    <path d="M170-9Q205-55 240-72" />
                    <path d="M260-9Q300-50 335-60" />
                    <path d="M350-6Q385-35 410-42" />
                    <path d="M120-6Q150 25 180 40" />
                    <path d="M220-8Q255 28 290 42" />
                    <path d="M320-7Q350 20 380 30" />
                  </g>
                  <g fill="#fff" opacity=".8">
                    <circle cx="300" cy="-30" r="3" />
                    <circle cx="330" cy="10" r="2.5" />
                    <circle cx="270" cy="-52" r="2" />
                    <circle cx="380" cy="-20" r="3.5" />
                    <circle cx="362" cy="24" r="2" />
                    <circle cx="420" cy="-10" r="2.5" />
                    <circle cx="250" cy="20" r="2" />
                  </g>
                </g>

                {/* Gel (parte trasera) */}
                <g transform="translate(205 300) rotate(-8)">
                  <ellipse rx="190" ry="55" fill="none" stroke="url(#gelG)" strokeWidth="16" opacity=".55" />
                  <ellipse rx="190" ry="55" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".7" />
                  <ellipse rx="176" ry="47" fill="none" stroke="#fff" strokeWidth="1" opacity=".45" />
                </g>
                <path
                  d="M30 230Q-5 280 20 330Q40 380 90 384Q60 340 70 300Q80 260 30 230Z"
                  fill="url(#gelG)"
                  opacity=".5"
                  stroke="#fff"
                  strokeOpacity=".7"
                />

                {/* Botella */}
                <g transform="translate(200 280) rotate(-22)">
                  <ellipse cx="22" cy="12" rx="105" ry="160" fill="#8a5a40" opacity=".18" filter="url(#softBlur)" />
                  <path
                    d="M-94-110Q-94-140-64-140H64Q94-140 94-110V128Q94 140 82 140H-82Q-94 140-94 128Z"
                    fill="url(#glassG)"
                  />
                  <path d="M-80-116V124" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".55" />
                  <path d="M84-110V124" stroke="#c9c3bb" strokeWidth="4" strokeLinecap="round" opacity=".5" />
                  <rect x="-26" y="-154" width="52" height="16" fill="#d8d2ca" />
                  <rect x="-44" y="-222" width="88" height="70" rx="5" fill="url(#metalG)" />
                  <path d="M-44-212H44M-44-206H44M-44-162H44" stroke="#6f675f" strokeWidth=".8" opacity=".5" />
                  <path d="M-30-222V-262Q-30-290 0-290Q30-290 30-262V-222Z" fill="url(#bulbG)" />
                </g>

                {/* Gel (parte delantera) */}
                <g transform="translate(205 300) rotate(-8)">
                  <path d="M-185 14A190 55 0 0 0 185 14" fill="none" stroke="#fff" strokeWidth="10" opacity=".3" />
                  <path d="M-185 14A190 55 0 0 0 185 14" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".75" />
                </g>

                {/* Burbujas */}
                <use href="#bubble" transform="translate(29 182) scale(22)" />
                <use href="#bubble" transform="translate(379 182) scale(26)" />
                <use href="#bubble" transform="translate(75 397) scale(24)" />
                <use href="#bubble" transform="translate(354 435) scale(37)" />
                <use href="#bubble" transform="translate(387 370) scale(7.5)" />
                <use href="#bubble" transform="translate(112 262) scale(5)" />

                {/* Brillo inferior */}
                <ellipse cx="230" cy="470" rx="190" ry="40" fill="#fff" opacity=".6" filter="url(#softBlur)" />
              </svg>

              {/* ---------------- TARJETA DE ESTADÍSTICA (flotante) ---------------- */}
              <div className="relative z-10 -mt-10 flex flex-col gap-5 rounded-[20px] border border-white/55 bg-white/25 p-6 shadow-[0_10px_30px_-18px_rgba(90,45,20,.35)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-7 lg:-mt-6">
                <div className="relative mx-auto h-[88px] w-[116px] shrink-0 sm:mx-0">
                  <svg viewBox="0 0 116 88" className="absolute inset-0 h-full w-full" aria-hidden="true">
                    <defs>
                      <path id="wleaf" d="M0 0Q4-5 0-11Q-4-5 0 0Z" />
                      <g id="branch" fill="#8f7867">
                        <path d="M50 84Q18 72 14 40Q14 22 25 6" stroke="#8f7867" strokeWidth="1.1" fill="none" />
                        <use href="#wleaf" transform="translate(44 82) rotate(-135)" />
                        <use href="#wleaf" transform="translate(38 79) rotate(-60)" />
                        <use href="#wleaf" transform="translate(30 73) rotate(-105)" />
                        <use href="#wleaf" transform="translate(25 67) rotate(-35)" />
                        <use href="#wleaf" transform="translate(19 58) rotate(-75)" />
                        <use href="#wleaf" transform="translate(16 49) rotate(-12)" />
                        <use href="#wleaf" transform="translate(14 39) rotate(-50)" />
                        <use href="#wleaf" transform="translate(14 30) rotate(8)" />
                        <use href="#wleaf" transform="translate(17 21) rotate(-28)" />
                        <use href="#wleaf" transform="translate(20 14) rotate(22)" />
                        <use href="#wleaf" transform="translate(25 6) rotate(-5)" />
                      </g>
                    </defs>
                    <use href="#branch" />
                    <use href="#branch" transform="translate(116 0) scale(-1 1)" />
                  </svg>
                  <div className="relative flex h-full flex-col items-center justify-center pt-1 text-center">
                    <span className="text-[24px] font-semibold leading-none text-[#3b2418]">100+</span>
                    <span className="mt-[3px] text-[8.5px] leading-[10px] text-[#5a4234]">
                      Clientes
                      <br />
                      Felices
                    </span>
                  </div>
                </div>
                <span className="hidden h-[94px] w-px shrink-0 bg-white/60 sm:block" aria-hidden="true" />
                <div className="sm:ml-[2px]">
                  <h2 className="text-[20px] font-normal leading-tight text-[#3b2418]">Experiencia Personalizada</h2>
                  <p className="mt-[14px] max-w-[275px] text-[10.5px] leading-[14px] text-[#4a3226]">
                    Productos premium y tratamientos exclusivos pensados para realzar tu elegancia natural.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Misma foto que ya usa el hero de Home (HeroSection.tsx) — se reutiliza acá
// en vez de sumar una imagen de stock nueva al sitio.
const HERO_IMAGE = 'https://www.universia.net/content/dam/universia/imagenes/2020/12/estilista%20profesional%20MX-min.jpg';
// pravatar.cc: servicio estable de fotos placeholder, el mismo que usa
// login-crextio.html — a diferencia del fallback de avatar del resto del
// sitio (i.ibb.co/...), que devuelve 404, este sí responde 200 (verificado).
const CLUSTER_AVATARS = ['https://i.pravatar.cc/150?img=47', 'https://i.pravatar.cc/150?img=45', 'https://i.pravatar.cc/150?img=44'];
const TEAM_AVATARS = ['https://i.pravatar.cc/60?img=12', 'https://i.pravatar.cc/60?img=32', 'https://i.pravatar.cc/60?img=5', 'https://i.pravatar.cc/60?img=68'];

const WEEK_DAYS = [
  { label: 'Dom', num: 22 },
  { label: 'Lun', num: 23 },
  { label: 'Mar', num: 24 },
  { label: 'Mié', num: 25 },
  { label: 'Jue', num: 26 },
  { label: 'Vie', num: 27 },
  { label: 'Sáb', num: 28 },
];

interface AuthShowcasePanelProps {
  onClose: () => void;
}

// Panel derecho compartido por Login/Register: la foto a pantalla completa
// con las tarjetas flotantes (notificación apilada, racimo de avatares,
// calendario + próxima cita con textura rayada) y el recorte/"fillet" de
// la esquina donde va el botón de cerrar de escritorio — calcado de
// login-crextio.html. Oculto en mobile (el formulario es lo único crítico
// ahí); el botón de cerrar de mobile vive en AuthCardShell.
export default function AuthShowcasePanel({ onClose }: AuthShowcasePanelProps) {
  return (
    <section className="relative hidden flex-1 py-[18px] pr-[18px] lg:block">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[30px]" aria-hidden="true">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />

          {/* Tarjeta apilada: capa de cristal oscuro detrás (primero en el
              DOM, sin z-index) + tarjeta sólida en degradado de marca
              encima. */}
          <div className="absolute left-[10.2%] top-[3.4%] h-[77px] w-[203px]">
            <div className="absolute left-[11px] top-[28px] h-[49px] w-[192px] rounded-[10px] bg-[#2c2235]/55 backdrop-blur-md">
              <span className="absolute right-[13px] top-[13px] h-[7px] w-[7px] rounded-full bg-pink-300" />
              <p className="absolute bottom-[11px] left-[28px] text-[10px] text-white/70">3:00 PM</p>
            </div>
            <div className="absolute left-0 top-0 h-[50px] w-[176px] rounded-[10px] bg-gradient-to-r from-purple-600 to-pink-600 px-[13px] py-[9px] shadow-[0_8px_20px_-8px_rgba(0,0,0,.35)]">
              <p className="text-[11px] font-medium leading-tight text-white">Cita confirmada</p>
              <p className="mt-[3px] text-[9.5px] text-white/80">Corte y Color</p>
              <span className="absolute right-[13px] top-[13px] h-[6px] w-[6px] rounded-full bg-white" />
            </div>
          </div>

          <div className="absolute left-[64.8%] top-[18%] h-[106px] w-[118px]">
            {CLUSTER_AVATARS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="absolute rounded-full border-2 border-white object-cover shadow-md"
                style={[
                  { left: 0, top: 0, width: 62, height: 62 },
                  { left: 60, top: 26, width: 55, height: 55 },
                  { left: 26, top: 60, width: 43, height: 43 },
                ][i]}
              />
            ))}
          </div>

          <div className="absolute left-[12.4%] top-[53.6%] h-[170px] w-[323px]">
            <div className="absolute left-[36px] top-0 h-[110px] w-[287px] overflow-hidden rounded-[12px] border border-white/30 bg-white/15 backdrop-blur-[6px]">
              <div className="grid grid-cols-7 gap-y-[5px] px-[12px] pt-[10px] text-center text-white">
                {WEEK_DAYS.map((d) => (
                  <span key={`lbl-${d.label}`} className="text-[11px] text-white/90">
                    {d.label}
                  </span>
                ))}
                {WEEK_DAYS.map((d) => (
                  <span key={`num-${d.label}`} className="text-[18px] font-light">
                    {d.num}
                  </span>
                ))}
              </div>
              <div
                className="absolute bottom-0 right-0 h-[54px] w-[44%]"
                style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.6) 0 1.5px, transparent 1.5px 9px)' }}
              />
            </div>

            <div className="absolute left-0 top-[74px] h-[96px] w-[190px] rounded-[12px] bg-white px-[13px] pt-[14px] shadow-[0_12px_30px_-10px_rgba(0,0,0,.35)]">
              <p className="text-[11.5px] font-medium text-gray-900">Próxima cita</p>
              <p className="mt-[2px] text-[9.5px] text-gray-500">Corte y Color · 3:00 PM</p>
              <span className="absolute right-[13px] top-[13px] h-[7px] w-[7px] rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
              <div className="absolute bottom-[13px] left-[13px] flex -space-x-[5px]">
                {TEAM_AVATARS.map((src) => (
                  <img key={src} src={src} alt="" className="h-[19px] w-[19px] rounded-full border border-white object-cover" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recorte/"fillet" de la esquina donde va el botón de cerrar:
            mismo truco que la referencia (radial-gradient con un corte
            nítido a los ~20px) para lograr esquinas cóncavas, con el color
            exacto del extremo derecho del degradado de la tarjeta para que
            el recorte quede invisible. El radio del fillet (30px) es el
            del panel de la foto, no el de la tarjeta completa (40px) —
            son dos valores distintos en la referencia. */}
        <span className="absolute right-0 top-0 h-[50px] w-[72px] rounded-bl-[20px] rounded-tr-[30px] bg-[#FBE2EE]" aria-hidden="true" />
        <span
          className="absolute right-[72px] top-0 h-5 w-5"
          style={{ background: 'radial-gradient(circle at 0 100%, transparent 19.5px, #FBE2EE 20px)' }}
          aria-hidden="true"
        />
        <span
          className="absolute right-0 top-[50px] h-5 w-5"
          style={{ background: 'radial-gradient(circle at 0 100%, transparent 19.5px, #FBE2EE 20px)' }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar y volver al inicio"
          className="absolute -top-[3px] right-[20px] grid h-[43px] w-[43px] place-items-center rounded-full bg-[#FBF7FA] text-gray-800 shadow-sm transition hover:bg-white"
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </section>
  );
}

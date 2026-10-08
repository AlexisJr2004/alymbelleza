import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

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

// Puerto fiel de login-crextio.html (estructura, gradiente de fondo,
// recorte/"fillet" de la esquina del botón de cerrar, tarjeta apilada,
// racimo de avatares, calendario con textura rayada) con los colores del
// sistema de Bella Beauty (morado→rosa) en vez de la paleta gris/crema/
// amarilla original — así lo pidió el usuario esta vez. Tipografía Outfit
// (.font-outfit en index.css), igual que la referencia, sin tocar la
// fuente del resto del sitio.
export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login.mutateAsync({ email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <>
      {/* Reemplaza el bg-gray-50 de AuthLayout solo en esta ruta, sin tocar
          el layout compartido (afecta a las otras 3 páginas de auth). Sin
          z-index explícito a propósito: un elemento fixed ya pinta por
          encima de una caja plana sin posicionar (como el bg-gray-50 del
          layout) y de las formas con z-index negativo del fondo, por orden
          de capas — no hace falta pelear con z-index (lección de los dos
          bugs de stacking de este mismo login). */}
      <div className="fixed inset-0 bg-[#ABA6B6]" aria-hidden="true" />

      <div
        className="font-outfit relative flex w-full max-w-[1040px] flex-col overflow-hidden rounded-[36px] shadow-[0_40px_90px_-30px_rgba(60,30,80,.45)] lg:h-[730px] lg:flex-row"
        style={{
          background:
            'radial-gradient(75% 60% at 22% 105%, rgba(168,85,247,.35) 0%, rgba(168,85,247,0) 70%), linear-gradient(90deg, #EBE7F0 0%, #EFE7ED 36%, #F8E3EF 60%, #FBE2EE 100%)',
        }}
      >
        {/* El botón de cerrar "de verdad" (con el recorte/fillet) vive
            dentro de la sección de la foto, oculta en mobile — sin esto,
            en mobile no había NINGÚN botón de cerrar. */}
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Cerrar y volver al inicio"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-gray-700 shadow-md backdrop-blur-md transition hover:bg-white lg:hidden"
        >
          <i className="fas fa-times" />
        </button>

        <section className="flex w-full flex-col px-8 py-9 sm:px-10 lg:w-[440px] lg:shrink-0 lg:overflow-y-auto lg:px-10 lg:pb-9 lg:pt-9">
          <span className="inline-flex h-[41px] w-fit items-center self-start rounded-full border border-gray-400 px-[18px] text-[17px] tracking-[-0.01em] text-gray-800">
            Bella Beauty
          </span>

          <div className="flex flex-1 flex-col items-center justify-center py-10 lg:py-0">
            <div className="w-full max-w-[290px]">
              <header className="text-center">
                <h1 className="text-[26px] font-light tracking-[-0.01em] text-gray-900">Inicia sesión</h1>
                <p className="mt-1 text-[12.5px] text-gray-600">Bienvenida de nuevo, ingresa tus datos</p>
              </header>

              <form className="mt-[34px]" onSubmit={handleSubmit} noValidate>
                <div className="space-y-[15px]">
                  <div>
                    <label htmlFor="login-email" className="mb-2 block pl-[18px] text-[11.5px] text-gray-500">
                      Correo electrónico
                    </label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      className="h-[43px] w-full rounded-full border-0 bg-[#FBFAFC] px-[18px] text-[12.5px] text-gray-800 outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="mb-2 block pl-[18px] text-[11.5px] text-gray-500">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••••••"
                        className="h-[43px] w-full rounded-full border-0 bg-[#FBFAFC] px-[18px] pr-12 text-[12.5px] text-gray-800 outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-purple-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        aria-pressed={showPassword}
                        className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-gray-600 transition hover:bg-black/5"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    </div>
                    <div className="mt-2 pr-[6px] text-right">
                      <Link to="/forgot-password" className="text-[11.5px] text-gray-500 hover:text-gray-700 hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={login.isPending}
                  className="mt-[22px] h-[48px] w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[13.5px] font-medium text-white transition hover:from-purple-700 hover:to-pink-700 active:scale-[.99] disabled:opacity-60"
                >
                  {login.isPending ? (
                    <span>
                      <i className="fas fa-spinner fa-spin mr-1.5" /> Verificando...
                    </span>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>

                <Link
                  to="/"
                  className="mt-3 flex h-[43px] w-full items-center justify-center gap-2 rounded-full border border-purple-200 bg-white/30 text-[11.5px] text-purple-700 transition hover:bg-white/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Ingresar como invitada
                </Link>
              </form>

              {error && (
                <div role="alert" className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-[18px] py-2.5 text-[11.5px] text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>

          <footer className="flex items-center justify-center text-[11px]">
            <p className="text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-gray-800 underline underline-offset-2 hover:text-gray-900">
                Regístrate
              </Link>
            </p>
          </footer>
        </section>

        <section className="relative hidden flex-1 py-[18px] pr-[18px] lg:block">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 overflow-hidden rounded-[30px]" aria-hidden="true">
              <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />

              {/* Tarjeta apilada: capa de cristal oscuro detrás (primero en
                  el DOM, sin z-index) + tarjeta sólida en degradado de
                  marca encima. */}
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
                nítido a los ~20px) para lograr esquinas cóncavas, con el
                color exacto del extremo derecho del degradado de la
                tarjeta para que el recorte quede invisible. */}
            <span className="absolute right-0 top-0 h-[50px] w-[72px] rounded-bl-[20px] rounded-tr-[36px] bg-[#FBE2EE]" aria-hidden="true" />
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
              onClick={() => navigate('/')}
              aria-label="Cerrar y volver al inicio"
              className="absolute -top-[3px] right-[20px] grid h-[43px] w-[43px] place-items-center rounded-full bg-[#FBF7FA] text-gray-800 shadow-sm transition hover:bg-white"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

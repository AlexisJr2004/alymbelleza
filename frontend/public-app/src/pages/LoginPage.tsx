import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

// Misma foto que ya usa el hero de Home (HeroSection.tsx) — se reutiliza acá
// en vez de sumar una imagen de stock nueva al sitio.
const HERO_IMAGE = 'https://www.universia.net/content/dam/universia/imagenes/2020/12/estilista%20profesional%20MX-min.jpg';
// Nota: el fallback de avatar usado en el resto del sitio
// (https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png) devuelve 404 — el
// host gratuito de imágenes ya no lo sirve. Acá se evita esa dependencia
// con íconos en vez de fotos; vale la pena reemplazarlo en el resto del
// sitio en un cambio aparte.
const AVATAR_TONES = ['bg-purple-200 text-purple-700', 'bg-pink-200 text-pink-700', 'bg-amber-200 text-amber-800'];

const WEEK_DAYS = [
  { label: 'Dom', num: 22 },
  { label: 'Lun', num: 23 },
  { label: 'Mar', num: 24 },
  { label: 'Mié', num: 25 },
  { label: 'Jue', num: 26, active: true },
  { label: 'Vie', num: 27 },
  { label: 'Sáb', num: 28 },
];

// Puerto del login al layout de referencia: panel claro con el formulario a
// la izquierda y una foto a pantalla completa con tarjetas flotantes a la
// derecha (oculta en mobile — el panel del formulario es lo único crítico
// ahí). Colores tomados literalmente de la referencia (crema + amarillo
// mostaza), no el morado/rosa de marca de Bella Beauty — así lo pidió el
// usuario explícitamente para esta pantalla.
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
    <div className="relative bg-white rounded-[28px] w-full max-w-5xl overflow-hidden shadow-2xl shadow-black/10 flex flex-col lg:flex-row lg:h-[620px]">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Cerrar y volver al inicio"
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <i className="fas fa-times" />
      </button>

      <div className="w-full lg:w-[44%] bg-[#F8F4ED] px-8 py-10 sm:px-12 sm:py-12 flex flex-col justify-center lg:overflow-y-auto">
        <span className="inline-flex items-center self-start px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-800 mb-8 lg:mb-10">
          Bella Beauty
        </span>

        <h1 className="text-[28px] sm:text-[32px] font-semibold text-gray-900 leading-tight">Inicia sesión</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">Bienvenida de nuevo, ingresa tus datos para continuar</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-gray-500 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 bg-white rounded-2xl border border-transparent focus:border-gray-300 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-colors"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-gray-500 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3.5 pr-11 bg-white rounded-2xl border border-transparent focus:border-gray-300 focus:outline-none text-sm text-gray-800 placeholder:text-gray-400 transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#F6C945] hover:bg-[#F0BD2C] text-gray-900 font-semibold py-3.5 rounded-full transition-all disabled:opacity-60 mt-7"
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
            className="flex items-center justify-center w-full py-3 mt-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Ingresar como invitada
          </Link>
        </form>

        {error && (
          <div role="alert" className="mt-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl py-2.5 px-3.5">
            {error}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-gray-900 font-medium underline underline-offset-2">
            Regístrate
          </Link>
        </p>
      </div>

      <div className="hidden lg:block lg:w-[56%] relative overflow-hidden">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-lg px-4 py-3 max-w-[220px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F6C945] shrink-0" />
            <span className="text-sm font-semibold text-gray-900">Cita confirmada</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 ml-4">Corte y Color · 3:00 PM</p>
        </div>

        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          {WEEK_DAYS.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-gray-400">{d.label}</span>
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium ${
                  d.active ? 'bg-[#F6C945] text-gray-900' : 'text-gray-600'
                }`}
              >
                {d.num}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Equipo disponible hoy</p>
            <p className="text-xs text-gray-500 mt-0.5">3 estilistas listas para ti</p>
          </div>
          <div className="flex -space-x-2">
            {AVATAR_TONES.map((tone, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center ${tone}`}
              >
                <i className="fas fa-user text-[10px]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

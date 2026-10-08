import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';
import AuthCardShell from '../components/auth/AuthCardShell';
import AuthShowcasePanel from '../components/auth/AuthShowcasePanel';

// Puerto fiel de login-crextio.html (estructura, gradiente de fondo,
// recorte/"fillet" de la esquina del botón de cerrar, tarjeta apilada,
// racimo de avatares, calendario con textura rayada) con los colores del
// sistema de Bella Beauty (morado→rosa) en vez de la paleta gris/crema/
// amarilla original — así lo pidió el usuario esta vez. Tipografía Outfit
// (.font-outfit en index.css), igual que la referencia, sin tocar la
// fuente del resto del sitio. El cascarón (AuthCardShell) y el panel de
// la foto (AuthShowcasePanel) se comparten con RegisterPage.
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
    <AuthCardShell onClose={() => navigate('/')} maxWidthClassName="lg:max-w-[1090px]">
      <section className="flex w-full flex-col px-8 py-9 sm:px-10 lg:w-[476px] lg:shrink-0 lg:overflow-y-auto lg:px-10 lg:pb-9 lg:pt-9">
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

      <AuthShowcasePanel onClose={() => navigate('/')} />
    </AuthCardShell>
  );
}

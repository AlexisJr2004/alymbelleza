import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';
import AuthCardShell from '../components/auth/AuthCardShell';
import AuthShowcasePanel from '../components/auth/AuthShowcasePanel';

// Mismo estilo que Login/Register (login-crextio.html adaptado a blanco):
// mismas dimensiones de tarjeta que el login (un solo campo, igual de
// simple), cascarón y panel de la foto compartidos vía AuthCardShell/
// AuthShowcasePanel.
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    try {
      const res = await forgotPassword.mutateAsync(email);
      setMessage({ text: res.message || '¡Enlace enviado! Revisa tu correo electrónico.', type: 'success' });
    } catch (err) {
      setMessage({ text: err instanceof ApiError ? err.message : 'Error de conexión. Inténtalo de nuevo más tarde.', type: 'error' });
    }
  };

  return (
    <AuthCardShell
      onClose={() => navigate('/')}
      maxWidthClassName="md:max-w-[1090px]"
      pageBackgroundClassName="bg-white"
      cardBackground="#FFFFFF"
    >
      <section className="flex w-full flex-col px-8 py-9 sm:px-10 lg:w-[476px] lg:shrink-0 lg:overflow-y-auto lg:px-10 lg:pb-9 lg:pt-9">
        <span className="inline-flex h-[41px] w-fit items-center self-start rounded-full border border-gray-400 px-[18px] text-[17px] tracking-[-0.01em] text-gray-800">
          Bella Beauty
        </span>

        <div className="flex flex-1 flex-col items-center justify-center py-10 lg:py-0">
          <div className="w-full max-w-[290px]">
            <header className="text-center">
              <h1 id="auth-card-title" className="text-[26px] font-light tracking-[-0.01em] text-gray-900">
                Recuperar contraseña
              </h1>
              <p className="mt-1 text-[12.5px] text-gray-600">Ingresa tu correo para recibir el enlace de recuperación</p>
            </header>

            <form className="mt-[34px]" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="forgot-email" className="mb-2 block pl-[18px] text-[11.5px] text-gray-500">
                  Correo electrónico
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  className="h-[43px] w-full rounded-full border-0 bg-[#FBFAFC] px-[18px] text-[12.5px] text-gray-800 outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-rose-400"
                />
              </div>

              <button
                type="submit"
                disabled={forgotPassword.isPending}
                className="mt-[22px] h-[48px] w-full rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-[13.5px] font-medium text-white transition hover:from-rose-700 hover:to-pink-700 active:scale-[.99] disabled:opacity-60"
              >
                {forgotPassword.isPending ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-1.5" /> Enviando...
                  </span>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </button>

              <Link
                to="/login"
                className="mt-3 flex h-[43px] w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white/30 text-[11.5px] text-rose-700 transition hover:bg-white/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Volver al inicio de sesión
              </Link>
            </form>

            {message && (
              <div
                role={message.type === 'error' ? 'alert' : 'status'}
                className={`mt-4 rounded-2xl border px-[18px] py-2.5 text-[11.5px] ${
                  message.type === 'success' ? 'border-green-100 bg-green-50 text-green-700' : 'border-red-100 bg-red-50 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>
      </section>

      <AuthShowcasePanel onClose={() => navigate('/')} cornerColor="#FFFFFF" />
    </AuthCardShell>
  );
}

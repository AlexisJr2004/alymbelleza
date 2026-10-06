import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

export default function ForgotPasswordPage() {
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
    <div className="auth-card animate-fade-up rounded-xl w-full max-w-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500" />

      <div className="p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-purple-500 to-pink-500">
            <img
              src="https://i.ibb.co/zhpcw3df/mujer-con-pelo-largo.png"
              alt=""
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Recuperar contraseña</h2>
          <p className="text-sm text-gray-600 mt-1">Ingresa tu correo para recibir el enlace de recuperación</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-600 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="forgot-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none input-focus"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full btn-gradient text-white py-3.5 rounded-full font-semibold shadow-sm transition-all disabled:opacity-60"
          >
            {forgotPassword.isPending ? <><i className="fas fa-spinner fa-spin mr-2" /> Enviando...</> : 'Enviar enlace de recuperación'}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="flex items-center justify-center w-full py-3 text-sm font-medium text-purple-700 border border-purple-200 rounded-full hover:bg-purple-50 transition-all duration-300 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 group-hover:text-purple-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>

        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`mt-4 text-sm text-center font-medium rounded-lg py-2 px-3 border ${
              message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    token ? null : { text: 'Enlace inválido. Falta el token de verificación.', type: 'error' }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setMessage(null);
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    try {
      await resetPassword.mutateAsync({ token, password });
      setMessage({ text: '¡Contraseña actualizada correctamente! Redirigiendo...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
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
          <h2 className="text-2xl font-semibold text-gray-800">Restablecer contraseña</h2>
          <p className="text-sm text-gray-600 mt-1">Crea una nueva contraseña para tu cuenta</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-gray-600 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-lg focus:outline-none input-focus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-gray-600 hover:text-purple-600"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!token || resetPassword.isPending}
            className="w-full btn-gradient text-white py-3.5 rounded-full font-semibold shadow-sm transition-all disabled:opacity-60"
          >
            {resetPassword.isPending ? <><i className="fas fa-spinner fa-spin mr-2" /> Procesando...</> : 'Restablecer contraseña'}
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

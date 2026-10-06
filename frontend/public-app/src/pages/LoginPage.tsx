import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

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
    <div className="auth-card animate-fade-up rounded-xl w-full max-w-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500" />

      <div className="p-7">
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-purple-500 to-pink-500">
            <img
              src="https://i.ibb.co/zhpcw3df/mujer-con-pelo-largo.png"
              alt=""
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bella Beauty</h2>
          <p className="text-[0.8125rem] text-gray-600 mt-1">Inicia sesión para continuar</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="login-email" className="block text-[0.8125rem] font-medium text-gray-600 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="w-full pl-9 pr-3 py-3 text-[0.9375rem] border border-gray-200 rounded-lg focus:outline-none input-focus"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-[0.8125rem] font-medium text-gray-600 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                className="w-full pl-9 pr-11 py-3 text-[0.9375rem] border border-gray-200 rounded-lg focus:outline-none input-focus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-gray-600 hover:text-purple-600 text-sm"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-[0.8125rem] text-purple-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full btn-gradient text-white py-3.5 rounded-full text-[0.9375rem] font-semibold transition-all disabled:opacity-60"
          >
            {login.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1.5" /> Verificando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center w-full py-3 text-[0.8125rem] font-medium text-purple-700 border border-purple-200 rounded-full hover:bg-purple-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Ingresar como invitado
          </Link>

          <p className="text-center text-[0.8125rem] text-gray-600 mt-2">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-purple-600 font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        {error && (
          <div role="alert" className="mt-4 text-sm text-center text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg py-2 px-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

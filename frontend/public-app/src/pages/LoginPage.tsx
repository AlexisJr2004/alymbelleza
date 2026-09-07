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
    <div className="auth-card bg-white rounded-xl w-full max-w-xs overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500" />

      <div className="p-6">
        <div className="text-center mb-4">
          <img src="https://i.ibb.co/zhpcw3df/mujer-con-pelo-largo.png" alt="mujer" className="mx-auto w-16 h-16 object-cover mb-2" />
          <h2 className="text-xl font-semibold text-gray-800">Bella Beauty</h2>
          <p className="text-xs text-gray-500 mt-1">Inicia sesión para continuar</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Correo electrónico</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-2.5 text-purple-400 text-sm" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none input-focus"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-2.5 text-purple-400 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:outline-none input-focus"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-purple-600 text-sm"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs text-purple-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={login.isPending} className="w-full btn-gradient text-white py-2 rounded-md text-sm font-medium transition-all disabled:opacity-60">
            {login.isPending ? <><i className="fas fa-spinner fa-spin mr-1" /> Verificando...</> : 'Iniciar Sesión'}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center w-full py-2 text-xs font-medium text-purple-700 border border-purple-200 rounded-md hover:bg-purple-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Ingresar como invitado
          </Link>

          <p className="text-center text-xs text-gray-500 mt-2">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-purple-600 font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        {error && <div className="mt-3 text-xs text-center text-red-600 font-medium">{error}</div>}
      </div>
    </div>
  );
}

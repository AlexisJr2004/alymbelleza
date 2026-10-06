import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';

const DEFAULT_AVATAR = 'https://i.ibb.co/zhpcw3df/mujer-con-pelo-largo.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('Ningún archivo');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName('Ningún archivo');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      await register.mutateAsync(formData);
      navigate('/login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al registrarse');
    }
  };

  return (
    <div className="auth-card animate-fade-up rounded-xl w-full max-w-3xl overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-purple-600 to-pink-500" />

      <div className="p-6">
        <div className="text-center mb-4">
          <div className="relative mx-auto w-20 h-20 mb-2 rounded-full p-[3px] bg-gradient-to-br from-purple-500 to-pink-500">
            <img
              src={preview || DEFAULT_AVATAR}
              alt="Vista previa"
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bella Beauty</h2>
          <p className="text-gray-600 text-sm mt-1">Completa tu registro</p>
        </div>

        <form className="space-y-4" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100">Información básica</h3>
              <div className="form-grid">
                <div>
                  <label htmlFor="register-name" className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre completo*
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="Ej: María González"
                  />
                </div>
                <div>
                  <label htmlFor="register-email" className="block text-xs font-medium text-gray-700 mb-1">
                    Correo electrónico*
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-xs font-medium text-gray-700 mb-1">
                    Contraseña*
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>
                <div>
                  <label htmlFor="register-photo" className="block text-xs font-medium text-gray-700 mb-1">
                    Foto de perfil
                  </label>
                  <div className="flex items-center gap-2">
                    <label htmlFor="register-photo" className="cursor-pointer">
                      <span className="text-xs text-white py-2 px-3.5 rounded-full bg-purple-500 hover:bg-purple-600 transition duration-150 inline-block font-medium">
                        Seleccionar
                      </span>
                      <input id="register-photo" type="file" name="profileImage" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">{fileName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100">Información personal</h3>
              <div className="form-grid">
                <div>
                  <label htmlFor="register-birthdate" className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="register-birthdate"
                    type="date"
                    name="birthdate"
                    autoComplete="bday"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                  />
                </div>
                <div>
                  <label htmlFor="register-gender" className="block text-xs font-medium text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    id="register-gender"
                    name="gender"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                  >
                    <option value="">Selecciona</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero-no-decir">Prefiero no decir</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100">Información de contacto</h3>
              <div className="form-grid">
                <div className="md:col-span-2">
                  <label htmlFor="register-address" className="block text-xs font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    id="register-address"
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="Calle, número, ciudad"
                  />
                </div>
                <div>
                  <label htmlFor="register-dni" className="block text-xs font-medium text-gray-700 mb-1">
                    Cédula
                  </label>
                  <input
                    id="register-dni"
                    type="text"
                    name="dni"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="Número de identificación"
                  />
                </div>
                <div>
                  <label htmlFor="register-phone" className="block text-xs font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none input-focus transition duration-150"
                    placeholder="Número de contacto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={register.isPending}
              className="w-full btn-gradient text-white py-3 text-sm rounded-full font-semibold transition-all disabled:opacity-60"
            >
              {register.isPending ? <><i className="fas fa-spinner fa-spin mr-1" /> Registrando...</> : 'Registrarse'}
            </button>

            <p className="text-center text-xs text-gray-600 mt-3">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-purple-600 font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>

        {error && (
          <div role="alert" className="mt-3 text-xs text-center text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg py-2 px-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { ApiError } from '../lib/apiClient';
import AuthCardShell from '../components/auth/AuthCardShell';
import AuthShowcasePanel from '../components/auth/AuthShowcasePanel';

const FIELD_CLASS =
  'h-[43px] w-full rounded-full border-0 bg-[#FBFAFC] px-[18px] text-[12.5px] text-gray-800 outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:bg-white focus:ring-purple-400';
const LABEL_CLASS = 'mb-2 block pl-[18px] text-[11.5px] text-gray-500';

// Mismo estilo que LoginPage (login-crextio.html adaptado a los colores
// de Bella Beauty), con el panel izquierdo más ancho para el formulario
// completo de registro (bastante más largo que el de login — por eso
// necesita scroll propio en escritorio, mismo patrón ya usado en
// LoginPage). El cascarón y el panel de la foto se comparten vía
// AuthCardShell/AuthShowcasePanel.
export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState('Ningún archivo');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : 'Ningún archivo');
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
    <AuthCardShell onClose={() => navigate('/')} maxWidthClassName="lg:max-w-[1200px]">
      <section className="flex w-full flex-col px-8 py-9 sm:px-10 lg:w-[600px] lg:shrink-0 lg:overflow-y-auto lg:px-10 lg:pb-9 lg:pt-9">
        <span className="inline-flex h-[41px] w-fit items-center self-start rounded-full border border-gray-400 px-[18px] text-[17px] tracking-[-0.01em] text-gray-800">
          Bella Beauty
        </span>

        <div className="flex flex-1 flex-col items-center justify-center py-10 lg:py-7">
          <div className="w-full max-w-[400px]">
            <header className="text-center">
              <h1 className="text-[26px] font-light tracking-[-0.01em] text-gray-900">Crea tu cuenta</h1>
              <p className="mt-1 text-[12.5px] text-gray-600">Regístrate para reservar tu próxima cita</p>
            </header>

            <form className="mt-[30px]" encType="multipart/form-data" onSubmit={handleSubmit} noValidate>
              <div className="space-y-[15px]">
                <div>
                  <label htmlFor="register-name" className={LABEL_CLASS}>
                    Nombre completo
                  </label>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Ej: María González"
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className={LABEL_CLASS}>
                    Correo electrónico
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className={LABEL_CLASS}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder="Mínimo 8 caracteres"
                      className={`${FIELD_CLASS} pr-12`}
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
                </div>

                <div>
                  <label htmlFor="register-photo" className={LABEL_CLASS}>
                    Foto de perfil
                  </label>
                  <div className="flex items-center gap-3 pl-[6px]">
                    <label
                      htmlFor="register-photo"
                      className="flex h-[36px] shrink-0 cursor-pointer items-center rounded-full border border-purple-200 bg-white/50 px-4 text-[11.5px] text-purple-700 transition hover:bg-white/90"
                    >
                      Seleccionar
                    </label>
                    <input id="register-photo" name="profileImage" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <span className="truncate text-[11.5px] text-gray-500">{fileName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <label htmlFor="register-birthdate" className={LABEL_CLASS}>
                      Nacimiento
                    </label>
                    <input id="register-birthdate" name="birthdate" type="date" autoComplete="bday" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label htmlFor="register-gender" className={LABEL_CLASS}>
                      Género
                    </label>
                    <select id="register-gender" name="gender" defaultValue="" className={FIELD_CLASS}>
                      <option value="">Selecciona</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                      <option value="prefiero-no-decir">Prefiero no decir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-address" className={LABEL_CLASS}>
                    Dirección
                  </label>
                  <input
                    id="register-address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Calle, número, ciudad"
                    className={FIELD_CLASS}
                  />
                </div>

                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <label htmlFor="register-dni" className={LABEL_CLASS}>
                      Cédula
                    </label>
                    <input id="register-dni" name="dni" type="text" placeholder="N° de identificación" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label htmlFor="register-phone" className={LABEL_CLASS}>
                      Teléfono
                    </label>
                    <input id="register-phone" name="phone" type="tel" autoComplete="tel" placeholder="N° de contacto" className={FIELD_CLASS} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={register.isPending}
                className="mt-[22px] h-[48px] w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[13.5px] font-medium text-white transition hover:from-purple-700 hover:to-pink-700 active:scale-[.99] disabled:opacity-60"
              >
                {register.isPending ? (
                  <span>
                    <i className="fas fa-spinner fa-spin mr-1.5" /> Registrando...
                  </span>
                ) : (
                  'Registrarse'
                )}
              </button>
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
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-gray-800 underline underline-offset-2 hover:text-gray-900">
              Inicia sesión
            </Link>
          </p>
        </footer>
      </section>

      <AuthShowcasePanel onClose={() => navigate('/')} />
    </AuthCardShell>
  );
}

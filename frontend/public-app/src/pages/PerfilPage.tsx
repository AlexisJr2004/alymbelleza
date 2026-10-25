import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfile';
import { ApiError } from '../lib/apiClient';
import { isLoggedIn, logout } from '../lib/auth';
import { notifyError, notifySuccess } from '../lib/sweetalert';
import { ShoppingBagIcon, ExclamationTriangleIcon } from '../components/icons';
import ProfileCard from '../components/perfil/ProfileCard';
import ProfileEditForm from '../components/perfil/ProfileEditForm';
import ProfileIcon from '../components/perfil/ProfileIcons';
import './PerfilPage.css';

export default function PerfilPage() {
  const navigate = useNavigate();
  const { data: user, isLoading, isFetching, error, refetch } = useProfileQuery();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      logout();
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (!isLoggedIn()) return null;

  async function handleSubmit(formData: FormData) {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
      setPreviewUrl(null);
      notifySuccess('Perfil actualizado', 'Tus cambios se guardaron correctamente.');
    } catch (err) {
      notifyError('Error al actualizar', err instanceof ApiError ? err.message : 'No se pudo actualizar el perfil.');
    }
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <nav aria-label="Ruta de navegación" className="profile-breadcrumb">
          <Link to="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page">Mi cuenta</span>
        </nav>

        <header className="profile-heading">
          <div>
            <p className="profile-eyebrow"><span aria-hidden="true" /> UN ESPACIO PARA TI</p>
            <h1>Mi perfil<span aria-hidden="true">.</span></h1>
            <p>Cuida de ti. Nosotros cuidamos de los detalles.</p>
          </div>
          <Link to="/citas" className="profile-button profile-button-secondary">
            <ProfileIcon name="calendar" className="h-4 w-4" /> Mis citas
            <ProfileIcon name="arrow" className="h-4 w-4" />
          </Link>
        </header>

        {error && !user ? (
          <section className="profile-panel profile-error" role="alert">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <h2>No pudimos cargar tu perfil</h2>
            <p>Comprueba tu conexión e inténtalo de nuevo. Tus datos siguen guardados.</p>
            <button type="button" onClick={() => void refetch()} disabled={isFetching} className="profile-button profile-button-primary">
              {isFetching ? 'Cargando…' : 'Volver a intentar'}
            </button>
          </section>
        ) : isLoading || !user ? (
          <div className="profile-grid" role="status" aria-label="Cargando tu perfil" aria-busy="true">
            <div className="profile-panel profile-skeleton profile-skeleton-card" />
            <div className="profile-panel profile-skeleton profile-skeleton-form" />
            <span className="sr-only">Cargando tu perfil…</span>
          </div>
        ) : (
          <div className="profile-grid">
            <aside className="profile-sidebar" aria-label="Tu cuenta">
              <ProfileCard user={user} previewUrl={previewUrl} />
              <div className="profile-shortcuts">
                <p className="profile-eyebrow">TU EXPERIENCIA BELLA BEAUTY</p>
                <Link to="/citas" className="profile-shortcut">
                  <span className="profile-shortcut-icon"><ProfileIcon name="calendar" className="h-5 w-5" /></span>
                  <span><strong>Tu próxima cita</strong><small>Un momento dedicado a ti</small></span>
                  <ProfileIcon name="arrow" className="h-4 w-4" />
                </Link>
                <Link to="/productos" className="profile-shortcut">
                  <span className="profile-shortcut-icon"><ShoppingBagIcon className="h-5 w-5" /></span>
                  <span><strong>Tu rutina de belleza</strong><small>Descubre nuestros productos</small></span>
                  <ProfileIcon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            <div className="profile-content">
              {error && <p className="profile-refresh-error" role="status">No pudimos actualizar los datos. Se muestra la última información disponible.</p>}
              <section className="profile-panel" aria-label="Información personal">
                <ProfileEditForm
                  key={`${user._id}-${user.updatedAt ?? ''}`}
                  user={user}
                  isEditing={isEditing}
                  isSaving={updateProfile.isPending}
                  previewUrl={previewUrl}
                  onStartEdit={() => setIsEditing(true)}
                  onCancel={() => { setIsEditing(false); setPreviewUrl(null); }}
                  onSubmit={handleSubmit}
                  onPreviewUrl={setPreviewUrl}
                />
              </section>

              <section className="profile-security" aria-labelledby="profile-security-title">
                <span className="profile-security-icon"><ProfileIcon name="shield" className="h-6 w-6" /></span>
                <div>
                  <h2 id="profile-security-title">El acceso a tu cuenta</h2>
                  <p>Si necesitas una nueva contraseña, te enviaremos un enlace a tu correo.</p>
                </div>
                <Link to="/forgot-password" className="profile-text-link">Restablecer contraseña <ProfileIcon name="arrow" className="h-4 w-4" /></Link>
              </section>
              <p className="profile-footnote">Tus datos se guardan únicamente cuando seleccionas «Guardar cambios».</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

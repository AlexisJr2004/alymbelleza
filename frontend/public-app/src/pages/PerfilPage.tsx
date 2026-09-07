import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileQuery, useUpdateProfile } from '../hooks/useProfile';
import { ApiError } from '../lib/apiClient';
import { isLoggedIn, logout } from '../lib/auth';
import ProfileCard from '../components/perfil/ProfileCard';
import ProfileEditForm, { type ProfileMessage } from '../components/perfil/ProfileEditForm';

const MESSAGE_CLASS: Record<NonNullable<ProfileMessage>['type'], string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-red-500',
};

// Página "Perfil" — puerto de frontend/perfil.html. El original hace un
// hard-check de sesión con window.location.href = 'login.html'; acá se
// reemplaza por un useNavigate() dentro de la SPA (mismo efecto, sin salir
// del bundle de React).
export default function PerfilPage() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useProfileQuery();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<ProfileMessage>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Equivalente al `if (res.status === 401) { localStorage.removeItem('user'); ... }`
  // de loadProfile() en perfil.html.
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      logout();
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (!isLoggedIn()) return null;

  async function handleSubmit(formData: FormData) {
    setMessage({ text: 'Actualizando perfil...', type: 'info' });
    try {
      await updateProfile.mutateAsync(formData);
      setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
      setIsEditing(false);
      setPreviewUrl(null);
    } catch (err) {
      setMessage({ text: err instanceof ApiError ? err.message : 'Error al actualizar el perfil', type: 'error' });
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {user ? (
          <ProfileCard user={user} previewUrl={previewUrl} />
        ) : (
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-center h-64">
              {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-purple-500" />}
            </div>
          </div>
        )}

        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Editar perfil</h2>

            {user && (
              <ProfileEditForm
                // Se remonta cuando cambia updatedAt (p.ej. tras un guardado
                // exitoso) para que los defaultValue tomen los valores recién
                // guardados sin necesidad de un window.location.reload().
                key={`${user._id}-${user.updatedAt ?? ''}`}
                user={user}
                isEditing={isEditing}
                isSaving={updateProfile.isPending}
                onStartEdit={() => {
                  setIsEditing(true);
                  setMessage(null);
                }}
                onSubmit={handleSubmit}
                onFileMessage={setMessage}
                onPreviewUrl={setPreviewUrl}
              />
            )}

            {message && <div className={`text-sm mt-4 ${MESSAGE_CLASS[message.type]}`}>{message.text}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}

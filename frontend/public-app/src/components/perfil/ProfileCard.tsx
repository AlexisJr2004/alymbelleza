import { useState, type SyntheticEvent } from 'react';
import { resolveProfileImage } from '../../lib/format';
import { EnvelopeIcon, MapPinIcon, UserCircleIcon } from '../icons';
import type { ProfileUser } from '../../types/models';
import ProfilePhotoLightbox from './ProfilePhotoLightbox';
import ProfileIcon from './ProfileIcons';

interface ProfileCardProps {
  user: ProfileUser;
  previewUrl: string | null;
}

function handleImgError(e: SyntheticEvent<HTMLImageElement>) {
  const fallback = `${window.location.origin}/img/profile-placeholder.svg`;
  if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
}

export default function ProfileCard({ user, previewUrl }: ProfileCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const photoSrc = previewUrl || resolveProfileImage(user);
  const joined = user.createdAt ? new Date(user.createdAt) : null;
  const joinedLabel = joined && !Number.isNaN(joined.getTime())
    ? joined.toLocaleDateString('es', { month: 'long', year: 'numeric' }) : null;

  return (
    <>
      <section className="profile-identity profile-panel" aria-label="Resumen de tu perfil">
        <div className="profile-cover">
          <span>BELLA BEAUTY</span>
          <span className="profile-cover-flower" aria-hidden="true">✳</span>
        </div>
        <div className="profile-identity-body">
          <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Ampliar foto de perfil" className="profile-avatar-button">
            <img src={photoSrc} alt={`Foto de ${user.name || 'perfil'}`} onError={handleImgError} className="profile-avatar" />
            <span className="profile-avatar-detail"><ProfileIcon name="camera" className="h-4 w-4" /></span>
          </button>
          <span className="profile-role"><UserCircleIcon className="h-3.5 w-3.5" />{user.role === 'admin' ? 'Administración' : 'Miembro Bella Beauty'}</span>
          <h2>{user.name || 'Tu perfil'}</h2>
          {joinedLabel && <p className="profile-member-since">Contigo desde {joinedLabel}</p>}
          {previewUrl && <p className="profile-preview-note" role="status">Vista previa · Foto sin guardar</p>}

          <dl className="profile-contact-list">
            <div>
              <dt><EnvelopeIcon className="h-4 w-4" /><span>Correo electrónico</span></dt>
              <dd>{user.email || 'Sin correo registrado'}</dd>
            </div>
            {user.address && <div>
              <dt><MapPinIcon className="h-4 w-4" /><span>Dirección</span></dt>
              <dd>{user.address}</dd>
            </div>}
          </dl>
          <div className="profile-identity-footer"><span aria-hidden="true" /> Tu belleza, tu esencia.</div>
        </div>
      </section>
      <ProfilePhotoLightbox open={lightboxOpen} src={photoSrc} onClose={() => setLightboxOpen(false)} />
    </>
  );
}

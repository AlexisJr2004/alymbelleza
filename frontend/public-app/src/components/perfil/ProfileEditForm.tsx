import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { ProfileUser } from '../../types/models';
import { resolveProfileImage } from '../../lib/format';
import { CheckIcon, EnvelopeIcon } from '../icons';
import ChangePhotoModal from './ChangePhotoModal';
import ProfileIcon from './ProfileIcons';

interface ProfileEditFormProps {
  user: ProfileUser;
  isEditing: boolean;
  isSaving: boolean;
  previewUrl: string | null;
  onStartEdit: () => void;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  onPreviewUrl: (url: string | null) => void;
}

function Field({ id, label, value, editing, children }: {
  id: string; label: string; value?: string; editing: boolean; children: ReactNode;
}) {
  return (
    <div className="profile-field">
      {editing ? <label htmlFor={id}>{label}</label> : <p className="profile-field-label">{label}</p>}
      {editing ? children : <p className={`profile-field-value ${value ? '' : 'is-empty'}`}>{value || 'Sin añadir'}</p>}
    </div>
  );
}

export default function ProfileEditForm({ user, isEditing, isSaving, previewUrl, onStartEdit, onCancel, onSubmit, onPreviewUrl }: ProfileEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const birthdate = user.birthdate?.split('T')[0] || '';
  const birthdateLabel = birthdate ? new Date(`${birthdate}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const genderLabel = { masculino: 'Masculino', femenino: 'Femenino', otro: 'Otro' }[user.gender || 'otro'];
  const inputClass = 'profile-input';

  function handlePhotoConfirm(file: File, url: string) {
    setSelectedPhoto(file);
    onPreviewUrl(url);
    setPhotoModalOpen(false);
  }

  function handleCancel() {
    if (isSaving) return;
    formRef.current?.reset();
    setSelectedPhoto(null);
    setPhotoModalOpen(false);
    onCancel();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!formRef.current || !isEditing || isSaving) return;
    const formData = new FormData(formRef.current);
    if (selectedPhoto) formData.set('profileImage', selectedPhoto);
    onSubmit(formData);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="profile-form" aria-busy={isSaving}>
      <div className="profile-form-heading">
        <div>
          <h2>Información personal</h2>
          <p>{isEditing ? 'Actualiza tus datos y guarda los cambios al terminar.' : 'Los detalles que hacen tu experiencia más personal.'}</p>
        </div>
        {!isEditing ? (
          <button id="edit-btn" type="button" onClick={onStartEdit} className="profile-button profile-button-secondary">
            <ProfileIcon name="edit" className="h-4 w-4" /> Editar perfil
          </button>
        ) : <span className="profile-editing-label" role="status"><span aria-hidden="true" /> Editando perfil</span>}
      </div>

      <fieldset disabled={isSaving} className="profile-form-fields">
        {isEditing && <div className="profile-photo-editor">
          <img src={previewUrl || resolveProfileImage(user)} alt="Foto de perfil actual" className="h-14 w-14 rounded-full object-cover" onError={event => { const fallback = `${window.location.origin}/img/profile-placeholder.svg`; if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback; }} />
          <div><strong>Tu foto de perfil</strong><p>{selectedPhoto ? 'Foto seleccionada. Guarda para aplicarla.' : 'Elige una imagen que te represente.'}</p></div>
          <button type="button" onClick={() => setPhotoModalOpen(true)} className="profile-button profile-button-secondary">
            <ProfileIcon name="camera" className="h-4 w-4" /> Cambiar foto
          </button>
        </div>}

        <div className="profile-section-title"><span>01</span><h3>Datos personales</h3></div>
        <div className="profile-fields-grid">
          <Field id="edit-name" label="Nombre completo" value={user.name} editing={isEditing}>
            <input id="edit-name" name="name" type="text" autoComplete="name" required defaultValue={user.name || ''} className={inputClass} placeholder="Tu nombre completo" />
          </Field>
          <Field id="edit-dni" label="Cédula" value={user.dni} editing={isEditing}>
            <input id="edit-dni" name="dni" type="text" defaultValue={user.dni || ''} className={inputClass} placeholder="Tu número de identificación" />
          </Field>
          <Field id="edit-birthdate" label="Fecha de nacimiento" value={birthdateLabel} editing={isEditing}>
            <input id="edit-birthdate" name="birthdate" type="date" autoComplete="bday" defaultValue={birthdate} className={inputClass} />
          </Field>
          <Field id="edit-gender" label="Género" value={user.gender ? genderLabel : ''} editing={isEditing}>
            <select id="edit-gender" name="gender" defaultValue={user.gender || ''} className={inputClass}>
              <option value="">Sin especificar</option><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="otro">Otro</option>
            </select>
          </Field>
        </div>

        <div className="profile-section-title profile-section-title-contact"><span>02</span><h3>Datos de contacto</h3></div>
        <div className="profile-fields-grid">
          <Field id="edit-phone" label="Teléfono" value={user.phone} editing={isEditing}>
            <input id="edit-phone" name="phone" type="tel" autoComplete="tel" defaultValue={user.phone || ''} className={inputClass} placeholder="Tu número de contacto" />
          </Field>
          <Field id="edit-address" label="Dirección" value={user.address} editing={isEditing}>
            <input id="edit-address" name="address" type="text" autoComplete="street-address" defaultValue={user.address || ''} className={inputClass} placeholder="Tu dirección" />
          </Field>
        </div>
        <div className="profile-email-note">
          <EnvelopeIcon className="h-5 w-5 shrink-0" />
          <div><span>Correo de acceso</span><p>{user.email}</p></div>
          <span className="profile-email-caption">Asociado a tu cuenta</span>
        </div>
      </fieldset>

      {isEditing && <div className="profile-form-actions">
        <p role="status">{isSaving ? 'Estamos guardando tus cambios…' : 'Revisa tus datos antes de guardar.'}</p>
        <div>
          <button type="button" onClick={handleCancel} disabled={isSaving} className="profile-button profile-button-secondary">Cancelar</button>
          <button id="save-btn" type="submit" disabled={isSaving} className="profile-button profile-button-primary">
            {isSaving ? <span className="profile-spinner" aria-hidden="true" /> : <CheckIcon className="h-4 w-4" />}
            {isSaving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>}
      <ChangePhotoModal open={photoModalOpen} onClose={() => setPhotoModalOpen(false)} onConfirm={handlePhotoConfirm} />
    </form>
  );
}

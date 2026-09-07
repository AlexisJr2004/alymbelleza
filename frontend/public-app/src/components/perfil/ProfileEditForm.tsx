import { useRef, type ChangeEvent, type FormEvent } from 'react';
import type { ProfileUser } from '../../types/models';

export type ProfileMessage = { text: string; type: 'error' | 'success' | 'info' } | null;

interface ProfileEditFormProps {
  user: ProfileUser;
  isEditing: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onSubmit: (formData: FormData) => void;
  onFileMessage: (message: ProfileMessage) => void;
  onPreviewUrl: (url: string | null) => void;
}

// Puerto del formulario "Editar perfil" (perfil.html ~566-661 + script
// ~1010-1200). Nota deliberada: el `#cancel-btn` del HTML original nunca se
// conecta a ningún handler (siempre se queda con la clase `hidden`, sin
// forma de mostrarse) — es markup muerto, así que no se porta acá; inventarle
// un "Cancelar" funcional sería agregar una función que el sitio real nunca tuvo.
export default function ProfileEditForm({
  user,
  isEditing,
  isSaving,
  onStartEdit,
  onSubmit,
  onFileMessage,
  onPreviewUrl,
}: ProfileEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedBirthdate = user.birthdate ? user.birthdate.split('T')[0] : '';

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fiel al original: si el archivo no pasa la validación, se muestra el
    // mensaje y se sale sin tocar el input — no se limpia el valor
    // seleccionado (perfil.html no llama a `.value = ''` en este punto).
    if (!file.type.match('image.*')) {
      onFileMessage({ text: 'Por favor selecciona una imagen válida', type: 'error' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onFileMessage({ text: 'La imagen es demasiado grande (máx. 2MB)', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      onPreviewUrl(ev.target?.result as string);
      onFileMessage({ text: 'Imagen seleccionada', type: 'success' });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    // Puerto literal de la renormalización de perfil.html: el input date ya
    // entrega YYYY-MM-DD, pero el original igual la hace pasar por
    // new Date(...).toISOString().split('T')[0] antes de mandarla.
    const birthdateValue = formData.get('birthdate');
    if (typeof birthdateValue === 'string' && birthdateValue) {
      formData.set('birthdate', new Date(birthdateValue).toISOString().split('T')[0]);
    }

    onSubmit(formData);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mb-4" encType="multipart/form-data" autoComplete="off">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="name"
            id="edit-name"
            defaultValue={user.name || ''}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label htmlFor="edit-dni" className="block text-sm font-medium text-gray-700 mb-1">
            Cédula
          </label>
          <input
            type="text"
            name="dni"
            id="edit-dni"
            defaultValue={user.dni || ''}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-birthdate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="birthdate"
            id="edit-birthdate"
            defaultValue={formattedBirthdate}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            name="gender"
            id="edit-gender"
            defaultValue={user.gender || ''}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          >
            <option value="">Selecciona</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            id="edit-phone"
            defaultValue={user.phone || ''}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="address"
            id="edit-address"
            defaultValue={user.address || ''}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              name="profileImage"
              id="edit-profileImage"
              accept="image/*"
              className="hidden"
              disabled={!isEditing}
              onChange={handleFileChange}
            />
            <button
              id="change-photo-btn"
              type="button"
              disabled={!isEditing}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            >
              Cambiar foto
            </button>
            <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (Max. 2MB)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        {!isEditing && (
          <button
            id="edit-btn"
            type="button"
            onClick={onStartEdit}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            Editar perfil
          </button>
        )}
        {isEditing && (
          <button
            id="save-btn"
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold shadow hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
          >
            Guardar cambios
          </button>
        )}
      </div>
    </form>
  );
}

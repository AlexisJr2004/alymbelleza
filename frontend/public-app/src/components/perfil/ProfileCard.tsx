import type { SyntheticEvent } from 'react';
import { resolveProfileImage } from '../../lib/format';
import type { ProfileUser } from '../../types/models';

interface ProfileCardProps {
  user: ProfileUser;
  previewUrl: string | null;
}

function handleImgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = 'https://i.ibb.co/5WcsrDcY/mujer-con-pelo-largo.png';
}

// Puerto de la tarjeta de perfil de solo lectura (perfil.html ~494-563).
//
// Desviación deliberada respecto al original: allí cada fila dni/phone/gender/
// birthdate/address SIEMPRE existe en el DOM (solo se le vacía el textContent
// cuando el campo no tiene valor), dejando una fila con icono y sin texto.
// Acá se oculta la fila entera cuando el campo está vacío, que es lo que el
// propio plan de esta sub-fase pide explícitamente ("only shown when the
// field has a value") — un icono huérfano sin texto no aporta nada.
export default function ProfileCard({ user, previewUrl }: ProfileCardProps) {
  const formattedBirthdate = user.birthdate ? user.birthdate.split('T')[0] : '';

  return (
    <div className="lg:w-1/3">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={previewUrl || resolveProfileImage(user)}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-lg"
              onError={handleImgError}
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white bg-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">{user.name || 'Nombre Apellido'}</h2>
          <p className="text-gray-500 text-sm mt-1 mb-3">{user.email || 'correo@ejemplo.com'}</p>

          <div className="w-full px-3 py-2 rounded-lg bg-purple-50 text-center mb-4">
            <span className="text-purple-700 font-medium">{user.role === 'admin' ? 'Administrador' : 'Usuario Activo'}</span>
          </div>

          <div className="w-full space-y-3 text-sm">
            {user.dni && (
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-600">Cédula: {user.dni}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-600"> | Tel: {user.phone}</span>
              </div>
            )}
            {user.gender && (
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-gray-600"> | Género: {user.gender}</span>
              </div>
            )}
            {formattedBirthdate && (
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600"> | Nacimiento: {formattedBirthdate}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600"> | Dirección: {user.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

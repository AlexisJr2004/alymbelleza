import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';

interface ContactInput {
  name: string;
  email: string;
  message: string;
}

// POST /api/contact espera JSON plano {name, email, message} (ver
// backend/.../authController.js sendContactEmail) — a diferencia de los
// testimonios, aquí sí se manda JSON, igual que hacía setupContactForm en main.js.
export function useSendContact() {
  return useMutation({
    mutationFn: (input: ContactInput) =>
      apiFetch<{ success: boolean; message?: string }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}

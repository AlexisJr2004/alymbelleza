import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../lib/apiClient';
import type { AppliedCoupon } from '../types/models';

interface ValidateCouponResponse {
  success: boolean;
  coupon: AppliedCoupon;
  discount: number;
}

// POST /api/coupons/validate: validación puntual de un código contra el
// subtotal actual del carrito (ver carrito.html ~1480-1515). Es una mutation
// y no una query porque es una llamada de un solo disparo hecha al enviar el
// formulario del cupón, no algo que tenga sentido volver a pedir solo.
export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      apiFetch<ValidateCouponResponse>('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      }),
  });
}

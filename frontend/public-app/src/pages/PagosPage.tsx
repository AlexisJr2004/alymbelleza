import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { usePaymentCardsQuery } from '../hooks/usePaymentCards';
import { useCreateOrder } from '../hooks/useOrders';
import { getStoredUser } from '../lib/auth';
import { notifyError } from '../lib/sweetalert';
import { renderFacturaHTML } from '../lib/invoiceTemplate';
import TarjetasPagoGrid from '../components/pagos/TarjetasPagoGrid';

// Página "Pagos" — puerto de frontend/pagos.html: grid de cuentas bancarias +
// flujo de generación/descarga de factura en PDF.
export default function PagosPage() {
  const { data: cards, isLoading, isError } = usePaymentCardsQuery();
  const createOrder = useCreateOrder();
  const facturaRef = useRef<HTMLDivElement>(null);
  const [facturaHtml, setFacturaHtml] = useState('');
  const [facturaVisible, setFacturaVisible] = useState(false);
  const [descargando, setDescargando] = useState(false);

  async function handleDescargarFactura() {
    // Simplificación deliberada respecto al pagos.html viejo (ver el mismo
    // comentario en CarritoPage.tsx): éste leía un "factura_usuario" propio de
    // localStorage; acá basta con getStoredUser(), que ya es confiable.
    const usuario = getStoredUser();
    if (!usuario || !usuario.token) {
      notifyError('Error', 'Debes iniciar sesión para completar la compra.');
      return;
    }

    const cuponCode = localStorage.getItem('factura_cupon') || undefined;
    setDescargando(true);
    try {
      // El backend arma la orden a partir del carrito actual del usuario (no
      // se manda el carrito en el body) y lo vacía como efecto colateral.
      const res = await createOrder.mutateAsync(cuponCode);
      const html = renderFacturaHTML(usuario, res.data);
      setFacturaHtml(html);
      setFacturaVisible(true);

      // Deja que el HTML recién asignado se monte en el contenedor oculto
      // (ver más abajo) antes de que html2pdf lo lea.
      await new Promise((resolve) => setTimeout(resolve, 0));

      const contenedor = facturaRef.current;
      if (contenedor) {
        const opt = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: `factura_bellabeauty_${Date.now()}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, logging: false, dpi: 300, letterRendering: true, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        };
        await html2pdf().set(opt).from(contenedor).save();
      }

      // La compra ya se registró y el carrito se vació en el backend.
      localStorage.removeItem('factura_cupon');
    } catch (err) {
      notifyError(
        'No se pudo completar la compra',
        err instanceof Error ? err.message : 'Ocurrió un error al procesar tu pedido.'
      );
    } finally {
      setFacturaVisible(false);
      setFacturaHtml('');
      setDescargando(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mb-16 animate-fade-in">
        <br />
        <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight text-gray-900">Nuestras Cuentas Bancarias ✨</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-4" />
      </div>

      <section className="py-12">
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Por favor transfiera el monto a cualquiera de nuestras cuentas y envíe el comprobante junto con la factura al WhatsApp: 099
          793 2650.
        </p>
        <TarjetasPagoGrid cards={cards} isLoading={isLoading} isError={isError} />

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleDescargarFactura}
            disabled={descargando}
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-full text-gray-700 font-medium hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-50 transition-all duration-200 ease-in-out disabled:opacity-60"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {descargando ? 'Procesando...' : 'Descargar Factura en PDF'}
          </button>
        </div>

        {/*
          Única excepción documentada a la regla de "cero dangerouslySetInnerHTML"
          de esta migración: este contenedor nunca se muestra al usuario (solo se
          hace visible un instante, fuera de pantalla lógica, mientras html2canvas
          lo rasteriza) y su contenido no es UI interactiva sino una plantilla de
          documento estática armada por renderFacturaHTML() (ver
          lib/invoiceTemplate.ts) con estilos inline pensados para ese renderizado,
          no para React. Usar JSX normal acá no aportaría nada y complicaría portar
          el diseño 1:1.
        */}
        <div ref={facturaRef} style={{ display: facturaVisible ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: facturaHtml }} />
      </section>
    </>
  );
}

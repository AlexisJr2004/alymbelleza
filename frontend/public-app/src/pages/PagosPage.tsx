import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import StorePageHeading from '../components/home/StorePageHeading';
import StoreIcon from '../components/home/StoreIcon';
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
  const { data: cards, isLoading, isError, refetch } = usePaymentCardsQuery();
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


  return <>
    <main className="bb-commerce" id="contenido">
      <div className="bb-container">
        <StorePageHeading page="Pagos" eyebrow="EL ÚLTIMO PASO DE TU COMPRA" title={<>Un paso más, <em>más cerca de ti</em></>} description="Encuentra nuestros datos bancarios y descarga la factura para acompañar tu comprobante de pago." icon="lock" />
        <div className="bb-commerce-grid">
          <div>
            <section className="bb-commerce-panel" aria-labelledby="payment-accounts-title">
              <h2 id="payment-accounts-title">Nuestras cuentas bancarias</h2>
              <p className="bb-payment-intro">Realiza tu transferencia a cualquiera de estas cuentas. Verifica el número y el titular antes de confirmar.</p>
              <TarjetasPagoGrid cards={cards} isLoading={isLoading} isError={isError} onRetry={() => refetch()} />
            </section>
            <Link to="/carrito" className="bb-commerce-back"><StoreIcon name="arrow" />Volver a mi carrito</Link>
          </div>
          <aside className="bb-commerce-panel bb-order-summary" aria-labelledby="payment-steps-title">
            <h2 id="payment-steps-title">Completa tu pedido</h2>
            <ol className="bb-payment-steps">
              <li><div><strong>Realiza la transferencia</strong>Utiliza los datos de la cuenta bancaria que prefieras.</div></li>
              <li><div><strong>Descarga tu factura</strong>Al generarla, se registra tu pedido con los productos de tu carrito.</div></li>
              <li><div><strong>Envíanos el comprobante</strong>Comparte el comprobante y la factura por WhatsApp para coordinar tu compra.</div></li>
            </ol>
            <button type="button" onClick={handleDescargarFactura} disabled={descargando} className="bb-button">
              <StoreIcon name="down" />{descargando ? 'Procesando...' : 'Descargar factura en PDF'}
            </button>
            <div className="bb-payment-help"><p>¿Necesitas ayuda con tu pago? Estamos para acompañarte.</p><a href="https://wa.me/593997932650" target="_blank" rel="noopener noreferrer"><StoreIcon name="headset" />WhatsApp: 099 793 2650</a></div>
          </aside>
        </div>
      </div>
    </main>
    {/* Documento estático escapado por renderFacturaHTML; html2pdf necesita este nodo para generar el PDF. */}
    <div ref={facturaRef} style={{ display: facturaVisible ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: facturaHtml }} />
  </>;
}

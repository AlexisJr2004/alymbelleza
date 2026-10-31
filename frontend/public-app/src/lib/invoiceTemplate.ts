import type { Order } from '../types/models';

function escapeHtml(value: unknown): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => map[char]);
}

interface FacturaUsuario {
  name?: string;
  email?: string;
}

// Estilos independientes de Tailwind para conservar el diseño al exportar a A4.
// No depende de imágenes ni fuentes externas durante la generación del PDF.
export function renderFacturaHTML(usuario: FacturaUsuario | null, order: Order): string {
  const money = (amount: number) => '$' + amount.toFixed(2);
  const fecha = new Date(order.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
  const discount = order.discount || 0;
  const rows = (order.items || []).map((item, index) => `
    <tr style="break-inside:avoid;page-break-inside:avoid;background:${index % 2 ? '#faf8f9' : '#ffffff'};">
      <td style="padding:14px 12px;border-bottom:1px solid #f0e3e9;word-break:break-word;">
        <span style="color:#a98191;font-size:10px;">${String(index + 1).padStart(2, '0')}</span>
        <strong style="display:block;margin-top:4px;font-size:12px;font-weight:600;">${escapeHtml(item.name)}</strong>
      </td>
      <td style="padding:14px 8px;text-align:center;border-bottom:1px solid #f0e3e9;">${item.cantidad}</td>
      <td style="padding:14px 8px;text-align:right;border-bottom:1px solid #f0e3e9;white-space:nowrap;">${money(item.price)}</td>
      <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f0e3e9;font-weight:600;white-space:nowrap;">${money(item.price * item.cantidad)}</td>
    </tr>`).join('');

  return `
    <article id="invoice" style="width:100%;box-sizing:border-box;margin:0;background:#ffffff;color:#51303f;font:12px/1.5 Arial,sans-serif;">
      <header style="padding:28px 28px 24px;background:#30252c;border-bottom:4px solid #d8a1b6;page-break-inside:avoid;">
        <table style="width:100%;border-collapse:collapse;"><tr>
          <td style="vertical-align:top;">
            <div style="font:30px Georgia,serif;color:#ffffff;">Bella <span style="color:#efc2d3;">Beauty</span></div>
            <p style="margin:7px 0 0;font-size:8px;letter-spacing:2px;color:#d8bdc8;">TU BELLEZA, NUESTRA PASIÓN</p>
          </td>
          <td style="text-align:right;vertical-align:top;">
            <p style="margin:0;font-size:9px;letter-spacing:1.5px;color:#d8bdc8;">DOCUMENTO DE COMPRA</p>
            <h1 style="margin:5px 0 0;font:34px Georgia,serif;color:#ffffff;">Factura de pedido</h1>
            <p style="margin:6px 0 0;font-size:11px;color:#e8d5dd;">${escapeHtml(fecha)}</p>
          </td>
        </tr></table>
      </header>

      <section style="padding:24px 28px;page-break-inside:avoid;">
        <p style="margin:0 0 5px;color:#a98191;font-size:9px;letter-spacing:1.3px;">N.º DE PEDIDO</p>
        <p style="margin:0 0 20px;font-size:12px;word-break:break-all;">${escapeHtml(order._id)}</p>
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr>
          <td style="width:56%;vertical-align:top;padding-right:20px;word-break:break-word;">
            <p style="margin:0 0 8px;color:#a98191;font-size:9px;letter-spacing:1.3px;">PREPARADO PARA</p>
            <strong style="font-size:14px;">${escapeHtml(usuario?.name || order.user?.name || 'Cliente')}</strong>
            <p style="margin:4px 0 0;color:#856575;">${escapeHtml(usuario?.email || order.user?.email || '')}</p>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 8px;color:#a98191;font-size:9px;letter-spacing:1.3px;">FORMA DE PAGO</p>
            <strong style="font-size:12px;">Transferencia bancaria</strong>
            <p style="margin:7px 0 0;"><span style="display:inline-block;padding:5px 10px;border:1px solid #ebcad7;border-radius:12px;background:#fff5f8;color:#a33660;font-size:10px;">Pago por verificar</span></p>
          </td>
        </tr></table>
      </section>

      <section style="padding:0 28px;">
        <h2 style="margin:0 0 12px;font:20px Georgia,serif;">Detalle de productos</h2>
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:11px;">
          <thead style="background:#f4edf0;color:#51303f;"><tr>
            <th style="padding:11px 12px;text-align:left;width:49%;font-weight:400;">Producto</th>
            <th style="padding:11px 8px;width:11%;font-weight:400;">Cant.</th>
            <th style="padding:11px 8px;text-align:right;width:19%;font-weight:400;">Precio</th>
            <th style="padding:11px 12px;text-align:right;width:21%;font-weight:400;">Importe</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="padding:20px 0;page-break-inside:avoid;">
          <table style="width:52%;margin-left:auto;border-collapse:collapse;font-size:12px;">
            <tr><td style="padding:6px 10px;color:#856575;">Subtotal</td><td style="padding:6px 10px;text-align:right;">${money(order.subtotal)}</td></tr>
            ${discount > 0 ? `<tr><td style="padding:6px 10px;color:#a33660;word-break:break-word;">Descuento${order.couponCode ? ' · ' + escapeHtml(order.couponCode) : ''}</td><td style="padding:6px 10px;text-align:right;color:#a33660;white-space:nowrap;">−${money(discount)}</td></tr>` : ''}
            <tr style="background:#30252c;color:#ffffff;"><td style="padding:14px 10px;font-weight:600;">TOTAL · USD</td><td style="padding:14px 10px;text-align:right;font:bold 24px Georgia,serif;color:#efc2d3;white-space:nowrap;">${money(order.total)}</td></tr>
          </table>
        </div>
      </section>

      <footer style="margin:0 28px;padding:20px 0;border-top:1px solid #ebd7e0;page-break-inside:avoid;">
        <h2 style="margin:0 0 6px;font:20px Georgia,serif;">Gracias por elegirnos.</h2>
        <p style="margin:0 0 12px;color:#856575;font-size:11px;">Comparte este resumen y tu comprobante de transferencia por el WhatsApp de la sección Pagos para coordinar tu compra.</p>
        <p style="margin:0;color:#9a7d89;font-size:9px;">Este documento registra tu pedido; no acredita la recepción del pago ni sustituye una factura fiscal.</p>
        <p style="margin:14px 0 0;color:#a98191;font-size:9px;letter-spacing:1px;">BELLA BEAUTY / TU BELLEZA, NUESTRA PASIÓN</p>
      </footer>
    </article>
  `;
}

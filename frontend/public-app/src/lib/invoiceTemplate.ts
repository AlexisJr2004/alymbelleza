import type { Order } from '../types/models';
import cosmeticsPhoto from '../assets/invoice/cosmetics-gold.png';

function escapeHtml(value: unknown): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, char => map[char]);
}

interface FacturaUsuario { name?: string; email?: string; address?: string }
const gold = '#bd9038';
const ink = '#242321';
const line = '#e8dfce';
const dark = 'linear-gradient(115deg,#171717,#393632)';
const metallic = 'linear-gradient(110deg,#8a5e1d,#d5aa50 35%,#fff0b4 55%,#b67e25)';
const flower = 'M24 44C10 40 3 31 3 21c12 0 20 8 21 23Zm0 0c14-4 21-13 21-23-12 0-20 8-21 23Zm0 0C13 33 13 18 24 5c11 13 11 28 0 39ZM17 26 10 12c8 1 13 6 14 12m7 2 7-14c-8 1-13 6-14 12';
const paths = {
  flower,
  document: 'M6 2h9l5 5v15H6V2Zm9 0v6h5M9 12h8m-8 4h8',
  calendar: 'M3 5h18v16H3V5Zm0 5h18M7 2v6m10-6v6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 22v-3a8 6 0 0 1 16 0v3',
  pin: 'M12 22S4 13 4 9a8 8 0 0 1 16 0c0 4-8 13-8 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  card: 'M2 5h20v15H2V5Zm0 5h20m-7 6h4',
  cart: 'M2 3h3l3 13h11l3-10H6m3 14h1m8 0h1',
};
function icon(name: keyof typeof paths, size = 24, color = gold) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${name === 'flower' ? '48 48' : '24 24'}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg>`;
  return `<img alt="" width="${size}" height="${size}" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}" style="display:inline-block;vertical-align:middle;" />`;
}

// Standalone A4 layout; all dynamic text is escaped. Product photography is bundled locally.
export function renderFacturaHTML(usuario: FacturaUsuario | null, order: Order): string {
  const money = (amount: number) => '$' + amount.toFixed(2);
  const fecha = new Date(order.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
  const name = escapeHtml(order.user?.name || usuario?.name || 'Cliente');
  const email = escapeHtml(order.user?.email || usuario?.email || '');
  const discount = order.discount || 0;
  const cell = `padding:10px 9px;border-bottom:1px solid ${line};vertical-align:top;`;
  const rows = (order.items || []).map((item, index) => `
    <tr style="break-inside:avoid;page-break-inside:avoid;background:${index % 2 ? '#faf9f6' : '#ffffff'};">
      <td style="${cell}text-align:center;color:#6a6255;">${String(index + 1).padStart(2, '0')}</td>
      <td style="${cell}overflow-wrap:anywhere;word-break:break-word;font-weight:600;">${escapeHtml(item.name)}</td>
      <td style="${cell}text-align:center;">${escapeHtml(item.cantidad)}</td>
      <td style="${cell}text-align:right;white-space:nowrap;">${money(item.price)}</td>
      <td style="${cell}text-align:right;white-space:nowrap;font-weight:700;background:#fcf5e7;">${money(item.price * item.cantidad)}</td>
    </tr>`).join('');
  const curve = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="178" viewBox="0 0 720 178"><defs><linearGradient id="gold"><stop stop-color="#a06a1d"/><stop offset=".4" stop-color="#ffe8a0"/><stop offset="1" stop-color="#b78126"/></linearGradient><linearGradient id="black"><stop stop-color="#171717"/><stop offset="1" stop-color="#393632"/></linearGradient></defs><path fill="url(#gold)" d="M0 0H470C364 24 370 113 264 142S81 111 0 172Z"/><path fill="url(#black)" d="M0 0H447C353 26 361 108 259 136S80 106 0 162Z"/></svg>`;
  return `
  <article id="invoice" style="width:718px;min-height:1036px;box-sizing:border-box;display:flex;flex-direction:column;margin:0;background:white;color:${ink};font:12px/1.45 Arial,sans-serif;">
    <header style="position:relative;height:178px;flex-shrink:0;overflow:hidden;page-break-inside:avoid;background:#faf8f3;">
      <img alt="" src="${escapeHtml(cosmeticsPhoto)}" style="position:absolute;right:0;top:0;width:430px;height:178px;object-fit:cover;object-position:right 52%;" />
      <img alt="" width="718" height="178" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(curve)}" style="position:absolute;inset:0;width:718px;height:178px;" />
      <div style="position:relative;width:318px;padding-top:10px;text-align:center;">
        ${icon('flower', 50, '#e8be65')}
        <div style="font:bold 37px Georgia,serif;color:white;line-height:1.15;">Bella <span style="color:#e7bd65;">Beauty</span></div>
        <p style="margin:7px 0 0;color:#f5ecd8;font-size:8px;letter-spacing:2.5px;">COSMÉTICOS &amp; BELLEZA</p>
      </div>
    </header>

    <div style="padding:8px 24px 0;">
      <section style="page-break-inside:avoid;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><tr>
          <td style="width:48px;vertical-align:middle;">${icon('document', 37)}</td>
          <td style="border-left:1px solid #36332e;padding-left:16px;">
            <h1 style="font:bold 40px/1 Georgia,serif;letter-spacing:1px;margin:0 0 5px;">FACTURA</h1>
            <p style="font-size:9px;letter-spacing:3px;margin:0;">DOCUMENTO DE COMPRA</p>
          </td>
          <td style="text-align:right;vertical-align:middle;"><span style="display:inline-block;border:1px solid ${gold};border-radius:22px;padding:9px 14px;background:${dark};color:white;font-size:11px;font-weight:600;">Ref. ${escapeHtml(order._id.slice(-10).toUpperCase())}</span></td>
        </tr></table>
        <table style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;border:1px solid #f0ece4;border-radius:15px;background:#f8f7f5;margin-bottom:14px;"><tr>
          <td style="padding:12px;width:31%;vertical-align:top;">${icon('calendar', 21)} <strong style="font-size:10px;">Fecha de emisión</strong><div style="margin-top:5px;font-size:10px;">${escapeHtml(fecha)}</div></td>
          <td style="padding:12px;border-left:1px solid ${line};width:36%;vertical-align:top;">${icon('document', 21)} <strong style="font-size:10px;">N.º de pedido</strong><div style="margin-top:5px;font-size:10px;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(order._id)}</div></td>
          <td style="padding:12px;border-left:1px solid ${line};vertical-align:top;">${icon('card', 21)} <strong style="font-size:10px;">Forma de pago</strong><div style="margin-top:5px;font-size:10px;">Transferencia bancaria</div></td>
        </tr></table>
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:22px;"><tr>
          <td style="width:50%;padding-right:8px;vertical-align:top;">${customerCard('Datos del cliente', name, email, 'user')}</td>
          <td style="padding-left:8px;vertical-align:top;">${customerCard('Preparado para', name, escapeHtml(usuario?.address || 'Entrega por coordinar'), 'pin')}</td>
        </tr></table>
      </section>
      <section>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;page-break-after:avoid;">
          <span style="display:inline-block;padding:9px;border-radius:50%;background:${metallic};">${icon('cart', 22, '#fff')}</span>
          <h2 style="margin:0;white-space:nowrap;font:bold 23px Georgia,serif;">Detalle de productos</h2>
          <span style="height:1px;background:${gold};flex:1;"></span>
        </div>
        <table style="width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;font-size:11px;border:1px solid ${line};border-radius:12px;overflow:hidden;">
          <colgroup><col style="width:7%"/><col style="width:48%"/><col style="width:10%"/><col style="width:17%"/><col style="width:18%"/></colgroup>
          <thead style="background:${dark};color:white;"><tr>
            ${['#', 'Producto', 'Cant.', 'Precio', 'Importe'].map((label, i) => `<th style="padding:9px;border-bottom:2px solid ${gold};text-align:${i === 1 ? 'left' : i > 2 ? 'right' : 'center'};">${label}</th>`).join('')}
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="padding:18px 0 16px;page-break-inside:avoid;">
          <table style="width:52%;margin-left:auto;border-collapse:separate;border-spacing:0;border:1px solid ${line};border-radius:13px;overflow:hidden;background:#faf9f7;">
            <tr><td style="padding:10px 16px;">Subtotal</td><td style="padding:10px 16px;text-align:right;">${money(order.subtotal)}</td></tr>
            ${discount > 0 ? `<tr><td style="padding:0 16px 10px;overflow-wrap:anywhere;">Descuento${order.couponCode ? ' · ' + escapeHtml(order.couponCode) : ''}</td><td style="padding:0 16px 10px;text-align:right;white-space:nowrap;">−${money(discount)}</td></tr>` : ''}
            <tr style="background:${dark};color:white;"><td style="padding:12px 16px;border-top:2px solid ${gold};font-weight:bold;">TOTAL (USD)</td><td style="padding:12px 16px;border-top:2px solid ${gold};text-align:right;font:bold 26px Georgia,serif;color:#efd18a;white-space:nowrap;">${money(order.total)}</td></tr>
          </table>
          <p style="margin:9px 0 0;text-align:right;font-size:9px;color:#786b54;">Pago por verificar</p>
        </div>
      </section>
    </div>
    <footer style="margin-top:auto;padding:14px 24px 16px;page-break-inside:avoid;">
      <div style="border:1px solid ${gold};border-radius:20px 20px 32px 20px;background:${dark};color:white;padding:16px;display:flex;gap:16px;align-items:center;">
        <span style="padding-right:14px;border-right:1px solid ${gold};">${icon('flower', 48, '#e8be65')}</span>
        <div style="flex:1;"><h2 style="margin:0 0 5px;font:italic bold 24px Georgia,serif;color:#e8be65;">Gracias por elegirnos.</h2><p style="margin:0;font-size:10px;line-height:1.5;">Comparte este resumen y tu comprobante de transferencia por el WhatsApp de Pagos para coordinar tu compra.</p></div>
        <div style="border-left:1px solid ${gold};padding-left:14px;font-size:10px;white-space:nowrap;"><strong style="color:#e8be65;">WhatsApp</strong><br />+593 99 793 2650</div>
      </div>
      <p style="margin:9px 0 0;text-align:center;font-size:8px;line-height:1.4;color:#807668;">Este documento registra tu pedido; no acredita la recepción del pago ni sustituye una factura fiscal.</p>
    </footer>
  </article>`;
}

function customerCard(title: string, name: string, detail: string, symbol: 'user' | 'pin') {
  return `<div style="border:1px solid ${line};border-bottom:2px solid ${gold};border-radius:15px;padding:14px;background:#fdfcfb;display:flex;gap:12px;min-height:62px;">
    <span style="align-self:flex-start;padding:8px;border-radius:10px;background:${dark};">${icon(symbol, 24, '#e8be65')}</span>
    <div style="min-width:0;overflow-wrap:anywhere;word-break:break-word;"><h2 style="margin:0 0 4px;font:bold 16px Georgia,serif;">${title}</h2><strong style="font-size:11px;">${name}</strong><p style="margin:4px 0 0;font-size:10px;">${detail}</p></div>
  </div>`;
}

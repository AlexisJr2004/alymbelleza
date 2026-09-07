import type { Order } from '../types/models';

// Escapa HTML antes de insertarlo en la plantilla de factura de abajo. Porte
// del escapeHtml() global de pagos.html — de uso exclusivo de esta plantilla,
// ya que el resto de la app renderiza todo vía JSX (que escapa solo).
function escapeHtml(value: unknown): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => map[char]);
}

interface FacturaUsuario {
  name?: string;
  email?: string;
}

// Puerto directo de renderFacturaHTML() en pagos.html (líneas ~1215-1348):
// arma el HTML con estilos inline (no Tailwind) que consume html2pdf/html2canvas
// para rasterizar el PDF descargable. Se mantiene como string armado a mano (no
// JSX) porque es exactamente eso lo que necesita esa librería como fuente — ver
// el comentario junto al contenedor oculto en PagosPage.tsx que explica la
// única excepción a dangerouslySetInnerHTML de toda esta migración.
export function renderFacturaHTML(usuario: FacturaUsuario | null, order: Order): string {
  const items = order.items || [];
  const subtotal = order.subtotal;
  const descuento = order.discount || 0;
  const total = order.total;

  // Fecha actual
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-EC');
  const fechaAnulacion = new Date(fecha);
  fechaAnulacion.setDate(fecha.getDate() + 3);
  const fechaAnulacionStr = fechaAnulacion.toLocaleDateString('es-EC');

  // Número de orden único
  const numeroOrden = `BB${Date.now().toString().slice(-6)}`;
  const transactionId = `TR${Math.floor(Math.random() * 1000000)}`;

  // Diseño de la factura (idéntico al original)
  return `
    <div id="invoice" style="max-width:800px;margin:auto;font-family:Arial,sans-serif;background:#fff;padding:0;">

        <!-- Cabecera -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #e9ecef;">
            <div>
                <h1 style="margin:0 0 5px 0;color:#7e22ce;font-size:24px;font-weight:bold;">FACTURA</h1>
                <p style="margin:0;font-size:14px;color:#666;">Fecha: ${fechaStr}</p>
            </div>
            <div style="text-align:right;">
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:10px;">
                    <img src="https://res.cloudinary.com/dokmxt0ja/image/upload/v1749136872/perfil_bellabeauty/rvh6jr74vxlmxsmwuykm.png" alt="Bella Beauty Logo" style="width:50px;height:50px;">
                    <div>
                        <h2 style="margin:0;color:#333;font-size:20px;font-weight:bold;">BELLA BEAUTY</h2>
                        <p style="margin:3px 0 0 0;font-size:12px;color:#666;">Tu belleza es nuestra pasión</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de la empresa y cliente -->
        <div style="display:flex;justify-content:space-between;margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #e9ecef;">
            <div style="flex:1;">
                <h3 style="margin:0 0 8px 0;color:#7e22ce;font-size:16px;">Datos de la Empresa</h3>
                <p style="margin:0;font-size:13px;color:#666;line-height:1.4;">
                    <b>Dirección:</b> Av. Principal 123, Ciudad<br/>
                    <b>Teléfono:</b> (02) 123-4567<br/>
                    <b>Email:</b> contacto@bellabeauty.com<br/>
                    <b>RUC:</b> 1234567890123
                </p>
            </div>
            <div style="flex:1;text-align:right;">
                <h3 style="margin:0 0 8px 0;color:#7e22ce;font-size:16px;">Datos del Cliente</h3>
                <p style="margin:0;font-size:13px;color:#666;line-height:1.4;">
                    <b>Nombre:</b> ${escapeHtml(usuario?.name || 'N/A')}<br/>
                    <b>Email:</b> ${escapeHtml(usuario?.email || 'N/A')}<br/>
                    <b>Factura No:</b> ${numeroOrden}<br/>
                    <b>Válido hasta:</b> ${fechaAnulacionStr}
                </p>
            </div>
        </div>

        <!-- Línea horizontal de separación -->
        <hr style="border:none;border-top:2px solid #7e22ce;margin:10px 0 15px 0;">

        <!-- Información de transacción compacta -->
        <div style="background:rgba(126, 34, 206, 0.05);border-radius:6px;margin-bottom:20px;padding:12px 15px;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr>
                    <td style="padding:5px 0;"><b style="color:#7e22ce;">ID Transacción:</b> ${transactionId}</td>
                    <td style="padding:5px 0;"><b style="color:#7e22ce;">Método de Pago:</b> Transferencia Bancaria</td>
                    <td style="padding:5px 0;text-align:right;"><b style="color:#7e22ce;">Estado:</b> <span style="color:#10b981;">Pagado</span></td>
                </tr>
            </table>
        </div>

        <!-- Tabla de productos -->
        <div style="border:1px solid #e9ecef;border-radius:6px;overflow:hidden;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                    <tr style="background:#f8f9fa;">
                        <th style="padding:10px;text-align:left;color:#7e22ce;font-weight:600;border-bottom:1px solid #e9ecef;">Producto</th>
                        <th style="padding:10px;text-align:center;color:#7e22ce;font-weight:600;border-bottom:1px solid #e9ecef;width:60px;">Cant.</th>
                        <th style="padding:10px;text-align:center;color:#7e22ce;font-weight:600;border-bottom:1px solid #e9ecef;width:80px;">Precio</th>
                        <th style="padding:10px;text-align:right;color:#7e22ce;font-weight:600;border-bottom:1px solid #e9ecef;width:90px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items
                      .map((item, idx) => {
                        const subtotalItem = item.price * item.cantidad;
                        return `<tr style="${idx < items.length - 1 ? 'border-bottom:1px solid #f0f0f0;' : ''}">
                            <td style="padding:10px;">
                                <strong style="font-size:13px;">${escapeHtml(item.name)}</strong><br>
                                <small style="color:#666;font-size:12px;">Producto de belleza premium</small>
                            </td>
                            <td style="padding:10px;text-align:center;">${item.cantidad}</td>
                            <td style="padding:10px;text-align:center;">$${item.price.toFixed(2)}</td>
                            <td style="padding:10px;text-align:right;color:#7e22ce;font-weight:600;">$${subtotalItem.toFixed(2)}</td>
                        </tr>`;
                      })
                      .join('')}
                </tbody>
            </table>

            <!-- Total -->
            <div style="background:#f8f9fa;border-top:1px solid #e9ecef;padding:12px 15px;">
                ${
                  descuento > 0
                    ? `
                <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:6px;">
                    <span style="font-size:13px;color:#666;margin-right:15px;">Subtotal:</span>
                    <span style="font-size:13px;color:#666;">$${subtotal.toFixed(2)}</span>
                </div>
                <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:6px;">
                    <span style="font-size:13px;color:#10b981;margin-right:15px;">Descuento${order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ''}:</span>
                    <span style="font-size:13px;color:#10b981;">-$${descuento.toFixed(2)}</span>
                </div>`
                    : ''
                }
                <div style="display:flex;justify-content:flex-end;align-items:center;">
                    <span style="font-weight:bold;font-size:14px;color:#7e22ce;margin-right:15px;">TOTAL:</span>
                    <span style="font-weight:bold;font-size:16px;color:#7e22ce;">$${total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <!-- Notas legales -->
        <div style="margin-top:15px;font-size:12px;color:#666;line-height:1.5;border-top:1px solid #f0f0f0;padding-top:15px;">
            <p style="margin:0 0 8px 0;"><b style="color:#7e22ce;">Notas:</b></p>
            <p style="margin:0 0 8px 0;">• Esta factura es válida hasta el ${fechaAnulacionStr} para anulaciones.</p>
            <p style="margin:0 0 8px 0;">• Conserve este documento para cualquier reclamo o garantía.</p>
            <p style="margin:0;">• Para consultas: contacto@bellabeauty.com | (02) 123-4567</p>
        </div>

        <!-- Pie de página -->
        <div style="margin-top:20px;text-align:center;font-size:11px;color:#999;padding-top:10px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;">© ${fecha.getFullYear()} Bella Beauty - Todos los derechos reservados</p>
        </div>
    </div>
    `;
}

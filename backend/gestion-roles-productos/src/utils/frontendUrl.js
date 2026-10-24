// El sitio público se sirve en el mismo servicio de Render, salvo que se
// configure FRONTEND_URL. No usar Host/Origin de la petición para enlaces con tokens.
function getFrontendUrl() {
  const configured = process.env.FRONTEND_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();
  try {
    const url = new URL(configured);
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      ['undefined', 'null'].includes(url.hostname) ||
      url.username || url.password || url.search || url.hash || url.pathname !== '/'
    ) {
      throw new Error('URL no válida');
    }
    return url.origin;
  } catch {
    throw Object.assign(new Error('Configura FRONTEND_URL con la URL pública del sitio (http o https), sin rutas ni parámetros.'), {
      code: 'FRONTEND_URL_CONFIG',
    });
  }
}

module.exports = { getFrontendUrl };

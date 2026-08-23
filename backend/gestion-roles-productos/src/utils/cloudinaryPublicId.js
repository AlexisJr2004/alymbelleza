// Reconstruye el public_id de Cloudinary a partir de una URL, para archivos subidos
// antes de que se empezara a guardar el public_id junto con la imagen.
// Ej: https://res.cloudinary.com/<cloud>/image/upload/v123456/carpeta/archivo.jpg -> carpeta/archivo
module.exports = function publicIdFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

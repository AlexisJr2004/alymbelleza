// Busca (y opcionalmente borra) archivos en Cloudinary que ya no tienen un elemento
// correspondiente en MongoDB: galería, imágenes de producto y fotos de perfil. Son
// huérfanos dejados por el bug de borrado anterior a este script. Por defecto solo
// hace un reporte, sin borrar nada.
//
// Uso:
//   npm run cleanup:cloudinary            -> modo de prueba, solo lista los huérfanos
//   npm run cleanup:cloudinary -- --delete -> borra de verdad los huérfanos encontrados

require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('../gestion-roles-productos/src/utils/cloudinary');
const publicIdFromUrl = require('../gestion-roles-productos/src/utils/cloudinaryPublicId');
const GalleryItem = require('../gestion-roles-productos/src/models/galleryItem');
const Product = require('../gestion-roles-productos/src/models/product');
const User = require('../gestion-roles-productos/src/models/user');

const shouldDelete = process.argv.includes('--delete');

// Compatibilidad con elementos de galería guardados antes de existir el campo publicId
function legacyGalleryPublicId(item) {
  const filenameWithExt = item.url.split('/').pop();
  const filename = filenameWithExt.split('.')[0];
  return `bella-beauty/gallery/${item.category}/${filename}`;
}

const TARGETS = [
  {
    name: 'Galería',
    prefix: 'bella-beauty/gallery/',
    resourceTypes: ['image', 'video'],
    keepIds: async () => {
      const items = await GalleryItem.find().lean();
      return items.map((item) => item.publicId || legacyGalleryPublicId(item));
    },
  },
  {
    name: 'Productos',
    prefix: 'productos_bellabeauty/',
    resourceTypes: ['image'],
    keepIds: async () => {
      const products = await Product.find().lean();
      return products
        .map((p) => p.imagePublicId || publicIdFromUrl(p.image))
        .filter(Boolean);
    },
  },
  {
    name: 'Fotos de perfil',
    prefix: 'perfil_bellabeauty/',
    resourceTypes: ['image'],
    keepIds: async () => {
      const users = await User.find().lean();
      return users
        .map((u) => u.profileImagePublicId || publicIdFromUrl(u.profileImage))
        .filter(Boolean);
    },
  },
];

async function listAllResources(prefix, resourceType) {
  let resources = [];
  let nextCursor;
  do {
    const response = await cloudinary.api.resources({
      type: 'upload',
      resource_type: resourceType,
      prefix,
      max_results: 500,
      next_cursor: nextCursor,
    });
    resources = resources.concat(response.resources);
    nextCursor = response.next_cursor;
  } while (nextCursor);
  return resources;
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

(async () => {
  const requiredEnv = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Faltan variables de entorno: ${missing.join(', ')}`);
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let totalOrphans = 0;
  let totalMB = 0;

  for (const target of TARGETS) {
    const keep = new Set(await target.keepIds());

    const resourceLists = await Promise.all(
      target.resourceTypes.map((type) => listAllResources(target.prefix, type))
    );
    const allResources = target.resourceTypes.flatMap((type, i) =>
      resourceLists[i].map((r) => ({ ...r, resource_type: type }))
    );

    const orphans = allResources.filter((r) => !keep.has(r.public_id));
    const mb = orphans.reduce((sum, r) => sum + (r.bytes || 0), 0) / 1024 / 1024;
    totalOrphans += orphans.length;
    totalMB += mb;

    console.log(`\n=== ${target.name} (${target.prefix}) ===`);
    console.log(`En uso: ${keep.size} | En Cloudinary: ${allResources.length} | Huérfanos: ${orphans.length} (${mb.toFixed(2)} MB)`);
    orphans.forEach((r) => {
      console.log(`  [${r.resource_type}] ${r.public_id}  (${((r.bytes || 0) / 1024).toFixed(0)} KB)`);
    });

    if (shouldDelete && orphans.length > 0) {
      for (const resourceType of target.resourceTypes) {
        const ids = orphans.filter((r) => r.resource_type === resourceType).map((r) => r.public_id);
        for (const batch of chunk(ids, 100)) {
          if (batch.length === 0) continue;
          const result = await cloudinary.api.delete_resources(batch, { resource_type: resourceType });
          console.log(result);
        }
      }
    }
  }

  console.log(`\nTotal huérfanos: ${totalOrphans} (${totalMB.toFixed(2)} MB)`);
  if (totalOrphans === 0) {
    console.log('No hay nada que limpiar.');
  } else if (!shouldDelete) {
    console.log('Modo de prueba: no se borró nada. Revisa la lista y vuelve a correr con --delete para borrarlos.');
  } else {
    console.log('Listo.');
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

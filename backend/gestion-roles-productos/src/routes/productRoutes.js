const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración de Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos_bellabeauty',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit' }],
  },
});
const upload = multer({ storage });

router.post('/', verifyToken, isAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { verifyToken } = require('../middlewares/authMiddleware');

// Configuración de Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'perfil_bellabeauty',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
});
const upload = multer({ storage });

router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/me', verifyToken, upload.single('profileImage'), authController.updateProfile);
router.get('/me', verifyToken, authController.me);
router.post('/testimonials', verifyToken, authController.createTestimonial);
router.put('/testimonials/:id', verifyToken, authController.editTestimonial);
router.delete('/testimonials/:id', verifyToken, authController.deleteTestimonial);



module.exports = router;
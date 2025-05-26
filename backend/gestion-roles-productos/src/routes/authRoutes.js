const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const authController = require('../controllers/authController');

// Configuración de Multer para imagen de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads')),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);

module.exports = router;
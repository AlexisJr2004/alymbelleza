const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// Validar un código en el carrito (cualquier usuario logueado)
router.post('/validate', verifyToken, couponController.validateCoupon);

// Administración de cupones (solo admin)
router.get('/', verifyToken, authorize('admin'), couponController.getCoupons);
router.post('/', verifyToken, authorize('admin'), couponController.createCoupon);
router.put('/:id', verifyToken, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', verifyToken, authorize('admin'), couponController.deleteCoupon);

module.exports = router;

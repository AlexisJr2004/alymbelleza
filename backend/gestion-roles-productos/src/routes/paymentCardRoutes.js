const express = require('express');
const router = express.Router();
const paymentCardController = require('../controllers/paymentCardController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// Tarjetas activas para la página de pagos (público, cualquier visitante)
router.get('/', paymentCardController.getPaymentCards);

// Administración de tarjetas de pago (solo admin)
router.get('/admin', verifyToken, authorize('admin'), paymentCardController.getPaymentCardsAdmin);
router.post('/', verifyToken, authorize('admin'), paymentCardController.createPaymentCard);
router.put('/:id', verifyToken, authorize('admin'), paymentCardController.updatePaymentCard);
router.delete('/:id', verifyToken, authorize('admin'), paymentCardController.deletePaymentCard);

module.exports = router;

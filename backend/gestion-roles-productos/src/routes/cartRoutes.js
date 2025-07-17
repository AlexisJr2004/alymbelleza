const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, cartController.getCart);
router.post('/add', (req, res, next) => {
  console.log("LLEGA A /api/cart/add", req.body, req.headers.authorization);
  next();
}, verifyToken, cartController.addToCart);
router.post('/update', verifyToken, cartController.updateQuantity);
router.post('/remove', verifyToken, cartController.removeFromCart);
router.post('/clear', verifyToken, cartController.clearCart);

module.exports = router;
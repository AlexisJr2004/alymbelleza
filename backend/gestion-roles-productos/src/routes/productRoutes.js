import express from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = express.Router();
const productController = new ProductController();

// Rutas para productos
router.post('/', authMiddleware, roleMiddleware('admin'), productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:id', authMiddleware, roleMiddleware('admin'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

export default router;
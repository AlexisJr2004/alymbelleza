import Product from '../models/product.js';

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, description, rating, availability, price } = req.body;
            let image = '';
            if (req.file && req.file.path) {
                image = req.file.path; // URL de Cloudinary
            }
            const newProduct = new Product({ name, description, rating, availability, price, image });
            await newProduct.save();
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al crear el producto', details: error.message });
        }
    }

    async getProducts(req, res) {
        try {
            const products = await Product.find({ availability: true });
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al obtener los productos', details: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (req.file && req.file.path) {
                updates.image = req.file.path; // Actualiza la imagen si se sube una nueva
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ success: false, error: 'Producto no encontrado' });
            }
            res.status(200).json({ success: true, data: updatedProduct });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al actualizar el producto', details: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ success: false, error: 'Producto no encontrado' });
            }
            res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al eliminar el producto', details: error.message });
        }
    }
}

export default new ProductController();
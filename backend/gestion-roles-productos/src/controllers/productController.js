const Product = require('../models/product');
const cloudinary = require('../utils/cloudinary');
const publicIdFromUrl = require('../utils/cloudinaryPublicId');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, rating, availability, price, category, featured, originalPrice } = req.body;
        let image = '';
        let imagePublicId;
        if (req.file && req.file.path) {
            image = req.file.path;
            imagePublicId = req.file.filename;
        }
        const newProduct = new Product({
            name,
            description,
            rating,
            availability,
            price,
            category,
            featured: featured === 'true' || featured === true,
            originalPrice,
            image,
            imagePublicId
        });
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ success: false, error: 'Error al crear el producto' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ success: false, error: 'Error al obtener los productos' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ success: false, error: 'Error al obtener el producto' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        let oldImagePublicId = null;

        if (req.file && req.file.path) {
            const existingProduct = await Product.findById(id);
            if (existingProduct) {
                oldImagePublicId = existingProduct.imagePublicId || publicIdFromUrl(existingProduct.image);
            }
            updates.image = req.file.path;
            updates.imagePublicId = req.file.filename;
        }
        if (typeof updates.featured !== "undefined") {
            updates.featured = updates.featured === 'true' || updates.featured === true;
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }

        // La imagen anterior queda huérfana en Cloudinary si no se borra; es un efecto
        // secundario best-effort, no debe hacer fallar la respuesta si Cloudinary falla.
        if (oldImagePublicId) {
            cloudinary.uploader.destroy(oldImagePublicId).catch((err) =>
                console.error('No se pudo borrar la imagen anterior del producto en Cloudinary:', err)
            );
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ success: false, error: 'Error al actualizar el producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }

        const publicId = deletedProduct.imagePublicId || publicIdFromUrl(deletedProduct.image);
        if (publicId) {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok' && result.result !== 'not found') {
                console.warn(`No se pudo borrar la imagen del producto en Cloudinary (${publicId}):`, result.result);
            }
        }

        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ success: false, error: 'Error al eliminar el producto' });
    }
};

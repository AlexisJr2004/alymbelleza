const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Depuración

    // Convertir userId a ObjectId
    const userId = mongoose.Types.ObjectId.isValid(decoded.userId) ? mongoose.Types.ObjectId(decoded.userId) : null;

    if (!userId) {
      console.log('El userId no es válido:', decoded.userId);
      return res.status(400).json({ error: 'ID de usuario no válido.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('Usuario no encontrado en la base de datos:', userId);
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err); // Depuración
    return res.status(403).json({ error: 'Token inválido.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores.' });
  next();
};
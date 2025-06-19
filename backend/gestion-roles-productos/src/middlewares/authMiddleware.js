const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Depuración
    const user = await User.findById(decoded.userId || decoded._id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado.' });
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
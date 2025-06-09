const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Busca el usuario real en la base de datos
    const user = await User.findById(decoded.userId || decoded._id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado.' });
    req.user = user; // Ahora req.user es el usuario real de MongoDB
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores.' });
  next();
};
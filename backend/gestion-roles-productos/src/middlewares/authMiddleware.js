const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

// Verifica el token JWT y adjunta el usuario autenticado (sin datos sensibles) a la petición
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token requerido.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ success: false, error: 'Token inválido.' });
    }

    const user = await User.findById(decoded.userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuario no encontrado.' });
    }
    if (user.isActive === false) {
      return res.status(403).json({ success: false, error: 'Tu cuenta ha sido deshabilitada. Contacta al administrador.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido.' });
  }
};

// Restringe el acceso a los roles indicados. Uso: authorize('admin')
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Acceso denegado. No tienes permisos suficientes.' });
  }
  next();
};

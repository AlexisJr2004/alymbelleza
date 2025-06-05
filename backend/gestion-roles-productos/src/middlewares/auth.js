const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) throw new Error('Usuario no encontrado');
    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};
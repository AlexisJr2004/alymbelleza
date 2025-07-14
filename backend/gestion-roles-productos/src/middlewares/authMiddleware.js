const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');



exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores.' });
  next();
};
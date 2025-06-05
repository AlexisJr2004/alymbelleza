const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const { authMiddleware } = require('../middlewares/auth');

// Crear cita
router.post('/', authMiddleware, async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ success: false, message: 'Fecha requerida' });
  const appointment = new Appointment({ user: req.user._id, date });
  await appointment.save();
  res.json({ success: true, appointment });
});

// Listar citas del usuario
router.get('/', authMiddleware, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id, status: 'pendiente' }).sort({ date: 1 });
  res.json({ success: true, appointments });
});

// Cambiar estado
router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['pendiente', 'realizada', 'cancelada'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Estado inválido' });
  }
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true }
  );
  res.json({ success: true, appointment });
});

module.exports = router;
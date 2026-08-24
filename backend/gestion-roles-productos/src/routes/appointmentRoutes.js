const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// Crear cita
router.post('/', verifyToken, async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ success: false, message: 'Fecha requerida' });
  const appointment = new Appointment({ user: req.user._id, date });
  await appointment.save();
  res.json({ success: true, appointment });
});

// Listar citas del usuario
router.get('/', verifyToken, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
  res.json({ success: true, appointments });
});

// Listar todas las citas de todos los clientes (panel de administrador)
router.get('/admin/all', verifyToken, authorize('admin'), async (req, res) => {
  const appointments = await Appointment.find().populate('user', 'name email').sort({ date: -1 });
  res.json({ success: true, appointments });
});

// Cambiar estado (el admin puede cambiar el estado de la cita de cualquier cliente)
router.patch('/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!['pendiente', 'realizada', 'cancelada'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Estado inválido' });
  }
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, user: req.user._id };
  const appointment = await Appointment.findOneAndUpdate(filter, { status }, { new: true });
  res.json({ success: true, appointment });
});

// Eliminar cita
router.delete('/:id', verifyToken, async (req, res) => {
  const deleted = await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }
  res.json({ success: true, message: 'Cita eliminada' });
});

module.exports = router;
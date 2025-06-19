const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Testimonial = require('../models/testimonial');

// Configuración de Nodemailer (usa tu configuración existente)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Solicitud de recuperación
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const resetUrl = `https://aly-mbelleza-backend.onrender.com/reset-password.html?token=${token}`;

  const mailOptions = {
    to: user.email,
    from: `"Bella Beauty Contacto" <${process.env.EMAIL_USER}>`,
    subject: 'Recuperación de contraseña - Bella Beauty',
    html: `
      <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
          <img src="https://res.cloudinary.com/dokmxt0ja/image/upload/v1748585094/mujer-con-pelo-largo_ppap6w.png" alt="Bella Beauty Logo" style="max-width: 80px; height: auto;">
          <h1 style="color: #7e22ce; font-size: 24px; margin-top: 15px; font-weight: 600;">Recuperación de Contraseña</h1>
        </div>
        <div style="padding: 25px 30px;">
          <p style="font-size: 16px; color: #374151;">Hola <b>${user.name}</b>,</p>
          <p style="font-size: 16px; color: #374151;">
            Hemos recibido una solicitud para restablecer tu contraseña en <b>Bella Beauty</b>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #7e22ce; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 500; font-size: 16px; box-shadow: 0 2px 5px rgba(126, 34, 206, 0.12);">
              Restablecer Contraseña
            </a>
          </div>
          <p style="font-size: 15px; color: #6b7280;">
            Si no solicitaste este cambio, puedes ignorar este correo. El enlace expirará en 1 hora por seguridad.
          </p>
          <div style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            <p>¿Tienes problemas? Copia y pega este enlace en tu navegador:</p>
            <a href="${resetUrl}" style="color: #7e22ce; word-break: break-all;">${resetUrl}</a>
          </div>
        </div>
        <div style="padding: 20px; background-color: #f9fafb; text-align: center; border-top: 1px solid #eaeaea; font-size: 13px; color: #6b7280;">
          <p style="margin: 0 0 10px 0;">Este mensaje fue enviado desde Bella Beauty</p>
          <p style="margin: 0;">
            <a href="https://aly-mbelleza-frontend.onrender.com" style="color: #7e22ce; text-decoration: none;">aly-mbelleza-frontend.onrender.com</a>
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  res.json({ message: 'Correo enviado con instrucciones.' });
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ error: 'Token inválido o expirado.' });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Contraseña actualizada correctamente.' });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId || req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, birthdate, gender, address, dni, phone } = req.body;
    let profileImage = req.file ? req.file.path : undefined;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage,
      role: role || 'cliente',
      birthdate,
      gender,
      address,
      dni,
      phone
    });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address, gender, birthdate, dni } = req.body;

        // Buscar al usuario autenticado
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Actualizar los campos permitidos
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.dni = dni || user.dni;

        // Convertir la fecha de nacimiento a UTC
        if (birthdate) {
            user.birthdate = new Date(birthdate);
        }

        // Si se subió una nueva imagen de perfil
        if (req.file && req.file.path) {
            user.profileImage = req.file.path;
        }

        await user.save();

        res.json({ success: true, message: 'Perfil actualizado correctamente.', user });
    } catch (err) {
        console.error('Error al actualizar el perfil:', err);
        res.status(500).json({ error: 'Error al actualizar el perfil.' });
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta.' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, profileImage: user.profileImage },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, user: { name: user.name, email: user.email, role: user.role, profileImage: user.profileImage } });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario.', details: err.message });
  }
};

// Editar un testimonio
exports.editTestimonial = async (req, res) => {
    try {
        const { id } = req.params; // ID del testimonio
        const { comment } = req.body; // Nuevo contenido del testimonio
        const userId = req.user._id; // ID del usuario autenticado

        // Buscar el testimonio
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonio no encontrado.' });
        }

        // Verificar si el usuario es el autor del testimonio
        if (testimonial.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para editar este testimonio.' });
        }

        // Actualizar el contenido del testimonio
        if (comment) {
            testimonial.comment = comment;
        }

        await testimonial.save();

        res.json({ success: true, message: 'Testimonio editado correctamente.', testimonial });
    } catch (err) {
        console.error('Error al editar el testimonio:', err);
        res.status(500).json({ error: 'Error al editar el testimonio.' });
    }
};

// Eliminar un testimonio
exports.deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params; // ID del testimonio
        const userId = req.user._id; // ID del usuario autenticado

        // Buscar el testimonio
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonio no encontrado.' });
        }

        // Verificar si el usuario es el autor del testimonio
        if (testimonial.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este testimonio.' });
        }

        await testimonial.remove();

        res.json({ success: true, message: 'Testimonio eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el testimonio:', err);
        res.status(500).json({ error: 'Error al eliminar el testimonio.' });
    }
};

exports.createTestimonial = async (req, res) => {
    try {
        const { comment } = req.body; // Contenido del testimonio
        const userId = req.user._id; // ID del usuario autenticado
        const name = req.user.name; // Nombre del usuario autenticado

        if (!comment) {
            return res.status(400).json({ error: 'El comentario es obligatorio.' });
        }

        const newTestimonial = new Testimonial({
            comment,
            userId,
            name,
        });

        await newTestimonial.save();

        res.status(201).json({ success: true, message: 'Testimonio creado correctamente.', testimonial: newTestimonial });
    } catch (err) {
        console.error('Error al crear el testimonio:', err);
        res.status(500).json({ error: 'Error al crear el testimonio.' });
    }
};
const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia } = req.body;
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const usuario = new Usuario({ nombreusuario, correo, contrasenia: hashedPassword });
        await usuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Inicio de sesión
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) return res.status(401).json({ error: 'Correo inválido' });
        const validarContrasena = await bcrypt.compare(contrasenia, usuario.contrasenia);
        if (!validarContrasena) return res.status(401).json({ error: 'Contraseña inválida' });
        const token = jwt.sign({ usuarioId: usuario._id }, 'clave_secreta', { expiresIn: '3h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Lista negra de tokens
let tokenBlacklist = [];

// Cierre de sesión
rutas.post('/cerrarsesion', (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(400).json({ error: 'Token no proporcionado' });
        tokenBlacklist.push(token);
        res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Middleware para verificar tokens y lista negra
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
    if (tokenBlacklist.includes(token)) return res.status(401).json({ error: 'Token inválido' });

    jwt.verify(token, 'clave_secreta', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });
        req.usuarioId = decoded.usuarioId;
        next();
    });
};

// Utilizar middleware para proteger las rutas
rutas.use(verificarToken);

module.exports = rutas;

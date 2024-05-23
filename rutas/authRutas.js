const express = require('express');
const rutas = express.Router();
const Usuario = require('../models/Usuario'); // Importa el modelo de Usuario
const bcrypt = require('bcrypt'); // Importa bcrypt para el hashing de contraseñas
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para la generación y verificación de tokens JWT

// Registro de usuario
rutas.post('/registro', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { nombreusuario, correo, contrasenia } = req.body;
        // Hashea la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        // Crea un nuevo objeto Usuario con los datos proporcionados
        const usuario = new Usuario({ nombreusuario, correo, contrasenia: hashedPassword });
        // Guarda el nuevo usuario en la base de datos
        await usuario.save();
        // Responde con un mensaje de éxito
        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (error) {
        // Maneja cualquier error y responde con un mensaje de error
        res.status(500).json({ mensaje: error.message });
    }
});

// Inicio de sesión
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la solicitud
        const { correo, contrasenia } = req.body;
        // Busca al usuario en la base de datos por correo
        const usuario = await Usuario.findOne({ correo });
        // Si el usuario no existe, responde con un error de autenticación
        if (!usuario) return res.status(401).json({ error: 'Correo invalido!!!!!' });
        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const validarContrasena = await bcrypt.compare(contrasenia, usuario.contrasenia);
        // Si la contraseña no es válida, responde con un error de autenticación
        if (!validarContrasena) return res.status(401).json({ error: 'Contrasenia invalido!!!!!' });
        // Crea un token JWT con el ID del usuario, firmándolo con una clave secreta y estableciendo una expiración
        const token = jwt.sign({ usuarioId: usuario._id }, 'clave_secreta', { expiresIn: '3h' });
        // Responde con el token generado
        res.json({ token });
    } catch (error) {
        // Maneja cualquier error y responde con un mensaje de error
        res.status(500).json({ mensaje: error.message });
    }
});

// Lista negra de tokens (para invalidar tokens en el cierre de sesión)
let tokenBlacklist = [];

// Cierre de sesión
rutas.post('/cerrarsesion', (req, res) => {
    try {
        // Extrae el token del encabezado de la solicitud
        const token = req.headers['authorization'];
        // Si no se proporciona un token, responde con un error
        if (!token) return res.status(400).json({ error: 'Token no proporcionado' });
        // Agrega el token a la lista negra para invalidarlo
        tokenBlacklist.push(token);
        // Responde con un mensaje de éxito
        res.status(200).json({ mensaje: 'Sesión cerrada correctamente' });
    } catch (error) {
        // Maneja cualquier error y responde con un mensaje de error
        res.status(500).json({ mensaje: error.message });
    }
});

// Middleware para verificar tokens y lista negra
rutas.use((req, res, next) => {
    // Extrae el token del encabezado de la solicitud
    const token = req.headers['authorization'];
    // Si el token está en la lista negra, responde con un error de autenticación
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    // Si el token no está en la lista negra, continúa con la siguiente función de middleware
    next();
});

module.exports = rutas;

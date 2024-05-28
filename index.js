// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
require('dotenv').config();

const asistenciaRutas = require('./rutas/asistenciaRutas');
const participanteRutas = require('./rutas/participanteRutas');
const asignacionRutas = require('./rutas/asignacionRutas');

// Configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Inicializar la aplicación de Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Conexión con MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor express corriendo en el puerto: ${PORT}`);
        });
    })
    .catch(error => console.log('Error de conexión', error));

// Middleware de autenticación
const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ mensaje: 'No existe el token de autenticación' });

        const decodificar = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        if (!req.usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Rutas
app.use('/auth', authRutas);
app.use('/apis/asistencia', autenticar, asistenciaRutas);
app.use('/apis/participante', autenticar, participanteRutas);
app.use('/apis/asignacion', autenticar, asignacionRutas);




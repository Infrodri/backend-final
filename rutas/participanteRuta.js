const express = require('express');
const rutas = express.Router();
const ParticipanteModel = require('../models/Participante');

// Endpoint 1. Traer todos los participantes
rutas.get('/getParticipantes', async (req, res) => {
    try {
        const participantes = await ParticipanteModel.find();
        res.json(participantes);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Endpoint 2. Crear un nuevo participante
rutas.post('/crear', async (req, res) => {
    const participante = new ParticipanteModel({
        nombre: req.body.nombre
    });
    try {
        const nuevoParticipante = await participante.save();
        res.status(201).json(nuevoParticipante);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Endpoint 3. Editar un participante
rutas.put('/editar/:id', async (req, res) => {
    try {
        const participanteEditado = await ParticipanteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!participanteEditado)
            return res.status(404).json({ mensaje: 'Participante no encontrado!!!' });
        else
            return res.status(201).json(participanteEditado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Endpoint 4. Eliminar un participante
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const participanteEliminado = await ParticipanteModel.findByIdAndDelete(req.params.id);
        if (!participanteEliminado)
            return res.status(404).json({ mensaje: 'Participante no encontrado!!!' });
        else
            return res.json({ mensaje: 'Participante eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Endpoint 5. Obtener un participante por ID
rutas.get('/obtenerParticipante/:id', async (req, res) => {
    try {
        const participante = await ParticipanteModel.findById(req.params.id);
        if (!participante)
            return res.status(404).json({ mensaje: 'Participante no encontrado!!!' });
        else
            return res.json(participante);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;

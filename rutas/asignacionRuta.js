const express = require('express');
const rutas = express.Router();
const AsignacionModel = require('../models/Asignacion');

// Endpoint 1. Traer todas las asignaciones
rutas.get('/getAsignaciones', async (req, res) => {
    try {
        const asignaciones = await AsignacionModel.find().populate('participanteId');
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Endpoint 2. Crear una nueva asignación
rutas.post('/crear', async (req, res) => {
    const asignacion = new AsignacionModel({
        participanteId: req.body.participanteId,
        materia: req.body.materia
    });
    try {
        const nuevaAsignacion = await asignacion.save();
        res.status(201).json(nuevaAsignacion);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Endpoint 3. Editar una asignación
rutas.put('/editar/:id', async (req, res) => {
    try {
        const asignacionEditada = await AsignacionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!asignacionEditada)
            return res.status(404).json({ mensaje: 'Asignación no encontrada!!!' });
        else
            return res.status(201).json(asignacionEditada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Endpoint 4. Eliminar una asignación
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const asignacionEliminada = await AsignacionModel.findByIdAndDelete(req.params.id);
        if (!asignacionEliminada)
            return res.status(404).json({ mensaje: 'Asignación no encontrada!!!' });
        else
            return res.json({ mensaje: 'Asignación eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Endpoint 5. Obtener una asignación por ID
rutas.get('/obtenerAsignacion/:id', async (req, res) => {
    try {
        const asignacion = await AsignacionModel.findById(req.params.id).populate('participanteId');
        if (!asignacion)
            return res.status(404).json({ mensaje: 'Asignación no encontrada!!!' });
        else
            return res.json(asignacion);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;

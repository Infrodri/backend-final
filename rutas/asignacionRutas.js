const express = require('express');
const rutas = express.Router();
const AsignacionModel = require('../models/asignacion');
const Participante = require('../models/Participante');

// Endpoint 1. Traer todas las asignaciones
rutas.get('/getAsignaciones', async (req, res) => {
    try {
        const asignaciones = await AsignacionModel.find();
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
        const asignacionEditada = await AsignacionModel.findByIdAndUpdate( req.params.id, req.body, { overwriteDiscriminatorKey: true, new: true });
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
// reporte 1
rutas.get('/getAsignaciones', async (req, res) => {
    try {
        const asignaciones = await AsignacionModel.aggregate([
            {
                $group: {
                    _id: "$participanteId",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "participantes", // Nombre del la colección de participantes
                    localField: "_id",
                    foreignField: "_id",
                    as: "participante"
                }
            },
            {
                $unwind: "$participante"
            },
            {
                $project: {
                    _id: 0,
                    participanteId: "$_id",
                    nombre: "$participante.nombre", // Suponiendo que los participantes tienen un campo "nombre"
                    materias: "$count"
                }
            }
        ]);
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// reporte 2
rutas.get('/getAsignacionesPorMateria', async (req, res) => {
    try {
        const asignaciones = await AsignacionModel.aggregate([
            {
                $lookup: {
                    from: "participantes", // Nombre de la colección de participantes
                    localField: "participanteId",
                    foreignField: "_id",
                    as: "participante"
                }
            },
            {
                $unwind: "$participante"
            },
            {
                $group: {
                    _id: "$materia",
                    participantes: { $push: "$participante.nombre" } // Suponiendo que los participantes tienen un campo "nombre"
                }
            },
            {
                $project: {
                    _id: 0,
                    materia: "$_id",
                    participantes: 1
                }
            }
        ]);
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//asignacion de controladores
rutas.get('/obtenerAsignacionesConParticipantes', async (req, res) => {
// exports.obtenerAsignacionesConParticipantes = async (req, res) => {
    try {
        const asignaciones = await AsignacionModel.find().populate('participanteId', 'nombre');
        const resultado = asignaciones.map(asignacion => ({
            Materia: asignacion.materia,
            Participante: asignacion.participanteId ? asignacion.participanteId.nombre : 'N/A'
        }));

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = rutas;

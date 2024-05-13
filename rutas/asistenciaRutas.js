const express = require('express');
const rutas = express.Router();
const AsistenciaModel = require('../models/Asistencia');

//endpoint 1.  traer todas las cantidad de los cusos
rutas.get('/getAsistencia', async (req, res) => {
    try  {
        const asistencia = await  AsistenciaModel.find();
        res.json(asistencia);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//endpoint 2. Crear Datos de la asistencia
rutas.post('/crear', async (req, res) => {
    const asistencia = new AsistenciaModel({
        curso: req.body.curso,
        materias: req.body.materias,
        cantidad: req.body.cantidad
    })
    try {
        const nuevaAsistencia = await asistencia.save();
        res.status(201).json(nuevaAsistencia);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3. Editar la asistencia Curso materias o cantidad
rutas.put('/editar/:id', async (req, res) => {
    try {
        const asistenciaEditada = await AsistenciaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!asistenciaEditada)
            return res.status(404).json({ mensaje : 'Asistencia no encontrada!!!'});
        else
            return res.status(201).json(asistenciaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})
//ENDPOINT 4. eliminar la asistencia a un curso especifico
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const asistenciaEliminada = await AsistenciaModel.findByIdAndDelete(req.params.id);
       if (!asistenciaEliminada)
            return res.status(404).json({ mensaje : 'Asitencia no encontrada!!!'});
       else 
            return res.json({mensaje :  'ASistencia eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - 5. obtener una asistencia por su ID
rutas.get('/asistencia/:id', async (req, res) => {
    try {
        const asistencia = await AsistenciaModel.findById(req.params.id);
        if (!asistencia)
            return res.status(404).json({ mensaje : 'ASistencia no encontrada!!!'});
        else 
            return res.json(asistencia);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - obtener Asistencia por una materia especifica
rutas.get('/ASistencaiPorMateria/:Materias', async (req, res) => {
    try {
        const AsistenciaMateria = await AsistenciaModel.find({ materias: req.params.materias});
        return res.json(AsistenciaMateria);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - eliminar todas las asistencias
rutas.delete('/eliminarTodas', async (req, res) => {
    try {
        await AsistenciaModel.deleteMany({ });
        return res.json({mensaje: "Todas las asistencias han sido eliminadas"});
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - contar el numero total de asistencia
rutas.get('/totalAsistencia', async (req, res) => {
    try {
        const total = await AsistenciaModel.countDocuments();
        return res.json({totalAsistencia: total });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - obtener asistencia ordenadas por curso ascendente
// query.sort({ field: 'asc', test: -1 });
rutas.get('/ordenarAsistencia', async (req, res) => {
    try {
       const asistenciaOrdenadas = await AsistenciaModel.find().sort({ curso: -1});
       res.status(200).json(asistenciaOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - obtener asistencia por cantidad
rutas.get('/asistenciaPorCantidad/:cantidad', async (req, res) => {
    try {
       const asistencia = await AsistenciaModel.find({ cantidad : req.params.cantidad});
       res.status(200).json(asistencia);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//endpoint 6 - obtener asistencia por un materias especificas
rutas.get('/asistenciaPorMAterias/:materias', async (req, res) => {
    try {
        const asistenciaCurso = await AsistenciaModel.find({ materias: new RegExp(req.params.materias, 'i')});
        return res.json(asistenciaMaterias);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

module.exports = rutas;

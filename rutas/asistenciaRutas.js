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
        cantidad: req.body.cantidad,
        fechaInicio: req.body.fechaInicio,
        fechaFinal: req.body.fechaFinal
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
rutas.get('/obtenerAsistencia/:id', async (req, res) => {
    try {
        console.log("entro a get")
        const asistencia = await AsistenciaModel.findById(req.params.id);
        if (!asistencia)
            return res.status(404).json({ mensaje : 'ASistencia no encontrada!!!'});
        else 
            return res.json(asistencia);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - 6. obtener Asistencia de cada curso que lleva la materias especifica
rutas.get('/materia/:materias', async (req, res) => {
    try {
        const AsistenciaMaterias = await AsistenciaModel.find({ materias: new RegExp(req.params.materias, 'i') });
        return res.json(AsistenciaMaterias);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - 7. eliminar todas las asistencias de las materias que sean menores a la cantidad X
rutas.delete('/eliminarPorCantidad/:cantidad', async (req, res) => {
    try {
        const cantidad = parseInt(req.params.cantidad);

        if (isNaN(cantidad)) {        // Verificar si la cantidad proporcionada es un número válido

            return res.status(400).json({ mensaje: 'Por favor, proporcione una cantidad válida.' });
        }

        const { deletedCount } = await AsistenciaModel.deleteMany({ cantidad: { $lt: cantidad } });   // Buscar y eliminar por la cantidad menor a "X"

        if (deletedCount === 0) {        // Verificar si se eliminaron 

            return res.status(404).json({ mensaje: `No se encontraron asistencias con cantidad menor a ${cantidad}.` });
        }

        return res.json({ mensaje: `Se han eliminado ${deletedCount} asistencias con cantidad menor a ${cantidad}.` });
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - 8. total Asistencia de todos lo cursos
rutas.get('/totalAsistencia', async (req, res) => {
    try {
        const total = await AsistenciaModel.countDocuments();
        return res.json({totalAsistencia: total });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - 9.Obtener las asistencias ordenadas por la cantidad de materias
// query.sort({ field: 'asc', test: -1 });
rutas.get('/ordenarAsistencia', async (req, res) => {
    try {
       const asistenciaOrdenadas = await AsistenciaModel.find().sort({ curso: -1});
       res.status(200).json(asistenciaOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// - 10. obtener asistencia por cantidad
rutas.get('/asistenciaPorCantidad/:cantidad', async (req, res) => {
    try {
       const asistencia = await AsistenciaModel.find({ cantidad : req.params.cantidad});
       res.status(200).json(asistencia);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});


module.exports = rutas;

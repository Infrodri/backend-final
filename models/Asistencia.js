const mongoose = require('mongoose');

// Definir el esquema
const AsistenciaSchema = new mongoose.Schema({
    curso: String,
    materias: String,
    cantidad: Number,
    fechaInicio: Date,
    fechaFinal: Date 
});

// Crear el modelo
const AsistenciaModel = mongoose.model('Asistencia', AsistenciaSchema);

module.exports = AsistenciaModel;


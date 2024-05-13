const mongoose = require('mongoose');
//definir el esquema
const AsistenciaSchema = new mongoose.Schema({
    // nombreCurso: { type: String, require: true}
    curso: String,
    materias: String,
    cantidad: Number
});

const AsistenciaModel = mongoose.model('Asistencia', AsistenciaSchema, 'asistencia');
module.exports = AsistenciaModel;



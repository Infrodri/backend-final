const mongoose = require('mongoose');
//definir el esquema
const AsistenciaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    nombre: String,
    ingredientes: String,
    porciones: Number
});

const AsistenciaModel = mongoose.model('Asistencia', AsistenciaSchema, 'asistencia');
module.exports = AsistenciaModel;



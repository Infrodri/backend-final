const mongoose = require('mongoose');

// Definir el esquema
const AsignacionSchema = mongoose.Schema({
    participanteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participante' },
    materia: String
});

// Crear el modelo
const AsignacionModel = mongoose.model('Asignacion', AsignacionSchema);

module.exports = AsignacionModel;

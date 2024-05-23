const mongoose = require('mongoose');

// Definir el esquema
const ParticipanteSchema = new mongoose.Schema({
    nombre: String
});

// Crear el modelo
const ParticipanteModel = mongoose.model('Participante', ParticipanteSchema);

module.exports = ParticipanteModel;

const mongoose = require('mongoose');

// Definir el esquema
const UsuarioSchema = new mongoose.Schema({
    
    nombreusuario: {
        tupe: String,
        require : true,
        unique : true
    },
    correo: {
        tupe: String,
        require : true,
        unique : true
    },
    contrasenia: {
        tupe: String,
        require : true,
        unique : true
    } 
});

// Crear el modelo
const UsuarioModel = mongoose.model('Usuario', usuarioSchema, 'usuario');

module.exports = UsuarioModel;
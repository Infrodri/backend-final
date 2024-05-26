// const express = require('express');
// const request = require('supertest');
// const asignacionRutas = require('../../rutas/asignacionRutas');
// const AsignacionModel = require('../../models/asignacion');
// const ParticipanteModel = require('../../models/Participante');
// const mongoose = require('mongoose');

// const app = express();
// app.use(express.json());
// app.use('/asignacion', asignacionRutas);

// describe('Pruebas Unitarias para Asignaciones', () => {
//     //se ejecuta antes de iniciar las pruebas
//     beforeEach(async () => {
//         await mongoose.connect('mongodb://127.0.0.1:27017/appasignaciones', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         await AsignacionModel.deleteMany({});
//         await ParticipanteModel.deleteMany({});
//     });

//     // al finalizar las pruebas
//     afterAll(() => {
//         return mongoose.connection.close();
//     });

//     // 1er test : GET /getAsignaciones
//     test('Deberia traer la lista de participantes y el conteo de materias: GET /getAsignaciones', async () => {
//         const participante1 = await ParticipanteModel.create({ nombre: 'Juan' });
//         const participante2 = await ParticipanteModel.create({ nombre: 'Maria' });

//         await AsignacionModel.create([
//             { participanteId: participante1._id, materia: 'Matemáticas' },
//             { participanteId: participante1._id, materia: 'Ciencias' },
//             { participanteId: participante2._id, materia: 'Historia' }
//         ]);

//         const res = await request(app).get('/asignacion/getAsignaciones');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveLength(2);
//         expect(res.body).toEqual(
//             expect.arrayContaining([
//                 expect.objectContaining({ nombre: 'Juan', materias: 2 }),
//                 expect.objectContaining({ nombre: 'Maria', materias: 1 })
//             ])
//         );
//     });

//     // 2do test : GET /getAsignacionesPorMateria
//     test('Deberia traer la lista de materias y los nombres de los participantes: GET /getAsignacionesPorMateria', async () => {
//         const participante1 = await ParticipanteModel.create({ nombre: 'Juan' });
//         const participante2 = await ParticipanteModel.create({ nombre: 'Maria' });

//         await AsignacionModel.create([
//             { participanteId: participante1._id, materia: 'Matemáticas' },
//             { participanteId: participante2._id, materia: 'Matemáticas' },
//             { participanteId: participante1._id, materia: 'Ciencias' }
//         ]);

//         const res = await request(app).get('/asignacion/getAsignacionesPorMateria');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveLength(2);
//         expect(res.body).toEqual(
//             expect.arrayContaining([
//                 expect.objectContaining({ materia: 'Matemáticas', participantes: expect.arrayContaining(['Juan', 'Maria']) }),
//                 expect.objectContaining({ materia: 'Ciencias', participantes: expect.arrayContaining(['Juan']) })
//             ])
//         );
//     });

//     // 3er test : POST /crear
//     test('Deberia agregar una nueva asignación: POST /crear', async () => {
//         const nuevoParticipante = await ParticipanteModel.create({ nombre: 'Carlos' });
//         const nuevaAsignacion = {
//             participanteId: nuevoParticipante._id,
//             materia: 'Física'
//         };
//         const res = await request(app)
//             .post('/asignacion/crear')
//             .send(nuevaAsignacion);
//         expect(res.statusCode).toEqual(201);
//         expect(res.body.participanteId).toEqual(nuevaAsignacion.participanteId.toString());
//     });

//     // 4to test : PUT /editar/:id
//     test('Deberia actualizar una asignación existente: PUT /editar/:id', async () => {
//         const nuevoParticipante = await ParticipanteModel.create({ nombre: 'Ana' });
//         const asignacionCreada = await AsignacionModel.create({
//             participanteId: nuevoParticipante._id,
//             materia: 'Química'
//         });
//         const asignacionActualizar = {
//             materia: 'Biología'
//         };
//         const res = await request(app)
//             .put('/asignacion/editar/' + asignacionCreada._id)
//             .send(asignacionActualizar);
//         expect(res.statusCode).toEqual(201);
//         expect(res.body.materia).toEqual(asignacionActualizar.materia);
//     });

//     // 5to test : DELETE /eliminar/:id
//     test('Deberia eliminar una asignación existente: DELETE /eliminar/:id', async () => {
//         const nuevoParticipante = await ParticipanteModel.create({ nombre: 'Luis' });
//         const asignacionCreada = await AsignacionModel.create({
//             participanteId: nuevoParticipante._id,
//             materia: 'Geografía'
//         });
//         const res = await request(app)
//             .delete('/asignacion/eliminar/' + asignacionCreada._id);
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toEqual({ mensaje: 'Asignación eliminada' });
//     });
// });


// const express = require('express');
// const request = require('supertest');
// const asistenciaRutas = require('../rutas/asistenciaRutas');
// const AsistenciaModel = require('../models/Asistencia');
// const mongoose = require('mongoose');

// // Configurar la aplicación de prueba
// const app = express();
// app.use(express.json());
// app.use('/asistencia', asistenciaRutas);

// describe('Pruebas Unitarias para Asistencia de cursos', () => {
//     // Se ejecuta antes de iniciar las pruebas
//     beforeEach(async () => {
//         await mongoose.connect('mongodb://127.0.0.1:27017/appasistencias', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         await AsistenciaModel.deleteMany({});
//     });

//     // Se ejecuta al finalizar todas las pruebas
//     afterAll(() => {
//         return mongoose.connection.close();
//     });

//     // Test para traer todas las asistencias
//     test('Debería traer todas las asistencias de curso: GET /asistencia/getAsistencia', async () => {
//         await AsistenciaModel.create([
//             {
//                 curso: 'Curso 1',
//                 materias: 'Matemáticas',
//                 cantidad: 30,
//                 fechaInicio: '2024-05-20',
//                 fechaFinal: '2025-05-20'
//             },
//             {
//                 curso: 'Curso 2',
//                 materias: 'Ciencias',
//                 cantidad: 25,
//                 fechaInicio: '2024-06-15',
//                 fechaFinal: '2025-06-15'
//             }
//         ]);

//         const res = await request(app).get('/asistencia/getAsistencia');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveLength(2);
//     }, 10000);

//     // Test para agregar una nueva asistencia
//     test('Debería agregar una nueva asistencia a curso: POST /asistencia/crear', async () => {
//         const nuevaAsistencia = {
//             curso: 'Curso 3',
//             materias: 'Lenguaje',
//             cantidad: 20,
//             fechaInicio: '2024-07-01',
//             fechaFinal: '2025-07-01'
//         };

//         const res = await request(app)
//             .post('/asistencia/crear')
//             .send(nuevaAsistencia);
//         expect(res.statusCode).toEqual(201);
//         expect(res.body.curso).toEqual(nuevaAsistencia.curso);
//     });

//     // Test para actualizar una asistencia
//     test('Debería actualizar una asistencia existente: PUT /asistencia/editar/:id', async () => {
//         const nuevaAsistencia = await AsistenciaModel.create({
//             curso: 'Curso 4',
//             materias: 'Historia',
//             cantidad: 15,
//             fechaInicio: '2024-08-01',
//             fechaFinal: '2025-08-01'
//         });

//         const asistenciaEditada = {
//             curso: 'Curso 4 Editado',
//             materias: 'Historia Editada',
//             cantidad: 20,
//             fechaInicio: '2024-08-01',
//             fechaFinal: '2025-08-01'
//         };

//         const res = await request(app)
//             .put(`/asistencia/editar/${nuevaAsistencia._id}`)
//             .send(asistenciaEditada);
//         expect(res.statusCode).toEqual(201);
//         expect(res.body.curso).toEqual(asistenciaEditada.curso);
//     });

//     // Test para eliminar una asistencia
//     test('Debería eliminar una asistencia existente: DELETE /asistencia/eliminar/:id', async () => {
//         const nuevaAsistencia = await AsistenciaModel.create({
//             curso: 'Curso 5',
//             materias: 'Arte',
//             cantidad: 10,
//             fechaInicio: '2024-09-01',
//             fechaFinal: '2025-09-01'
//         });

//         const res = await request(app)
//             .delete(`/asistencia/eliminar/${nuevaAsistencia._id}`);
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.mensaje).toEqual('ASistencia eliminada');
//     });
// });

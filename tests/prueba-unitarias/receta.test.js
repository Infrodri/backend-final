const express = require('express');
const request = require('supertest');
const asistenciaRutas = require('../../rutas/asistenciaRutas');
const AsistenciaModel = require('../../models/Asistencia');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/asistencia', asistenciaRutas);

describe('Pruebas Unitarias para Asistencia de cursos', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appasistencias',{
            useNewUrlParser : true,            
        });
        await AsistenciaModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las aistencias de curso metodo: GET: getAsistencia', async() =>{
        await AsistenciaModel.create({
            curso: 'prueba',
            materias: 'todas las materias',
            cantidad: 100,
            fechaInicio: '2024-05-20',
            fechaFinal: '2025-05-20' 
        });
        await AsistenciaModel.create({
            curso: 'prueba',
            materias: 'todas las materias',
            cantidad: 100,
            fechaInicio: '2024-05-20',
            fechaFinal: '2025-05-20' 
        });
        // solicitud - request
        const res =  await request(app).get('/apis/getAsistencia');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);
//test para agregar una nueva asistencia para un curso
    test('Deberia agregar una nueva Asistencia a curso: POST: /crear', async() => {
        const nuevaAsistencia = {
            curso: 'prueba',
            materias: 'todas las materias',
            cantidad: 100,
            fechaInicio: '2024-05-20',
            fechaFinal: '2025-05-20' 
        };
        const res =  await request(app)
                            .post('/apis/crear')
                            .send(nuevaAsistencia);
        expect(res.statusCode).toEqual(201);
        expect(res.body.curso).toEqual(nuevaAsistencia.curso);
    });
//teste de actualizacion de nuestra asistencia a un curso espesifico
    test('Deberia actualizar una Asistencia a curso que ya existe: PUT /editar/:id', async()=>{
        const nuevaAsistencia = await AsistenciaModel.create(
            {
                curso: 'prueba',
                materias: 'todas las materias',
                cantidad: 100,
                fechaInicio: '2024-05-20',
                fechaFinal: '2025-05-20' 
            });
        const asistenciaEditada = {
            curso: 'prueba editada',
            materias: 'todas las materiaseditada',
            cantidad: 100,
            fechaInicio: '2024-05-20',
            fechaFinal: '2025-05-20' 
        };
        const res =  await request(app)
                            .put('/apis/editar/'+nuevaAsistencia._id)
                            .send(asistenciaEditada);
        expect(res.statusCode).toEqual(201);
        expect(res.body.curso).toEqual(asistenciaEditada.curso);                   

    });
//     test('Deberia eliminar una tarea existente : DELETE /eliminar/:id', async() =>{
//         const asistenciaCreada = await asistenciaCreada.create(
//             { curso : 'primero',
//             materias : 'matematicas, lenguaje, sociales, ciencias',
//             cantidad : 10,
//             fechaInicio : '2020-01-20T00:00:00.000Z',
//             fechaFinal: '2021-05-20T00:00:00.000Z'
//                                  });

//         const res =  await request(app)
//                                 .delete('/apis/eliminar/'+asistenciaCreada._id);
        
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toEqual({mensaje :  'Curso eliminado'});
});
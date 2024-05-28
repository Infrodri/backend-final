const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const AsistenciaModel = require('../../models/Asistencia');
const asistenciaRutas = require('../../rutas/asistenciaRutas');

const app = express();
app.use(express.json());
app.use('/asistencia', asistenciaRutas);

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/test_database';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Asistencias API', () => {
    beforeEach(async () => {
        await AsistenciaModel.deleteMany();
    });

    it('debería crear una nueva asistencia', async () => {
        const res = await request(app)
            .post('/asistencia/crear')
            .send({
                fechaInicio: '2023-05-01',
                curso: 'Matemáticas',
                cantidad: 30
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        
        expect(res.body).toHaveProperty('fechaInicio', '2023-05-01T00:00:00.000Z');
        expect(res.body).toHaveProperty('curso', 'Matemáticas');
        expect(res.body).toHaveProperty('cantidad', 30);
    });

    it('debería obtener todas las asistencias', async () => {
        const asistencia = new AsistenciaModel({ fecha: '2023-05-01', curso: 'Matemáticas', cantidad: 30 });
        await asistencia.save();

        const res = await request(app).get('/asistencia/getAsistencias');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('curso', 'Matemáticas');
    });

    it('debería editar una asistencia', async () => {
        const asistencia = new AsistenciaModel({ fecha: '2023-05-01', curso: 'Matemáticas', cantidad: 30 });
        const savedAsistencia = await asistencia.save();

        const res = await request(app)
            .put(`/asistencia/editar/${savedAsistencia._id}`)
            .send({
                curso: 'Física',
                cantidad: 25
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('curso', 'Física');
        expect(res.body).toHaveProperty('cantidad', 25);
    });

    it('debería eliminar una asistencia', async () => {
        const asistencia = new AsistenciaModel({ fecha: '2023-05-01', curso: 'Matemáticas', cantidad: 30 });
        const savedAsistencia = await asistencia.save();

        const res = await request(app).delete(`/asistencia/eliminar/${savedAsistencia._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensaje', 'Asistencia eliminada');
    });
});


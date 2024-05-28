const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const AsignacionModel = require('../../models/asignacion');
const ParticipanteModel = require('../../models/Participante');
const asignacionRutas = require('../../rutas/asignacionRutas');

const app = express();
app.use(express.json());
app.use('/asignacion', asignacionRutas);

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/test_database';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Asignaciones API', () => {
    let participanteId;

    beforeEach(async () => {
        await AsignacionModel.deleteMany();
        await ParticipanteModel.deleteMany();

        const participante = new ParticipanteModel({ nombre: 'Test Participante' });
        const savedParticipante = await participante.save();
        participanteId = savedParticipante._id;
    });

    it('debería crear una nueva asignación', async () => {
        const res = await request(app)
            .post('/asignacion/crear')
            .send({
                participanteId: participanteId,
                materia: 'Test Materia'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('participanteId', String(participanteId));
        expect(res.body).toHaveProperty('materia', 'Test Materia');
    });

    it('debería obtener todas las asignaciones', async () => {
        const asignacion = new AsignacionModel({ participanteId, materia: 'Test Materia' });
        await asignacion.save();

        const res = await request(app).get('/asignacion/getAsignaciones');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('materia', 'Test Materia');
    });

    it('debería editar una asignación', async () => {
        const asignacion = new AsignacionModel({ participanteId, materia: 'Test Materia' });
        const savedAsignacion = await asignacion.save();

        const res = await request(app)
            .put(`/asignacion/editar/${savedAsignacion._id}`)
            .send({
                materia: 'Updated Materia'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('materia', 'Updated Materia');
    });

    it('debería eliminar una asignación', async () => {
        const asignacion = new AsignacionModel({ participanteId, materia: 'Test Materia' });
        const savedAsignacion = await asignacion.save();

        const res = await request(app).delete(`/asignacion/eliminar/${savedAsignacion._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mensaje', 'Asignación eliminada');
    });

    it('debería obtener asignaciones con participantes', async () => {
        const asignacion = new AsignacionModel({ participanteId, materia: 'Test Materia' });
        await asignacion.save();

        const res = await request(app).get('/asignacion/obtenerAsignacionesConParticipantes');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('Materia', 'Test Materia');
        expect(res.body[0]).toHaveProperty('Participante', 'Test Participante');
    });
});


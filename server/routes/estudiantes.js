import express from 'express';
import Estudiante from '../models/Estudiante.js';

const router = express.Router();

// GET - Obtener todos los estudiantes
router.get('/', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        res.json({
            success: true,
            total: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiantes',
            error: error.message
        });
    }
});

// GET - Obtener solo los nombres
router.get('/nombres', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find().select('nombre apellido cedula -_id');
        res.json({
            success: true,
            total: estudiantes.length,
            data: estudiantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener nombres',
            error: error.message
        });
    }
});

export default router;
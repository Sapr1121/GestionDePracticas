import express from 'express';
import {
    createEstudiante,
    getAllEstudiantes,
    getEstudianteById,
    loginEstudiante
} from '../controllers/estudianteController.js';
import Estudiante from '../models/Estudiante.js';
import { requireAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// RUTAS PÚBLICAS
router.post('/create', createEstudiante);
router.post('/login', loginEstudiante);

// RUTAS ADMIN (PROTEGIDAS)
router.get('/', getAllEstudiantes);
router.get('/:id', requireAdmin, getEstudianteById);


// AHORA (SIN TOKEN)
router.patch('/:id/habilitar', async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { 
                habilitado: true,
                solicitudPendiente: false
            },
            { new: true }
        ).select('-contrasena');

        if (!estudiante) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Estudiante habilitado',
            estudiante
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

router.patch('/:id/bloquear', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { bloqueado: true },
            { new: true }
        ).select('-contrasena');

        if (!estudiante) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Estudiante habilitado',
            estudiante
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// server/routes/estudianteRoutes.js
router.patch('/asignar-tutor', async (req, res) => {
    try {
        const { estudianteId, tutorId } = req.body;

        const tutor = await Tutor.findById(tutorId);
        if (!tutor || tutor.bloqueado || !tutor.disponible) {
            return res.status(400).json({ success: false, message: 'Tutor no disponible' });
        }

        const estudiante = await Estudiante.findByIdAndUpdate(
            estudianteId,
            { tutor: tutorId },
            { new: true }
        );

        // Actualizar disponibilidad del tutor
        await actualizarDisponibilidadTutor(tutorId);

        res.status(200).json({ success: true, message: 'Tutor asignado', estudiante });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

router.post('/solicitar-habilitacion', async (req, res) => {
    try {
        const { estudianteId } = req.body;
        const estudiante = await Estudiante.findById(estudianteId);
        if (!estudiante) return res.status(404).json({ success: false, message: 'No encontrado' });
        if (estudiante.habilitado) return res.status(400).json({ success: false, message: 'Ya estás habilitado' });
        if (estudiante.solicitudPendiente) return res.status(400).json({ success: false, message: 'Ya enviaste una solicitud' });

        estudiante.solicitudPendiente = true;
        await estudiante.save();

        res.status(200).json({ success: true, message: 'Solicitud enviada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

export default router;
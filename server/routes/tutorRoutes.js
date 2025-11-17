import express from 'express';
import {
    createTutor,
    getAllTutores,
    getTutorById,
    loginTutor
} from '../controllers/tutorController.js';
import Tutor from '../models/Tutor.js';
import { requireAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// ¡IMPORTANTE! Estas deben ir PRIMERO
// ============================================
router.post('/login', loginTutor);
router.post('/create', createTutor);

// ============================================
// RUTAS ESPECÍFICAS (ANTES DE /:id)
// ============================================
router.get('/disponibles', async (req, res) => {
    try {
        const tutores = await Tutor.find({ disponible: true, bloqueado: false })
            .select('nombre apellido departamento')
            .sort({ apellido: 1 });

        res.status(200).json({ success: true, tutores });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
});

// ============================================
// RUTAS PROTEGIDAS (REQUIEREN ADMIN)
// ============================================
router.get('/', requireAdmin, getAllTutores);

// BLOQUEAR TUTOR
router.patch('/:id/bloquear', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const tutor = await Tutor.findByIdAndUpdate(
            id,
            { bloqueado: true },
            { new: true }
        ).select('-contrasena');

        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Tutor bloqueado',
            tutor
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// ============================================
// RUTAS CON PARÁMETROS (SIEMPRE AL FINAL)
// ============================================
router.get('/:id', requireAdmin, getTutorById);

export default router;
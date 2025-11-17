import express from 'express';
import {
    createObservacion,
    getAllObservaciones,
    getObservacionesByEstudiante,
    getObservacionesByEmpresa,
    updateEstadoObservacion,
    deleteObservacion,
    getEstadisticasObservaciones
} from '../controllers/observacionController.js';
import AsignacionTutor from '../models/AsignacionTutor.js'; // ← AGREGAR
import Observacion from '../models/Observacion.js'; // ← AGREGAR

const router = express.Router();

// Crear observación
router.post('/create', createObservacion);

// Obtener todas (admin)
router.get('/all', getAllObservaciones);

// Obtener por estudiante
router.get('/estudiante/:estudianteId', getObservacionesByEstudiante);

// Obtener por empresa
router.get('/empresa/:empresaId', getObservacionesByEmpresa);

// Actualizar estado (admin)
router.patch('/:id/estado', updateEstadoObservacion);

// Eliminar (admin)
router.delete('/:id', deleteObservacion);

// Estadísticas
router.get('/estadisticas', getEstadisticasObservaciones);

// ✅ Obtener observaciones de estudiantes asignados a un tutor
router.get('/tutor/:tutorId', async (req, res) => {
    try {
        const { tutorId } = req.params;
        
        // 1. Obtener los IDs de los estudiantes asignados a este tutor
        const asignaciones = await AsignacionTutor.find({
            tutorId,
            estado: 'aceptado'
        }).select('estudianteId');
        
        const estudiantesIds = asignaciones.map(a => a.estudianteId);
        
        // 2. Buscar observaciones de esos estudiantes
        const observaciones = await Observacion.find({
            estudianteId: { $in: estudiantesIds }
        })
        .populate('estudianteId', 'nombre apellido cedula carrera semestreActual correo')
        .populate('empresaId', 'name nit') // ← name, no nombre
        .populate('ofertaId', 'nombreProyecto')
        .sort({ fechaCreacion: -1 });
        
        // Mapear para incluir los datos completos
        const observacionesFormateadas = observaciones.map(obs => ({
            ...obs.toObject(),
            estudianteData: obs.estudianteId,
            empresaData: obs.empresaId,
            ofertaData: obs.ofertaId
        }));
        
        res.json({
            success: true,
            total: observacionesFormateadas.length,
            observaciones: observacionesFormateadas
        });
        
    } catch (error) {
        console.error('Error al obtener observaciones del tutor:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
        });
    }
});

export default router;
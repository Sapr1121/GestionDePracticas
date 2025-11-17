import express from 'express';
import {
    solicitarTutor,
    getMiSolicitud,
    getSolicitudesPendientes,
    aceptarSolicitud,
    rechazarSolicitud,
    getEstudiantesAsignados,
    agregarNota,
    asignarNotaFinal
} from '../controllers/asignacionController.js';

const router = express.Router();

// ==========================================
// RUTAS PARA ESTUDIANTES
// ==========================================

// Solicitar un tutor
router.post('/solicitar', solicitarTutor);

// Ver mi solicitud activa
router.get('/estudiante/:estudianteId/solicitud', getMiSolicitud);

// ==========================================
// RUTAS PARA TUTORES
// ==========================================

// Ver solicitudes pendientes
router.get('/tutor/:tutorId/pendientes', getSolicitudesPendientes);

// Ver estudiantes asignados
router.get('/tutor/:tutorId/estudiantes', getEstudiantesAsignados);

// Aceptar solicitud
router.patch('/solicitud/:solicitudId/aceptar', aceptarSolicitud);

// Rechazar solicitud
router.patch('/solicitud/:solicitudId/rechazar', rechazarSolicitud);

// Agregar nota a estudiante
router.post('/asignacion/:asignacionId/nota', agregarNota);

// Asignar nota final
router.patch('/asignacion/:asignacionId/nota-final', asignarNotaFinal);

export default router;
import express from 'express';
import {
    solicitarTutor,
    getMiSolicitud,
    getSolicitudesPendientes,
    aceptarSolicitud,
    rechazarSolicitud,
    getEstudiantesAsignados,
    agregarNota,
    asignarNotaFinal,
    getAllNotasFinales,
    marcarNotaComoVista
} from '../controllers/asignacionController.js';

const router = express.Router();

// ==========================================
// RUTAS PARA ADMIN (Primero, antes de las rutas con parámetros)
// ==========================================
router.get('/notas/todas', getAllNotasFinales);
router.patch('/nota/:asignacionId/marcar-visto', marcarNotaComoVista);

// ==========================================
// RUTAS PARA ESTUDIANTES
// ==========================================
router.post('/solicitar', solicitarTutor);
router.get('/estudiante/:estudianteId/solicitud', getMiSolicitud);

// ==========================================
// RUTAS PARA TUTORES
// ==========================================
router.get('/tutor/:tutorId/pendientes', getSolicitudesPendientes);
router.get('/tutor/:tutorId/estudiantes', getEstudiantesAsignados);
router.patch('/solicitud/:solicitudId/aceptar', aceptarSolicitud);
router.patch('/solicitud/:solicitudId/rechazar', rechazarSolicitud);
router.post('/asignacion/:asignacionId/nota', agregarNota);
router.patch('/asignacion/:asignacionId/nota-final', asignarNotaFinal);

export default router;
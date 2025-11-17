import express from 'express';
import {
    createAplicacion,
    getAplicacionesByEstudiante,
    getAplicacionesByEmpresa,
    getAplicacionesByOferta,
    updateEstadoAplicacion,
    descargarArchivo
} from '../controllers/aplicacionController.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

// Crear aplicación con archivos
router.post('/create', 
    upload.fields([
        { name: 'hojaVida', maxCount: 1 },
        { name: 'cartaPresentacion', maxCount: 1 }
    ]),
    createAplicacion
);

// Obtener aplicaciones
router.get('/estudiante/:estudianteId', getAplicacionesByEstudiante);
router.get('/empresa/:empresaId', getAplicacionesByEmpresa);
router.get('/oferta/:ofertaId', getAplicacionesByOferta);

// Actualizar estado (solo una ruta)
router.patch('/:id/estado', updateEstadoAplicacion);

// Descargar archivos
router.get('/:id/archivo/:tipo', descargarArchivo);

export default router;
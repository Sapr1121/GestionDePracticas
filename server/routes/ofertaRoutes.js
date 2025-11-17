import express from 'express';
import {
    createOferta,
    getOfertasByEmpresa,
    deleteOferta,
    updateOferta,
    getAllOfertas
} from '../controllers/ofertaController.js';

const router = express.Router();

router.post('/create', createOferta);
router.get('/empresa/:empresaId', getOfertasByEmpresa);
router.get('/all', getAllOfertas);
router.delete('/:id', deleteOferta);
router.put('/:id', updateOferta);

export default router;
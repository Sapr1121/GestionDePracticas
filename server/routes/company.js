const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Oferta = require('../models/Oferta'); // Asegúrate de importar el modelo de Oferta
const bcrypt = require('bcryptjs');

// Obtener todas las empresas
router.get('/all', async (req, res) => {
    try {
        const companies = await User.find({ role: 'empresa' })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            companies
        });
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener empresas'
        });
    }
});

// Crear nueva empresa (tu endpoint existente)
router.post('/create', async (req, res) => {
    // ... tu código existente
});

// ⭐ AGREGAR ESTE ENDPOINT NUEVO
router.put('/toggle-status/:id', async (req, res) => {
    try {
        const company = await User.findById(req.params.id);
        
        if (!company || company.role !== 'empresa') {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        // Cambiar el estado
        company.isActive = company.isActive === false ? true : false;
        await company.save();

        // Si se desactiva la empresa, desactivar todas sus ofertas
        if (company.isActive === false) {
            await Oferta.updateMany(
                { empresaId: company._id },
                { $set: { activa: false } }
            );
        }

        res.json({
            success: true,
            message: `Empresa ${company.isActive ? 'activada' : 'desactivada'} exitosamente`,
            company
        });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la empresa'
        });
    }
});

module.exports = router;
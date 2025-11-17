import Oferta from '../models/Oferta.js';
import User from '../models/User.js'; // IMPORTANTE: para verificar empresa activa

export const createOferta = async (req, res) => {
    try {
        const {
            carrera,
            nombreProyecto,
            areasProyecto,
            observaciones,
            esConducenteGrado,
            maxEstudiantesEntrevistar,
            maxEstudiantesAceptar,
            fechaInicio,
            fechaFin,
            pago,
            empresaId
        } = req.body;

        // Verificar que la empresa exista y esté activa
        const empresa = await User.findById(empresaId);
        if (!empresa || !empresa.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Empresa no autorizada para crear ofertas'
            });
        }

        const newOferta = new Oferta({
            empresaId,
            carrera,
            nombreProyecto,
            areasProyecto,
            observaciones,
            esConducenteGrado,
            maxEstudiantesEntrevistar,
            maxEstudiantesAceptar,
            fechaInicio,
            fechaFin,
            pago
        });

        await newOferta.save();

        res.status(201).json({
            success: true,
            message: 'Oferta creada exitosamente',
            oferta: newOferta
        });

    } catch (error) {
        console.error('Error al crear oferta:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getOfertasByEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;

        // Verificar empresa activa
        const empresa = await User.findById(empresaId);
        if (!empresa || !empresa.isActive) {
            return res.status(200).json({ success: true, ofertas: [] });
        }

        const ofertas = await Oferta.find({ 
            empresaId, 
            activa: true 
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            ofertas
        });

    } catch (error) {
        console.error('Error al obtener ofertas:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const deleteOferta = async (req, res) => {
    try {
        const { id } = req.params;

        const oferta = await Oferta.findById(id);
        if (!oferta) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
        }

        // Opcional: verificar que la empresa esté activa
        const empresa = await User.findById(oferta.empresaId);
        if (empresa && !empresa.isActive) {
            return res.status(403).json({ success: false, message: 'Empresa desactivada' });
        }

        await Oferta.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Oferta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar oferta:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const updateOferta = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const oferta = await Oferta.findById(id);
        if (!oferta) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
        }

        const empresa = await User.findById(oferta.empresaId);
        if (empresa && !empresa.isActive) {
            return res.status(403).json({ success: false, message: 'Empresa desactivada' });
        }

        const updatedOferta = await Oferta.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Oferta actualizada exitosamente',
            oferta: updatedOferta
        });

    } catch (error) {
        console.error('Error al actualizar oferta:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getAllOfertas = async (req, res) => {
    try {
        // 1. Solo ofertas activas
        // 2. Solo de empresas activas
        const ofertas = await Oferta.find({ activa: true })
            .populate({
                path: 'empresaId',
                match: { isActive: true }, // SOLO EMPRESAS ACTIVAS
                select: 'name email'
            })
            .sort({ createdAt: -1 });

        // Filtrar ofertas donde empresaId es null (empresa desactivada)
        const ofertasValidas = ofertas.filter(o => o.empresaId !== null);

        res.status(200).json({
            success: true,
            ofertas: ofertasValidas
        });

    } catch (error) {
        console.error('Error al obtener todas las ofertas:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
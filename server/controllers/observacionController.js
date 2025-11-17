import Observacion from '../models/Observacion.js';
import Estudiante from '../models/Estudiante.js';
import User from '../models/User.js';
import Oferta from '../models/Oferta.js';

// Crear una nueva observación
export const createObservacion = async (req, res) => {
    try {
        const { estudianteId, empresaId, ofertaId, tipo, motivo, descripcion } = req.body;

        // Validaciones
        if (!estudianteId || !empresaId || !tipo || !motivo || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar estudiante
        const estudiante = await Estudiante.findById(estudianteId);
        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        // Verificar empresa
        const empresa = await User.findById(empresaId);
        if (!empresa) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        // Datos de la observación
        const observacionData = {
            estudianteId,
            empresaId,
            tipo,
            motivo,
            descripcion,
            estudianteData: {
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                cedula: estudiante.cedula,
                carrera: estudiante.carrera,
                semestre: estudiante.semestreActual,
                correo: estudiante.correo
            },
            empresaData: {
                nombre: empresa.name,
                nit: empresa.nit
            }
        };

        // Si hay oferta asociada
        if (ofertaId) {
            const oferta = await Oferta.findById(ofertaId);
            if (oferta) {
                observacionData.ofertaId = ofertaId;
                observacionData.ofertaData = {
                    nombreProyecto: oferta.nombreProyecto
                };
            }
        }

        const observacion = new Observacion(observacionData);
        await observacion.save();

        res.status(201).json({
            success: true,
            message: 'Observación creada exitosamente',
            observacion
        });

    } catch (error) {
        console.error('Error al crear observación:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

// Obtener todas las observaciones (para admin)
export const getAllObservaciones = async (req, res) => {
    try {
        const { estado } = req.query;
        
        const filter = {};
        if (estado) {
            filter.estado = estado;
        }

        const observaciones = await Observacion.find(filter)
            .populate('estudianteId', 'nombre apellido cedula carrera correo')
            .populate('empresaId', 'name nit')
            .populate('ofertaId', 'nombreProyecto')
            .sort({ fechaCreacion: -1 });

        res.status(200).json({
            success: true,
            count: observaciones.length,
            observaciones
        });
    } catch (error) {
        console.error('Error al obtener observaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener observaciones',
            error: error.message
        });
    }
};

// Obtener observaciones de un estudiante específico
export const getObservacionesByEstudiante = async (req, res) => {
    try {
        const { estudianteId } = req.params;

        const observaciones = await Observacion.find({ estudianteId })
            .populate('empresaId', 'name')
            .populate('ofertaId', 'nombreProyecto')
            .sort({ fechaCreacion: -1 });

        res.status(200).json({
            success: true,
            count: observaciones.length,
            observaciones
        });
    } catch (error) {
        console.error('Error al obtener observaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener observaciones',
            error: error.message
        });
    }
};

// Obtener observaciones creadas por una empresa
export const getObservacionesByEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;

        const observaciones = await Observacion.find({ empresaId })
            .populate('estudianteId', 'nombre apellido carrera')
            .populate('ofertaId', 'nombreProyecto')
            .sort({ fechaCreacion: -1 });

        res.status(200).json({
            success: true,
            count: observaciones.length,
            observaciones
        });
    } catch (error) {
        console.error('Error al obtener observaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener observaciones',
            error: error.message
        });
    }
};

// Actualizar estado de observación (para admin)
export const updateEstadoObservacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, notasAdmin } = req.body;

        const observacion = await Observacion.findByIdAndUpdate(
            id,
            {
                estado,
                notasAdmin: notasAdmin || '',
                fechaRevision: estado === 'revisada' ? Date.now() : null
            },
            { new: true }
        );

        if (!observacion) {
            return res.status(404).json({
                success: false,
                message: 'Observación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente',
            observacion
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado',
            error: error.message
        });
    }
};

// Eliminar observación (solo admin)
export const deleteObservacion = async (req, res) => {
    try {
        const { id } = req.params;

        const observacion = await Observacion.findByIdAndDelete(id);

        if (!observacion) {
            return res.status(404).json({
                success: false,
                message: 'Observación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Observación eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar observación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar observación',
            error: error.message
        });
    }
};

// Obtener estadísticas de observaciones
export const getEstadisticasObservaciones = async (req, res) => {
    try {
        const total = await Observacion.countDocuments();
        const pendientes = await Observacion.countDocuments({ estado: 'pendiente' });
        const revisadas = await Observacion.countDocuments({ estado: 'revisada' });
        const positivas = await Observacion.countDocuments({ tipo: 'positiva' });
        const negativas = await Observacion.countDocuments({ tipo: 'negativa' });

        res.status(200).json({
            success: true,
            estadisticas: {
                total,
                pendientes,
                revisadas,
                positivas,
                negativas
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};
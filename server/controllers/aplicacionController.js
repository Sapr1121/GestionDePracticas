import Aplicacion from '../models/Aplicacion.js';
import Oferta from '../models/Oferta.js';
import Estudiante from '../models/Estudiante.js';

export const createAplicacion = async (req, res) => {
    try {
        const { ofertaId, estudianteId, empresaId, telefono } = req.body;
        
        if (!empresaId || typeof empresaId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'empresaId inválido'
            });
        }

        // VALIDACIONES
        if (!estudianteId || !ofertaId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        if (!req.files?.hojaVida) {
            return res.status(400).json({
                success: false,
                message: 'La hoja de vida es obligatoria'
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

        // Verificar oferta
        const oferta = await Oferta.findById(ofertaId);
        if (!oferta || !oferta.activa) {
            return res.status(400).json({
                success: false,
                message: 'Oferta no disponible'
            });
        }

        // ✅ NUEVO: Verificar cupos disponibles
        if (oferta.cuposDisponibles <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay cupos disponibles para esta oferta'
            });
        }

        // Verificar aplicación duplicada
        const existe = await Aplicacion.findOne({ estudianteId, ofertaId });
        if (existe) {
            return res.status(400).json({
                success: false,
                message: 'Ya aplicaste a esta oferta'
            });
        }

        // Archivos
        const hojaVida = req.files.hojaVida[0];
        const cartaPresentacion = req.files.cartaPresentacion?.[0];

        // Crear aplicación
        const aplicacion = new Aplicacion({
            estudianteId,
            ofertaId,
            empresaId: empresaId || oferta.empresaId,
            telefono,
            estudianteData: {
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                carrera: estudiante.carrera,
                semestre: estudiante.semestreActual,
                correo: estudiante.correo,
                telefono,
                cedula: estudiante.cedula
            },
            hojaVida: {
                filename: hojaVida.filename,
                originalName: hojaVida.originalname,
                mimetype: hojaVida.mimetype,
                size: hojaVida.size,
                path: hojaVida.path
            },
            cartaPresentacion: cartaPresentacion ? {
                filename: cartaPresentacion.filename,
                originalName: cartaPresentacion.originalname,
                mimetype: cartaPresentacion.mimetype,
                size: cartaPresentacion.size,
                path: cartaPresentacion.path
            } : null
        });

        await aplicacion.save();

        res.status(201).json({
            success: true,
            message: 'Aplicación enviada exitosamente',
            aplicacion
        });

    } catch (error) {
        console.error('Error en createAplicacion:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: error.message
        });
    }
};

export const getAplicacionesByEstudiante = async (req, res) => {
    try {
        const { estudianteId } = req.params;
        
        const aplicaciones = await Aplicacion.find({ estudianteId })
            .populate('ofertaId')
            .populate('empresaId')
            .sort({ fechaAplicacion: -1 });

        res.status(200).json({
            success: true,
            aplicaciones
        });
    } catch (error) {
        console.error('Error al obtener aplicaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener aplicaciones',
            error: error.message
        });
    }
};

export const getAplicacionesByEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;
        
        const aplicaciones = await Aplicacion.find({ empresaId })
            .populate('ofertaId')
            .populate('estudianteId')
            .sort({ fechaAplicacion: -1 });

        res.status(200).json({
            success: true,
            aplicaciones
        });
    } catch (error) {
        console.error('Error al obtener aplicaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener aplicaciones',
            error: error.message
        });
    }
};

export const getAplicacionesByOferta = async (req, res) => {
    try {
        const { ofertaId } = req.params;
        
        const aplicaciones = await Aplicacion.find({ ofertaId })
            .populate('estudianteId')
            .sort({ fechaAplicacion: -1 });

        res.status(200).json({
            success: true,
            aplicaciones
        });
    } catch (error) {
        console.error('Error al obtener aplicaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener aplicaciones',
            error: error.message
        });
    }
};

// ✅ ACTUALIZADO: Ahora maneja fechaEntrevista y decrementa vacantes
export const updateEstadoAplicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, notasEmpresa, fechaEntrevista } = req.body;

        const aplicacion = await Aplicacion.findById(id).populate('ofertaId');
        
        if (!aplicacion) {
            return res.status(404).json({
                success: false,
                message: 'Aplicación no encontrada'
            });
        }

        const estadoAnterior = aplicacion.estado;

        // Actualizar la aplicación
        aplicacion.estado = estado;
        aplicacion.notasEmpresa = notasEmpresa || aplicacion.notasEmpresa;
        aplicacion.fechaActualizacion = Date.now();
        
        if (fechaEntrevista) {
            aplicacion.fechaEntrevista = fechaEntrevista;
        }

        await aplicacion.save();

        // ✅ SI SE ACEPTA (CONTRATA) AL ESTUDIANTE, DECREMENTAR VACANTES
        if (estado === 'aceptado' && estadoAnterior !== 'aceptado') {
            const oferta = await Oferta.findById(aplicacion.ofertaId);
            
            if (oferta) {
                oferta.cuposDisponibles = Math.max(0, oferta.cuposDisponibles - 1);
                
                // SI NO HAY CUPOS, DESACTIVAR LA OFERTA
                if (oferta.cuposDisponibles === 0) {
                    oferta.activa = false;
                }
                
                await oferta.save();
            }
        }

        // ✅ SI SE RECHAZA A UN ACEPTADO, INCREMENTAR VACANTES
        if (estadoAnterior === 'aceptado' && estado !== 'aceptado') {
            const oferta = await Oferta.findById(aplicacion.ofertaId);
            
            if (oferta) {
                oferta.cuposDisponibles = Math.min(
                    oferta.maxEstudiantesAceptar,
                    oferta.cuposDisponibles + 1
                );
                oferta.activa = true;
                await oferta.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente',
            aplicacion
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

// Función para descargar archivos
export const descargarArchivo = async (req, res) => {
    try {
        const { id, tipo } = req.params;
        
        const aplicacion = await Aplicacion.findById(id);
        
        if (!aplicacion) {
            return res.status(404).json({
                success: false,
                message: 'Aplicación no encontrada'
            });
        }

        let archivo;
        if (tipo === 'hoja-vida') {
            archivo = aplicacion.hojaVida;
        } else if (tipo === 'carta-presentacion') {
            archivo = aplicacion.cartaPresentacion;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Tipo de archivo no válido'
            });
        }

        if (!archivo || !archivo.path) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado'
            });
        }

        res.download(archivo.path, archivo.originalName);
        
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al descargar archivo',
            error: error.message
        });
    }
};
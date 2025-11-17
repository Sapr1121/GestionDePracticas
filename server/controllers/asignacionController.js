import AsignacionTutor from '../models/AsignacionTutor.js';
import Estudiante from '../models/Estudiante.js';
import Tutor from '../models/Tutor.js';
import Aplicacion from '../models/Aplicacion.js'; // ← NUEVO

// ==========================================
// ESTUDIANTE: Solicitar tutor
// ==========================================
export const solicitarTutor = async (req, res) => {
    try {
        const { estudianteId, tutorId } = req.body;

        // Verificar que el estudiante existe
        const estudiante = await Estudiante.findById(estudianteId);
        if (!estudiante) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }

        // Verificar si ya tiene tutor asignado (permanente)
        if (estudiante.tutor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya tienes un tutor asignado. No puedes cambiarlo.' 
            });
        }

        // Verificar si ya tiene una solicitud pendiente
        const solicitudExistente = await AsignacionTutor.findOne({
            estudianteId,
            estado: 'pendiente'
        });

        if (solicitudExistente) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya tienes una solicitud pendiente. Espera la respuesta del tutor.' 
            });
        }

        // Verificar que el tutor existe y está disponible
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor no encontrado' });
        }

        if (tutor.bloqueado) {
            return res.status(400).json({ success: false, message: 'El tutor está bloqueado' });
        }

        if (!tutor.disponible) {
            return res.status(400).json({ 
                success: false, 
                message: 'El tutor ya alcanzó su límite de estudiantes' 
            });
        }

        // Crear la solicitud
        const nuevaSolicitud = new AsignacionTutor({
            estudianteId,
            tutorId
        });

        await nuevaSolicitud.save();

        res.status(201).json({
            success: true,
            message: 'Solicitud enviada al tutor',
            solicitud: nuevaSolicitud
        });

    } catch (error) {
        console.error('Error al solicitar tutor:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// ESTUDIANTE: Ver estado de solicitud
// ==========================================
export const getMiSolicitud = async (req, res) => {
    try {
        const { estudianteId } = req.params;

        const solicitud = await AsignacionTutor.findOne({
            estudianteId,
            estado: { $in: ['pendiente', 'aceptado'] }
        })
        .populate('tutorId', 'nombre apellido departamento correo')
        .sort({ fechaSolicitud: -1 });

        if (!solicitud) {
            return res.status(200).json({ 
                success: true, 
                solicitud: null,
                mensaje: 'No tienes solicitudes activas'
            });
        }

        res.status(200).json({
            success: true,
            solicitud
        });

    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Ver solicitudes pendientes
// ==========================================
export const getSolicitudesPendientes = async (req, res) => {
    try {
        const { tutorId } = req.params;

        const solicitudes = await AsignacionTutor.find({
            tutorId,
            estado: 'pendiente'
        })
        .populate('estudianteId', 'nombre apellido cedula carrera semestreActual correo')
        .sort({ fechaSolicitud: -1 });

        res.status(200).json({
            success: true,
            total: solicitudes.length,
            solicitudes
        });

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Aceptar solicitud - ✅ CORREGIDO
// ==========================================
export const aceptarSolicitud = async (req, res) => {
    try {
        const { solicitudId } = req.params;

        const solicitud = await AsignacionTutor.findById(solicitudId);
        if (!solicitud) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }

        if (solicitud.estado !== 'pendiente') {
            return res.status(400).json({ 
                success: false, 
                message: 'Esta solicitud ya fue procesada' 
            });
        }

        // Verificar que el tutor aún tiene espacio
        const tutor = await Tutor.findById(solicitud.tutorId);
        const estudiantesAsignados = await AsignacionTutor.countDocuments({
            tutorId: solicitud.tutorId,
            estado: 'aceptado'
        });

        if (estudiantesAsignados >= tutor.maxEstudiantes) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya alcanzaste tu límite de estudiantes' 
            });
        }

        // ✅ NUEVO: Buscar la aplicación aceptada del estudiante para obtener oferta y empresa
        const aplicacionAceptada = await Aplicacion.findOne({
            estudianteId: solicitud.estudianteId,
            estado: 'aceptado'
        }).populate('ofertaId');

        if (!aplicacionAceptada) {
            return res.status(400).json({ 
                success: false, 
                message: 'El estudiante no tiene una práctica aceptada en ninguna empresa' 
            });
        }

        // ✅ NUEVO: Actualizar la solicitud con oferta y empresa
        solicitud.estado = 'aceptado';
        solicitud.fechaRespuesta = new Date();
        solicitud.permanente = true;
        solicitud.ofertaId = aplicacionAceptada.ofertaId._id;
        solicitud.empresaId = aplicacionAceptada.ofertaId.empresaId;
        await solicitud.save();

        // Asignar tutor al estudiante
        await Estudiante.findByIdAndUpdate(solicitud.estudianteId, {
            tutor: solicitud.tutorId
        });

        // Actualizar disponibilidad del tutor si llegó al límite
        if (estudiantesAsignados + 1 >= tutor.maxEstudiantes) {
            tutor.disponible = false;
            await tutor.save();
        }

        const solicitudCompleta = await AsignacionTutor.findById(solicitudId)
            .populate('estudianteId', 'nombre apellido carrera')
            .populate('ofertaId', 'nombreProyecto fechaInicio fechaFin')
            .populate('empresaId', 'name nit sector');

        res.status(200).json({
            success: true,
            message: 'Solicitud aceptada',
            solicitud: solicitudCompleta
        });

    } catch (error) {
        console.error('Error al aceptar solicitud:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Rechazar solicitud
// ==========================================
export const rechazarSolicitud = async (req, res) => {
    try {
        const { solicitudId } = req.params;
        const { motivo } = req.body;

        const solicitud = await AsignacionTutor.findById(solicitudId);
        if (!solicitud) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }

        if (solicitud.estado !== 'pendiente') {
            return res.status(400).json({ 
                success: false, 
                message: 'Esta solicitud ya fue procesada' 
            });
        }

        solicitud.estado = 'rechazado';
        solicitud.fechaRespuesta = new Date();
        solicitud.motivoRechazo = motivo || 'No especificado';
        await solicitud.save();

        res.status(200).json({
            success: true,
            message: 'Solicitud rechazada',
            solicitud
        });

    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Ver estudiantes asignados - ✅ CORREGIDO
// ==========================================
export const getEstudiantesAsignados = async (req, res) => {
    try {
        const { tutorId } = req.params;

        const asignaciones = await AsignacionTutor.find({
            tutorId,
            estado: 'aceptado'
        })
        .populate('estudianteId', 'nombre apellido cedula carrera semestreActual correo telefono')
        .populate({
            path: 'ofertaId',
            select: 'nombreProyecto fechaInicio fechaFin areasProyecto',
            populate: {
                path: 'empresaId',
                select: 'name nit sector companyData'
            }
        })
        .populate('empresaId', 'name nit sector companyData')
        .sort({ fechaRespuesta: -1 });

        res.status(200).json({
            success: true,
            total: asignaciones.length,
            estudiantes: asignaciones
        });

    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Agregar nota a estudiante
// ==========================================
export const agregarNota = async (req, res) => {
    try {
        const { asignacionId } = req.params;
        const { titulo, valor, comentario } = req.body;

        const asignacion = await AsignacionTutor.findById(asignacionId);
        if (!asignacion) {
            return res.status(404).json({ success: false, message: 'Asignación no encontrada' });
        }

        if (asignacion.estado !== 'aceptado') {
            return res.status(400).json({ 
                success: false, 
                message: 'Solo puedes calificar estudiantes asignados' 
            });
        }

        // Agregar la nota
        asignacion.notas.push({
            titulo,
            valor,
            comentario,
            fecha: new Date()
        });

        await asignacion.save();

        res.status(200).json({
            success: true,
            message: 'Nota agregada exitosamente',
            asignacion
        });

    } catch (error) {
        console.error('Error al agregar nota:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// ==========================================
// TUTOR: Asignar nota final - ✅ CON VALIDACIÓN DE FECHA
// ==========================================
export const asignarNotaFinal = async (req, res) => {
    try {
        const { asignacionId } = req.params;
        const { notaFinal } = req.body;

        if (notaFinal < 0 || notaFinal > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'La nota debe estar entre 0 y 5' 
            });
        }

        const asignacion = await AsignacionTutor.findById(asignacionId)
            .populate('ofertaId', 'fechaFin');
        
        if (!asignacion) {
            return res.status(404).json({ success: false, message: 'Asignación no encontrada' });
        }

        // ✅ VALIDAR QUE LA PRÁCTICA HAYA FINALIZADO
        if (asignacion.ofertaId && asignacion.ofertaId.fechaFin) {
            const fechaFin = new Date(asignacion.ofertaId.fechaFin);
            const hoy = new Date();
            
            if (hoy < fechaFin) {
                const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
                return res.status(400).json({ 
                    success: false, 
                    message: `No puedes asignar nota aún. La práctica finaliza en ${diasRestantes} días (${fechaFin.toLocaleDateString('es-ES')})` 
                });
            }
        }

        asignacion.notaFinal = notaFinal;
        await asignacion.save();

        // Actualizar también en el estudiante
        await Estudiante.findByIdAndUpdate(asignacion.estudianteId, {
            notaFinal,
            calificadoPor: asignacion.tutorId
        });

        res.status(200).json({
            success: true,
            message: 'Nota final asignada exitosamente',
            asignacion
        });

    } catch (error) {
        console.error('Error al asignar nota final:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};
import Estudiante from '../models/Estudiante.js';
import bcrypt from 'bcryptjs';

export const createEstudiante = async (req, res) => {
    try {
        const { nombre, apellido, cedula, semestreActual, carrera, correo, contrasena } = req.body;

        // Verificar si el estudiante ya existe
        const estudianteExistente = await Estudiante.findOne({ 
            $or: [{ correo }, { cedula }] 
        });

        if (estudianteExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo o cédula ya están registrados'
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const nuevoEstudiante = new Estudiante({
            nombre,
            apellido,
            cedula,
            semestreActual,
            carrera,
            correo,
            contrasena: hashedPassword
        });

        await nuevoEstudiante.save();

        res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            estudiante: {
                id: nuevoEstudiante._id,
                nombre: nuevoEstudiante.nombre,
                apellido: nuevoEstudiante.apellido,
                correo: nuevoEstudiante.correo,
                carrera: nuevoEstudiante.carrera
            }
        });

    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.find()
            .select('-contrasena')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: estudiantes.length,  // ⬅️ AGREGADO
            estudiantes  // ⬅️ Ya lo tienes
        });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = await Estudiante.findById(id).select('-contrasena');

        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            estudiante
        });

    } catch (error) {
        console.error('Error al obtener estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const loginEstudiante = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const estudiante = await Estudiante.findOne({ correo });

        if (!estudiante) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(contrasena, estudiante.contrasena);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        if (estudiante.bloqueado) {
            return res.status(403).json({ success: false, message: 'Cuenta bloqueada por infracción' });
        }

        // NO HABILITADO
        if (!estudiante.habilitado) {
            return res.status(403).json({ success: false, message: 'Aún no estás habilitado para prácticas. Solicitud en revisión.' });
        }

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: estudiante._id,
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                correo: estudiante.correo,
                carrera: estudiante.carrera,
                semestre: estudiante.semestreActual,
                role: estudiante.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
import Tutor from '../models/Tutor.js';
import bcrypt from 'bcryptjs';

export const createTutor = async (req, res) => {
    try {
        const { nombre, apellido, cedula, correo, contrasena, departamento } = req.body;

        const tutorExistente = await Tutor.findOne({ 
            $or: [{ correo }, { cedula }] 
        });

        if (tutorExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo o cédula ya están registrados'
            });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const nuevoTutor = new Tutor({
            nombre,
            apellido,
            cedula,
            correo,
            contrasena: hashedPassword,
            departamento
        });

        await nuevoTutor.save();

        res.status(201).json({
            success: true,
            message: 'Tutor creado exitosamente',
            tutor: {
                id: nuevoTutor._id,
                nombre: nuevoTutor.nombre,
                apellido: nuevoTutor.apellido,
                correo: nuevoTutor.correo,
                departamento: nuevoTutor.departamento
            }
        });

    } catch (error) {
        console.error('Error al crear tutor:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getAllTutores = async (req, res) => {
    try {
        const tutores = await Tutor.find()
            .select('-contrasena')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: tutores.length,
            tutores
        });
    } catch (error) {
        console.error('Error al obtener tutores:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const getTutorById = async (req, res) => {
    try {
        const { id } = req.params;
        const tutor = await Tutor.findById(id).select('-contrasena');

        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            tutor
        });

    } catch (error) {
        console.error('Error al obtener tutor:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const loginTutor = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const tutor = await Tutor.findOne({ correo });

        if (!tutor) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(contrasena, tutor.contrasena);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (tutor.bloqueado) {
            return res.status(403).json({ success: false, message: 'Cuenta bloqueada por infracción' });
        }

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: tutor._id,
                nombre: tutor.nombre,
                apellido: tutor.apellido,
                correo: tutor.correo,
                departamento: tutor.departamento,
                role: tutor.role
            }
        });

    } catch (error) {
        console.error('Error en login de tutor:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
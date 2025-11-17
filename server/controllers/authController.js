import User from '../models/User.js';
import Estudiante from '../models/Estudiante.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Primero buscar en la colección de Users (admin y empresas)
        let user = await User.findOne({ email });
        let isEstudiante = false;

        // Si no se encuentra en Users, buscar en Estudiantes
        if (!user) {
            user = await Estudiante.findOne({ correo: email });
            isEstudiante = true;
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordField = isEstudiante ? user.contrasena : user.password;
        const isValidPassword = await bcrypt.compare(password, passwordField);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si es empresa y está desactivada
        if (!isEstudiante && user.role === 'empresa' && !user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Cuenta desactivada. Contacte al administrador.'
            });
        }

        // Preparar respuesta según el tipo de usuario
        let userData;
        
        if (isEstudiante) {
            userData = {
                id: user._id,
                name: `${user.nombre} ${user.apellido}`,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.correo,
                correo: user.correo,
                carrera: user.carrera,
                semestre: user.semestreActual,
                role: 'estudiante',
                habilitado: user.habilitado,           // AÑADIDO
                solicitudPendiente: user.solicitudPendiente, // AÑADIDO
                bloqueado: user.bloqueado || false     // AÑADIDO
            };
        } else {
            userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...(user.companyData && { companyData: user.companyData })
            };
        }

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            user: userData
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
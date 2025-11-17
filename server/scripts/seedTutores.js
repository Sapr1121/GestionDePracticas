import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Tutor from '../models/Tutor.js';

dotenv.config();

const tutores = [
    { nombre: 'Dr. Roberto', apellido: 'Gómez', cedula: '2001234567', correo: 'roberto.gomez@utp.edu.co', departamento: 'Ingeniería de Sistemas' },
    { nombre: 'Dra. Patricia', apellido: 'Hernández', cedula: '2001234568', correo: 'patricia.hernandez@utp.edu.co', departamento: 'Ingeniería Eléctrica' },
    { nombre: 'Ing. José', apellido: 'Castro', cedula: '2001234569', correo: 'jose.castro@utp.edu.co', departamento: 'Ingeniería Mecánica' },
    { nombre: 'Dra. Laura', apellido: 'Reyes', cedula: '2001234570', correo: 'laura.reyes@utp.edu.co', departamento: 'Ingeniería Electrónica' },
    { nombre: 'Ing. Manuel', apellido: 'Ortega', cedula: '2001234571', correo: 'manuel.ortega@utp.edu.co', departamento: 'Ingeniería Civil' },
    { nombre: 'Dra. Carolina', apellido: 'Mora', cedula: '2001234572', correo: 'carolina.mora@utp.edu.co', departamento: 'Ingeniería de Sistemas' },
    { nombre: 'Ing. Felipe', apellido: 'Vega', cedula: '2001234573', correo: 'felipe.vega@utp.edu.co', departamento: 'Ingeniería Eléctrica' },
    { nombre: 'Dra. Natalia', apellido: 'Pineda', cedula: '2001234574', correo: 'natalia.pineda@utp.edu.co', departamento: 'Ingeniería Mecánica' },
    { nombre: 'Ing. Andrés', apellido: 'Salazar', cedula: '2001234575', correo: 'andres.salazar@utp.edu.co', departamento: 'Ingeniería Electrónica' },
    { nombre: 'Dra. Claudia', apellido: 'Ríos', cedula: '2001234576', correo: 'claudia.rios@utp.edu.co', departamento: 'Ingeniería Civil' }
];

const seedTutores = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-practicas');
        console.log('Conectado a MongoDB');

        // Limpiar colección
        await Tutor.deleteMany({});
        console.log('Colección de tutores limpiada');

        // Hashear contraseña y agregar campos requeridos
        const tutoresConPassword = await Promise.all(
            tutores.map(async (tutor) => {
                const hashedPassword = await bcrypt.hash('tutor123', 10);
                return {
                    ...tutor,
                    contrasena: hashedPassword,
                    bloqueado: false,
                    disponible: true,
                    maxEstudiantes: 3
                };
            })
        );

        // Insertar en base de datos
        await Tutor.insertMany(tutoresConPassword);
        console.log('10 tutores creados con:');
        console.log('   Contraseña: tutor123');
        console.log('   disponible: true');
        console.log('   bloqueado: false');
        console.log('   maxEstudiantes: 3');

        mongoose.connection.close();
        console.log('Desconectado de MongoDB');

    } catch (error) {
        console.error('Error al crear tutores:', error);
        process.exit(1);
    }
};

// Ejecutar
seedTutores();
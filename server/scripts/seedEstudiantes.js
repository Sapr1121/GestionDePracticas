import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Estudiante from '../models/Estudiante.js';

dotenv.config();

const estudiantes = [
    { nombre: 'Carlos', apellido: 'Rodríguez', cedula: '1001234567', semestreActual: 6, carrera: 'Ingeniería de Sistemas', correo: 'carlos.rodriguez@utp.edu.co' },
    { nombre: 'María', apellido: 'González', cedula: '1001234568', semestreActual: 7, carrera: 'Ingeniería Eléctrica', correo: 'maria.gonzalez@utp.edu.co' },
    { nombre: 'Juan', apellido: 'Martínez', cedula: '1001234569', semestreActual: 8, carrera: 'Ingeniería Mecánica', correo: 'juan.martinez@utp.edu.co' },
    { nombre: 'Ana', apellido: 'López', cedula: '1001234570', semestreActual: 5, carrera: 'Ingeniería Electrónica', correo: 'ana.lopez@utp.edu.co' },
    { nombre: 'Luis', apellido: 'Ramírez', cedula: '1001234571', semestreActual: 9, carrera: 'Ingeniería Civil', correo: 'luis.ramirez@utp.edu.co' },
    { nombre: 'Sofia', apellido: 'Torres', cedula: '1001234572', semestreActual: 6, carrera: 'Ingeniería de Sistemas', correo: 'sofia.torres@utp.edu.co' },
    { nombre: 'Diego', apellido: 'Pérez', cedula: '1001234573', semestreActual: 7, carrera: 'Ingeniería Eléctrica', correo: 'diego.perez@utp.edu.co' },
    { nombre: 'Laura', apellido: 'Sánchez', cedula: '1001234574', semestreActual: 8, carrera: 'Ingeniería Mecánica', correo: 'laura.sanchez@utp.edu.co' },
    { nombre: 'Andrés', apellido: 'Vargas', cedula: '1001234575', semestreActual: 5, carrera: 'Ingeniería Electrónica', correo: 'andres.vargas@utp.edu.co' },
    { nombre: 'Camila', apellido: 'Morales', cedula: '1001234576', semestreActual: 10, carrera: 'Ingeniería Civil', correo: 'camila.morales@utp.edu.co' },
    { nombre: 'Miguel', apellido: 'Castro', cedula: '1001234577', semestreActual: 6, carrera: 'Ingeniería de Sistemas', correo: 'miguel.castro@utp.edu.co' },
    { nombre: 'Valentina', apellido: 'Herrera', cedula: '1001234578', semestreActual: 7, carrera: 'Ingeniería Eléctrica', correo: 'valentina.herrera@utp.edu.co' },
    { nombre: 'Santiago', apellido: 'Ruiz', cedula: '1001234579', semestreActual: 8, carrera: 'Ingeniería Mecánica', correo: 'santiago.ruiz@utp.edu.co' },
    { nombre: 'Isabella', apellido: 'Jiménez', cedula: '1001234580', semestreActual: 5, carrera: 'Ingeniería Electrónica', correo: 'isabella.jimenez@utp.edu.co' },
    { nombre: 'Sebastián', apellido: 'Díaz', cedula: '1001234581', semestreActual: 9, carrera: 'Ingeniería Civil', correo: 'sebastian.diaz@utp.edu.co' },
    { nombre: 'Daniela', apellido: 'Mendoza', cedula: '1001234582', semestreActual: 6, carrera: 'Ingeniería de Sistemas', correo: 'daniela.mendoza@utp.edu.co' },
    { nombre: 'Alejandro', apellido: 'Rojas', cedula: '1001234583', semestreActual: 7, carrera: 'Ingeniería Eléctrica', correo: 'alejandro.rojas@utp.edu.co' },
    { nombre: 'Paula', apellido: 'Gutiérrez', cedula: '1001234584', semestreActual: 8, carrera: 'Ingeniería Mecánica', correo: 'paula.gutierrez@utp.edu.co' },
    { nombre: 'Mateo', apellido: 'Ortiz', cedula: '1001234585', semestreActual: 5, carrera: 'Ingeniería Electrónica', correo: 'mateo.ortiz@utp.edu.co' },
    { nombre: 'Mariana', apellido: 'Silva', cedula: '1001234586', semestreActual: 10, carrera: 'Ingeniería Civil', correo: 'mariana.silva@utp.edu.co' }
];

const seedEstudiantes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-practicas');
        console.log('Conectado a MongoDB');

        // Limpiar colección
        await Estudiante.deleteMany({});
        console.log('Colección de estudiantes limpiada');

        // Hashear contraseña y agregar TODOS los campos
        const estudiantesConPassword = await Promise.all(
            estudiantes.map(async (est) => {
                const hashedPassword = await bcrypt.hash('estudiante123', 10);
                return {
                    ...est,
                    contrasena: hashedPassword,
                    habilitado: false,
                    bloqueado: false,
                    solicitudPendiente: false  // NUEVO CAMPO
                };
            })
        );

        await Estudiante.insertMany(estudiantesConPassword);
        console.log('20 estudiantes creados con:');
        console.log('   habilitado: false');
        console.log('   bloqueado: false');
        console.log('   solicitudPendiente: false');
        console.log('   Contraseña: estudiante123');

        mongoose.connection.close();
        console.log('Desconectado de MongoDB');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedEstudiantes();
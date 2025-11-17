import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Estudiante from '../models/Estudiante.js';

dotenv.config();

const migrar = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-practicas');
        console.log('Conectado a MongoDB');

        const result = await Estudiante.updateMany(
            { solicitudPendiente: { $exists: false } }, // Solo los que NO tienen el campo
            { $set: { solicitudPendiente: false } }
        );

        console.log(`Estudiantes actualizados: ${result.modifiedCount}`);
        console.log('Todos los estudiantes ahora tienen solicitudPendiente: false');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

migrar();
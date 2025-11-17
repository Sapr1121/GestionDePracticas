import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    contrasena: {
        type: String,
        required: true
    },
    departamento: {
        type: String,
        required: true,
        enum: [
            'Ingeniería de Sistemas',
            'Ingeniería Eléctrica',
            'Ingeniería Mecánica',
            'Ingeniería Electrónica',
            'Ingeniería Civil'
        ]
    },
    role: {
        type: String,
        default: 'tutor'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bloqueado: {
        type: Boolean,
        default: false
    },
    // server/models/Tutor.js
    maxEstudiantes: {
        type: Number,
        default: 3
    },
    disponible: {
        type: Boolean,
        default: true
    }
        
});

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;
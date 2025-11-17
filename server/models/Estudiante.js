import mongoose from 'mongoose';

const estudianteSchema = new mongoose.Schema({
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
    semestreActual: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    carrera: {
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
    role: {
        type: String,
        default: 'estudiante'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    habilitado: {
        type: Boolean,
        default: false
    },
    bloqueado: {
        type: Boolean,
        default: false
    },
    solicitudPendiente: { type: Boolean, default: false },
        tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        default: null
    },
    estudiantesAsignadosCount: { // para contar rápido
        type: Number,
        default: 0
    },
    notaFinal: {
        type: Number,
        min: 0,
        max: 5,
        default: null
    },
    calificadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
    }
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);
export default Estudiante;
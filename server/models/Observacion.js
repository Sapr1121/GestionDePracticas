import mongoose from 'mongoose';

const observacionSchema = new mongoose.Schema({
    estudianteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ofertaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oferta',
        default: null
    },
    tipo: {
        type: String,
        enum: ['positiva', 'negativa', 'neutra'],
        required: true
    },
    motivo: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },
    estado: {
        type: String,
        enum: ['pendiente', 'revisada', 'archivada'],
        default: 'pendiente'
    },
    // Datos del estudiante al momento de la observación (para histórico)
    estudianteData: {
        nombre: String,
        apellido: String,
        cedula: String,
        carrera: String,
        semestre: Number,
        correo: String
    },
    // Datos de la empresa
    empresaData: {
        nombre: String,
        nit: String
    },
    // Datos de la oferta (si aplica)
    ofertaData: {
        nombreProyecto: String
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaRevision: {
        type: Date,
        default: null
    },
    notasAdmin: {
        type: String,
        default: ''
    }
});

// Índice para búsquedas rápidas
observacionSchema.index({ estudianteId: 1, empresaId: 1 });
observacionSchema.index({ estado: 1, fechaCreacion: -1 });

const Observacion = mongoose.model('Observacion', observacionSchema);
export default Observacion;
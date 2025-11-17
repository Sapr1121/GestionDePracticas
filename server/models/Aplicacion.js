import mongoose from 'mongoose';

const aplicacionSchema = new mongoose.Schema({
    estudianteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    ofertaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Oferta',
        required: true
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Datos del estudiante al momento de aplicar
    estudianteData: {
        nombre: String,
        apellido: String,
        carrera: String,
        semestre: Number,
        correo: String,
        telefono: String,
        cedula: String
    },
    // Datos adicionales de la aplicación
    hojaVida: {
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    },
    cartaPresentacion: {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_revision', 'preseleccionado', 'entrevista', 'aceptado', 'rechazado'],
        default: 'pendiente'
    },
    notasEmpresa: {
        type: String,
        default: ''
    },
    fechaAplicacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    fechaEntrevista: {
        type: Date
    },
});

// Índice compuesto para evitar aplicaciones duplicadas
aplicacionSchema.index({ estudianteId: 1, ofertaId: 1 }, { unique: true });

const Aplicacion = mongoose.model('Aplicacion', aplicacionSchema);
export default Aplicacion;
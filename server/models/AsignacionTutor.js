import mongoose from 'mongoose';

const asignacionTutorSchema = new mongoose.Schema({
    estudianteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aceptado', 'rechazado'],
        default: 'pendiente'
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    },
    fechaRespuesta: {
        type: Date,
        default: null
    },
    motivoRechazo: {
        type: String,
        default: null
    },
    // Notas que el tutor puede asignar al estudiante
    notas: [{
        titulo: String,
        valor: {
            type: Number,
            min: 0,
            max: 5
        },
        comentario: String,
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    notaFinal: {
        type: Number,
        min: 0,
        max: 5,
        default: null
    },
    // Una vez aceptado, es permanente
    permanente: {
        type: Boolean,
        default: false
    },
    ofertaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oferta',
    required: false // Por si ya tienes registros sin esto
},
empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
},
vistoAdmin: {
    type: Boolean,
    default: false
},
fechaVistoAdmin: {
    type: Date,
    default: null
}
}, {
    timestamps: true
});

// Índices para búsquedas rápidas
asignacionTutorSchema.index({ estudianteId: 1, estado: 1 });
asignacionTutorSchema.index({ tutorId: 1, estado: 1 });

const AsignacionTutor = mongoose.model('AsignacionTutor', asignacionTutorSchema);
export default AsignacionTutor;
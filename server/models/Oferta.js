import mongoose from 'mongoose';

const ofertaSchema = new mongoose.Schema({
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carrera: [{
        type: String,
    }],
    nombreProyecto: {
        type: String,
        required: true
    },
    areasProyecto: [{
        type: String
    }],
    observaciones: {
        type: String,
        default: ''
    },
    esConducenteGrado: {
        type: Boolean,
        required: true
    },
    maxEstudiantesEntrevistar: {
        type: Number,
        required: true
    },
    maxEstudiantesAceptar: {
        type: Number,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    pago: {
        type: Number,
        required: true
    },
    activa: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cuposDisponibles: {
        type: Number,
        required: true,
        default: function () {
            return this.maxEstudiantesAceptar;
        }
    },
});

const Oferta = mongoose.model('Oferta', ofertaSchema);
export default Oferta;
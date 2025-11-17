import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const asignacionService = {
    // ESTUDIANTE
    solicitarTutor: async (estudianteId, tutorId) => {
        const response = await axios.post(`${API_BASE_URL}/asignaciones/solicitar`, {
            estudianteId,
            tutorId
        });
        return response.data;
    },

    getMiSolicitud: async (estudianteId) => {
        const response = await axios.get(`${API_BASE_URL}/asignaciones/estudiante/${estudianteId}/solicitud`);
        return response.data;
    },

    // TUTOR
    getSolicitudesPendientes: async (tutorId) => {
        const response = await axios.get(`${API_BASE_URL}/asignaciones/tutor/${tutorId}/pendientes`);
        return response.data;
    },

    getEstudiantesAsignados: async (tutorId) => {
        const response = await axios.get(`${API_BASE_URL}/asignaciones/tutor/${tutorId}/estudiantes`);
        return response.data;
    },

    aceptarSolicitud: async (solicitudId) => {
        const response = await axios.patch(`${API_BASE_URL}/asignaciones/solicitud/${solicitudId}/aceptar`);
        return response.data;
    },

    rechazarSolicitud: async (solicitudId, motivo) => {
        const response = await axios.patch(`${API_BASE_URL}/asignaciones/solicitud/${solicitudId}/rechazar`, {
            motivo
        });
        return response.data;
    },

    agregarNota: async (asignacionId, notaData) => {
        const response = await axios.post(`${API_BASE_URL}/asignaciones/asignacion/${asignacionId}/nota`, notaData);
        return response.data;
    },

    asignarNotaFinal: async (asignacionId, notaFinal) => {
        const response = await axios.patch(`${API_BASE_URL}/asignaciones/asignacion/${asignacionId}/nota-final`, {
            notaFinal
        });
        return response.data;
    }
};

export const tutorService = {
    getTutoresDisponibles: async () => {
        const response = await axios.get(`${API_BASE_URL}/tutores/disponibles`);
        return response.data;
    }
};
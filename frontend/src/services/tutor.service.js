import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const tutorEstudianteService = {
    getByTutor: async (tutorId) => {
        const response = await axios.get(`${API_BASE_URL}/tutores/${tutorId}/estudiantes`);
        return response.data;
    }
};

export const tutorReporteService = {
    getByTutor: async (tutorId) => {
        const response = await axios.get(`${API_BASE_URL}/reportes/tutor/${tutorId}`);
        return response.data;
    }
};
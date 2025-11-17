import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const estudianteOfertasService = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/ofertas/all`);
        return response.data;
    }
};

export const estudianteAplicacionService = {
    getByEstudiante: async (estudianteId) => {
        const response = await axios.get(`${API_BASE_URL}/aplicaciones/estudiante/${estudianteId}`);
        return response.data;
    },
    create: async (formData) => {
        // IMPORTANTE: Usar fetch para FormData, no axios
        const response = await fetch(`${API_BASE_URL}/aplicaciones/create`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    }
};

export const estudianteCompanyService = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        return response.data;
    }
};
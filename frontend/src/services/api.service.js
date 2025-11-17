import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const companyService = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/company/all`);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/company/create`, data);
        return response.data;
    },
    // NUEVO: Activar/Desactivar empresa
    toggleStatus: async (companyId) => {
        const response = await axios.put(`${API_BASE_URL}/company/toggle-status/${companyId}`);
        return response.data;
    }
};

export const ofertasService = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE_URL}/ofertas/all`);
        return response.data;
    }
};
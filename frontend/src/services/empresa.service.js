import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const ofertaService = {
    getByEmpresa: async (empresaId) => {
        const response = await axios.get(`${API_BASE_URL}/ofertas/empresa/${empresaId}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/ofertas/create`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/ofertas/${id}`);
        return response.data;
    }
};

export const aplicacionService = {
    getByOferta: async (ofertaId) => {
        const response = await axios.get(`${API_BASE_URL}/aplicaciones/oferta/${ofertaId}`);
        return response.data;
    },
    
    updateEstado: async (aplicacionId, nuevoEstado, fechaEntrevista = null) => {
        const payload = {
            estado: nuevoEstado,
            notasEmpresa: nuevoEstado === 'rechazado' ? 'No cumple con el perfil' : ''
        };
        
        if (fechaEntrevista) {
            payload.fechaEntrevista = fechaEntrevista;
        }
        
        const response = await axios.patch(
            `${API_BASE_URL}/aplicaciones/${aplicacionId}/estado`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    }
};

// ✅ NUEVO: Servicio de Observaciones
export const observacionService = {
    create: async (data) => {
        const response = await axios.post(
            `${API_BASE_URL}/observaciones/create`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },
    
    getByEmpresa: async (empresaId) => {
        const response = await axios.get(
            `${API_BASE_URL}/observaciones/empresa/${empresaId}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },
    
    getByEstudiante: async (estudianteId) => {
        const response = await axios.get(
            `${API_BASE_URL}/observaciones/estudiante/${estudianteId}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    }
};
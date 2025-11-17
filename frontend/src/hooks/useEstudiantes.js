import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

export const useEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadEstudiantes = async () => {
        setLoading(true);
        try {
            console.log('Cargando estudiantes desde /api/estudiantes');
            const res = await axios.get('/api/estudiantes'); // ← CAMBIADO
            console.log('Respuesta:', res.data);
            setEstudiantes(res.data.estudiantes || []);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            if (error.response?.status === 401) {
                console.log('No autorizado (normal si no eres admin)');
            }
            setEstudiantes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEstudiantes();
    }, []);

    const reloadEstudiantes = () => {
        loadEstudiantes();
    };

    return { estudiantes, reloadEstudiantes, loading };
};
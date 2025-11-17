import { useState, useEffect } from 'react';
import { ofertasService } from '../services/api.service';

export const useOfertas = () => {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOfertas = async () => {
        try {
            setLoading(true);
            const data = await ofertasService.getAll();
            if (data.success) {
                setOfertas(data.ofertas);
            }
        } catch (err) {
            console.error('Error al cargar ofertas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOfertas();
    }, []);

    return { ofertas, loading, error, reloadOfertas: loadOfertas };
};

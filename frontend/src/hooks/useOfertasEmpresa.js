import { useState, useEffect } from 'react';
import { ofertaService } from '../services/empresa.service';

export const useOfertas = (empresaId) => {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOfertas = async () => {
        if (!empresaId) return;
        try {
            setLoading(true);
            const data = await ofertaService.getByEmpresa(empresaId);
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
    }, [empresaId]);

    return { ofertas, loading, error, reloadOfertas: loadOfertas };
};

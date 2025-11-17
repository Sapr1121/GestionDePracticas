import { useState } from 'react';
import { aplicacionService } from '../services/empresa.service';

export const useAplicaciones = () => {
    const [aplicaciones, setAplicaciones] = useState({});
    const [loadingAplicaciones, setLoadingAplicaciones] = useState({});

    const loadAplicaciones = async (ofertaId) => {
        if (aplicaciones[ofertaId]) return;
        
        setLoadingAplicaciones(prev => ({ ...prev, [ofertaId]: true }));
        try {
            const data = await aplicacionService.getByOferta(ofertaId);
            if (data.success) {
                setAplicaciones(prev => ({ 
                    ...prev, 
                    [ofertaId]: data.aplicaciones 
                }));
            }
        } catch (err) {
            console.error('Error al cargar aplicaciones:', err);
        } finally {
            setLoadingAplicaciones(prev => ({ ...prev, [ofertaId]: false }));
        }
    };

    const updateEstado = async (aplicacionId, nuevoEstado, fechaEntrevista = null) => {
        try {
            const data = await aplicacionService.updateEstado(
                aplicacionId, 
                nuevoEstado, 
                fechaEntrevista
            );
            return data;
        } catch (err) {
            console.error('Error al actualizar estado:', err);
            throw err;
        }
    };

    const reloadAplicaciones = (ofertaId) => {
        setAplicaciones(prev => {
            const updated = { ...prev };
            delete updated[ofertaId];
            return updated;
        });
        loadAplicaciones(ofertaId);
    };

    return { 
        aplicaciones, 
        loadingAplicaciones, 
        loadAplicaciones,
        updateEstado,
        reloadAplicaciones
    };
};
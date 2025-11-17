import { useState, useEffect } from 'react';
import { asignacionService, tutorService } from '../services/asignacion.service';

export const useTutorEstudiante = (user) => {
    const [tutoresDisponibles, setTutoresDisponibles] = useState([]);
    const [miSolicitud, setMiSolicitud] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Cargar tutores disponibles y mi solicitud en paralelo
            const [tutoresResponse, solicitudResponse] = await Promise.all([
                tutorService.getTutoresDisponibles(),
                asignacionService.getMiSolicitud(user.id)
            ]);

            if (tutoresResponse.success) {
                setTutoresDisponibles(tutoresResponse.tutores || []);
            }

            if (solicitudResponse.success && solicitudResponse.solicitud) {
                setMiSolicitud(solicitudResponse.solicitud);
            }

        } catch (err) {
            console.error('Error al cargar datos de tutores:', err);
            setError('Error al cargar la información');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const solicitarTutor = async (tutorId) => {
        try {
            setError('');
            setSuccess('');

            const response = await asignacionService.solicitarTutor(user.id, tutorId);

            if (response.success) {
                setSuccess('¡Solicitud enviada exitosamente! Espera la respuesta del tutor.');
                await loadData(); // Recargar datos
                return true;
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al enviar la solicitud';
            setError(errorMsg);
            return false;
        }
    };

    const limpiarMensajes = () => {
        setError('');
        setSuccess('');
    };

    return {
        tutoresDisponibles,
        miSolicitud,
        loading,
        error,
        success,
        solicitarTutor,
        reloadData: loadData,
        limpiarMensajes
    };
};
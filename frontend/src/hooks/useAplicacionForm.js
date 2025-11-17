import { useState } from 'react';
import axios from 'axios'; 
import { estudianteAplicacionService } from '../services/estudiante.service';

export const useAplicacionForm = (onSuccess) => {
    const [formAplicacion, setFormAplicacion] = useState({
        telefono: '',
        hojaVida: null,
        cartaPresentacion: null
    });
    const [aplicando, setAplicando] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setFormAplicacion({
            telefono: '',
            hojaVida: null,
            cartaPresentacion: null
        });
        setError('');
    };

    const handleChangeForm = (e) => {
        setFormAplicacion({
            ...formAplicacion,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Por favor selecciona un archivo PDF');
                e.target.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo no debe superar los 5MB');
                e.target.value = '';
                return;
            }
            setFormAplicacion(prev => ({
                ...prev,
                [fieldName]: file
            }));
        }
    };

    const handleSubmitAplicacion = async (e, user, selectedOferta) => {
    e.preventDefault();
    setAplicando(true);
    setError('');

    const formData = new FormData();
    formData.append('ofertaId', selectedOferta._id);
    formData.append('estudianteId', user.id);
    const empresaId = selectedOferta.empresaId?._id || selectedOferta.empresaId;
    formData.append('empresaId', empresaId);
    formData.append('telefono', formAplicacion.telefono);
    formData.append('hojaVida', formAplicacion.hojaVida);
    if (formAplicacion.cartaPresentacion) {
        formData.append('cartaPresentacion', formAplicacion.cartaPresentacion);
    }

    // 🔍 DEBUG - Agregar esto temporalmente
    console.log('=== DEBUG ===');
    console.log('selectedOferta.empresaId:', selectedOferta.empresaId);
    console.log('empresaId extraído:', empresaId);
    console.log('tipo de empresaId:', typeof empresaId);
    console.log('=============');

    try {
        await axios.post('http://localhost:3000/api/aplicaciones/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        onSuccess();
    } catch (err) {
        setError(err.response?.data?.message || 'Error al enviar aplicación');
    } finally {
        setAplicando(false);
    }
};

    return {
        formAplicacion,
        aplicando,
        error,
        handleChangeForm,
        handleFileChange,
        handleSubmitAplicacion,
        resetForm,
        setError
    };
};
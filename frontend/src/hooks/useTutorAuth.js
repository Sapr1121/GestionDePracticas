import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTutorAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        
        console.log('🔍 userData raw:', userData);
        
        if (!userData) {
            console.log('❌ No hay userData en localStorage');
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('👤 Usuario parseado completo:', parsedUser);
        console.log('🔑 ID del usuario:', parsedUser._id || parsedUser.id || parsedUser.userId);
        console.log('👔 Role:', parsedUser.role);

        // VERIFICA ROL
        if (parsedUser.role !== 'tutor') {
            console.log('❌ Role incorrecto:', parsedUser.role);
            navigate('/login');
            return;
        }

        // ✅ CORRECCIÓN: Normalizar el campo _id
        const userNormalizado = {
            ...parsedUser,
            _id: parsedUser._id || parsedUser.id || parsedUser.userId // Intentar todos los posibles nombres
        };

        console.log('✅ Usuario normalizado:', userNormalizado);
        setUser(userNormalizado);
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return { user, logout };
};
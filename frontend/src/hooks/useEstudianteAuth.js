import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEstudianteAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);

        // VERIFICA ROL
        if (parsedUser.role !== 'estudiante') {
            navigate('/login');
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return { user, logout };
};
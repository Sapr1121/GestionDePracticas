import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // PASO 1: Intentar con el endpoint general /api/auth/login
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const token = response.data.token;
                const user = response.data.user;

                // GUARDA TODO EN localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // REDIRIGE SEGÚN ROL
                const routes = {
                    admin: '/admin-dashboard',
                    estudiante: '/estudiante-dashboard',
                    empresa: '/empresa-dashboard',
                    tutor: '/tutor-dashboard'
                };

                navigate(routes[user.role] || '/');
                return; // ✅ Login exitoso, salir
            }
        } catch (err) {
            console.log('Login general falló, intentando endpoints específicos...');
        }

        // PASO 2: Si falló, intentar con endpoints específicos (para tutores, etc.)
        const endpoints = {
            estudiante: 'http://localhost:3000/api/estudiantes/login',
            tutor: 'http://localhost:3000/api/tutores/login',
            empresa: 'http://localhost:3000/api/empresas/login'
        };

        for (const [role, url] of Object.entries(endpoints)) {
            try {
                const response = await axios.post(url, {
                    correo: email,
                    contrasena: password
                });

                if (response.data.success) {
                    const user = response.data.user;

                    // GUARDA EN localStorage
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('role', user.role);

                    // REDIRIGE SEGÚN ROL
                    const routes = {
                        admin: '/admin-dashboard',
                        estudiante: '/estudiante-dashboard',
                        empresa: '/empresa-dashboard',
                        tutor: '/tutor-dashboard'
                    };

                    navigate(routes[user.role] || '/');
                    return; // ✅ Login exitoso
                }
            } catch (err) {
                // Continuar con el siguiente endpoint
                continue;
            }
        }

        // Si llegó aquí, ningún login funcionó
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Iniciar Sesión
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email / Correo
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="tu@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition duration-200 ${
                            loading
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                
            </div>
        </div>
    );
};

export default Login;
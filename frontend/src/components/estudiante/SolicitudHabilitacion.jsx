// frontend/src/components/estudiante/SolicitudHabilitacion.jsx
import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useEstudiantes } from '../../hooks/useEstudiantes';

export const SolicitudHabilitacion = ({ user }) => {
    const [enviando, setEnviando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState('');

    const handleSolicitar = async () => {
        setEnviando(true);
        setError('');
        setExito(false);

        try {
            await axios.post('http://localhost:3000/api/estudiantes/solicitar-habilitacion', {
            estudianteId: user.id
        });
            setExito(true);
            reloadEstudiantes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar solicitud');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Acceso Restringido
                </h1>

                <p className="text-gray-600 mb-6">
                    Hola <strong>{user.nombre} {user.apellido}</strong>,<br />
                    Aún no estás habilitado para ver las ofertas.
                </p>

                {exito ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Solicitud enviada. Pronto te habilitaremos.
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-6">
                            Haz click para solicitar acceso.
                        </p>
                        <button
                            onClick={handleSolicitar}
                            disabled={enviando}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                                enviando
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {enviando ? 'Enviando...' : 'Solicitar Habilitación'}
                        </button>
                    </>
                )}

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};
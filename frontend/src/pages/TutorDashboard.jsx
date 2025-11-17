import React, { useState } from 'react';
import { useTutorAuth } from '../hooks/useTutorAuth';
import { useTutorData } from '../hooks/useTutorData';
import { EstadisticasCards } from '../components/tutor/EstadisticasCards';
import { SolicitudesPendientesTab } from '../components/tutor/SolicitudesPendientesTab';
import { EstudiantesAsignadosTab } from '../components/tutor/EstudiantesAsignadosTab';
import { ObservacionesTutorTab } from '../components/tutor/ObservacionesTutorTab'; // ← CORRECTO

const TutorDashboard = () => {
    const { user, logout } = useTutorAuth();

    const {
        estudiantesAsignados = [],
        solicitudesPendientes = [],
        loading = false,
        reloadData,
        responderSolicitud
    } = useTutorData(user) || {};

    const [activeTab, setActiveTab] = useState('solicitudes');
    const [success, setSuccess] = useState('');
    const [errorGlobal, setErrorGlobal] = useState('');

    const handleAceptarSolicitud = async (solicitudId) => {
        try {
            await responderSolicitud(solicitudId, 'aceptada');
            setSuccess('Solicitud aceptada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            reloadData();
        } catch (error) {
            setErrorGlobal(error.message || 'Error al aceptar la solicitud');
            setTimeout(() => setErrorGlobal(''), 5000);
        }
    };

    const handleRechazarSolicitud = async (solicitudId, motivo) => {
        try {
            await responderSolicitud(solicitudId, 'rechazada', motivo);
            setSuccess('Solicitud rechazada');
            setTimeout(() => setSuccess(''), 3000);
            reloadData();
        } catch (error) {
            setErrorGlobal(error.message || 'Error al rechazar la solicitud');
            setTimeout(() => setErrorGlobal(''), 5000);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Sesión no iniciada
                    </h2>
                    <p className="text-gray-600">
                        Por favor, inicia sesión para continuar.
                    </p>
                </div>
            </div>
        );
    }

    if (user.bloqueado) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Cuenta Bloqueada</h1>
                    <p className="text-gray-600">Has sido bloqueado por infracción.</p>
                    <p className="text-sm text-gray-500 mt-4">Contacta a la oficina de prácticas.</p>
                    <button onClick={logout} className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NAV */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Dashboard Tutor</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hola, {user.nombre || 'Tutor'}</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* PESTAÑAS */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {/* SOLICITUDES */}
                        <button
                            onClick={() => setActiveTab('solicitudes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                                activeTab === 'solicitudes'
                                    ? 'border-yellow-500 text-yellow-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Solicitudes Pendientes
                            {solicitudesPendientes.length > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {solicitudesPendientes.length}
                                </span>
                            )}
                        </button>

                        {/* ESTUDIANTES */}
                        <button
                            onClick={() => setActiveTab('estudiantes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'estudiantes'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Estudiantes Asignados
                        </button>

                        {/* OBSERVACIONES (REEMPLAZA REPORTES) */}
                        <button
                            onClick={() => setActiveTab('observaciones')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'observaciones'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Observaciones
                        </button>
                    </nav>
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}
                {errorGlobal && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorGlobal}
                    </div>
                )}

                <EstadisticasCards
                    user={user}
                    solicitudesPendientesCount={solicitudesPendientes.length}
                    estudiantesCount={estudiantesAsignados.length}
                    reportesCount={0} // ← Ya no usamos reportes
                />

                {/* SOLICITUDES */}
                {activeTab === 'solicitudes' && (
                    <SolicitudesPendientesTab
                        solicitudes={solicitudesPendientes}
                        loading={loading}
                        onAceptar={handleAceptarSolicitud}
                        onRechazar={handleRechazarSolicitud}
                    />
                )}

                {/* ESTUDIANTES */}
                {activeTab === 'estudiantes' && (
                    <EstudiantesAsignadosTab
                        estudiantes={estudiantesAsignados}
                        loading={loading}
                        reloadData={reloadData}
                    />
                )}

                {/* OBSERVACIONES (REEMPLAZA REPORTES) */}
                {activeTab === 'observaciones' && (
                    <ObservacionesTutorTab
                        tutorId={user._id}  // o pasa el estudiante si es necesario
                        reloadData={reloadData}
                    />
                )}
            </div>
        </div>
    );
};

export default TutorDashboard;
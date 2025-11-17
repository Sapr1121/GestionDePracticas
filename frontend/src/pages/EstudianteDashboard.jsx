import React, { useState } from 'react';
import { useEstudianteAuth } from '../hooks/useEstudianteAuth';
import { useEstudianteData } from '../hooks/useEstudianteData';
import { useAplicacionForm } from '../hooks/useAplicacionForm';
import { useTutorEstudiante } from '../hooks/useTutorEstudiante';
import { EstadisticasCards } from '../components/estudiante/EstadisticasCards';
import { OfertasDisponiblesTab } from '../components/estudiante/OfertasDisponiblesTab';
import { MisAplicacionesTab } from '../components/estudiante/MisAplicacionesTab';
import { MiTutorTab } from '../components/estudiante/MiTutorTab';
import { AplicacionModal } from '../components/estudiante/AplicacionModal';
import { SolicitudHabilitacion } from '../components/estudiante/SolicitudHabilitacion';

const EstudianteDashboard = () => {
    const { user, logout } = useEstudianteAuth();

    // HOOKS SIEMPRE AL INICIO
    const {
        ofertasFiltradas,
        aplicaciones,
        loading,
        getCompanyName,
        reloadData
    } = useEstudianteData(user);

    // NUEVO: Hook para tutores
    const {
        tutoresDisponibles,
        miSolicitud,
        loading: loadingTutores,
        error: errorTutor,
        success: successTutor,
        solicitarTutor,
        limpiarMensajes
    } = useTutorEstudiante(user);

    const [activeTab, setActiveTab] = useState('disponibles');
    const [showModal, setShowModal] = useState(false);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [success, setSuccess] = useState('');
    const [errorGlobal, setErrorGlobal] = useState('');

    const {
        formAplicacion,
        aplicando,
        error: formError,
        handleChangeForm,
        handleFileChange,
        handleSubmitAplicacion,
        resetForm
    } = useAplicacionForm(() => {
        setSuccess('¡Aplicación enviada exitosamente!');
        setShowModal(false);
        reloadData();
        setTimeout(() => setSuccess(''), 3000);
    });

    // LÓGICA DESPUÉS DE LOS HOOKS
    if (!user) return null;

    // ESTUDIANTE NO HABILITADO
    if (!user.habilitado) {
        return <SolicitudHabilitacion user={user} />;
    }

    // ESTUDIANTE BLOQUEADO
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

    // DASHBOARD NORMAL (ESTUDIANTE HABILITADO)
    const handleAplicarClick = (oferta) => {
        const yaAplico = aplicaciones.some(app => app.ofertaId._id === oferta._id);
        if (yaAplico) {
            setErrorGlobal('Ya has aplicado a esta oferta');
            setTimeout(() => setErrorGlobal(''), 3000);
            return;
        }
        setSelectedOferta(oferta);
        setShowModal(true);
        resetForm();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        limpiarMensajes(); // Limpiar mensajes al cambiar de pestaña
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NAV */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Dashboard Estudiante</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hola, {user.nombre}</span>
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
                        <button
                            onClick={() => handleTabChange('disponibles')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'disponibles'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Ofertas Disponibles
                        </button>
                        <button
                            onClick={() => handleTabChange('misAplicaciones')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'misAplicaciones'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Mis Aplicaciones
                        </button>
                        <button
                            onClick={() => handleTabChange('miTutor')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                                activeTab === 'miTutor'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Mi Tutor
                            {miSolicitud && miSolicitud.estado === 'aceptado' && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            )}
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
                    ofertasDisponibles={ofertasFiltradas.length}
                    aplicacionesCount={aplicaciones.length}
                />

                {activeTab === 'disponibles' && (
                    <OfertasDisponiblesTab
                        ofertas={ofertasFiltradas}
                        aplicaciones={aplicaciones}
                        loading={loading}
                        user={user}
                        getCompanyName={getCompanyName}
                        onAplicar={handleAplicarClick}
                    />
                )}

                {activeTab === 'misAplicaciones' && (
                    <MisAplicacionesTab
                        aplicaciones={aplicaciones}
                        getCompanyName={getCompanyName}
                    />
                )}

                {activeTab === 'miTutor' && (
                    <MiTutorTab
                        tutoresDisponibles={tutoresDisponibles}
                        miSolicitud={miSolicitud}
                        loading={loadingTutores}
                        onSolicitarTutor={solicitarTutor}
                        error={errorTutor}
                        success={successTutor}
                    />
                )}
            </div>

            {/* MODAL APLICACIÓN */}
            <AplicacionModal
                showModal={showModal}
                selectedOferta={selectedOferta}
                companyName={selectedOferta ? getCompanyName(selectedOferta.empresaId) : ''}
                formAplicacion={formAplicacion}
                aplicando={aplicando}
                error={formError}
                onClose={() => setShowModal(false)}
                onChange={handleChangeForm}
                onFileChange={handleFileChange}
                onSubmit={(e) => handleSubmitAplicacion(e, user, selectedOferta)}
            />
        </div>
    );
};

export default EstudianteDashboard;
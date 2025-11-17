import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEmpresaAuth } from '../hooks/useEmpresaAuth';
import { useOfertas } from '../hooks/useOfertas';
import { useAplicaciones } from '../hooks/useAplicaciones';
import { Modal } from '../components/shared/Modal';
import { OfertaForm } from '../components/empresa/OfertaForm';
import { OfertaCard } from '../components/empresa/OfertaCard';
import { AplicacionCard } from '../components/empresa/AplicacionCard';
import { EntrevistaModal } from '../components/empresa/EntrevistaModal';
import { ObservacionModal } from '../components/empresa/ObservacionModal';
import { ofertaService, observacionService } from '../services/empresa.service';
import { Users, Briefcase } from 'lucide-react';

const EmpresaDashboard = () => {
    const { user, logout } = useEmpresaAuth();
    const { ofertas, reloadOfertas } = useOfertas(user?.id);
    const { 
        aplicaciones, 
        loadingAplicaciones, 
        loadAplicaciones,
        updateEstado,
        reloadAplicaciones 
    } = useAplicaciones();
    
    const [showModal, setShowModal] = useState(false);
    const [showEntrevistaModal, setShowEntrevistaModal] = useState(false);
    const [showObservacionModal, setShowObservacionModal] = useState(false); // ← NUEVO
    const [aplicacionSeleccionada, setAplicacionSeleccionada] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('ofertas');
    const [enviandoObservacion, setEnviandoObservacion] = useState(false); // ← NUEVO
    
    // Estado para contratados
    const [contratados, setContratados] = useState([]);
    const [loadingContratados, setLoadingContratados] = useState(false);

    // Función para cargar contratados
    const loadContratados = async () => {
        if (!user?.id) return;
        
        setLoadingContratados(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/aplicaciones/empresa/${user.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                const aceptados = response.data.aplicaciones.filter(
                    app => app.estado === 'aceptado'
                );
                setContratados(aceptados);
            }
        } catch (err) {
            console.error('Error cargando contratados:', err);
        } finally {
            setLoadingContratados(false);
        }
    };

    // Cargar cuando se abre la pestaña de contratados
    useEffect(() => {
        if (activeTab === 'contratados' && user?.id) {
            loadContratados();
        }
    }, [activeTab, user?.id]);

    const handleDeleteOferta = async (id) => {
        if (!window.confirm('¿Eliminar esta oferta? Todas las aplicaciones asociadas se perderán.')) return;
        try {
            await ofertaService.delete(id);
            reloadOfertas();
            setSuccess('Oferta eliminada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error al eliminar la oferta');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEstadoChange = async (aplicacionId, nuevoEstado, ofertaId) => {
        try {
            await updateEstado(aplicacionId, nuevoEstado);
            setSuccess('Estado actualizado correctamente');
            setTimeout(() => setSuccess(''), 3000);
            reloadAplicaciones(ofertaId);
            reloadOfertas(); // Para actualizar los cupos
            
            // Si se contrató a alguien, recargar la lista de contratados
            if (nuevoEstado === 'aceptado') {
                loadContratados();
            }
        } catch (err) {
            setError('Error al actualizar el estado');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAgendarEntrevista = (aplicacion) => {
        setAplicacionSeleccionada(aplicacion);
        setShowEntrevistaModal(true);
    };

    const handleConfirmarEntrevista = async (fechaCompleta) => {
        if (!aplicacionSeleccionada) return;
        
        try {
            await updateEstado(
                aplicacionSeleccionada._id, 
                'entrevista', 
                fechaCompleta
            );
            setShowEntrevistaModal(false);
            setAplicacionSeleccionada(null);
            setSuccess('Entrevista agendada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
            // Recargar las aplicaciones de la oferta
            reloadAplicaciones(aplicacionSeleccionada.ofertaId._id);
        } catch (err) {
            setError('Error al agendar la entrevista');
            setTimeout(() => setError(''), 3000);
        }
    };

    // ✅ NUEVO: Manejar reportar observación
    const handleReportarObservacion = (aplicacion) => {
        setAplicacionSeleccionada(aplicacion);
        setShowObservacionModal(true);
    };

    // ✅ NUEVO: Enviar observación
    const handleSubmitObservacion = async (formData) => {
        setEnviandoObservacion(true);
        try {
            await observacionService.create({
                estudianteId: aplicacionSeleccionada.estudianteId._id,
                empresaId: user.id,
                ofertaId: aplicacionSeleccionada.ofertaId?._id,
                ...formData
            });
            
            setShowObservacionModal(false);
            setAplicacionSeleccionada(null);
            setSuccess('Observación reportada exitosamente. El administrador será notificado.');
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la observación');
            setTimeout(() => setError(''), 3000);
        } finally {
            setEnviandoObservacion(false);
        }
    };

    const handleFormSuccess = () => {
        reloadOfertas();
        setShowModal(false);
        setSuccess('Oferta creada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NAVBAR */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Panel Empresa</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Bienvenido, {user.name}</span>
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* ALERTAS */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* ESTADÍSTICAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Ofertas Activas</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {ofertas.filter(o => o.activa).length}
                                </p>
                            </div>
                            <Briefcase className="text-blue-600" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Aplicaciones</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {Object.values(aplicaciones).flat().length}
                                </p>
                            </div>
                            <Users className="text-purple-600" size={40} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Contratados</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {contratados.length}
                                </p>
                            </div>
                            <Users className="text-green-600" size={40} />
                        </div>
                    </div>
                </div>

                {/* PESTAÑAS */}
                <div className="border-b mb-6">
                    <button 
                        onClick={() => setActiveTab('ofertas')} 
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === 'ofertas' 
                                ? 'border-b-2 border-blue-600 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Mis Ofertas ({ofertas.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('contratados')} 
                        className={`px-6 py-3 ml-4 font-medium text-sm ${
                            activeTab === 'contratados' 
                                ? 'border-b-2 border-blue-600 text-blue-600' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Contratados ({contratados.length})
                    </button>
                </div>

                {/* TAB: OFERTAS */}
                {activeTab === 'ofertas' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Mis Ofertas de Práctica</h2>
                            <button 
                                onClick={() => setShowModal(true)} 
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                + Nueva Oferta
                            </button>
                        </div>

                        <div className="space-y-8">
                            {ofertas.map(oferta => (
                                <OfertaCard
                                    key={oferta._id}
                                    oferta={oferta}
                                    onDelete={handleDeleteOferta}
                                    onViewAplicaciones={loadAplicaciones}
                                    aplicaciones={aplicaciones[oferta._id]}
                                    loading={loadingAplicaciones[oferta._id]}
                                >
                                    {aplicaciones[oferta._id] && aplicaciones[oferta._id].length > 0 && (
                                        <div className="mt-6 space-y-4 border-t pt-6">
                                            <h4 className="font-bold text-gray-700 mb-4">
                                                Aplicaciones ({aplicaciones[oferta._id].length})
                                            </h4>
                                            {aplicaciones[oferta._id].map(app => (
                                                <AplicacionCard
                                                    key={app._id}
                                                    aplicacion={app}
                                                    onEstadoChange={(id, estado) => 
                                                        handleEstadoChange(id, estado, oferta._id)
                                                    }
                                                    onAgendarEntrevista={handleAgendarEntrevista}
                                                    
                                                />
                                            ))}
                                        </div>
                                    )}
                                    
                                    {aplicaciones[oferta._id] && aplicaciones[oferta._id].length === 0 && (
                                        <div className="text-center py-8 text-gray-500 border-t mt-4">
                                            No hay aplicaciones para esta oferta
                                        </div>
                                    )}
                                </OfertaCard>
                            ))}
                        </div>

                        {ofertas.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500 mb-4">
                                    No hay ofertas creadas. Crea tu primera oferta de práctica.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* TAB: CONTRATADOS */}
                {activeTab === 'contratados' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Estudiantes Contratados
                        </h2>
                        
                        {loadingContratados ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-600 mt-4">Cargando contratados...</p>
                            </div>
                        ) : contratados.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500">
                                    No hay estudiantes contratados aún
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {contratados.map(app => (
                                    <div 
                                        key={app._id} 
                                        className="bg-white border-2 border-green-300 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {app.estudianteData.nombre} {app.estudianteData.apellido}
                                            </h3>
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                CONTRATADO
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p>
                                                <strong>Proyecto:</strong><br />
                                                {app.ofertaId?.nombreProyecto || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Carrera:</strong> {app.estudianteData.carrera}
                                            </p>
                                            <p>
                                                <strong>Semestre:</strong> {app.estudianteData.semestre}
                                            </p>
                                            <p>
                                                <strong>Teléfono:</strong> {app.estudianteData.telefono}
                                            </p>
                                            <p>
                                                <strong>Email:</strong> {app.estudianteData.correo}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <p className="text-xs text-gray-500">
            Contratado: {new Date(app.fechaActualizacion).toLocaleDateString('es-CO')}
        </p>
        
        {/* BOTÓN DE OBSERVACIÓN */}
        <button
            onClick={() => handleReportarObservacion(app)}
            className="bg-orange-600 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-700 transition flex items-center gap-1"
        >
            Reportar Observación
        </button>
    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL CREAR OFERTA */}
            <Modal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                title="Crear Oferta de Práctica"
            >
                <OfertaForm
                    empresaId={user.id}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>

            {/* MODAL AGENDAR ENTREVISTA */}
            <EntrevistaModal
                isOpen={showEntrevistaModal}
                onClose={() => {
                    setShowEntrevistaModal(false);
                    setAplicacionSeleccionada(null);
                }}
                onConfirm={handleConfirmarEntrevista}
                aplicacion={aplicacionSeleccionada}
            />

            {/* ✅ MODAL OBSERVACIÓN - NUEVO */}
            <ObservacionModal
                isOpen={showObservacionModal}
                onClose={() => {
                    setShowObservacionModal(false);
                    setAplicacionSeleccionada(null);
                }}
                onSubmit={handleSubmitObservacion}
                aplicacion={aplicacionSeleccionada}
                loading={enviandoObservacion}
            />
        </div>
    );
};

export default EmpresaDashboard;
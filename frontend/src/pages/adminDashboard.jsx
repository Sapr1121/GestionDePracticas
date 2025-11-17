import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCompanies } from '../hooks/useCompanies';
import { useOfertas } from '../hooks/useOfertas';
import { useEstudiantes } from '../hooks/useEstudiantes';
import { Modal } from '../components/shared/Modal';
import { Tabs } from '../components/shared/Tabs';
import { CompanyForm } from '../components/admin/CompanyForm';
import { DashboardTab } from '../components/admin/DashboardTab';
import { CompaniesTab } from '../components/admin/CompaniesTab';
import { OfertasTab } from '../components/admin/OfertasTab';
import { EstudiantesHabilitadosTab } from '../components/admin/EstudiantesHabilitadosTab';
import { ObservacionesTab } from '../components/admin/ObservacionesTab';
import axios from 'axios';
import { NotasTab } from '../components/admin/NotasTab';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { companies, reloadCompanies } = useCompanies();
    const { ofertas } = useOfertas();
    const { estudiantes: allEstudiantes, reloadEstudiantes, loading } = useEstudiantes();
    
    const estudiantes = user?.role === 'admin' ? allEstudiantes : [];
    const solicitudesPendientes = estudiantes.filter(e => 
        e.solicitudPendiente === true && e.habilitado === false
    );
    
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Estados para observaciones
    const [observaciones, setObservaciones] = useState([]);
    const [loadingObservaciones, setLoadingObservaciones] = useState(false);

    // Debug
    useEffect(() => {
        console.log('Todos los estudiantes:', estudiantes);
    }, [estudiantes]);

    // Cargar observaciones cuando se abre la pestaña
    useEffect(() => {
        if (activeTab === 'observaciones') {
            loadObservaciones();
        }
    }, [activeTab]);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'empresas', label: 'Empresas' },
        { id: 'ofertas', label: 'Ofertas de Práctica' },
        { id: 'estudiantes-habilitados', label: 'Estudiantes Habilitados' },
        { id: 'solicitudes-practica', label: 'Solicitudes de Práctica' },
        { id: 'observaciones', label: 'Observaciones de Estudiantes' },
        { id: 'notas', label: 'Notas' },
        { id: 'reportes', label: 'Reportes' }
    ];

    // Función para cargar observaciones
    const loadObservaciones = async () => {
        setLoadingObservaciones(true);
        try {
            const response = await axios.get('http://localhost:3000/api/observaciones/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data.success) {
                setObservaciones(response.data.observaciones);
            }
        } catch (error) {
            console.error('Error al cargar observaciones:', error);
            alert('Error al cargar las observaciones');
        } finally {
            setLoadingObservaciones(false);
        }
    };

    // Actualizar estado de observación
    const handleUpdateEstadoObservacion = async (id, nuevoEstado) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/observaciones/${id}/estado`,
                { estado: nuevoEstado },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                alert('Estado actualizado correctamente');
                loadObservaciones(); // Recargar lista
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado');
        }
    };

    // Eliminar observación
    const handleDeleteObservacion = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/observaciones/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                alert('Observación eliminada correctamente');
                loadObservaciones(); // Recargar lista
            }
        } catch (error) {
            console.error('Error al eliminar observación:', error);
            alert('Error al eliminar la observación');
        }
    };

    const handleFormSuccess = () => {
        reloadCompanies();
        setShowModal(false);
    };

    const handleToggleCompany = async (companyId) => {
        if (!window.confirm('¿Cambiar el estado de esta empresa?')) return;
        try {
            const res = await axios.patch(`http://localhost:3000/api/companies/${companyId}/toggle-status`);
            reloadCompanies();
            const { ofertasDesactivadas } = res.data.data || {};
            alert(ofertasDesactivadas > 0 
                ? `Empresa desactivada. Se desactivaron ${ofertasDesactivadas} oferta(s).`
                : 'Empresa activada.'
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Error al cambiar estado');
        }
    };

    const handleHabilitarEstudiante = async (id) => {
        if (!window.confirm('¿Habilitar a este estudiante para prácticas?')) return;
        try {
            const res = await axios.patch(`http://localhost:3000/api/estudiantes/${id}/habilitar`);
            
            // ACTUALIZA localStorage
            const updatedUser = res.data.estudiante;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            reloadEstudiantes();
            alert('Estudiante habilitado exitosamente');
        } catch (error) {
            alert('Error al habilitar estudiante');
        }
    };

    const handleBloquearEstudiante = async (id) => {
        if (!window.confirm('¿Bloquear a este estudiante?')) return;
        try {
            await axios.patch(`http://localhost:3000/api/estudiantes/${id}/bloquear`);
            reloadEstudiantes();
            alert('Estudiante bloqueado');
        } catch (error) {
            alert('Error al bloquear estudiante');
        }
    };

    // FILTROS
    const estudiantesHabilitados = estudiantes.filter(e => 
        e.habilitado === true && e.bloqueado !== true
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Panel Administrativo</h1>
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

            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <DashboardTab companies={companies} ofertas={ofertas} />}
                
                {activeTab === 'empresas' && (
                    <CompaniesTab 
                        companies={companies} 
                        onCreateClick={() => setShowModal(true)}
                        onToggleCompany={handleToggleCompany}
                    />
                )}
                
                {activeTab === 'ofertas' && <OfertasTab ofertas={ofertas} companies={companies} />}
                
                {activeTab === 'estudiantes-habilitados' && (
                    <EstudiantesHabilitadosTab 
                        estudiantes={estudiantesHabilitados}
                        onBloquear={handleBloquearEstudiante}
                    />
                )}
                {activeTab === 'notas' && <NotasTab />}

                {/* SOLICITUDES PENDIENTES */}
                {activeTab === 'solicitudes-practica' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                            SOLICITUDES DE PRÁCTICA
                        </h2>

                        {loading && <p className="text-center text-blue-600">Cargando solicitudes...</p>}

                        {!loading && solicitudesPendientes.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No hay solicitudes pendientes</p>
                        )}

                        {!loading && solicitudesPendientes.map(e => (
                            <div key={e._id} className="p-5 bg-white rounded-lg shadow-md mb-4 border-l-4 border-yellow-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold">{e.nombre} {e.apellido}</h3>
                                        <p className="text-gray-600">{e.correo}</p>
                                        <p className="text-sm text-gray-500">{e.carrera} - Semestre {e.semestreActual}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block mb-2 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                                            Solicitud enviada
                                        </span>
                                        <button
                                            onClick={() => handleHabilitarEstudiante(e._id)}
                                            className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                                        >
                                            Habilitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ NUEVA PESTAÑA: OBSERVACIONES */}
                {activeTab === 'observaciones' && (
                    <ObservacionesTab
                        observaciones={observaciones}
                        onUpdateEstado={handleUpdateEstadoObservacion}
                        onDelete={handleDeleteObservacion}
                        loading={loadingObservaciones}
                    />
                )}
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Crear Nueva Empresa">
                <CompanyForm onSuccess={handleFormSuccess} onCancel={() => setShowModal(false)} />
            </Modal>
        </div>
    );
};

export default AdminDashboard;
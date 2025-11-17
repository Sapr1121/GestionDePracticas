import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Eye, Calendar, Building2 } from 'lucide-react';

export const ObservacionesTutorTab = ({ tutorId }) => {
    const [observaciones, setObservaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [observacionSeleccionada, setObservacionSeleccionada] = useState(null);
    const [showDetalles, setShowDetalles] = useState(false);

    useEffect(() => {
        cargarObservaciones();
    }, [tutorId]);

    const cargarObservaciones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3000/api/observaciones/tutor/${tutorId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setObservaciones(data.observaciones || data || []);
            } else {
                console.error('Error al cargar observaciones');
                setObservaciones([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setObservaciones([]);
        } finally {
            setLoading(false);
        }
    };

    const getTipoConfig = (tipo) => {
        const configs = {
            'positiva': {
                bg: 'bg-green-50',
                border: 'border-green-300',
                text: 'text-green-800',
                badgeBg: 'bg-green-100',
                icon: CheckCircle,
                label: 'POSITIVA'
            },
            'negativa': {
                bg: 'bg-red-50',
                border: 'border-red-300',
                text: 'text-red-800',
                badgeBg: 'bg-red-100',
                icon: AlertTriangle,
                label: 'NEGATIVA'
            },
            'neutra': {
                bg: 'bg-blue-50',
                border: 'border-blue-300',
                text: 'text-blue-800',
                badgeBg: 'bg-blue-100',
                icon: Info,
                label: 'NEUTRA'
            }
        };
        return configs[tipo] || configs['neutra'];
    };

    const observacionesFiltradas = observaciones.filter(obs => {
        if (filtroTipo !== 'todos' && obs.tipo !== filtroTipo) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando observaciones...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Observaciones de tus Estudiantes
                </h2>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">{observaciones.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm text-gray-600">Positivas</p>
                        <p className="text-2xl font-bold text-green-600">
                            {observaciones.filter(o => o.tipo === 'positiva').length}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-600">Neutras</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {observaciones.filter(o => o.tipo === 'neutra').length}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <p className="text-sm text-gray-600">Negativas</p>
                        <p className="text-2xl font-bold text-red-600">
                            {observaciones.filter(o => o.tipo === 'negativa').length}
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-4">
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="positiva">Positivas</option>
                        <option value="neutra">Neutras</option>
                        <option value="negativa">Negativas</option>
                    </select>
                    <button
                        onClick={cargarObservaciones}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        🔄 Recargar
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                {observacionesFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No hay observaciones
                        </h3>
                        <p className="text-gray-600">
                            {filtroTipo === 'todos' 
                                ? 'Tus estudiantes aún no tienen observaciones registradas.'
                                : `No hay observaciones de tipo "${filtroTipo}".`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {observacionesFiltradas.map((obs) => {
                            const tipoConfig = getTipoConfig(obs.tipo);
                            const IconoTipo = tipoConfig.icon;

                            return (
                                <div
                                    key={obs._id}
                                    className={`${tipoConfig.bg} border-2 ${tipoConfig.border} rounded-lg p-6 shadow-md`}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <IconoTipo className={tipoConfig.text} size={24} />
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800">
                                                    {obs.estudianteData?.nombre || obs.estudianteId?.nombre} {obs.estudianteData?.apellido || obs.estudianteId?.apellido}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {obs.estudianteData?.carrera || obs.estudianteId?.carrera} - Semestre {obs.estudianteData?.semestreActual || obs.estudianteId?.semestre}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tipoConfig.badgeBg} ${tipoConfig.text}`}>
                                            {tipoConfig.label}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-gray-500" />
                                            <span><strong>Empresa:</strong> {obs.empresaData?.nombre || 'No especificada'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-500" />
                                            <span><strong>Fecha:</strong> {new Date(obs.fechaCreacion || obs.createdAt).toLocaleDateString('es-ES')}</span>
                                        </div>
                                    </div>

                                    {/* Motivo */}
                                    <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                        <p className="text-sm"><strong>Motivo:</strong> {obs.motivo}</p>
                                    </div>

                                    {/* Descripción (truncada) */}
                                    <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                        <p className="text-sm text-gray-700">
                                            {obs.descripcion?.substring(0, 150) || ''}
                                            {obs.descripcion?.length > 150 && '...'}
                                        </p>
                                    </div>

                                    {/* Acción */}
                                    <button
                                        onClick={() => {
                                            setObservacionSeleccionada(obs);
                                            setShowDetalles(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        <Eye size={16} />
                                        Ver Detalles
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de Detalles */}
            {showDetalles && observacionSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Detalles de la Observación
                                </h2>
                                <button
                                    onClick={() => setShowDetalles(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">Estudiante</h4>
                                        <p>{observacionSeleccionada.estudianteData?.nombre} {observacionSeleccionada.estudianteData?.apellido}</p>
                                        <p className="text-sm text-gray-600">{observacionSeleccionada.estudianteData?.cedula}</p>
                                        <p className="text-sm text-gray-600">{observacionSeleccionada.estudianteData?.correo}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">Empresa</h4>
                                        <p>{observacionSeleccionada.empresaData?.nombre}</p>
                                        <p className="text-sm text-gray-600">NIT: {observacionSeleccionada.empresaData?.nit}</p>
                                    </div>
                                </div>

                                {observacionSeleccionada.ofertaData && (
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">Proyecto</h4>
                                        <p>{observacionSeleccionada.ofertaData.nombreProyecto}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Motivo</h4>
                                    <p className="bg-gray-50 p-3 rounded">{observacionSeleccionada.motivo}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 mb-2">Descripción Completa</h4>
                                    <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">{observacionSeleccionada.descripcion}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        onClick={() => setShowDetalles(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
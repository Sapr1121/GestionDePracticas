import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Eye, Archive, Trash2, Calendar, Building2, User } from 'lucide-react';

export const ObservacionesTab = ({ observaciones, onUpdateEstado, onDelete, loading }) => {
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [observacionSeleccionada, setObservacionSeleccionada] = useState(null);
    const [showDetalles, setShowDetalles] = useState(false);

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

    const getEstadoConfig = (estado) => {
        const configs = {
            'pendiente': { color: 'yellow', label: 'Pendiente' },
            'revisada': { color: 'green', label: 'Revisada' },
            'archivada': { color: 'gray', label: 'Archivada' }
        };
        return configs[estado] || configs['pendiente'];
    };

    const observacionesFiltradas = observaciones.filter(obs => {
        if (filtroEstado !== 'todas' && obs.estado !== filtroEstado) return false;
        if (filtroTipo !== 'todos' && obs.tipo !== filtroTipo) return false;
        return true;
    });

    const handleVerDetalles = (obs) => {
        setObservacionSeleccionada(obs);
        setShowDetalles(true);
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        if (window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
            await onUpdateEstado(id, nuevoEstado);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Cargando observaciones...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header y Filtros */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Observaciones de Estudiantes
                </h2>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">{observaciones.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-600">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {observaciones.filter(o => o.estado === 'pendiente').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                        <p className="text-sm text-gray-600">Negativas</p>
                        <p className="text-2xl font-bold text-red-600">
                            {observaciones.filter(o => o.tipo === 'negativa').length}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                        <p className="text-sm text-gray-600">Positivas</p>
                        <p className="text-2xl font-bold text-green-600">
                            {observaciones.filter(o => o.tipo === 'positiva').length}
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-4 mb-6">
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="todas">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="revisada">Revisadas</option>
                        <option value="archivada">Archivadas</option>
                    </select>

                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="positiva">Positivas</option>
                        <option value="neutra">Neutras</option>
                        <option value="negativa">Negativas</option>
                    </select>
                </div>
            </div>

            {/* Lista de Observaciones */}
            {observacionesFiltradas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No hay observaciones con los filtros seleccionados</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {observacionesFiltradas.map((obs) => {
                        const tipoConfig = getTipoConfig(obs.tipo);
                        const estadoConfig = getEstadoConfig(obs.estado);
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
                                                {obs.estudianteData.nombre} {obs.estudianteData.apellido}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {obs.estudianteData.carrera} - Semestre {obs.estudianteData.semestre}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tipoConfig.badgeBg} ${tipoConfig.text}`}>
                                            {tipoConfig.label}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${estadoConfig.color}-100 text-${estadoConfig.color}-800`}>
                                            {estadoConfig.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-gray-500" />
                                        <span><strong>Empresa:</strong> {obs.empresaData.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-500" />
                                        <span><strong>Fecha:</strong> {new Date(obs.fechaCreacion).toLocaleDateString('es-CO')}</span>
                                    </div>
                                </div>

                                {/* Motivo */}
                                <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                    <p className="text-sm"><strong>Motivo:</strong> {obs.motivo}</p>
                                </div>

                                {/* Descripción (truncada) */}
                                <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                    <p className="text-sm text-gray-700">
                                        {obs.descripcion.substring(0, 150)}
                                        {obs.descripcion.length > 150 && '...'}
                                    </p>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleVerDetalles(obs)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        <Eye size={16} />
                                        Ver Detalles
                                    </button>

                                    {obs.estado === 'pendiente' && (
                                        <button
                                            onClick={() => handleCambiarEstado(obs._id, 'revisada')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            <CheckCircle size={16} />
                                            Marcar Revisada
                                        </button>
                                    )}

                                    {obs.estado === 'revisada' && (
                                        <button
                                            onClick={() => handleCambiarEstado(obs._id, 'archivada')}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                                        >
                                            <Archive size={16} />
                                            Archivar
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Eliminar esta observación?')) {
                                                onDelete(obs._id);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm ml-auto"
                                    >
                                        <Trash2 size={16} />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">Estudiante</h4>
                                        <p>{observacionSeleccionada.estudianteData.nombre} {observacionSeleccionada.estudianteData.apellido}</p>
                                        <p className="text-sm text-gray-600">{observacionSeleccionada.estudianteData.cedula}</p>
                                        <p className="text-sm text-gray-600">{observacionSeleccionada.estudianteData.correo}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">Empresa</h4>
                                        <p>{observacionSeleccionada.empresaData.nombre}</p>
                                        <p className="text-sm text-gray-600">NIT: {observacionSeleccionada.empresaData.nit}</p>
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
                                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
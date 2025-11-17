import React, { useState, useEffect } from 'react';

export const NotasTab = () => {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroCarrera, setFiltroCarrera] = useState('todas');
    const [filtroTutor, setFiltroTutor] = useState('todos');
    const [filtroVisto, setFiltroVisto] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [notaSeleccionada, setNotaSeleccionada] = useState(null);
    const [showDetalles, setShowDetalles] = useState(false);

    useEffect(() => {
        cargarNotas();
    }, []);

    const cargarNotas = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'http://localhost:3000/api/asignaciones/notas/todas',
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const data = await response.json();
            if (data.success) {
                setNotas(data.notas || []);
            }
        } catch (error) {
            console.error('Error al cargar notas:', error);
            alert('Error al cargar las notas');
        } finally {
            setLoading(false);
        }
    };

    const marcarComoVisto = async (asignacionId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/asignaciones/nota/${asignacionId}/marcar-visto`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const data = await response.json();
            if (data.success) {
                cargarNotas();
            }
        } catch (error) {
            console.error('Error al marcar como visto:', error);
            alert('Error al marcar como visto');
        }
    };

    // Obtener listas únicas para filtros
    const carreras = [...new Set(notas.map(n => n.estudianteId?.carrera).filter(Boolean))];
    const tutores = [...new Set(notas.map(n => 
        `${n.tutorId?.nombre || ''} ${n.tutorId?.apellido || ''}`.trim()
    ).filter(Boolean))];

    // Aplicar filtros
    const notasFiltradas = notas.filter(nota => {
        if (filtroCarrera !== 'todas' && nota.estudianteId?.carrera !== filtroCarrera) return false;
        
        if (filtroTutor !== 'todos') {
            const nombreTutor = `${nota.tutorId?.nombre || ''} ${nota.tutorId?.apellido || ''}`.trim();
            if (nombreTutor !== filtroTutor) return false;
        }
        
        if (filtroVisto === 'visto' && !nota.vistoAdmin) return false;
        if (filtroVisto === 'no-visto' && nota.vistoAdmin) return false;
        
        if (busqueda) {
            const nombreCompleto = `${nota.estudianteId?.nombre || ''} ${nota.estudianteId?.apellido || ''}`.toLowerCase();
            if (!nombreCompleto.includes(busqueda.toLowerCase())) return false;
        }

        return true;
    });

    // Estadísticas
    const stats = {
        total: notas.length,
        noVistas: notas.filter(n => !n.vistoAdmin).length,
        vistas: notas.filter(n => n.vistoAdmin).length,
        promedioGeneral: notas.length > 0 
            ? (notas.reduce((sum, n) => sum + (n.notaFinal || 0), 0) / notas.length).toFixed(2)
            : '0.00'
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando notas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Notas Finales de Prácticas
                    </h2>
                    <button
                        onClick={cargarNotas}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        🔄 Recargar
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-gray-600">Total Notas</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        <p className="text-sm text-gray-600">Sin Revisar</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.noVistas}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm text-gray-600">Revisadas</p>
                        <p className="text-3xl font-bold text-green-600">{stats.vistas}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p className="text-sm text-gray-600">Promedio General</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.promedioGeneral}</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filtros</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar estudiante..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={filtroCarrera}
                        onChange={(e) => setFiltroCarrera(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todas">Todas las carreras</option>
                        {carreras.map(carrera => (
                            <option key={carrera} value={carrera}>{carrera}</option>
                        ))}
                    </select>

                    <select
                        value={filtroTutor}
                        onChange={(e) => setFiltroTutor(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">Todos los tutores</option>
                        {tutores.map(tutor => (
                            <option key={tutor} value={tutor}>{tutor}</option>
                        ))}
                    </select>

                    <select
                        value={filtroVisto}
                        onChange={(e) => setFiltroVisto(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">Todas</option>
                        <option value="no-visto">Sin revisar</option>
                        <option value="visto">Revisadas</option>
                    </select>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                    Mostrando {notasFiltradas.length} de {notas.length} notas
                </p>
            </div>

            {/* Lista de Notas */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {notasFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No hay notas registradas
                        </h3>
                        <p className="text-gray-600">
                            {busqueda || filtroCarrera !== 'todas' || filtroTutor !== 'todos' || filtroVisto !== 'todos'
                                ? 'No se encontraron notas con los filtros aplicados.'
                                : 'Los tutores aún no han asignado notas finales.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nota Final</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notasFiltradas.map((nota) => (
                                    <tr key={nota._id} className={nota.vistoAdmin ? 'bg-white' : 'bg-yellow-50'}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {nota.estudianteId?.nombre} {nota.estudianteId?.apellido}
                                            </div>
                                            <div className="text-sm text-gray-500">{nota.estudianteId?.carrera}</div>
                                            <div className="text-xs text-gray-400">{nota.estudianteId?.cedula}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {nota.tutorId?.nombre} {nota.tutorId?.apellido}
                                            </div>
                                            <div className="text-xs text-gray-500">{nota.tutorId?.departamento}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {nota.ofertaId?.empresaId?.name || 'No disponible'}
                                            </div>
                                            <div className="text-xs text-gray-500">{nota.ofertaId?.nombreProyecto}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${
                                                nota.notaFinal >= 4.5 ? 'bg-green-100 text-green-800' :
                                                nota.notaFinal >= 3.5 ? 'bg-blue-100 text-blue-800' :
                                                nota.notaFinal >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {nota.notaFinal.toFixed(1)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {nota.vistoAdmin ? (
                                                <div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✓ Revisado
                                                    </span>
                                                    {nota.fechaVistoAdmin && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(nota.fechaVistoAdmin).toLocaleDateString('es-ES')}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    ⏰ Sin revisar
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setNotaSeleccionada(nota);
                                                        setShowDetalles(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                                >
                                                    👁️ Ver
                                                </button>
                                                {!nota.vistoAdmin && (
                                                    <button
                                                        onClick={() => marcarComoVisto(nota._id)}
                                                        className="text-green-600 hover:text-green-900 text-sm"
                                                    >
                                                        ✓ Marcar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de Detalles */}
            {showDetalles && notaSeleccionada && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Detalles de la Calificación</h2>
                                <button onClick={() => setShowDetalles(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                            </div>

                            <div className="space-y-6">
                                {/* Nota destacada */}
                                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                                    <p className="text-sm text-gray-600 mb-2">Nota Final</p>
                                    <p className="text-6xl font-bold text-blue-600">{notaSeleccionada.notaFinal.toFixed(1)}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {notaSeleccionada.notaFinal >= 3.0 ? '✅ Aprobado' : '❌ Reprobado'}
                                    </p>
                                </div>

                                {/* Información */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">📚 Estudiante</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Nombre:</strong> {notaSeleccionada.estudianteId?.nombre} {notaSeleccionada.estudianteId?.apellido}</p>
                                            <p><strong>Cédula:</strong> {notaSeleccionada.estudianteId?.cedula}</p>
                                            <p><strong>Carrera:</strong> {notaSeleccionada.estudianteId?.carrera}</p>
                                            <p><strong>Email:</strong> {notaSeleccionada.estudianteId?.correo}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">👨‍🏫 Tutor</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Nombre:</strong> {notaSeleccionada.tutorId?.nombre} {notaSeleccionada.tutorId?.apellido}</p>
                                            <p><strong>Departamento:</strong> {notaSeleccionada.tutorId?.departamento}</p>
                                        </div>
                                    </div>
                                </div>

                                {notaSeleccionada.ofertaId && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">🏢 Práctica Profesional</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Empresa:</strong> {notaSeleccionada.ofertaId?.empresaId?.name}</p>
                                            <p><strong>NIT:</strong> {notaSeleccionada.ofertaId?.empresaId?.nit}</p>
                                            <p><strong>Proyecto:</strong> {notaSeleccionada.ofertaId?.nombreProyecto}</p>
                                            {notaSeleccionada.ofertaId?.fechaInicio && (
                                                <p><strong>Periodo:</strong> {new Date(notaSeleccionada.ofertaId.fechaInicio).toLocaleDateString('es-ES')} - {new Date(notaSeleccionada.ofertaId.fechaFin).toLocaleDateString('es-ES')}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">📅 Registro</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Calificado:</strong> {new Date(notaSeleccionada.updatedAt).toLocaleString('es-ES')}</p>
                                        {notaSeleccionada.vistoAdmin && notaSeleccionada.fechaVistoAdmin && (
                                            <p><strong>Revisado:</strong> {new Date(notaSeleccionada.fechaVistoAdmin).toLocaleString('es-ES')}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    {!notaSeleccionada.vistoAdmin && (
                                        <button
                                            onClick={() => {
                                                marcarComoVisto(notaSeleccionada._id);
                                                setShowDetalles(false);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            ✓ Marcar como Revisado
                                        </button>
                                    )}
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
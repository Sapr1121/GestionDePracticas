import React, { useState } from 'react';

export const EstudiantesAsignadosTab = ({ estudiantes, loading, reloadData }) => {
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
    const [mostrarModalNota, setMostrarModalNota] = useState(null);
    const [notaFinal, setNotaFinal] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');

    // Función para verificar si puede asignar nota
    const puedeAsignarNota = (fechaFinalizacion) => {
        if (!fechaFinalizacion) return false;
        const hoy = new Date();
        const fechaFin = new Date(fechaFinalizacion);
        return hoy >= fechaFin;
    };

    // Función para calcular días restantes
    const diasRestantes = (fechaFinalizacion) => {
        if (!fechaFinalizacion) return null;
        const hoy = new Date();
        const fechaFin = new Date(fechaFinalizacion);
        const diferencia = fechaFin - hoy;
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return dias;
    };

    const handleAsignarNota = async (asignacionId) => {
        const nota = parseFloat(notaFinal);
        
        if (isNaN(nota) || nota < 0 || nota > 5) {
            setError('La nota debe estar entre 0 y 5');
            return;
        }

        setProcesando(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3000/api/asignaciones/asignacion/${asignacionId}/nota-final`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ notaFinal: nota })
                }
            );

            if (response.ok) {
                alert('Nota final asignada exitosamente');
                setMostrarModalNota(null);
                setNotaFinal('');
                reloadData();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al asignar nota');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setProcesando(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando estudiantes...</span>
                </div>
            </div>
        );
    }

    if (estudiantes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No tienes estudiantes asignados
                    </h3>
                    <p className="text-gray-600">
                        Una vez que aceptes solicitudes, los estudiantes aparecerán aquí.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Estudiantes Asignados ({estudiantes.length})
                    </h2>
                    <button
                        onClick={reloadData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        🔄 Recargar
                    </button>
                </div>
            </div>

            {/* Grid de estudiantes */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {estudiantes.map((asignacion) => {
                        // ✅ DEBUG: Agregar console.log para ver la estructura
                        console.log('🔍 Asignación completa:', asignacion);
                        console.log('📅 OfertaId:', asignacion.ofertaId);
                        
                        const estudiante = asignacion.estudianteId;
                        const empresa = asignacion.empresaId || asignacion.ofertaId?.empresaId;
                        
                        // ✅ Las fechas están en ofertaId
                        const fechaInicio = asignacion.ofertaId?.fechaInicio;
                        const fechaFin = asignacion.ofertaId?.fechaFin;
                        
                        const puedeCalificar = puedeAsignarNota(fechaFin);
                        const diasFaltantes = diasRestantes(fechaFin);
                        const yaCalificado = asignacion.notaFinal !== null && asignacion.notaFinal !== undefined;
                        
                        return (
                            <div
                                key={asignacion._id}
                                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
                            >
                                {/* Avatar y nombre */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {estudiante?.nombre?.charAt(0)?.toUpperCase() || 'E'}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3 className="font-semibold text-gray-800 text-sm">
                                            {estudiante?.nombre || 'Nombre no disponible'}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {estudiante?.codigo || estudiante?.cedula || 'Sin código'}
                                        </p>
                                    </div>
                                </div>

                                {/* Información de la empresa */}
                                {empresa && (
                                    <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg mr-2">🏢</span>
                                            <h4 className="font-semibold text-purple-900 text-sm">
                                                {empresa.name || empresa.nombre || 'Empresa'}
                                            </h4>
                                        </div>
                                        {empresa.nit && (
                                            <p className="text-xs text-purple-700">
                                                NIT: {empresa.nit}
                                            </p>
                                        )}
                                        {empresa.sector && (
                                            <p className="text-xs text-purple-700">
                                                Sector: {empresa.sector}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Fechas de práctica */}
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center mb-2">
                                        <span className="text-lg mr-2">📅</span>
                                        <h4 className="font-semibold text-blue-900 text-sm">
                                            Periodo de Práctica
                                        </h4>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Inicio:</span>
                                            <span className="font-medium text-blue-900">
                                                {fechaInicio 
                                                    ? new Date(fechaInicio).toLocaleDateString('es-ES')
                                                    : 'No definida'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Finalización:</span>
                                            <span className="font-medium text-blue-900">
                                                {fechaFin 
                                                    ? new Date(fechaFin).toLocaleDateString('es-ES')
                                                    : 'No definida'}
                                            </span>
                                        </div>
                                        {diasFaltantes !== null && diasFaltantes > 0 && (
                                            <div className="mt-2 pt-2 border-t border-blue-200">
                                                <span className="text-orange-700 font-medium">
                                                    ⏰ Faltan {diasFaltantes} días para finalizar
                                                </span>
                                            </div>
                                        )}
                                        {diasFaltantes !== null && diasFaltantes <= 0 && !yaCalificado && (
                                            <div className="mt-2 pt-2 border-t border-blue-200">
                                                <span className="text-green-700 font-medium">
                                                    ✅ Periodo finalizado - Puede calificar
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info básica del estudiante */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-20 flex-shrink-0">Email:</span>
                                        <span className="text-gray-700 break-all text-xs">
                                            {estudiante?.correo || estudiante?.email || 'No disponible'}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-20 flex-shrink-0">Programa:</span>
                                        <span className="text-gray-700 text-xs">
                                            {estudiante?.carrera || estudiante?.programa || 'No especificado'}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-20 flex-shrink-0">Teléfono:</span>
                                        <span className="text-gray-700 text-xs">
                                            {estudiante?.telefono || estudiante?.celular || 'No disponible'}
                                        </span>
                                    </div>
                                </div>

                                {/* Sección de calificación */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    {yaCalificado ? (
                                        // Ya tiene nota
                                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-xs text-green-700 mb-1">Nota Final</p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {asignacion.notaFinal.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">✓ Calificado</p>
                                        </div>
                                    ) : puedeCalificar ? (
                                        // Puede asignar nota
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMostrarModalNota(asignacion._id);
                                                setNotaFinal('');
                                                setError('');
                                            }}
                                            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                                        >
                                            📝 Asignar Nota Final
                                        </button>
                                    ) : (
                                        // No puede asignar aún
                                        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <p className="text-xs text-orange-700 mb-1">
                                                🔒 Nota no disponible
                                            </p>
                                            <p className="text-xs text-orange-600">
                                                Debe finalizar el periodo de práctica
                                            </p>
                                            {diasFaltantes > 0 && (
                                                <p className="text-xs text-orange-500 mt-1 font-medium">
                                                    Disponible en {diasFaltantes} días
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Botón ver más */}
                                <button 
                                    onClick={() => setEstudianteSeleccionado(asignacion)}
                                    className="mt-3 w-full text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    Ver detalles completos →
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de detalles */}
            {estudianteSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del modal */}
                        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {estudianteSeleccionado.estudianteId?.nombre || 'Nombre no disponible'} {estudianteSeleccionado.estudianteId?.apellido || ''}
                                    </h2>
                                    <p className="text-blue-100 mt-1">
                                        {estudianteSeleccionado.estudianteId?.cedula || estudianteSeleccionado.estudianteId?.codigo || 'Sin código'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEstudianteSeleccionado(null)}
                                    className="text-white hover:bg-blue-700 rounded-full p-2"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-6 space-y-6">
                            {/* Información de la empresa */}
                            {(estudianteSeleccionado.empresaId || estudianteSeleccionado.ofertaId?.empresaId) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        🏢 Empresa de Práctica
                                    </h3>
                                    <div className="bg-purple-50 rounded-lg p-4 space-y-2 border border-purple-200">
                                        <InfoRow 
                                            label="Nombre" 
                                            value={(estudianteSeleccionado.empresaId || estudianteSeleccionado.ofertaId?.empresaId)?.name || 
                                                   (estudianteSeleccionado.empresaId || estudianteSeleccionado.ofertaId?.empresaId)?.nombre} 
                                        />
                                        <InfoRow 
                                            label="NIT" 
                                            value={(estudianteSeleccionado.empresaId || estudianteSeleccionado.ofertaId?.empresaId)?.nit} 
                                        />
                                        <InfoRow 
                                            label="Sector" 
                                            value={(estudianteSeleccionado.empresaId || estudianteSeleccionado.ofertaId?.empresaId)?.sector} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Fechas de práctica */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    📅 Periodo de Práctica
                                </h3>
                                <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-200">
                                    <InfoRow 
                                        label="Fecha de Inicio" 
                                        value={(estudianteSeleccionado.ofertaId?.fechaInicio)
                                            ? new Date(estudianteSeleccionado.ofertaId.fechaInicio).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'No definida'
                                        } 
                                    />
                                    <InfoRow 
                                        label="Fecha de Finalización" 
                                        value={(estudianteSeleccionado.ofertaId?.fechaFin)
                                            ? new Date(estudianteSeleccionado.ofertaId.fechaFin).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'No definida'
                                        } 
                                    />
                                    {estudianteSeleccionado.ofertaId?.fechaFin && (
                                        <div className="pt-2 border-t border-blue-200">
                                            <InfoRow 
                                                label="Estado" 
                                                value={
                                                    puedeAsignarNota(estudianteSeleccionado.ofertaId.fechaFin) 
                                                        ? <span className="text-green-600 font-medium">✅ Periodo finalizado</span>
                                                        : <span className="text-orange-600 font-medium">⏰ En curso ({diasRestantes(estudianteSeleccionado.ofertaId.fechaFin)} días restantes)</span>
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información personal */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    📋 Información Personal
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <InfoRow 
                                        label="Email" 
                                        value={estudianteSeleccionado.estudianteId?.correo || estudianteSeleccionado.estudianteId?.email} 
                                    />
                                    <InfoRow 
                                        label="Teléfono" 
                                        value={estudianteSeleccionado.estudianteId?.telefono || estudianteSeleccionado.estudianteId?.celular} 
                                    />
                                    <InfoRow 
                                        label="Carrera" 
                                        value={estudianteSeleccionado.estudianteId?.carrera || estudianteSeleccionado.estudianteId?.programa} 
                                    />
                                    <InfoRow 
                                        label="Semestre" 
                                        value={estudianteSeleccionado.estudianteId?.semestreActual || estudianteSeleccionado.estudianteId?.semestre} 
                                    />
                                </div>
                            </div>

                            {/* Información de asignación */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    📄 Información de Asignación
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <InfoRow 
                                        label="Estado" 
                                        value={
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Aceptado
                                            </span>
                                        }
                                    />
                                    <InfoRow 
                                        label="Fecha de solicitud" 
                                        value={new Date(estudianteSeleccionado.fechaSolicitud).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} 
                                    />
                                    {estudianteSeleccionado.fechaRespuesta && (
                                        <InfoRow 
                                            label="Fecha de aceptación" 
                                            value={new Date(estudianteSeleccionado.fechaRespuesta).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} 
                                        />
                                    )}
                                    <InfoRow 
                                        label="Permanente" 
                                        value={estudianteSeleccionado.permanente ? 'Sí' : 'No'} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer del modal */}
                        <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end">
                            <button
                                onClick={() => setEstudianteSeleccionado(null)}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para asignar nota final */}
            {mostrarModalNota && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            📝 Asignar Nota Final
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                            Ingresa la nota final del estudiante (0.0 - 5.0):
                        </p>
                        
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={notaFinal}
                            onChange={(e) => {
                                setNotaFinal(e.target.value);
                                setError('');
                            }}
                            placeholder="Ej: 4.5"
                            className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center font-bold"
                        />
                        
                        {error && (
                            <p className="text-red-600 text-sm mb-4">{error}</p>
                        )}
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setMostrarModalNota(null);
                                    setNotaFinal('');
                                    setError('');
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                disabled={procesando}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleAsignarNota(mostrarModalNota)}
                                disabled={procesando || !notaFinal}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {procesando ? 'Guardando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente auxiliar para mostrar filas de información
const InfoRow = ({ label, value }) => (
    <div className="flex py-1">
        <span className="text-gray-600 w-40 flex-shrink-0">{label}:</span>
        <span className="text-gray-800 font-medium">{value || 'No disponible'}</span>
    </div>
);
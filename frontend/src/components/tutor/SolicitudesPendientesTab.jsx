import React, { useState } from 'react';

export const SolicitudesPendientesTab = ({ solicitudes, loading, onAceptar, onRechazar }) => {
    const [procesando, setProcesando] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [mostrarModalRechazo, setMostrarModalRechazo] = useState(null);

    const handleAceptar = async (solicitudId) => {
        if (window.confirm('¿Estás seguro de aceptar esta solicitud?')) {
            setProcesando(solicitudId);
            try {
                await onAceptar(solicitudId);
            } finally {
                setProcesando(null);
            }
        }
    };

    const handleRechazar = async (solicitudId) => {
        if (!motivoRechazo.trim()) {
            alert('Debes proporcionar un motivo de rechazo');
            return;
        }
        setProcesando(solicitudId);
        try {
            await onRechazar(solicitudId, motivoRechazo);
            setMostrarModalRechazo(null);
            setMotivoRechazo('');
        } finally {
            setProcesando(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
                </div>
            </div>
        );
    }

    if (solicitudes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No hay solicitudes pendientes
                    </h3>
                    <p className="text-gray-600">
                        Cuando un estudiante solicite ser tu practicante, aparecerá aquí.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <div className="flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Solicitudes Pendientes ({solicitudes.length})
                        </h2>
                        <p className="text-sm text-gray-600">
                            Tienes {solicitudes.length} solicitud(es) esperando tu respuesta
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de solicitudes */}
            <div className="divide-y divide-gray-200">
                {solicitudes.map((solicitud) => {
                    // ✅ CORRECCIÓN: Tu backend usa estudianteId, no estudiante
                    const estudiante = solicitud.estudianteId;
                    
                    console.log('Renderizando solicitud:', solicitud);
                    console.log('Datos del estudiante:', estudiante);
                    
                    return (
                        <div key={solicitud._id} className="p-6 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {/* Info del estudiante */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {estudiante?.nombre || 'Nombre no disponible'} {estudiante?.apellido || ''}
                                        </h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>
                                                <span className="font-medium">Email:</span>{' '}
                                                {estudiante?.correo || estudiante?.email || 'No disponible'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Cédula:</span>{' '}
                                                {estudiante?.cedula || estudiante?.codigo || 'No disponible'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Carrera:</span>{' '}
                                                {estudiante?.carrera || estudiante?.programa || 'No especificado'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Semestre:</span>{' '}
                                                {estudiante?.semestreActual || estudiante?.semestre || 'No especificado'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Fecha de solicitud:</span>{' '}
                                                {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badge de estado */}
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        ⏳ Pendiente
                                    </span>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col space-y-2 ml-4">
                                    <button
                                        onClick={() => handleAceptar(solicitud._id)}
                                        disabled={procesando === solicitud._id}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                                    >
                                        {procesando === solicitud._id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                ✓ Aceptar
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setMostrarModalRechazo(solicitud._id)}
                                        disabled={procesando === solicitud._id}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    >
                                        ✗ Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de rechazo */}
            {mostrarModalRechazo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Rechazar Solicitud
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Por favor, proporciona un motivo del rechazo para el estudiante:
                        </p>
                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            placeholder="Ej: No cuento con disponibilidad para este periodo..."
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows="4"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setMostrarModalRechazo(null);
                                    setMotivoRechazo('');
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleRechazar(mostrarModalRechazo)}
                                disabled={procesando === mostrarModalRechazo || !motivoRechazo.trim()}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {procesando === mostrarModalRechazo ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
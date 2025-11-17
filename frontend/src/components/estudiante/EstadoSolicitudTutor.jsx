import React from 'react';

export const EstadoSolicitudTutor = ({ solicitud }) => {
    if (!solicitud) {
        return null;
    }

    const { estado, tutorId, fechaSolicitud, motivoRechazo } = solicitud;

    // SOLICITUD PENDIENTE
    if (estado === 'pendiente') {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-medium text-blue-800">
                            Solicitud Pendiente
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p className="mb-2">
                                Has enviado una solicitud a <strong>{tutorId.nombre} {tutorId.apellido}</strong>
                            </p>
                            <p className="text-xs text-blue-600">
                                Enviada el: {new Date(fechaSolicitud).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="mt-4 bg-white p-3 rounded border border-blue-200">
                            <p className="text-sm text-gray-600">
                                ⏳ Esperando respuesta del tutor...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // SOLICITUD ACEPTADA
    if (estado === 'aceptado') {
        return (
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-medium text-green-800">
                            ¡Tutor Asignado!
                        </h3>
                        <div className="mt-3 bg-white rounded-lg p-4 shadow-sm">
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-500">Nombre:</span>
                                    <p className="font-semibold text-gray-800">
                                        {tutorId.nombre} {tutorId.apellido}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Departamento:</span>
                                    <p className="text-gray-700">{tutorId.departamento}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Correo:</span>
                                    <p className="text-gray-700">{tutorId.correo}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 bg-green-100 p-3 rounded">
                            <p className="text-sm text-green-700">
                                ✅ Esta asignación es permanente. Tu tutor te acompañará durante toda tu práctica.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // SOLICITUD RECHAZADA
    if (estado === 'rechazado') {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3 flex-1">
                        <h3 className="text-lg font-medium text-red-800">
                            Solicitud Rechazada
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p className="mb-2">
                                Tu solicitud a <strong>{tutorId.nombre} {tutorId.apellido}</strong> fue rechazada.
                            </p>
                            {motivoRechazo && (
                                <div className="mt-3 bg-white p-3 rounded border border-red-200">
                                    <p className="text-xs text-gray-500 mb-1">Motivo:</p>
                                    <p className="text-sm text-gray-700">{motivoRechazo}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 bg-blue-50 p-3 rounded">
                            <p className="text-sm text-blue-700">
                                💡 Puedes solicitar otro tutor disponible desde la lista.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
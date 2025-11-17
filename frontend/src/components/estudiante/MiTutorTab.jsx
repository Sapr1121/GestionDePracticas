import React from 'react';
import { TutoresDisponibles } from './TutoresDisponibles';
import { EstadoSolicitudTutor } from './EstadoSolicitudTutor';

export const MiTutorTab = ({ 
    tutoresDisponibles, 
    miSolicitud, 
    loading,
    onSolicitarTutor,
    error,
    success
}) => {
    return (
        <div className="space-y-6">
            {/* Mensajes de éxito/error */}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Estado de la solicitud actual */}
            {miSolicitud && (
                <div className="mb-6">
                    <EstadoSolicitudTutor solicitud={miSolicitud} />
                </div>
            )}

            {/* Tutores disponibles - Solo mostrar si NO tiene solicitud pendiente o aceptada */}
            {(!miSolicitud || miSolicitud.estado === 'rechazado') && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tutores Disponibles
                        </h2>
                        <p className="text-gray-600">
                            Selecciona un tutor para enviarle una solicitud. Recuerda que una vez asignado, 
                            será tu tutor permanente durante toda la práctica.
                        </p>
                    </div>

                    <TutoresDisponibles 
                        tutores={tutoresDisponibles}
                        onSolicitar={onSolicitarTutor}
                        loading={loading}
                    />
                </div>
            )}

            {/* Si tiene solicitud pendiente o aceptada, mostrar info adicional */}
            {miSolicitud && miSolicitud.estado === 'pendiente' && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        💡 <strong>Consejo:</strong> Mientras esperas la respuesta, puedes seguir 
                        aplicando a ofertas de práctica. No es necesario tener tutor asignado para aplicar.
                    </p>
                </div>
            )}

            {miSolicitud && miSolicitud.estado === 'aceptado' && (
                <div className="mt-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Próximos pasos con tu tutor:
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start">
                                <span className="mr-2">1️⃣</span>
                                <span>Contacta a tu tutor por correo para la primera reunión</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2️⃣</span>
                                <span>Mantén comunicación constante sobre tu progreso</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3️⃣</span>
                                <span>Tu tutor podrá ver las observaciones que recibas de la empresa</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">4️⃣</span>
                                <span>Al finalizar, tu tutor asignará tu calificación final</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
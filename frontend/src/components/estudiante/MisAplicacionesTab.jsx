import React from 'react';
import { Clock, Calendar, CheckCircle, XCircle, Building2, FileText } from 'lucide-react';

export const MisAplicacionesTab = ({ aplicaciones, getCompanyName }) => {
    const getEstadoConfig = (estado) => {
        const configs = {
            'pendiente': {
                bg: 'bg-yellow-50',
                border: 'border-yellow-300',
                text: 'text-yellow-800',
                badgeBg: 'bg-yellow-100',
                icon: Clock,
                label: 'PENDIENTE',
                description: 'Tu aplicación está siendo revisada por la empresa'
            },
            'entrevista': {
                bg: 'bg-indigo-50',
                border: 'border-indigo-300',
                text: 'text-indigo-800',
                badgeBg: 'bg-indigo-100',
                icon: Calendar,
                label: 'ENTREVISTA AGENDADA',
                description: 'La empresa te ha citado a una entrevista'
            },
            'aceptado': {
                bg: 'bg-green-50',
                border: 'border-green-300',
                text: 'text-green-800',
                badgeBg: 'bg-green-100',
                icon: CheckCircle,
                label: '¡CONTRATADO!',
                description: '¡Felicitaciones! Has sido seleccionado para esta práctica'
            },
            'rechazado': {
                bg: 'bg-red-50',
                border: 'border-red-300',
                text: 'text-red-800',
                badgeBg: 'bg-red-100',
                icon: XCircle,
                label: 'RECHAZADO',
                description: 'Lamentablemente no fuiste seleccionado para esta oferta'
            }
        };
        return configs[estado] || configs['pendiente'];
    };

    if (aplicaciones.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No has aplicado a ninguna oferta
                </h3>
                <p className="text-gray-500">
                    Explora las ofertas disponibles y aplica a las que te interesen
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Mis Aplicaciones ({aplicaciones.length})
                </h2>
            </div>

            {aplicaciones.map((app) => {
                const config = getEstadoConfig(app.estado);
                const IconoEstado = config.icon;
                const companyName = getCompanyName(app.ofertaId?.empresaId);

                return (
                    <div 
                        key={app._id}
                        className={`${config.bg} border-2 ${config.border} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all`}
                    >
                        {/* Header */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {app.ofertaId?.nombreProyecto || 'Oferta no disponible'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Building2 size={18} />
                                        <span className="font-medium">{companyName}</span>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.badgeBg} ${config.text} border-2 ${config.border}`}>
                                    <IconoEstado size={18} />
                                    <span className="text-sm font-bold">{config.label}</span>
                                </div>
                            </div>

                            {/* Descripción del estado */}
                            <div className={`${config.badgeBg} border ${config.border} rounded-lg p-4 mb-4`}>
                                <p className={`text-sm ${config.text} font-medium`}>
                                    {config.description}
                                </p>
                            </div>

                            {/* Información de la oferta */}
                            {app.ofertaId && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 bg-white rounded-lg p-4 border border-gray-200">
                                    <div>
                                        <p><strong>Áreas:</strong> {app.ofertaId.areasProyecto?.join(', ') || 'N/A'}</p>
                                        <p><strong>Conducente a grado:</strong> {app.ofertaId.esConducenteGrado ? 'Sí' : 'No'}</p>
                                    </div>
                                    <div>
                                        <p><strong>Duración:</strong> {new Date(app.ofertaId.fechaInicio).toLocaleDateString('es-CO')} - {new Date(app.ofertaId.fechaFin).toLocaleDateString('es-CO')}</p>
                                        <p><strong>Pago:</strong> ${app.ofertaId.pago?.toLocaleString('es-CO') || '0'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Fecha de entrevista */}
                            {app.estado === 'entrevista' && app.fechaEntrevista && (
                                <div className="mt-4 bg-white border-2 border-indigo-300 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar size={24} className="text-indigo-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-indigo-900 mb-1">
                                                📅 Fecha y hora de tu entrevista
                                            </h4>
                                            <p className="text-lg font-semibold text-indigo-800">
                                                {new Date(app.fechaEntrevista).toLocaleDateString('es-CO', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="text-sm text-indigo-700 mt-2">
                                                💡 Prepárate con anticipación y llega puntual. ¡Mucha suerte!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mensaje para contratados */}
                            {app.estado === 'aceptado' && (
                                <div className="mt-4 bg-white border-2 border-green-300 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle size={24} className="text-green-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-green-900 mb-1">
                                                🎉 ¡Felicitaciones por tu contratación!
                                            </h4>
                                            <p className="text-sm text-green-800">
                                                La empresa se pondrá en contacto contigo pronto para coordinar los detalles de inicio de tu práctica.
                                            </p>
                                            <p className="text-xs text-green-700 mt-2">
                                                Contratado el: {new Date(app.fechaActualizacion).toLocaleDateString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notas de rechazo */}
                            {app.estado === 'rechazado' && app.notasEmpresa && (
                                <div className="mt-4 bg-white border-2 border-red-300 rounded-lg p-4">
                                    <p className="text-sm text-red-800">
                                        <strong>Motivo:</strong> {app.notasEmpresa}
                                    </p>
                                    <p className="text-xs text-red-700 mt-2">
                                        No te desanimes, sigue aplicando a otras ofertas
                                    </p>
                                </div>
                            )}

                            {/* Footer con fechas */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                                <span>Aplicaste: {new Date(app.fechaAplicacion).toLocaleDateString('es-CO')}</span>
                                {app.fechaActualizacion && app.fechaActualizacion !== app.fechaAplicacion && (
                                    <span>Actualizado: {new Date(app.fechaActualizacion).toLocaleDateString('es-CO')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, XCircle, Clock, FileWarning } from 'lucide-react';

export const AplicacionCard = ({ aplicacion, onEstadoChange, onAgendarEntrevista }) => {
    const [descargando, setDescargando] = useState(false);

    const getEstadoConfig = (estado) => {
        const configs = {
            'pendiente': {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'PENDIENTE',
                icon: Clock
            },
            'entrevista': {
                bg: 'bg-indigo-100',
                text: 'text-indigo-800',
                border: 'border-indigo-300',
                label: 'ENTREVISTA AGENDADA',
                icon: Calendar
            },
            'aceptado': {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'CONTRATADO',
                icon: CheckCircle
            },
            'rechazado': {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'RECHAZADO',
                icon: XCircle
            }
        };
        return configs[estado] || configs['pendiente'];
    };

    const descargarArchivo = async (aplicacionId, tipo, nombreOriginal) => {
        setDescargando(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/aplicaciones/${aplicacionId}/archivo/${tipo}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Error al descargar');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreOriginal;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error descargando archivo:', error);
            alert('Error al descargar el archivo');
        } finally {
            setDescargando(false);
        }
    };

    const estadoConfig = getEstadoConfig(aplicacion.estado);
    const IconoEstado = estadoConfig.icon;

    return (
        <div className={`bg-white border-2 ${estadoConfig.border} rounded-lg p-5 shadow-sm hover:shadow-md transition`}>
            {/* Header con info del estudiante */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800">
                        {aplicacion.estudianteData.nombre} {aplicacion.estudianteData.apellido}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Carrera:</strong> {aplicacion.estudianteData.carrera}</p>
                        <p><strong>Semestre:</strong> {aplicacion.estudianteData.semestre}</p>
                        <p><strong>Teléfono:</strong> {aplicacion.estudianteData.telefono}</p>
                        <p><strong>Email:</strong> {aplicacion.estudianteData.correo}</p>
                        <p className="text-xs text-gray-500 mt-2">
                            Aplicó: {new Date(aplicacion.fechaAplicacion).toLocaleDateString('es-CO')}
                        </p>
                    </div>
                </div>

                {/* Badge de estado */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${estadoConfig.bg} ${estadoConfig.text} border ${estadoConfig.border}`}>
                    <IconoEstado size={16} />
                    <span className="text-xs font-bold">{estadoConfig.label}</span>
                </div>
            </div>

            {/* Botones de descarga */}
            <div className="flex gap-2 mb-4">
                {aplicacion.hojaVida && (
                    <button
                        onClick={() => descargarArchivo(
                            aplicacion._id,
                            'hoja-vida',
                            aplicacion.hojaVida.originalName
                        )}
                        disabled={descargando}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 text-sm"
                    >
                        <Download size={16} />
                        Hoja de Vida
                    </button>
                )}
                {aplicacion.cartaPresentacion && (
                    <button
                        onClick={() => descargarArchivo(
                            aplicacion._id,
                            'carta-presentacion',
                            aplicacion.cartaPresentacion.originalName
                        )}
                        disabled={descargando}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 text-sm"
                    >
                        <Download size={16} />
                        Carta
                    </button>
                )}
            </div>

            {/* Acciones según estado */}
            {aplicacion.estado === 'pendiente' && (
                <div className="flex gap-2 pt-3 border-t">
                    <button
                        onClick={() => onAgendarEntrevista(aplicacion)}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Calendar size={18} />
                        Agendar Entrevista
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('¿Seguro que deseas rechazar esta aplicación?')) {
                                onEstadoChange(aplicacion._id, 'rechazado');
                            }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        <XCircle size={18} />
                        Rechazar
                    </button>
                </div>
            )}

            {aplicacion.estado === 'entrevista' && (
                <div className="pt-3 border-t space-y-3">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <p className="text-sm text-indigo-900">
                            <strong>📅 Entrevista agendada:</strong><br />
                            {new Date(aplicacion.fechaEntrevista).toLocaleDateString('es-CO', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (window.confirm('¿Contratar a este estudiante?')) {
                                    onEstadoChange(aplicacion._id, 'aceptado');
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            <CheckCircle size={18} />
                            Contratar
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('¿Rechazar después de la entrevista?')) {
                                    onEstadoChange(aplicacion._id, 'rechazado');
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            <XCircle size={18} />
                            Rechazar
                        </button>
                    </div>
                </div>
            )}

            {aplicacion.estado === 'aceptado' && (
                <div className="pt-3 border-t">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-900">
                            ✅ <strong>Contratado el:</strong> {new Date(aplicacion.fechaActualizacion).toLocaleDateString('es-CO')}
                        </p>
                    </div>
                </div>
            )}

            {aplicacion.estado === 'rechazado' && aplicacion.notasEmpresa && (
                <div className="pt-3 border-t">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-900">
                            <strong>Motivo:</strong> {aplicacion.notasEmpresa}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
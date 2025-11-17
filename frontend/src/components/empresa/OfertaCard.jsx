import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Users, AlertCircle } from 'lucide-react';

export const OfertaCard = ({ 
    oferta, 
    onDelete, 
    onViewAplicaciones, 
    aplicaciones, 
    loading,
    children 
}) => {
    const [mostrarAplicaciones, setMostrarAplicaciones] = useState(false);

    const handleToggleAplicaciones = () => {
        if (!mostrarAplicaciones && !aplicaciones) {
            onViewAplicaciones(oferta._id);
        }
        setMostrarAplicaciones(!mostrarAplicaciones);
    };

    // Calcular porcentaje de cupos usados
    const porcentajeCupos = ((oferta.maxEstudiantesAceptar - oferta.cuposDisponibles) / oferta.maxEstudiantesAceptar) * 100;
    
    // Determinar color según disponibilidad
    const getColorCupos = () => {
        if (oferta.cuposDisponibles === 0) return 'text-red-600 bg-red-50 border-red-300';
        if (porcentajeCupos >= 75) return 'text-orange-600 bg-orange-50 border-orange-300';
        return 'text-green-600 bg-green-50 border-green-300';
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Header de la oferta */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                                {oferta.nombreProyecto}
                            </h3>
                            {!oferta.activa && (
                                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                                    INACTIVA
                                </span>
                            )}
                            {oferta.activa && oferta.cuposDisponibles === 0 && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
                                    COMPLETA
                                </span>
                            )}
                        </div>
                        
                        {/* Indicador de cupos */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getColorCupos()}`}>
                            <Users size={18} />
                            <span className="font-bold text-sm">
                                {oferta.cuposDisponibles} / {oferta.maxEstudiantesAceptar} cupos disponibles
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onDelete(oferta._id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                        title="Eliminar oferta"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Información de la oferta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">
                            <strong>Carreras:</strong> {oferta.carrera.join(', ')}
                        </p>
                        <p className="text-gray-600">
                            <strong>Áreas:</strong> {oferta.areasProyecto.join(', ')}
                        </p>
                        <p className="text-gray-600">
                            <strong>Conducente a grado:</strong> {oferta.esConducenteGrado ? 'Sí' : 'No'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            <strong>Inicio:</strong> {new Date(oferta.fechaInicio).toLocaleDateString('es-CO')}
                        </p>
                        <p className="text-gray-600">
                            <strong>Fin:</strong> {new Date(oferta.fechaFin).toLocaleDateString('es-CO')}
                        </p>
                        <p className="text-gray-600">
                            <strong>Pago:</strong> ${oferta.pago.toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>

                {oferta.observaciones && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm text-gray-700">
                            <strong>Observaciones:</strong> {oferta.observaciones}
                        </p>
                    </div>
                )}

                {/* Alerta de cupos llenos */}
                {oferta.cuposDisponibles === 0 && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                            Esta oferta ha alcanzado el máximo de estudiantes contratados y ya no está disponible para nuevas aplicaciones.
                        </p>
                    </div>
                )}

                {/* Botón ver aplicaciones */}
                <button
                    onClick={handleToggleAplicaciones}
                    disabled={loading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition border border-blue-200"
                >
                    {loading ? (
                        'Cargando...'
                    ) : (
                        <>
                            {mostrarAplicaciones ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            {mostrarAplicaciones ? 'Ocultar' : 'Ver'} Aplicaciones
                            {aplicaciones && ` (${aplicaciones.length})`}
                        </>
                    )}
                </button>
            </div>

            {/* Contenedor de aplicaciones */}
            {mostrarAplicaciones && (
                <div className="bg-gray-50 p-6 border-t">
                    {children}
                </div>
            )}
        </div>
    );
};
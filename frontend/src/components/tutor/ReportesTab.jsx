import React from 'react';

export const ReportesTab = ({ reportes }) => {
    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                    Reportes ({reportes.length})
                </h2>
            </div>

            {/* Contenido provisional */}
            <div className="p-8">
                <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Sección en Desarrollo
                    </h3>
                    <p className="text-gray-600 mb-4">
                        El módulo de reportes está en proceso de implementación.
                    </p>
                    <div className="text-sm text-gray-500 bg-white rounded p-4 max-w-md mx-auto mt-4">
                        <p className="font-medium mb-2">Funcionalidades planificadas:</p>
                        <ul className="text-left space-y-1">
                            <li>• Crear nuevos reportes</li>
                            <li>• Historial de reportes enviados</li>
                            <li>• Filtrar por estudiante</li>
                            <li>• Exportar reportes</li>
                            <li>• Estadísticas de seguimiento</li>
                        </ul>
                    </div>
                </div>

                {/* Preview de datos (opcional) */}
                {reportes.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                            <strong>Datos disponibles:</strong> {reportes.length} reporte(s) en el sistema
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
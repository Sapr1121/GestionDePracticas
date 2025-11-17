import React from 'react';

export const SolicitudesPracticaTab = ({ estudiantes, onHabilitar }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitudes de Práctica</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semestre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {estudiantes.map(est => (
                            <tr key={est._id}>
                                <td className="px-6 py-4">{est.nombre} {est.apellido}</td>
                                <td className="px-6 py-4">{est.correo}</td>
                                <td className="px-6 py-4">{est.carrera}</td>
                                <td className="px-6 py-4">{est.semestreActual}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2">
                                        Solicitud enviada
                                    </span>
                                    <button
                                        onClick={() => onHabilitar(est._id)}
                                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                                    >
                                        Habilitar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {estudiantes.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No hay solicitudes pendientes</p>
                )}
            </div>
        </div>
    );
};
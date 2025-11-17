import React from 'react';

export const EstudiantesHabilitadosTab = ({ estudiantes, onBloquear }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Estudiantes Habilitados</h2>
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
                                    <button
                                        onClick={() => onBloquear(est._id)}
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                    >
                                        Bloquear
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {estudiantes.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No hay estudiantes habilitados</p>
                )}
            </div>
        </div>
    );
};
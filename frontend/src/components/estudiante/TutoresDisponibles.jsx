import React, { useState } from 'react';

export const TutoresDisponibles = ({ tutores, onSolicitar, loading }) => {
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSolicitarClick = (tutor) => {
        setSelectedTutor(tutor);
        setShowConfirm(true);
    };

    const handleConfirmar = () => {
        if (selectedTutor) {
            onSolicitar(selectedTutor._id);
            setShowConfirm(false);
            setSelectedTutor(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (tutores.length === 0) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            No hay tutores disponibles en este momento. Todos han alcanzado su cupo máximo de estudiantes.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutores.map((tutor) => (
                    <div 
                        key={tutor._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                            <h3 className="text-lg font-bold text-white">
                                {tutor.nombre} {tutor.apellido}
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-sm">{tutor.departamento}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleSolicitarClick(tutor)}
                                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                            >
                                Solicitar como Tutor
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de confirmación */}
            {showConfirm && selectedTutor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Confirmar Solicitud
                        </h3>
                        
                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de que deseas solicitar a:
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-bold text-blue-900">
                                    {selectedTutor.nombre} {selectedTutor.apellido}
                                </p>
                                <p className="text-sm text-blue-700">
                                    {selectedTutor.departamento}
                                </p>
                            </div>
                            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                                <p className="text-sm text-yellow-700">
                                    ⚠️ <strong>Importante:</strong> Una vez que el tutor acepte tu solicitud, 
                                    la asignación será permanente y no podrás cambiar de tutor.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    setSelectedTutor(null);
                                }}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmar}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
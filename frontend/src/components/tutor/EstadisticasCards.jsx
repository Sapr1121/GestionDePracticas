import React from 'react';

export const EstadisticasCards = ({ user, solicitudesPendientes, estudiantesCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Información del Tutor */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Tu Departamento</p>
                        <p className="text-xl font-semibold text-gray-800">{user.departamento}</p>
                    </div>
                </div>
            </div>

            {/* Card 2: Solicitudes Pendientes */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Solicitudes Pendientes</p>
                        <p className="text-3xl font-bold text-gray-800">{solicitudesPendientes}</p>
                    </div>
                </div>
            </div>

            {/* Card 3: Estudiantes Asignados */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Estudiantes Asignados</p>
                        <p className="text-3xl font-bold text-gray-800">{estudiantesCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React from 'react';

export const OfertasTab = ({ ofertas, companies }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Todas las Ofertas de Práctica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ofertas.map((oferta) => (
                    <div key={oferta._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {oferta.nombreProyecto}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {companies.find(c => c._id === oferta.empresaId)?.name || 'Cargando...'}
                            </p>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                            <div>
                                <p className="font-semibold text-gray-700">Carreras:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {oferta.carrera.map((carr, index) => (
                                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            {carr}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-700">Áreas:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {oferta.areasProyecto.map((area, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p><strong>Conducente a grado:</strong> {oferta.esConducenteGrado ? 'Sí' : 'No'}</p>
                            <p><strong>Estudiantes a entrevistar:</strong> {oferta.maxEstudiantesEntrevistar}</p>
                            <p><strong>Estudiantes a aceptar:</strong> {oferta.maxEstudiantesAceptar}</p>
                            <p><strong>Inicio:</strong> {new Date(oferta.fechaInicio).toLocaleDateString()}</p>
                            <p><strong>Fin:</strong> {new Date(oferta.fechaFin).toLocaleDateString()}</p>
                            <p><strong>Pago:</strong> ${oferta.pago.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Creada: {new Date(oferta.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {ofertas.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay ofertas de práctica creadas aún
                </div>
            )}
        </div>
    );
};

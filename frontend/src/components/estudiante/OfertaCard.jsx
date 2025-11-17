import React from 'react';

export const OfertaCard = ({ oferta, companyName, yaAplico, onAplicar }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {oferta.nombreProyecto}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                    {companyName}
                </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-4">
                <div>
                    <p className="font-semibold text-gray-700">Áreas del proyecto:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {oferta.areasProyecto.map((area, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
                <p>
                    <strong>Conducente a grado:</strong> {oferta.esConducenteGrado ? 'Sí' : 'No'}
                </p>
                <p>
                    <strong>Cupos disponibles:</strong> {oferta.maxEstudiantesAceptar}
                </p>
                <p>
                    <strong>Duración:</strong> {new Date(oferta.fechaInicio).toLocaleDateString()} - {new Date(oferta.fechaFin).toLocaleDateString()}
                </p>
                <p>
                    <strong>Compensación:</strong> ${oferta.pago.toLocaleString()}
                </p>
            </div>

            {oferta.observaciones && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500">
                        <strong>Observaciones:</strong> {oferta.observaciones}
                    </p>
                </div>
            )}

            <button 
                onClick={() => onAplicar(oferta)}
                disabled={yaAplico}
                className={`w-full py-2 px-4 rounded-lg transition font-medium ${
                    yaAplico 
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {yaAplico ? 'Ya aplicaste' : 'Aplicar a esta oferta'}
            </button>
        </div>
    );
};
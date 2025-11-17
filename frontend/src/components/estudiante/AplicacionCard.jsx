import React from 'react';
import { getEstadoColor, getEstadoTexto } from '../../utils/estadoHelpers';

export const AplicacionCard = ({ aplicacion, companyName }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        {aplicacion.ofertaId.nombreProyecto}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {companyName}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(aplicacion.estado)}`}>
                    {getEstadoTexto(aplicacion.estado)}
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                    <strong>Fecha de aplicación:</strong><br/>
                    {new Date(aplicacion.fechaAplicacion).toLocaleDateString()}
                </p>
                <p>
                    <strong>Teléfono:</strong><br/>
                    {aplicacion.estudianteData?.telefono || aplicacion.telefono || 'No proporcionado'}
                </p>
            </div>

            {aplicacion.notasEmpresa && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm">
                        <strong>Notas de la empresa:</strong><br/>
                        {aplicacion.notasEmpresa}
                    </p>
                </div>
            )}
        </div>
    );
};
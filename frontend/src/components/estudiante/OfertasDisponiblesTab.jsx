import React from 'react';
import { OfertaCard } from './OfertaCard';

export const OfertasDisponiblesTab = ({
    ofertas,
    aplicaciones,
    loading,
    user,
    getCompanyName,
    onAplicar
}) => {
    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Cargando ofertas...</p>
            </div>
        );
    }

    if (ofertas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No hay ofertas disponibles</h3>
                <p className="text-gray-600">
                    Actualmente no hay ofertas de práctica para tu carrera. Vuelve a revisar más tarde.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ofertas Disponibles para {user.carrera}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ofertas.map((oferta) => {
                    const yaAplico = aplicaciones.some(app => app.ofertaId._id === oferta._id);
                    
                    return (
                        <OfertaCard
                            key={oferta._id}
                            oferta={oferta}
                            companyName={getCompanyName(oferta.empresaId)}
                            yaAplico={yaAplico}
                            onAplicar={onAplicar}
                        />
                    );
                })}
            </div>
        </div>
    );
};
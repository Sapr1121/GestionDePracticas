import React from 'react';
import { StatCard } from '../shared/StatCard';

export const DashboardTab = ({ companies, ofertas }) => {
    const newOffersThisWeek = ofertas.filter(o => {
        const createdAt = new Date(o.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
    }).length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Empresas"
                    value={companies.length}
                    color="blue"
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    }
                />

                <StatCard
                    title="Ofertas Activas"
                    value={ofertas.length}
                    color="green"
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                />

                <StatCard
                    title="Nuevas Esta Semana"
                    value={newOffersThisWeek}
                    color="purple"
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Últimas Ofertas Creadas</h3>
                <div className="space-y-4">
                    {ofertas.slice(0, 5).map((oferta) => (
                        <div key={oferta._id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-800">{oferta.nombreProyecto}</h4>
                                    <p className="text-sm text-gray-600">
                                        Empresa: {companies.find(c => c._id === oferta.empresaId)?.name || 'Cargando...'}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {oferta.carrera.map((carr, idx) => (
                                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {carr}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(oferta.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {ofertas.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay ofertas creadas aún</p>
                    )}
                </div>
            </div>
        </div>
    );
};

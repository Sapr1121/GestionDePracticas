import React, { useState, useMemo } from 'react';

export const CompaniesTab = ({ companies = [], onCreateClick, onToggleCompany }) => {
    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // '', 'active', 'inactive'

    // Obtener sectores únicos para el filtro
    const sectors = useMemo(() => {
        const unique = [...new Set(companies.map(c => c.companyData?.sector).filter(Boolean))];
        return unique.sort();
    }, [companies]);

    // Filtrar empresas
    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 company.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSector = !sectorFilter || company.companyData?.sector === sectorFilter;

            const matchesStatus = statusFilter === '' ||
                                 (statusFilter === 'active' && company.isActive) ||
                                 (statusFilter === 'inactive' && !company.isActive);

            return matchesSearch && matchesSector && matchesStatus;
        });
    }, [companies, searchTerm, sectorFilter, statusFilter]);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Gestión de Empresas
                </h2>
                <button
                    onClick={onCreateClick}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                >
                    + Crear Empresa
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda por nombre/email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar
                    </label>
                    <input
                        type="text"
                        placeholder="Nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filtro por sector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sector
                    </label>
                    <select
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los sectores</option>
                        {sectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro por estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        <option value="active">Activas</option>
                        <option value="inactive">Inactivas</option>
                    </select>
                </div>

                {/* Contador */}
                <div className="flex items-end justify-start sm:justify-end">
                    <span className="text-sm text-gray-600">
                        {filteredCompanies.length} de {companies.length} empresas
                    </span>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIT
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sector
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCompanies.map((company) => (
                                <tr 
                                    key={company._id}
                                    className={!company.isActive ? 'bg-red-50' : ''}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {company.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {company.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {company.companyData?.nit || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {company.companyData?.sector || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(company.createdAt).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            company.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {company.isActive ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleCompany(company._id)}
                                            className={`px-4 py-1.5 rounded text-white font-medium text-sm transition ${
                                                company.isActive 
                                                    ? 'bg-red-600 hover:bg-red-700' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            {company.isActive ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCompanies.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {companies.length === 0 
                                ? 'No hay empresas registradas' 
                                : 'No se encontraron empresas con los filtros aplicados'
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
import { useState, useEffect } from 'react';
import { estudianteOfertasService, estudianteAplicacionService, estudianteCompanyService } from '../services/estudiante.service';

export const useEstudianteData = (user) => {
    const [ofertas, setOfertas] = useState([]);
    const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [aplicaciones, setAplicaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user) return;
        
        try {
            setLoading(true);

            const [ofertasResponse, companiesResponse, aplicacionesResponse] = await Promise.all([
                estudianteOfertasService.getAll(),
                estudianteCompanyService.getAll(),
                estudianteAplicacionService.getByEstudiante(user.id)
            ]);

            if (ofertasResponse.success) {
                const todasOfertas = ofertasResponse.ofertas;
                setOfertas(todasOfertas);
                
                const ofertasParaMiCarrera = todasOfertas.filter(oferta => 
                    oferta.carrera.includes(user.carrera) && oferta.activa
                );
                setOfertasFiltradas(ofertasParaMiCarrera);
            }

            if (companiesResponse.success) {
                setCompanies(companiesResponse.companies);
            }

            if (aplicacionesResponse.success) {
                setAplicaciones(aplicacionesResponse.aplicaciones);
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const getCompanyName = (empresaId) => {
        const company = companies.find(c => c._id === empresaId);
        return company ? company.name : 'Empresa no encontrada';
    };

    return {
        ofertas,
        ofertasFiltradas,
        companies,
        aplicaciones,
        loading,
        getCompanyName,
        reloadData: loadData
    };
};
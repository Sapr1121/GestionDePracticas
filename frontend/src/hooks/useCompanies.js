import { useState, useEffect } from 'react';
import { companyService } from '../services/api.service';

export const useCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await companyService.getAll();
            if (data.success) {
                setCompanies(data.companies);
            }
        } catch (err) {
            console.error('Error al cargar empresas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    return { companies, loading, error, reloadCompanies: loadCompanies };
};
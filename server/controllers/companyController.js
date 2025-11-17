import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createCompany = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            nit, 
            razonSocial, 
            telefono, 
            direccion, 
            sector, 
            representanteLegal 
        } = req.body;

        // Verificar si el email ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'El email ya está registrado' 
            });
        }

        // Hashear contraseña
        const hashPassword = await bcrypt.hash(password, 10);

        // Crear empresa
        const newCompany = new User({
            name,
            email,
            password: hashPassword,
            role: 'empresa',
            companyData: {
                nit,
                razonSocial,
                telefono,
                direccion,
                sector,
                representanteLegal
            }
        });

        await newCompany.save();

        res.status(201).json({
            success: true,
            message: 'Empresa creada exitosamente',
            company: {
                id: newCompany._id,
                name: newCompany.name,
                email: newCompany.email,
                role: newCompany.role
            }
        });

    } catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
        });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await User.find({ role: 'empresa' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            companies
        });

    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
        });
    }
};

export const toggleCompanyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await User.findById(id);

        if (!company || company.role !== 'empresa') {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        const willBeActive = !company.isActive;
        company.isActive = willBeActive;
        await company.save();

        let ofertasAffected = 0;

        if (!willBeActive) {
            // DESACTIVAR TODAS LAS OFERTAS DE LA EMPRESA
            const result = await Oferta.updateMany(
                { empresaId: company._id },
                { activa: false }
            );
            ofertasAffected = result.modifiedCount;
        }

        res.status(200).json({
            success: true,
            message: `Empresa ${willBeActive ? 'activada' : 'desactivada'} exitosamente`,
            data: {
                company: {
                    id: company._id,
                    name: company.name,
                    isActive: willBeActive
                },
                ofertasDesactivadas: ofertasAffected
            }
        });
    } catch (error) {
        console.error('Error al alternar estado de empresa:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};
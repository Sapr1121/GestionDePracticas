import express from 'express';
import { createCompany, getAllCompanies, toggleCompanyStatus } from '../controllers/companyController.js';

const router = express.Router();

router.post('/create', createCompany);
router.get('/all', getAllCompanies);
router.patch('/:id/toggle-status', toggleCompanyStatus);

export default router;
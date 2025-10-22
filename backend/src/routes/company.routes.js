const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

// Protected routes - Recruiter and Admin only
router.use(protect);
router.use(authorize('RECRUITER', 'ADMIN'));

router.post('/', companyController.createCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;

const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { companyValidation } = require('../middlewares/validate.middleware');

// Public routes
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

// Protected routes - Recruiter and Admin only
router.use(protect);
router.use(authorize('RECRUITER', 'ADMIN'));

router.post('/', validate(companyValidation.create), companyController.createCompany);
router.put('/:id', validate(companyValidation.update), companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

// Employer management routes
router.post('/:id/employers', validate(companyValidation.addEmployer), companyController.addEmployer);
router.delete('/:id/employers', validate(companyValidation.removeEmployer), companyController.removeEmployer);
router.get('/:id/employers', companyController.getCompanyEmployers);

module.exports = router;

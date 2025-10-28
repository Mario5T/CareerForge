const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { employerValidation, jobValidation } = require('../middlewares/validate.middleware');

router.post('/company', protect, validate(employerValidation.createCompanyProfile), employerController.createCompanyProfile);
router.put('/company', protect, validate(employerValidation.updateCompanyProfile), employerController.updateCompanyProfile);
router.get('/company', protect, employerController.getMyCompany);

router.post('/jobs', protect, validate(jobValidation.create), employerController.createJob);
router.get('/jobs', protect, employerController.getMyJobs);
router.get('/jobs/company', protect, employerController.getCompanyJobs);
router.put('/jobs/:jobId', protect, validate(jobValidation.update), employerController.updateJob);
router.delete('/jobs/:jobId', protect, employerController.deleteJob);
router.get('/jobs/:jobId/applicants', protect, employerController.getApplicantsForJob);

module.exports = router; 

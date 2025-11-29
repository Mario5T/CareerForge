const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.get('/', jobController.getAllJobs);
router.get('/applications/me', protect, jobController.getMyApplications);
router.get('/:id', jobController.getJobById);

router.post('/:id/apply', protect, jobController.applyToJob);
router.get('/:id/applications', protect, jobController.getMyApplications);
router.patch('/applications/:applicationId', protect, jobController.updateApplicationStatus);

module.exports = router;

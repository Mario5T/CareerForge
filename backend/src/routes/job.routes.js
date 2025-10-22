const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Protected routes
router.use(protect);

// User can apply to jobs
router.post('/:id/apply', jobController.applyToJob);

// Recruiter and Admin routes
router.post('/', authorize('RECRUITER', 'ADMIN'), jobController.createJob);
router.put('/:id', authorize('RECRUITER', 'ADMIN'), jobController.updateJob);
router.delete('/:id', authorize('RECRUITER', 'ADMIN'), jobController.deleteJob);
router.get('/:id/applications', authorize('RECRUITER', 'ADMIN'), jobController.getJobApplications);
router.patch('/applications/:applicationId', authorize('RECRUITER', 'ADMIN'), jobController.updateApplicationStatus);

module.exports = router;

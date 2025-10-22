const jobService = require('../services/job.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Create job
exports.createJob = async (req, res) => {
  try {
    const job = await jobService.createJob({
      ...req.body,
      createdById: req.user.id,
    });
    successResponse(res, 201, 'Job created successfully', job);
  } catch (error) {
    logger.error(`Create job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs(req.query);
    successResponse(res, 200, 'Jobs retrieved successfully', jobs);
  } catch (error) {
    logger.error(`Get jobs error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    successResponse(res, 200, 'Job retrieved successfully', job);
  } catch (error) {
    logger.error(`Get job error: ${error.message}`);
    errorResponse(res, error.statusCode || 404, error.message);
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(
      req.params.id,
      req.body,
      req.user.id
    );
    successResponse(res, 200, 'Job updated successfully', job);
  } catch (error) {
    logger.error(`Update job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id, req.user.id);
    successResponse(res, 200, 'Job deleted successfully');
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Apply to job
exports.applyToJob = async (req, res) => {
  try {
    const application = await jobService.applyToJob(
      req.params.id,
      req.user.id
    );
    successResponse(res, 201, 'Application submitted successfully', application);
  } catch (error) {
    logger.error(`Apply to job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Get applications for a job
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await jobService.getJobApplications(
      req.params.id,
      req.user.id
    );
    successResponse(res, 200, 'Applications retrieved successfully', applications);
  } catch (error) {
    logger.error(`Get applications error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await jobService.updateApplicationStatus(
      req.params.applicationId,
      req.body.status,
      req.user.id
    );
    successResponse(res, 200, 'Application status updated successfully', application);
  } catch (error) {
    logger.error(`Update application status error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

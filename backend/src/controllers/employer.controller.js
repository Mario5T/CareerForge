const employerService = require('../services/employer.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.createCompanyProfile = async (req, res) => {
  try {
    const company = await employerService.createCompanyProfile(req.user.id, req.body);
    successResponse(res, 201, 'Company profile created successfully', company);
  } catch (error) {
    logger.error(`Create company profile error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const company = await employerService.updateCompanyProfile(req.user.id, req.body);
    successResponse(res, 200, 'Company profile updated successfully', company);
  } catch (error) {
    logger.error(`Update company profile error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.getMyCompany = async (req, res) => {
  try {
    const company = await employerService.getMyCompany(req.user.id);
    successResponse(res, 200, 'Company profile retrieved successfully', company);
  } catch (error) {
    logger.error(`Get company error: ${error.message}`);
    errorResponse(res, error.statusCode || 404, error.message);
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await employerService.getMyJobs(req.user.id);
    successResponse(res, 200, 'Employer jobs retrieved successfully', jobs);
  } catch (error) {
    logger.error(`Get employer jobs error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.getApplicantsForJob = async (req, res) => {
  try {
    const applicants = await employerService.getApplicantsForJob(req.params.jobId, req.user.id);
    successResponse(res, 200, 'Applicants retrieved successfully', applicants);
  } catch (error) {
    logger.error(`Get applicants error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await employerService.createJob(req.user.id, req.body);
    successResponse(res, 201, 'Job created successfully', job);
  } catch (error) {
    logger.error(`Create job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await employerService.updateJob(req.params.jobId, req.user.id, req.body);
    successResponse(res, 200, 'Job updated successfully', job);
  } catch (error) {
    logger.error(`Update job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await employerService.deleteJob(req.params.jobId, req.user.id);
    successResponse(res, 200, 'Job deleted successfully');
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await employerService.getCompanyJobs(req.user.id);
    successResponse(res, 200, 'Company jobs retrieved successfully', jobs);
  } catch (error) {
    logger.error(`Get company jobs error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

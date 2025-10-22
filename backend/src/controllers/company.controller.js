const companyService = require('../services/company.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Create company
exports.createCompany = async (req, res) => {
  try {
    const company = await companyService.createCompany({
      ...req.body,
      userId: req.user.id,
    });
    successResponse(res, 201, 'Company created successfully', company);
  } catch (error) {
    logger.error(`Create company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies(req.query);
    successResponse(res, 200, 'Companies retrieved successfully', companies);
  } catch (error) {
    logger.error(`Get companies error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    successResponse(res, 200, 'Company retrieved successfully', company);
  } catch (error) {
    logger.error(`Get company error: ${error.message}`);
    errorResponse(res, error.statusCode || 404, error.message);
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const company = await companyService.updateCompany(
      req.params.id,
      req.body,
      req.user.id
    );
    successResponse(res, 200, 'Company updated successfully', company);
  } catch (error) {
    logger.error(`Update company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    await companyService.deleteCompany(req.params.id, req.user.id);
    successResponse(res, 200, 'Company deleted successfully');
  } catch (error) {
    logger.error(`Delete company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

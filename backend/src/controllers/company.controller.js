const companyService = require('../services/company.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.createCompany = async (req, res) => {
  try {
    const company = await companyService.createCompany({
      ...req.body,
    });
    successResponse(res, 201, 'Company created successfully', company);
  } catch (error) {
    logger.error(`Create company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies(req.query);
    successResponse(res, 200, 'Companies retrieved successfully', companies);
  } catch (error) {
    logger.error(`Get companies error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};
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

exports.addEmployer = async (req, res) => {
  try {
    const employer = await companyService.addEmployerToCompany(
      req.params.id,
      req.body.userId,
      req.body
    );
    successResponse(res, 201, 'Employer added to company successfully', employer);
  } catch (error) {
    logger.error(`Add employer error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.removeEmployer = async (req, res) => {
  try {
    await companyService.removeEmployerFromCompany(req.params.id, req.body.userId);
    successResponse(res, 200, 'Employer removed from company successfully');
  } catch (error) {
    logger.error(`Remove employer error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};
exports.getCompanyEmployers = async (req, res) => {
  try {
    const employers = await companyService.getCompanyEmployers(req.params.id);
    successResponse(res, 200, 'Company employers retrieved successfully', employers);
  } catch (error) {
    logger.error(`Get company employers error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// COMPANY role: Get own company
exports.getMyCompany = async (req, res) => {
  try {
    const company = await companyService.getCompanyByOwnerId(req.user.id);
    
    if (!company) {
      return successResponse(res, 200, 'No company found', { company: null, hasCompany: false });
    }

    const profileCompletion = companyService.getProfileCompletion(company);
    
    successResponse(res, 200, 'Company retrieved successfully', {
      company,
      profileCompletion,
      hasCompany: true,
    });
  } catch (error) {
    logger.error(`Get my company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// COMPANY role: Create own company
exports.createMyCompany = async (req, res) => {
  try {
    // Check if user has COMPANY role
    if (req.user.role !== 'COMPANY') {
      return errorResponse(res, 403, 'Only users with COMPANY role can create a company');
    }

    const company = await companyService.createCompany(req.body, req.user.id);
    const profileCompletion = companyService.getProfileCompletion(company);

    successResponse(res, 201, 'Company created successfully', {
      company,
      profileCompletion,
    });
  } catch (error) {
    logger.error(`Create my company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// COMPANY role: Update own company
exports.updateMyCompany = async (req, res) => {
  try {
    // Check if user has COMPANY role
    if (req.user.role !== 'COMPANY') {
      return errorResponse(res, 403, 'Only users with COMPANY role can update their company');
    }

    const company = await companyService.updateCompanyByOwner(req.user.id, req.body);
    const profileCompletion = companyService.getProfileCompletion(company);

    successResponse(res, 200, 'Company updated successfully', {
      company,
      profileCompletion,
    });
  } catch (error) {
    logger.error(`Update my company error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

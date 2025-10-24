const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Validate request using express-validator
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return errorResponse(
      res,
      400,
      'Validation failed',
      extractedErrors
    );
  }

  next();
};

/**
 * Common validation rules
 */
const { body, param, query } = require('express-validator');

exports.userValidation = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['USER', 'RECRUITER', 'ADMIN'])
      .withMessage('Invalid role'),
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
  ],
};

exports.companyValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Company name is required'),
    body('description').optional().trim(),
    body('website').optional().isURL().withMessage('Invalid URL'),
    body('location').optional().trim(),
    body('logo').optional().trim(),
    body('industry').optional().trim(),
    body('companySize')
      .optional()
      .isIn([
        'SIZE_1_10',
        'SIZE_11_50',
        'SIZE_51_200',
        'SIZE_201_500',
        'SIZE_501_1000',
        'SIZE_1000_PLUS',
      ])
      .withMessage('Invalid company size'),
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('description').optional().trim(),
    body('website').optional().isURL().withMessage('Invalid URL'),
    body('location').optional().trim(),
    body('logo').optional().trim(),
    body('industry').optional().trim(),
    body('companySize')
      .optional()
      .isIn([
        'SIZE_1_10',
        'SIZE_11_50',
        'SIZE_51_200',
        'SIZE_201_500',
        'SIZE_501_1000',
        'SIZE_1000_PLUS',
      ])
      .withMessage('Invalid company size'),
  ],
  addEmployer: [
    body('userId').isUUID().withMessage('Valid user ID is required'),
    body('title').optional().trim(),
    body('department').optional().trim(),
  ],
  removeEmployer: [
    body('userId').isUUID().withMessage('Valid user ID is required'),
  ],
};

exports.employerValidation = {
  createCompanyProfile: [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('companyDescription').optional().trim(),
    body('companyWebsite').optional().isURL().withMessage('Invalid company URL'),
    body('companyLocation').optional().trim(),
    body('companyLogo').optional().trim(),
    body('companyIndustry').optional().trim(),
    body('companySize')
      .optional()
      .isIn([
        'SIZE_1_10',
        'SIZE_11_50',
        'SIZE_51_200',
        'SIZE_201_500',
        'SIZE_501_1000',
        'SIZE_1000_PLUS',
      ])
      .withMessage('Invalid company size'),
    body('title').optional().trim(),
    body('department').optional().trim(),
  ],
  updateCompanyProfile: [
    body('companyName').optional().trim(),
    body('companyDescription').optional().trim(),
    body('companyWebsite').optional().isURL().withMessage('Invalid company URL'),
    body('companyLocation').optional().trim(),
    body('companyLogo').optional().trim(),
    body('companyIndustry').optional().trim(),
    body('companySize')
      .optional()
      .isIn([
        'SIZE_1_10',
        'SIZE_11_50',
        'SIZE_51_200',
        'SIZE_201_500',
        'SIZE_501_1000',
        'SIZE_1000_PLUS',
      ])
      .withMessage('Invalid company size'),
    body('title').optional().trim(),
    body('department').optional().trim(),
  ],
};

exports.jobValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('description').trim().notEmpty().withMessage('Job description is required'),
    body('requirements')
      .optional()
      .isArray()
      .withMessage('Requirements must be an array'),
    body('salaryMin').optional().isInt({ min: 0 }).withMessage('Salary minimum must be positive'),
    body('salaryMax').optional().isInt({ min: 0 }).withMessage('Salary maximum must be positive'),
    body('salaryCurrency').optional().isString(),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('jobType')
      .isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'])
      .withMessage('Invalid job type'),
    body('experienceLevel')
      .isIn(['ENTRY', 'MID', 'SENIOR', 'LEAD'])
      .withMessage('Invalid experience level'),
    body('positions')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Positions must be at least 1'),
  ],
  update: [
    body('title').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Job description cannot be empty'),
    body('requirements')
      .optional()
      .isArray()
      .withMessage('Requirements must be an array'),
    body('salaryMin').optional().isInt({ min: 0 }).withMessage('Salary minimum must be positive'),
    body('salaryMax').optional().isInt({ min: 0 }).withMessage('Salary maximum must be positive'),
    body('salaryCurrency').optional().isString(),
    body('location')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Location cannot be empty'),
    body('jobType')
      .optional()
      .isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'])
      .withMessage('Invalid job type'),
    body('experienceLevel')
      .optional()
      .isIn(['ENTRY', 'MID', 'SENIOR', 'LEAD'])
      .withMessage('Invalid experience level'),
    body('positions')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Positions must be at least 1'),
  ],
  updateApplicationStatus: [
    body('status')
      .isIn(['PENDING', 'ACCEPTED', 'REJECTED'])
      .withMessage('Invalid application status'),
  ],
};

exports.idValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
];

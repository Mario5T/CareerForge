const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Register user
exports.register = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    successResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    errorResponse(res, error.statusCode || 401, error.message);
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    successResponse(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    successResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

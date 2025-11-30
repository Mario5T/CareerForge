const chatbotService = require('../services/chatbot.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.handleMessage = async (req, res) => {
  try {
    console.log('Chatbot message received:', {
      userId: req.user?.id,
      message: req.body?.message?.substring(0, 50),
      hasUser: !!req.user
    });
    
    const userId = req.user.id;
    const { message } = req.body;
    
    if (!message) {
      console.log('No message provided');
      return errorResponse(res, 400, 'Message is required');
    }
    
    console.log('Processing chatbot request...');
    const result = await chatbotService.handleMessage(userId, message);
    console.log('Chatbot response generated:', result?.type);
    
    successResponse(res, 200, 'ok', result);
  } catch (error) {
    console.error('Chatbot handleMessage error:', error);
    logger.error(`Chatbot handleMessage error: ${error.message}`);
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.matchJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await chatbotService.matchJobs(userId, req.query);
    successResponse(res, 200, 'ok', result);
  } catch (error) {
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.jobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const data = await chatbotService.jobDetails(jobId);
    successResponse(res, 200, 'ok', data);
  } catch (error) {
    errorResponse(res, error.statusCode || 404, error.message);
  }
};

exports.userApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await chatbotService.userApplications(userId);
    successResponse(res, 200, 'ok', data);
  } catch (error) {
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

exports.applicationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await chatbotService.applicationStats(userId);
    successResponse(res, 200, 'ok', data);
  } catch (error) {
    errorResponse(res, error.statusCode || 500, error.message);
  }
};

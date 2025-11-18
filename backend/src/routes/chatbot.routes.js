const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { protect } = require('../middlewares/auth.middleware');

// Core chatbot endpoints
router.post('/message', protect, chatbotController.handleMessage);
router.get('/matchJobs', protect, chatbotController.matchJobs);
router.get('/jobDetails/:jobId', chatbotController.jobDetails);
router.get('/userApplications', protect, chatbotController.userApplications);
router.get('/applicationStats', protect, chatbotController.applicationStats);

module.exports = router;

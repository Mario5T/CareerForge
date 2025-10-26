const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

// Google OAuth routes
router.get('/google',
  authController.googleLogin
);

router.get('/google/callback',
  authController.googleCallback
);

// Auth status routes
router.get('/me', authController.getCurrentUser);
router.get('/status', authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;

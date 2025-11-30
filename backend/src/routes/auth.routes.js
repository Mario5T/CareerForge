const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const passport = require('passport');
router.get('/google',
  authController.googleLogin
);

router.get('/google/callback',
  authController.googleCallback
);
router.get('/me', protect, authController.getCurrentUser);
router.get('/status', authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;

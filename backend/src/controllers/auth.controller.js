const passport = require('passport');
const oauthService = require('../services/oauth.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.googleLogin = (req, res, next) => {
  try {
    if (req.query.returnUrl) {
      req.session.returnUrl = req.query.returnUrl;
    }

    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  } catch (error) {
    logger.error(`Google login initiation error: ${error.message}`);
    errorResponse(res, 500, 'Failed to initiate Google login');
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    passport.authenticate('google', async (err, user, info) => {
      if (err) {
        logger.error(`Google OAuth error: ${err.message}`);
        return errorResponse(res, 500, 'Authentication failed');
      }

      if (!user) {
        logger.error('Google OAuth: No user returned');
        return errorResponse(res, 401, 'Authentication failed');
      }

      try {
        const result = await oauthService.handleOAuthCallback(user);
        const { FRONTEND_URL } = require('../config/env');
        // Ensure we have a valid frontend URL with protocol
        const baseUrl = FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = req.session.returnUrl || `${baseUrl}/auth/callback`;
        
        // Ensure the redirect URL is properly formed
        const finalRedirectUrl = new URL(redirectUrl, baseUrl).toString();

        if (req.session.returnUrl) {
          delete req.session.returnUrl;
        }

        return res.redirect(`${finalRedirectUrl}?token=${result.token}&success=true`);
      } catch (serviceError) {
        logger.error(`OAuth callback service error: ${serviceError.message}`);
        errorResponse(res, 500, 'Failed to complete authentication');
      }
    })(req, res, next);
  } catch (error) {
    logger.error(`Google callback error: ${error.message}`);
    errorResponse(res, 500, 'Authentication failed');
  }
};

exports.getCurrentUser = (req, res) => {
  try {
    if (req.user) {
      successResponse(res, 200, 'User authenticated', {
        user: req.user,
      });
    } else {
      errorResponse(res, 401, 'Not authenticated');
    }
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    errorResponse(res, 500, 'Failed to get user info');
  }
};


exports.logout = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        logger.error(`Logout error: ${err.message}`);
        return errorResponse(res, 500, 'Logout failed');
      }

      req.session.destroy((err) => {
        if (err) {
          logger.error(`Session destroy error: ${err.message}`);
          return errorResponse(res, 500, 'Logout failed');
        }

        res.clearCookie('connect.sid');
        successResponse(res, 200, 'Logout successful');
      });
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    errorResponse(res, 500, 'Logout failed');
  }
};

exports.checkAuth = (req, res) => {
  try {
    if (req.user) {
      successResponse(res, 200, 'Authenticated', {
        authenticated: true,
        user: req.user,
      });
    } else {
      successResponse(res, 200, 'Not authenticated', {
        authenticated: false,
      });
    }
  } catch (error) {
    logger.error(`Check auth error: ${error.message}`);
    errorResponse(res, 500, 'Failed to check authentication status');
  }
};

const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { JWT_SECRET } = require('../config/env');
const { AppError } = require('../utils/errorHandler');

exports.protect = async (req, res, next) => {
  try {
    let token;
    let user;

    if (req.user) {
      user = req.user;
    } else {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            bio: true,
            skills: true,
            resume: true,
            resumeOriginalName: true,
            profilePhoto: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        return next(new AppError('Not authorized to access this route', 401));
      }
    }

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize specific roles
 * @param  {...any} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

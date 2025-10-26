const { prisma } = require('../config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { AppError } = require('../utils/errorHandler');

/**
 * Generate JWT token for OAuth user
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

/**
 * Find or create user from OAuth profile
 */
exports.findOrCreateOAuthUser = async (profile) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new AppError('Email not provided by OAuth provider', 400);
    }

    // Check if user exists with this OAuth provider ID
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    if (user) {
      // Update user with latest profile info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: profile.displayName || user.name,
          avatar: profile.photos?.[0]?.value || user.avatar,
          updatedAt: new Date(),
        },
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
      return user;
    }

    // Check if user exists with this email (for linking accounts)
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Link OAuth account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          provider: 'google',
          name: profile.displayName || user.name,
          avatar: profile.photos?.[0]?.value || user.avatar,
        },
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
      return user;
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        name: profile.displayName,
        email,
        googleId: profile.id,
        provider: 'google',
        avatar: profile.photos?.[0]?.value,
        role: 'USER',
        isActive: true,
      },
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

    return user;
  } catch (error) {
    console.error('OAuth user creation error:', error);
    throw error;
  }
};

/**
 * Get OAuth login URL
 */
exports.getGoogleAuthURL = () => {
  // This would typically return the URL for frontend to redirect to
  // For now, we'll handle the full OAuth flow on the backend
  return '/api/auth/google';
};

/**
 * Handle OAuth callback and generate tokens
 */
exports.handleOAuthCallback = async (user) => {
  try {
    const token = this.generateToken(user);
    return {
      user,
      token,
      isNewUser: user.createdAt.getTime() > Date.now() - 60000, // User created within last minute
    };
  } catch (error) {
    console.error('OAuth callback handling error:', error);
    throw error;
  }
};

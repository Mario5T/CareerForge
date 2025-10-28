const { prisma } = require('../config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { AppError } = require('../utils/errorHandler');

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};


exports.findOrCreateOAuthUser = async (profile) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new AppError('Email not provided by OAuth provider', 400);
    }
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    if (user) {
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

    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
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

exports.getGoogleAuthURL = () => {
  return '/api/auth/google';
};


exports.handleOAuthCallback = async (user) => {
  try {
    const token = this.generateToken(user);
    return {
      user,
      token,
      isNewUser: user.createdAt.getTime() > Date.now() - 60000, 
    };
  } catch (error) {
    console.error('OAuth callback handling error:', error);
    throw error;
  }
};

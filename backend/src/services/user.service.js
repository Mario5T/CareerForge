const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { AppError } = require('../utils/errorHandler');

// Create user (supports both regular and OAuth users)
exports.createUser = async (userData) => {
  const { email, password, name, role, phone, googleId, provider, avatar } = userData;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // For OAuth users, password is optional
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
      phone,
      googleId,
      provider: provider || (googleId ? 'google' : 'local'),
      avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  return { user, token };
};

// Login user (supports both regular and OAuth users)
exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user with password
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if this is an OAuth user (no password login allowed)
  if (user.provider && user.provider !== 'local') {
    throw new AppError('Please login using your OAuth provider', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

// OAuth-specific helper functions

// Find or create OAuth user
exports.findOrCreateOAuthUser = async (profile) => {
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
};

// Generate token for OAuth user
exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Get user by OAuth ID
exports.getUserByGoogleId = async (googleId) => {
  const user = await prisma.user.findUnique({
    where: { googleId },
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

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// Get user by ID
exports.getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// Update user
exports.updateUser = async (userId, updateData) => {
  const { password, email, role, ...allowedUpdates } = updateData;

  // If password is being updated, hash it
  if (password) {
    allowedUpdates.password = await bcrypt.hash(password, 12);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: allowedUpdates,
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
      updatedAt: true,
    },
  });

  return user;
};

// Delete user
exports.deleteUser = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

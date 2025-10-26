require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Default backend port (override by setting PORT env var if needed)
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/careerforge',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',

  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
};

require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/careerforge',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/v1/auth/google/callback',

  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_API_KEYS: [
    process.env.GROQ_API_KEY,
    ...Object.entries(process.env)
      .filter(([key]) => key.startsWith('GROQ_API_KEY_'))
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([_, value]) => value)
  ].filter(Boolean),
};



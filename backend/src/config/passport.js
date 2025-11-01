const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('./db');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('./env');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('./env');

// Check OAuth envs; if missing, warn and continue without registering the strategy
const OAUTH_ENABLED = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
if (!OAUTH_ENABLED) {
  console.warn('\n[OAuth] Google OAuth is disabled: `GOOGLE_CLIENT_ID` and/or `GOOGLE_CLIENT_SECRET` not set.');
  console.warn('Add them to backend/.env (see backend/OAUTH_SETUP.md). The rest of the API will still run.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (OAUTH_ENABLED) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID
          let existingUser = await prisma.user.findUnique({
            where: { googleId: profile.id },
          });

          if (existingUser) {
            // Update user with latest profile info if needed
            const updatedUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: profile.displayName || existingUser.name,
                avatar: profile.photos?.[0]?.value || existingUser.avatar,
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
            return done(null, updatedUser);
          }

          // Check if user exists with this email (for linking accounts)
          existingUser = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value },
          });

          if (existingUser) {
            // Link Google account to existing user
            const updatedUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: profile.id,
                provider: 'google',
                name: profile.displayName || existingUser.name,
                avatar: profile.photos?.[0]?.value || existingUser.avatar,
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
            return done(null, updatedUser);
          }

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
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

          return done(null, newUser);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;

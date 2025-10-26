# Google OAuth Setup Guide

This guide explains how to set up Google OAuth for the CareerForge application.

## Prerequisites

1. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API (or Google People API)
   - Go to "Credentials" in the left sidebar
   - Create credentials > OAuth 2.0 Client IDs
   - Set application type to "Web application"
   - Add authorized origins: `http://localhost:3000` (for development)
   - Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Google OAuth credentials:

   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

   # Session Configuration
   SESSION_SECRET=your-session-secret-change-in-production
   ```

## API Endpoints

### Authentication Routes

#### 1. Google OAuth Login
```http
GET /api/auth/google
```

Initiates Google OAuth login flow. Redirects user to Google for authentication.

**Query Parameters:**
- `returnUrl` (optional): URL to redirect back to after successful authentication

#### 2. Google OAuth Callback
```http
GET /api/auth/google/callback
```

Handles the OAuth callback from Google. Returns user information and JWT token.

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "USER",
      "avatar": "https://profile-photo-url",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here",
    "isNewUser": false
  }
}
```

#### 3. Get Current User
```http
GET /api/auth/me
```

Returns current authenticated user information.

#### 4. Check Authentication Status
```http
GET /api/auth/status
```

Returns authentication status.

**Response:**
```json
{
  "success": true,
  "message": "Authenticated",
  "data": {
    "authenticated": true,
    "user": { ... }
  }
}
```

#### 5. Logout
```http
POST /api/auth/logout
```

Logs out the current user and destroys the session.

## Frontend Integration

### React Example

```javascript
// Login with Google
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google?returnUrl=' + window.location.origin;
};

// After successful login, extract token from URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const success = urlParams.get('success');

  if (token && success) {
    // Store token in localStorage or state management
    localStorage.setItem('token', token);

    // Remove query parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

### Protected Route Example

```javascript
// Check authentication status
const checkAuth = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/status', {
      credentials: 'include'
    });
    const data = await response.json();
    return data.data.authenticated;
  } catch (error) {
    return false;
  }
};
```

## User Flow

1. **New User:**
   - User clicks "Login with Google"
   - Redirected to Google OAuth
   - Google authenticates user
   - Callback creates new user in database
   - Returns user info and JWT token

2. **Existing User:**
   - User clicks "Login with Google"
   - Redirected to Google OAuth
   - Google authenticates user
   - Callback finds existing user
   - Updates profile info if needed
   - Returns user info and JWT token

3. **Account Linking:**
   - If user exists with email but no OAuth
   - OAuth callback links Google account to existing user
   - User can now login with either method

## Security Features

- **Session Management:** Express sessions with secure cookies
- **CORS Protection:** Configured for frontend domain only
- **JWT Tokens:** Secure token-based authentication
- **OAuth Security:** Standard OAuth 2.0 flow with Google

## Development vs Production

- **Development:** HTTP, localhost URLs
- **Production:** HTTPS, secure session cookies, production Google OAuth settings

## Troubleshooting

1. **Callback URL Issues:**
   - Ensure callback URL matches exactly in Google Console
   - Include protocol (http/https)

2. **CORS Issues:**
   - Check CORS_ORIGIN environment variable
   - Ensure credentials: true in requests

3. **Session Issues:**
   - Verify SESSION_SECRET is set
   - Check cookie domain settings

## Database Schema

The User model now includes:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String?  // Optional for OAuth users
  googleId  String?  @unique
  provider  String?  // 'google', 'local', etc.
  avatar    String?  // Profile picture from OAuth
  // ... other fields
}
```

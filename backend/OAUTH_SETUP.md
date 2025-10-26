# OAuth Setup Instructions

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API or Google People API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized origins: `http://localhost:3000`
7. Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy the Client ID and Client Secret

## 2. Environment Configuration

1. Copy `.env.example` to `.env` in the backend directory
2. Fill in your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-secure-session-secret
```

## 3. Database Migration

The OAuth fields have already been added to the database schema. The migration ran successfully.

## 4. Install Dependencies

All OAuth dependencies have been installed:
- passport
- passport-google-oauth20
- express-session

## 5. Start the Server

```bash
cd backend
npm run dev
```

## 6. Frontend Integration

### Login Button
```javascript
// Add Google login button to your frontend
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};
```

### Handle Callback
```javascript
// After successful login, extract token from URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    localStorage.setItem('token', token);
    // Redirect to dashboard or remove query params
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

### Protected Routes
```javascript
// Check auth status
const checkAuth = async () => {
  const response = await fetch('http://localhost:5000/api/auth/status', {
    credentials: 'include'
  });
  const data = await response.json();
  return data.data.authenticated;
};
```

## Available Endpoints

- `GET /api/auth/google` - Initiate Google login
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `GET /api/auth/status` - Check auth status
- `POST /api/auth/logout` - Logout

## User Registration Flow

1. **New User**: OAuth creates new user account automatically
2. **Existing Email**: Links Google account to existing user
3. **Existing OAuth**: Updates profile info and logs in

The implementation supports both traditional email/password and Google OAuth authentication methods.

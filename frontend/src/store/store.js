import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/checkAuth/fulfilled'],
      },
    }),
});

export default store;

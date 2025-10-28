import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, selectIsAuthenticated, selectAuthLoading } from '../store/slices/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  return {
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;

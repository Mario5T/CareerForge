import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, selectCurrentUser } from '../store/slices/auth/authSlice';

export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(selectCurrentUser);

  return {
    isAuthenticated,
    isLoading,
    user,
  };
};

export default useAuth;

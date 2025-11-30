import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/auth/authSlice';
import { useToast } from '../../components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const location = useLocation();
    
    useEffect(() => {
        const handleAuth = async () => {
            try {
                console.log('OAuth callback received:', location.search);
                
                const token = searchParams.get('token');
                const success = searchParams.get('success');
                const error = searchParams.get('error');
                // Make sure this matches your backend URL exactly
                const API_URL = import.meta.env.VITE_API_URL || 'https://careerforge-production.up.railway.app';

                console.log('OAuth callback params:', { token, success, error });

                if (error) {
                    throw new Error(error || 'Authentication failed');
                }

                if (success === 'true' && token) {
                    console.log('Processing OAuth callback with token');
                    localStorage.setItem('token', token);

                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });

                    console.log('Auth me response status:', response.status);
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Failed to fetch user data');
                    }

                    const data = await response.json();
                    console.log('User data received:', data);

                    if (data.success && data.data?.user) {
                        dispatch(setCredentials({ user: data.data.user, token }));
                        toast({
                            title: 'Success',
                            description: 'You have successfully logged in!',
                        });
                        navigate('/', { replace: true });
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } else {
                    throw new Error('Missing token or success parameter');
                }
            } catch (error) {
                console.error('OAuth error:', error);
                localStorage.removeItem('token');
                
                toast({
                    title: 'Authentication Failed',
                    description: error.message || 'Failed to authenticate with Google',
                    variant: 'destructive',
                });
                
                navigate('/login', { replace: true });
            }
        };

        handleAuth();
    }, [dispatch, location.search, navigate, searchParams, toast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4">
                <Loader2 className="h-full w-full text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">Processing your login...</h2>
            <p className="text-muted-foreground text-center">You'll be redirected shortly</p>
        </div>
    );
};

export default OAuthCallback;

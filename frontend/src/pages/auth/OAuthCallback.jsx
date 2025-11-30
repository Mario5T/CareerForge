import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/auth/authSlice';
import { useToast } from '../../components/ui/use-toast';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    useEffect(() => {
        const token = searchParams.get('token');
        const success = searchParams.get('success');

        if (success === 'true' && token) {
            // Store token in localStorage
            localStorage.setItem('token', token);

            // Fetch user data with the token
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data.user) {
                        // Update Redux state
                        dispatch(setCredentials({ user: data.data.user, token }));

                        toast({
                            title: 'Success',
                            description: 'You have successfully logged in!',
                            variant: 'default',
                        });

                        // Redirect to homepage
                        navigate('/', { replace: true });
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                })
                .catch((error) => {
                    console.error('OAuth callback error:', error);
                    localStorage.removeItem('token');

                    toast({
                        title: 'Error',
                        description: 'Authentication failed. Please try again.',
                        variant: 'destructive',
                    });

                    navigate('/auth/login', { replace: true });
                });
        } else {
            toast({
                title: 'Error',
                description: 'Authentication failed. Please try again.',
                variant: 'destructive',
            });

            navigate('/auth/login', { replace: true });
        }
    }, [searchParams, navigate, dispatch, toast]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg font-medium">Completing sign in...</p>
            </div>
        </div>
    );
};

export default OAuthCallback;

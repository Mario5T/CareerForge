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
        try {
            const token = searchParams.get('token');
            const success = searchParams.get('success');
            const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001/api/v1';

            if (success === 'true' && token) {
                localStorage.setItem('token', token);

                fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success && data.data.user) {
                            dispatch(setCredentials({ user: data.data.user, token }));

                            toast({
                                title: 'Success',
                                description: 'You have successfully logged in!',
                            });

                            navigate('/', { replace: true });
                        } else {
                            throw new Error('Failed to fetch user');
                        }
                    })
                    .catch((err) => {
                        console.error('OAuth callback error:', err);
                        localStorage.removeItem('token');

                        toast({
                            title: 'Error',
                            description: 'Authentication failed',
                            variant: 'destructive',
                        });

                        navigate('/auth/login', { replace: true });
                    });
            } else {
                navigate('/auth/login', { replace: true });
            }
        } catch (err) {
            console.error('Fatal OAuth error:', err);
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

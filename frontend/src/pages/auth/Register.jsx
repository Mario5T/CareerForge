import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/auth/authSlice';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(register({ name, email, password, role })).unwrap();
      toast({
        title: 'Success',
        description: 'Registration successful! Welcome to CareerForge.',
        variant: 'default',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error || 'Failed to register. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="space-y-3">
          <Label>Account Type</Label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              role === 'USER' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="role"
                value="USER"
                checked={role === 'USER'}
                onChange={handleChange}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-[#6A38C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-semibold text-sm">Job Seeker</span>
              <span className="text-xs text-gray-500 text-center">Find & apply to jobs</span>
            </label>
            <label className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              role === 'RECRUITER' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="role"
                value="RECRUITER"
                checked={role === 'RECRUITER'}
                onChange={handleChange}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-[#6A38C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-sm">Recruiter</span>
              <span className="text-xs text-gray-500 text-center">Post jobs for hire</span>
            </label>
            <label className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              role === 'COMPANY' ? 'border-[#6A38C2] bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="role"
                value="COMPANY"
                checked={role === 'COMPANY'}
                onChange={handleChange}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-[#6A38C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-semibold text-sm">Company</span>
              <span className="text-xs text-gray-500 text-center">Manage recruiters</span>
            </label>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => window.location.href = 'http://localhost:5001/api/v1/auth/google'}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.3 3.9 41.4z"
          />
        </svg>
        Continue with Google
      </Button>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;

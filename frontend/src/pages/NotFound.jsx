import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';
import Footer from '../components/shared/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@careerforge.com" className="flex items-center gap-2">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;

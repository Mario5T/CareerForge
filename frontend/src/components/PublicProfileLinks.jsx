import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Users, Building2, ExternalLink } from 'lucide-react';

const PublicProfileLinks = () => {
  const exampleProfiles = {
    user: {
      id: 'user123',
      name: 'John Doe',
      headline: 'Full Stack Developer',
      avatar: User
    },
    recruiter: {
      id: 'recruiter456',
      name: 'Sarah Smith',
      title: 'Senior Technical Recruiter',
      company: 'Tech Corp',
      avatar: Users
    },
    company: {
      id: 'company789',
      name: 'Tech Innovations Inc',
      industry: 'Software Development',
      avatar: Building2
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Public Profile Navigation Examples</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Below are examples of how to navigate to different types of public profiles:
          </p>

          {/* User Profile Example */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{exampleProfiles.user.name}</h4>
                  <p className="text-sm text-muted-foreground">{exampleProfiles.user.headline}</p>
                  <Badge variant="outline" className="mt-1">User Profile</Badge>
                </div>
              </div>
              <Button asChild>
                <Link to={`/public/user/${exampleProfiles.user.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Recruiter Profile Example */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{exampleProfiles.recruiter.name}</h4>
                  <p className="text-sm text-muted-foreground">{exampleProfiles.recruiter.title}</p>
                  <p className="text-xs text-muted-foreground">{exampleProfiles.recruiter.company}</p>
                  <Badge variant="outline" className="mt-1">Recruiter Profile</Badge>
                </div>
              </div>
              <Button asChild>
                <Link to={`/public/recruiter/${exampleProfiles.recruiter.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Company Profile Example */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{exampleProfiles.company.name}</h4>
                  <p className="text-sm text-muted-foreground">{exampleProfiles.company.industry}</p>
                  <Badge variant="outline" className="mt-1">Company Profile</Badge>
                </div>
              </div>
              <Button asChild>
                <Link to={`/public/company/${exampleProfiles.company.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">In JSX Components:</h4>
            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
              <p>{`<Link to="/public/user/123">View User Profile</Link>`}</p>
              <p>{`<Link to="/public/recruiter/456">View Recruiter Profile</Link>`}</p>
              <p>{`<Link to="/public/company/789">View Company Profile</Link>`}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Programmatic Navigation:</h4>
            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
              <p>{`navigate('/public/user/123')`}</p>
              <p>{`navigate('/public/recruiter/456')`}</p>
              <p>{`navigate('/public/company/789')`}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Dynamic with Variables:</h4>
            <div className="bg-muted p-3 rounded-lg text-sm font-mono">
              <p>{`const profileId = user.id;`}</p>
              <p>{`<Link to={\`/public/user/\${profileId}\`}>View Profile</Link>`}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfileLinks;

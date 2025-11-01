import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Users, Briefcase, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { selectCurrentUser } from '../store/slices/auth/authSlice';

const Home = () => {
  const user = useSelector(selectCurrentUser);

  // Company Dashboard View
  if (user?.role === 'COMPANY') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your company</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Jobs currently open</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recruiters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Profile complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these essential tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild className="h-auto py-4 flex flex-col items-center gap-2">
                <Link to="/company/profile">
                  <Building2 className="h-6 w-6" />
                  <span>Complete Company Profile</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Link to="/company/jobs">
                  <Briefcase className="h-6 w-6" />
                  <span>Post a Job</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Link to="/company/recruiters">
                  <Users className="h-6 w-6" />
                  <span>Manage Recruiters</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Setup Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
            <CardDescription>Complete these steps to get the most out of CareerForge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">Create your account</p>
                  <p className="text-sm text-gray-600">You're all set!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">Complete company profile</p>
                  <p className="text-sm text-gray-600">Add your company details and logo</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/company/profile">Complete</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">Post your first job</p>
                  <p className="text-sm text-gray-600">Start attracting top talent</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/company/jobs">Post Job</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">Invite recruiters</p>
                  <p className="text-sm text-gray-600">Add team members to help with hiring</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/company/recruiters">Invite</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Regular Home Page for non-company users
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Find Your Dream Job or Top Talent
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Connect with the best opportunities and candidates in the tech industry.
          Whether you're looking for your next career move or your next hire,
          we've got you covered.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild>
            <Link to="/jobs">Find Jobs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/employer/post-job">Post a Job</Link>
          </Button>
        </div>
      </div>
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg">Frontend Developer</h3>
            <p className="text-gray-600 mt-1">TechCorp • New York, NY</p>
            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
              We're looking for an experienced Frontend Developer to join our team...
            </p>
            <Button variant="link" className="mt-4 p-0 h-auto">
              View Details
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Create a Profile',
              description: 'Sign up and create your professional profile in minutes.'
            },
            {
              title: 'Find Opportunities',
              description: 'Browse through thousands of job listings or candidates.'
            },
            {
              title: 'Apply or Hire',
              description: 'Apply to jobs with one click or post your own job listing.'
            }
          ].map((step, index) => (
            <div key={index} className="text-center p-6 border rounded-lg">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="font-medium text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

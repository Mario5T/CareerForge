import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Users, Briefcase, TrendingUp, CheckCircle2, AlertCircle, MapPin, DollarSign, Edit2, Award, BookOpen } from 'lucide-react';
import { selectCurrentUser } from '../store/slices/auth/authSlice';
import companyService from '../services/company.service';
import api from '../services/api';

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/v1/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        // Get first 6 jobs for featured section
        setFeaturedJobs((data.data || []).slice(0, 6));
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
        setError('Failed to load featured jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // Fetch user profile if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id && user?.role === 'USER') {
        setLoadingProfile(true);
        try {
          const response = await api.get('/users/profile');
          setUserProfile(response.data);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id, user?.role]);

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `From ${formatter.format(min)}`;
    return `Up to ${formatter.format(max)}`;
  };

  const [companyStats, setCompanyStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    recruiters: 0,
    profileCompletion: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role !== 'COMPANY') return;

      try {
        const response = await companyService.getMyCompany();

        if (!response.data?.hasCompany || !response.data.company) {
          setCompanyStats((prev) => ({ ...prev, loading: false }));
          return;
        }

        const company = response.data.company;
        const jobs = company.jobs || [];
        const employers = company.employers || [];

        const activeJobs = jobs.filter((job) => job.isActive !== false).length;
        const totalApplications = jobs.reduce(
          (sum, job) => sum + (job.applications ? job.applications.length : 0),
          0
        );

        const recruiters = employers.length;
        const profileCompletion = response.data.profileCompletion?.percentage || 0;

        setCompanyStats({
          activeJobs,
          totalApplications,
          recruiters,
          profileCompletion,
          loading: false,
        });
      } catch {
        setCompanyStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    const handleCompanyDataUpdated = () => {
      fetchStats();
    };

    window.addEventListener('companyDataUpdated', handleCompanyDataUpdated);

    return () => {
      window.removeEventListener('companyDataUpdated', handleCompanyDataUpdated);
    };
  }, [user?.role, user?.id]);

  // Company Dashboard View
  if (user?.role === 'COMPANY') {
    const { activeJobs, totalApplications, recruiters, profileCompletion } = companyStats;
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
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">Jobs currently open</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recruiters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recruiters}</div>
              <p className="text-xs text-muted-foreground">Team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileCompletion}%</div>
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
        
        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for jobs, companies, or skills..."
              className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Button asChild>
            <Link to="/jobs">Find Jobs</Link>
          </Button>
          {(!user || user?.role === 'COMPANY' || user?.role === 'EMPLOYER') && (
            <Button variant="outline" asChild>
              <Link to="/employer/post-job">Post a Job</Link>
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card - Only for logged in USER role */}
      {user?.role === 'USER' && userProfile && (
        <section className="mt-16 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left side - Profile info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{userProfile.name || 'User'}</h3>
                      <p className="text-slate-600">{userProfile.email}</p>
                      {userProfile.location && (
                        <div className="flex items-center gap-1 text-slate-600 text-sm mt-1">
                          <MapPin className="h-4 w-4" />
                          {userProfile.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {userProfile.bio && (
                    <p className="text-slate-700 text-sm mb-4 line-clamp-2">{userProfile.bio}</p>
                  )}

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {userProfile.skills && userProfile.skills.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-slate-700"><strong>{userProfile.skills.length}</strong> Skills</span>
                      </div>
                    )}
                    {userProfile.experience && userProfile.experience.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span className="text-slate-700"><strong>{userProfile.experience.length}</strong> Experience</span>
                      </div>
                    )}
                    {userProfile.education && userProfile.education.length > 0 && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-slate-700"><strong>{userProfile.education.length}</strong> Education</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Skills preview and action button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  {/* Skills preview */}
                  {userProfile.skills && userProfile.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Top Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white text-blue-700 text-xs font-medium rounded-full border border-blue-200 shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {userProfile.skills.length > 3 && (
                          <span className="px-3 py-1 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                            +{userProfile.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit Profile Button */}
                  <Button asChild className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                    <Link to="/profile" className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Jobs</h2>
          <Link to="/jobs" className="text-blue-600 hover:underline">View all jobs →</Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.id}`}
                  className="block border rounded-lg p-6 hover:shadow-md transition-shadow hover:border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600 mt-1">
                        {job.company?.name || 'Company'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="capitalize">{job.jobType.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {job.experienceLevel}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No featured jobs available at the moment.</p>
              </div>
            )}
          </div>
        )}
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

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Building2, Users, Briefcase, TrendingUp, CheckCircle2, AlertCircle, MapPin, DollarSign, Edit2, Award, BookOpen, ArrowRight } from 'lucide-react';
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
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
 

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.get('/jobs');
        const data = response.data;
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

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (user?.id && user?.role === 'USER' && userProfile?.skills && userProfile.skills.length > 0) {
        setLoadingRecommended(true);
        try {
          const response = await api.get('/jobs');
          const data = response.data;
          
          const jobsWithMatch = (data.data || []).map(job => ({
            ...job,
            matchScore: calculateSkillMatch(userProfile.skills, job.requirements || [], job.description || '')
          }));
          
          const recommended = jobsWithMatch
            .filter(job => job.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 6);
          
          setRecommendedJobs(recommended);
        } catch (err) {
          console.error('Error fetching recommended jobs:', err);
        } finally {
          setLoadingRecommended(false);
        }
      }
    };

    fetchRecommendedJobs();
  }, [user?.id, user?.role, userProfile?.skills]);

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

  const calculateSkillMatch = (userSkills = [], jobRequirements = [], jobDescription = '') => {
    if (!userSkills || userSkills.length === 0) return 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const jobReqsLower = jobRequirements.map(r => r.toLowerCase());
    const descriptionLower = jobDescription.toLowerCase();
    
    let matches = 0;
    userSkillsLower.forEach(skill => {
      if (jobReqsLower.some(req => req.includes(skill) || skill.includes(req))) {
        matches++;
      }
      else if (descriptionLower.includes(skill)) {
        matches++;
      }
    });
    
    return Math.round((matches / userSkills.length) * 100);
  };

  const [companyStats, setCompanyStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    recruiters: 0,
    profileCompletion: 0,
    loading: true,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

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

        // Set recent jobs from company data
        const sortedJobs = jobs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentJobs(sortedJobs);
        setJobsLoading(false);
      } catch {
        setCompanyStats((prev) => ({ ...prev, loading: false }));
        setJobsLoading(false);
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

  if (user?.role === 'COMPANY') {
    const { activeJobs, totalApplications, recruiters, profileCompletion } = companyStats;
    const isProfileComplete = profileCompletion >= 100;
    
    return (
      <div className="min-h-screen bg-gray-50/50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white pb-20 pt-10 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              Company Dashboard <Building2 className="h-6 w-6 text-yellow-300" />
            </h1>
            <p className="text-blue-100 text-lg">
              Welcome back! Manage your company and recruitment team.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 pb-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900">{activeJobs}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Currently hiring</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Applications</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalApplications}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span>Across all listings</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Recruiters</p>
                    <h3 className="text-3xl font-bold text-gray-900">{recruiters}</h3>
                  </div>
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span>Team members</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Profile Status</p>
                    <h3 className="text-3xl font-bold text-gray-900">{profileCompletion}%</h3>
                  </div>
                  <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isProfileComplete ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-4 flex items-center text-xs font-medium ${isProfileComplete ? 'text-green-600' : 'text-orange-600'}`}>
                  <span>{isProfileComplete ? 'Complete!' : 'In progress'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/company/profile"
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group block"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Company Profile</h3>
                    <p className="text-sm text-muted-foreground mt-1">Update your company information</p>
                  </Link>

                  <Link
                    to="/company/recruiters"
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group block"
                  >
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Manage Recruiters</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add or remove team members</p>
                  </Link>

                  <Link
                    to="/company/jobs"
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group block"
                  >
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">View Jobs</h3>
                    <p className="text-sm text-muted-foreground mt-1">See all active job postings</p>
                  </Link>

                  <Link
                    to="/company/applications"
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group block"
                  >
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Applications</h3>
                    <p className="text-sm text-muted-foreground mt-1">Review candidate applications</p>
                  </Link>
                </div>
              </section>

              {/* Recent Jobs */}
              <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
                  <div>
                    <CardTitle className="text-lg">Recent Job Postings</CardTitle>
                    <CardDescription>Your latest recruitment activities</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link to="/company/jobs">View All Jobs <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {jobsLoading ? (
                    <div className="p-6 space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                          <div className="h-12 w-12 bg-gray-100 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900">No jobs posted yet</h3>
                      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                        Your recruiters can post job opportunities to find great talent.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentJobs.map((job) => (
                        <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                              {job.title.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                                <span className="flex items-center gap-1">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <div className="text-sm font-medium text-gray-900">{job._count?.applications || job.applications?.length || 0}</div>
                              <div className="text-xs text-muted-foreground">Applicants</div>
                            </div>
                            <Badge variant={job.isActive ? 'default' : 'secondary'} className={job.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : ''}>
                              {job.isActive ? 'Active' : 'Closed'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Setup Checklist - Conditionally Rendered */}
              {!isProfileComplete && (
                <Card className="border-orange-200 bg-orange-50/50 shadow-sm mb-8">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-orange-900">Setup Checklist</CardTitle>
                      <span className="text-xs font-medium text-orange-600 bg-white px-2 py-1 rounded-full border border-orange-200">
                        {profileCompletion}% Complete
                      </span>
                    </div>
                    <CardDescription className="text-orange-700/80">Complete these steps to maximize your reach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">Create your account</p>
                          <p className="text-xs text-muted-foreground">You're all set!</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                        {isProfileComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">Complete company profile</p>
                          {!isProfileComplete && (
                            <>
                              <p className="text-xs text-orange-600 mt-1">
                                {profileCompletion}% complete
                              </p>
                              <Button asChild size="sm" variant="outline" className="mt-2 w-full h-8 text-xs bg-white hover:bg-orange-50 border-orange-200 text-orange-700">
                                <Link to="/company/profile">Complete Profile</Link>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 rounded-lg bg-white/50">
                        {recruiters > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">Invite recruiters</p>
                          {recruiters === 0 && (
                            <Button asChild size="sm" variant="outline" className="mt-2 w-full h-8 text-xs bg-white hover:bg-orange-50 border-orange-200 text-orange-700">
                              <Link to="/company/recruiters">Invite Team</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Company Tips */}
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Company Tips</CardTitle>
                  <CardDescription className="text-blue-700/80">Maximize your hiring success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-medium text-sm text-blue-900">Complete Your Profile</h4>
                      <p className="text-xs text-blue-700/70 mt-1">A complete profile attracts better candidates.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-medium text-sm text-blue-900">Build Your Team</h4>
                      <p className="text-xs text-blue-700/70 mt-1">Invite recruiters to help manage hiring.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-medium text-sm text-blue-900">Monitor Activity</h4>
                      <p className="text-xs text-blue-700/70 mt-1">Track applications and team performance.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0 duration-300">
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
          {!user || user?.role === 'USER' ? (
            <Button asChild>
              <Link to="/jobs">Find Jobs</Link>
            </Button>
          ) : null}
          {(!user || user?.role === 'RECRUITER') && (
            <Button variant="outline" asChild>
              <Link to="/employer/post-job">Post a Job</Link>
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card - Only for logged in USER role */}
      {user?.role === 'USER' && userProfile && (
        <section className="mt-16 mb-12 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow !bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left side - Profile info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{userProfile.name || 'User'}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{userProfile.email}</p>
                      {userProfile.location && (
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm mt-1">
                          <MapPin className="h-4 w-4" />
                          {userProfile.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {userProfile.bio && (
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 line-clamp-2">{userProfile.bio}</p>
                  )}

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {userProfile.skills && userProfile.skills.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300"><strong>{userProfile.skills.length}</strong> Skills</span>
                      </div>
                    )}
                    {userProfile.experience && userProfile.experience.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300"><strong>{userProfile.experience.length}</strong> Experience</span>
                      </div>
                    )}
                    {userProfile.education && userProfile.education.length > 0 && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300"><strong>{userProfile.education.length}</strong> Education</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Skills preview and action button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  {/* Skills preview */}
                  {userProfile.skills && userProfile.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Top Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-600 shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {userProfile.skills.length > 3 && (
                          <span className="px-3 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600">
                            +{userProfile.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit Profile Button */}
                  <Button asChild className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
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
                  className="group block rounded-lg border border-border bg-card p-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-ring/20 hover:bg-accent/5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground mt-1">
                        {job.company?.name || 'Company'}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="capitalize">{job.jobType.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
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

      {/* Recommended Jobs Section - Only for logged in USER role with skills */}
      {user?.role === 'USER' && userProfile?.skills && userProfile.skills.length > 0 && (
        <section className="mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recommended Jobs for You</h2>
            <Link to="/jobs" className="text-blue-600 hover:underline">View all jobs →</Link>
          </div>
          
          {loadingRecommended ? (
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
          ) : recommendedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job) => (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.id}`}
                  className="group block rounded-lg border border-border bg-card p-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-ring/20 hover:bg-accent/5"
                >
                  {/* Match Score Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground mt-1">
                        {job.company?.name || 'Company'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-sm shadow-md">
                        {job.matchScore}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Match indicator bar */}
                  <div className="mb-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                      style={{ width: `${job.matchScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="capitalize">{job.jobType.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                      {job.experienceLevel}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No matching jobs found yet.</p>
              <p className="text-sm text-muted-foreground mb-6">Add more skills to your profile to see personalized job recommendations.</p>
              <Button asChild>
                <Link to="/profile">Update Your Skills</Link>
              </Button>
            </div>
          )}
        </section>
      )}

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
            <div key={index} className="text-center p-6 border rounded-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-300 hover:shadow-md transition-all hover:-translate-y-0.5">
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

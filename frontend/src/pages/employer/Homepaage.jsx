import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';
import employerService from '../../services/employer.service';
import companyService from '../../services/company.service';
import { Progress } from '../../components/ui/progress';
import { Sparkles, ArrowUpRight, Building, Globe, ChevronRight } from 'lucide-react';

const EmployerHomepage = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    loading: true,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRecentJobs();
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await companyService.getMyCompany();
      if (response.data) {
        setCompany(response.data.company);
        setProfileCompletion(response.data.profileCompletion);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await employerService.getDashboardStats();
      const stats = response.data || {};

      setStats({
        activeJobs: stats.activeJobs || 0,
        totalApplications: stats.totalApplications || 0,
        pendingApplications: stats.pendingApplications || 0,
        acceptedApplications: stats.acceptedApplications || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats((prev) => ({ ...prev, loading: false }));
      toast({
        title: 'Error',
        description: 'Failed to load statistics',
        variant: 'destructive',
      });
    }
  };

  const fetchRecentJobs = async () => {
    try {
      setJobsLoading(true);
      const response = await employerService.getMyJobs();
      const jobs = (response.data || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentJobs(jobs);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recent jobs',
        variant: 'destructive',
      });
    } finally {
      setJobsLoading(false);
    }
  };

  const handlePostJob = () => {
    navigate('/employer/post-job');
  };

  const handleManageJobs = () => {
    navigate('/employer/jobs');
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/employer/jobs/${jobId}/applicants`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white pb-20 pt-10 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Recruiter Dashboard <Sparkles className="h-5 w-5 text-yellow-300" />
              </h1>
              <p className="text-blue-100 text-lg">
                Welcome back, {user?.name}! Here's your recruitment overview.
              </p>
            </div>
            {company && (
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <p className="text-sm font-medium text-blue-100">Current Company</p>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4" />
                  <span className="font-bold">{company.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Jobs</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.activeJobs}</h3>
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
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalApplications}</h3>
                </div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>Across all active listings</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pending Review</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</h3>
                </div>
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-orange-600 font-medium">
                <span>Needs attention</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Accepted</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.acceptedApplications}</h3>
                </div>
                <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                <span>Successful hires</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Quick Actions <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handlePostJob}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Post a Job</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create a new listing to attract talent</p>
                </button>

                <button
                  onClick={handleManageJobs}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Manage Jobs</h3>
                  <p className="text-sm text-muted-foreground mt-1">View and edit your active listings</p>
                </button>

                <button
                  onClick={() => recentJobs[0] && handleViewApplicants(recentJobs[0].id)}
                  disabled={recentJobs.length === 0}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Review Applicants</h3>
                  <p className="text-sm text-muted-foreground mt-1">Screen candidates for recent jobs</p>
                </button>
              </div>
            </section>

            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
                <div>
                  <CardTitle className="text-lg">Recent Job Postings</CardTitle>
                  <CardDescription>Your latest recruitment activities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleManageJobs} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All Jobs <ArrowRight className="h-4 w-4 ml-1" />
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
                      Get started by posting your first job opportunity to find great talent.
                    </p>
                    <Button onClick={handlePostJob} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
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
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-900">{job._count?.applications || 0}</div>
                            <div className="text-xs text-muted-foreground">Applicants</div>
                          </div>
                          <Badge variant={job.isActive ? 'default' : 'secondary'} className={job.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : ''}>
                            {job.isActive ? 'Active' : 'Closed'}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => handleViewApplicants(job.id)}>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Recruitment Tips</CardTitle>
                <CardDescription className="text-blue-700/80">Boost your hiring success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium text-sm text-blue-900">Clear Job Descriptions</h4>
                    <p className="text-xs text-blue-700/70 mt-1">Be specific about requirements to attract the right fit.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium text-sm text-blue-900">Fast Response Times</h4>
                    <p className="text-xs text-blue-700/70 mt-1">Engage candidates quickly to keep them interested.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium text-sm text-blue-900">Showcase Culture</h4>
                    <p className="text-xs text-blue-700/70 mt-1">Highlight what makes your company unique.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerHomepage;

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

  useEffect(() => {
    fetchStats();
    fetchRecentJobs();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your recruitment activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Jobs currently open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Received so far</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting your action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">Candidates accepted</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handlePostJob}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Plus className="h-6 w-6" />
              <span>Post a New Job</span>
            </Button>

            <Button
              onClick={handleManageJobs}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Briefcase className="h-6 w-6" />
              <span>Manage All Jobs</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() =>
                navigate(
                  `/employer/jobs/${recentJobs[0]?.id}/applicants`
                )
              }
              disabled={recentJobs.length === 0}
            >
              <Users className="h-6 w-6" />
              <span>View Applicants</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Your latest job listings</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManageJobs}
                className="gap-2"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 animate-pulse"
                    >
                      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No jobs posted yet
                  </p>
                  <Button onClick={handlePostJob} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-base">
                            {job.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {job.company?.name || 'Company'}
                          </p>
                        </div>
                        <Badge
                          variant={job.isActive ? 'default' : 'secondary'}
                        >
                          {job.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        {job.salaryMin && job.salaryMax && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salaryCurrency} {job.salaryMin.toLocaleString()} -
                            {job.salaryMax.toLocaleString()}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job._count?.applications || 0} applicants
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewApplicants(job.id)}
                        >
                          View <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Setup Checklist */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Setup Checklist</CardTitle>
              <CardDescription>Get started with recruiting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Create your account</p>
                    <p className="text-xs text-muted-foreground">
                      You're all set!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Post your first job</p>
                    <p className="text-xs text-muted-foreground">
                      Start attracting candidates
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      <Link to="/employer/post-job">Post Job</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Review applications</p>
                    <p className="text-xs text-muted-foreground">
                      Evaluate incoming candidates
                    </p>
                    <Button
                      onClick={handleManageJobs}
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      Manage Jobs
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Complete company profile
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add company details
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      <Link to="/company/profile">Complete</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recruitment Tips</CardTitle>
          <CardDescription>Best practices for successful hiring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-medium">Write Clear Job Descriptions</h4>
              <p className="text-sm text-muted-foreground">
                Include specific requirements and responsibilities to attract
                qualified candidates.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-medium">Review Applications Promptly</h4>
              <p className="text-sm text-muted-foreground">
                Respond to candidates quickly to maintain their interest and
                improve your employer brand.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-medium">Use Relevant Keywords</h4>
              <p className="text-sm text-muted-foreground">
                Include industry-specific keywords to improve job visibility
                and attract better matches.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerHomepage;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import { 
  Users, Eye, MapPin, Briefcase, 
  DollarSign, Loader2, TrendingUp, AlertCircle, CheckCircle2 
} from 'lucide-react';
import companyService from '../../services/company.service';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const CompanyJobs = () => {
  const user = useSelector(selectCurrentUser);
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'COMPANY') {
      toast({
        title: 'Access Denied',
        description: 'Only company owners can access this page',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    fetchCompanyAndJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const fetchCompanyAndJobs = async () => {
    try {
      setLoading(true);
      const response = await companyService.getMyCompany();
      
      if (!response.data.hasCompany) {
        toast({
          title: 'No Company Found',
          description: 'Please create your company profile first',
          variant: 'destructive',
        });
        navigate('/company/profile');
        return;
      }

      setCompany(response.data.company);
      // Jobs are included in company data
      setJobs(response.data.company.jobs || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  

  const getJobStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.isActive).length;
    const totalApplications = jobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0);
    const pendingApplications = totalApplications; // TODO: Get actual pending count

    return { totalJobs, activeJobs, totalApplications, pendingApplications };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  const stats = getJobStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-gray-600">
              {company?.name} • View and manage all job postings
            </p>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">No jobs to display.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge 
                            variant={job.isActive ? 'default' : 'secondary'}
                            className={job.isActive ? 'bg-green-600' : ''}
                          >
                            {job.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.jobType?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          {(job.salaryMin || job.salaryMax) && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {job.salaryMin && job.salaryMax
                                ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                                : job.salaryMin
                                ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}+`
                                : `Up to ${job.salaryCurrency} ${job.salaryMax.toLocaleString()}`
                              }
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job._count?.applications || 0} applicants
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.positions || 1} position{job.positions !== 1 ? 's' : ''}
                          </span>
                          <span>
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/company/applications?jobId=${job.id}`)}
                      className="w-full"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Applicants ({job._count?.applications || 0})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;

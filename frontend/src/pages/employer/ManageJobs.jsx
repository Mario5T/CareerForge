import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import { Plus, Edit, Trash2, Users, Eye, MapPin, Briefcase, DollarSign } from 'lucide-react';
import employerService from '../../services/employer.service';
import { useAuth } from '../../hooks/useAuth';

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isCompanyUser = user?.role === 'COMPANY';

  useEffect(() => {
    if (isCompanyUser) {
      navigate('/company/jobs', { replace: true });
      return;
    }
    fetchJobs();
  }, [isCompanyUser, navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await employerService.getMyJobs();
      setJobs(response.data || []);
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

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await employerService.deleteJob(jobId);
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
      });
      fetchJobs();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  const viewApplicants = (jobId) => {
    navigate(`/employer/jobs/${jobId}/applicants`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
          <p className="text-muted-foreground">View and manage your job postings</p>
        </div>
        {!isCompanyUser && (
          <Button asChild>
            <Link to="/employer/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        )}
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first job posting
            </p>
            {!isCompanyUser && (
              <Button asChild>
                <Link to="/employer/post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={job.isActive ? 'default' : 'secondary'}>
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
                                : `${job.salaryCurrency} ${job.salaryMax.toLocaleString()}`
                              }
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job._count?.applications || 0} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-auto w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewApplicants(job.id)}
                      className="w-full"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Applicants
                    </Button>
                    {!isCompanyUser && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <Link to={`/employer/jobs/${job.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                          className="w-full text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
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

export default ManageJobs;

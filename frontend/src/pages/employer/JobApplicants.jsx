import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  User,
  Loader2,
  Trash2,
} from 'lucide-react';
import employerService from '../../services/employer.service';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await employerService.getApplicantsForJob(jobId);
      
      if (response.data) {
        setJob(response.data.job);
        setApplicants(response.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load applicants',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdating(applicationId);
      await employerService.updateApplicationStatus(applicationId, newStatus);
      
      toast({
        title: 'Success',
        description: `Application ${newStatus.toLowerCase()} successfully`,
      });

      // Update local state
      setApplicants(
        applicants.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdating(applicationId);
      await employerService.deleteApplication(applicationId);
      
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });

      // Update local state
      setApplicants(applicants.filter((app) => app.id !== applicationId));
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete application',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/employer/jobs')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            {job?.title || 'Job Applicants'}
          </h1>
          <p className="text-muted-foreground">
            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} for this position
          </p>
        </div>
      </div>

      {/* Job Summary Card */}
      {job && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Position</p>
                <p className="font-semibold">{job.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Job Type</p>
                <p className="font-semibold">{job.jobType?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Posted</p>
                <p className="font-semibold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applicants yet</h3>
            <p className="text-muted-foreground">
              Applicants will appear here once they apply for this position
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {applicant.applicant?.name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {applicant.applicant?.email}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusBadgeVariant(applicant.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(applicant.status)}
                        {applicant.status}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      {applicant.applicant?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {applicant.applicant.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {new Date(applicant.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Cover Letter Preview */}
                    {applicant.coverLetter && (
                      <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                        <p className="text-gray-700 line-clamp-2">
                          {applicant.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 md:w-auto w-full">


                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link to={`/public/user/${applicant.applicant?.id}`} target="_blank">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>

                    {applicant.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(applicant.id, 'ACCEPTED')
                          }
                          disabled={updating === applicant.id}
                          className="w-full"
                        >
                          {updating === applicant.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusUpdate(applicant.id, 'REJECTED')
                          }
                          disabled={updating === applicant.id}
                          className="w-full"
                        >
                          {updating === applicant.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}

                    {applicant.status === 'ACCEPTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusUpdate(applicant.id, 'REJECTED')
                        }
                        disabled={updating === applicant.id}
                        className="w-full"
                      >
                        {updating === applicant.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    )}

                    {applicant.status === 'REJECTED' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(applicant.id, 'PENDING')
                          }
                          disabled={updating === applicant.id}
                          className="w-full"
                        >
                          {updating === applicant.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Clock className="h-4 w-4 mr-2" />
                          )}
                          Reconsider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(applicant.id)}
                          disabled={updating === applicant.id}
                          className="w-full"
                        >
                          {updating === applicant.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
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

export default JobApplicants;

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import { 
  FileText, Search, Filter, Download, Eye, 
  CheckCircle2, XCircle, Clock, Mail, Phone,
  Briefcase, MapPin, Calendar, User, Loader2,
  TrendingUp, AlertCircle, UserCheck
} from 'lucide-react';
import companyService from '../../services/company.service';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const CompanyApplications = () => {
  const user = useSelector(selectCurrentUser);
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

    fetchCompanyApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    filterApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, jobFilter, applications]);

  const fetchCompanyApplications = async () => {
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
      
      // Flatten all applications from all jobs
      const allApplications = [];
      if (response.data.company.jobs) {
        response.data.company.jobs.forEach(job => {
          if (job.applications) {
            job.applications.forEach(app => {
              allApplications.push({
                ...app,
                jobTitle: job.title,
                jobId: job.id,
                jobLocation: job.location,
                jobType: job.jobType,
              });
            });
          }
        });
      }

      // Sort by date (newest first)
      allApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setApplications(allApplications);
      setFilteredApplications(allApplications);
      const qpJobId = searchParams.get('jobId');
      if (qpJobId) {
        setJobFilter(qpJobId);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicant?.name?.toLowerCase().includes(query) ||
        app.applicant?.email?.toLowerCase().includes(query) ||
        app.jobTitle?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Job filter
    if (jobFilter !== 'ALL') {
      filtered = filtered.filter(app => app.jobId === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'PENDING').length;
    const accepted = applications.filter(a => a.status === 'ACCEPTED').length;
    const rejected = applications.filter(a => a.status === 'REJECTED').length;

    return { total, pending, accepted, rejected };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'ACCEPTED': return <CheckCircle2 className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const uniqueJobs = [...new Set(applications.map(app => ({ id: app.jobId, title: app.jobTitle })))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Applications</h1>
            <p className="text-gray-600">
              {company?.name} • Manage all job applications
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => {/* TODO: Export to CSV */}}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Job Filter */}
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="ALL">All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              When candidates apply to your job postings, they will appear here
            </p>
            <Button 
              onClick={() => navigate('/company/jobs')}
              className="bg-[#6A38C2] hover:bg-[#5b30a6]"
            >
              View Jobs
            </Button>
          </CardContent>
        </Card>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Applicant Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#6A38C2] text-white flex items-center justify-center text-xl font-bold shrink-0">
                      {application.applicant?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {application.applicant?.name || 'Unknown Applicant'}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status}
                          </span>
                        </Badge>
                      </div>

                      {/* Job Applied For */}
                      <div className="mb-3 text-gray-700 font-medium">
                        Applied for: <span className="text-[#6A38C2]">{application.jobTitle}</span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        {application.applicant?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{application.applicant.email}</span>
                          </div>
                        )}
                        
                        {application.applicant?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{application.applicant.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{application.jobType?.replace('_', ' ')}</span>
                          <span className="text-gray-400">•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{application.jobLocation}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {application.applicant?.bio && (
                          <p className="text-gray-600 mt-2 line-clamp-2">
                            {application.applicant.bio}
                          </p>
                        )}

                        {application.applicant?.skills && application.applicant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {application.applicant.skills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {application.applicant.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{application.applicant.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/profiles/${application.applicant?.id}`)}
                      className="w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    
                    {application.applicant?.resume && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.applicant.resume, '_blank')}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    )}

                    

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${application.jobId}`)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Info */}
      {filteredApplications.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;

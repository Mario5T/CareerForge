import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  Calendar, 
  ArrowLeft, 
  ExternalLink, 
  Send, 
  Bookmark, 
  Share2,
  CheckCircle2,
  XCircle,
  Users,
  Flag,
  Link2,
  ArrowRight,
} from 'lucide-react';
import jobService from '../../services/job.service';
import api from '../../services/api';
import { PREDEFINED_SKILLS } from '../../constants/skills';
const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const TECH_STACK_SUBSTRINGS = [
  'js','javascript','typescript','react','redux','next','nuxt','vue','angular','svelte',
  'node','express','nest','koa','hapi','fastify','django','flask','fastapi','spring',
  'rails','laravel','symfony','phoenix','go','golang','rust','csharp','cpp','swift','kotlin','dart',
  'reactnative','flutter','android','ios',
  'postgres','mysql','sqlite','mongodb','mariadb','redis','prisma','sequelize','typeorm','mongoose',
  'graphql','rest','grpc','websocket',
  'docker','kubernetes','terraform','ansible','jenkins','github','gitlab','cicd','nginx','apache',
  'aws','azure','gcp','googlecloud','vercel','netlify',
  'webpack','vite','babel','tailwind','bootstrap','material','chakra','antd','sass','less','postcss',
  'jest','vitest','mocha','chai','cypress','playwright','selenium','puppeteer','rtl',
  'kafka','rabbitmq','sqs','sns','pubsub','elasticsearch','kibana','logstash',
  'figma','adobe','photoshop','illustrator','sketch','jira','confluence'
];

const isTechStackSkill = (skill) => {
  const ns = normalize(skill);
  if (ns.length < 3) return TECH_STACK_SUBSTRINGS.some(k => ns === k);
  return TECH_STACK_SUBSTRINGS.some(k => ns.includes(k));
};

const extractTechSkills = (requirements = []) => {
  const found = new Set();
  const normalizedReqs = requirements.map(r => normalize(r));
  const skills = PREDEFINED_SKILLS.map(s => ({ raw: s, norm: normalize(s) }))
    .filter(s => s.norm.length >= 2 && isTechStackSkill(s.raw));

  for (const req of normalizedReqs) {
    for (const sk of skills) {
      if (sk.norm && sk.norm.length >= 3 && req.includes(sk.norm)) {
        found.add(sk.raw);
      }
    }
  }
  return Array.from(found).sort((a, b) => a.localeCompare(b)).slice(0, 20);
};

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const techSkills = job?.requirements ? extractTechSkills(job.requirements) : [];
  const isCompanyUser = user?.role === 'COMPANY';
  const isRecruiter = user?.role === 'RECRUITER';
  const isJobSeeker = user?.role === 'USER';


  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobById(id);
        setJob(response.data);
        
        try {
          const allJobsResponse = await jobService.getAllJobs();
          const related = (allJobsResponse.data || []).filter(
            j => j.id !== id && (j.companyId === response.data.companyId || j.jobType === response.data.jobType)
          ).slice(0, 3);
          setRelatedJobs(related);
        } catch (err) {
          console.error('Error fetching related jobs:', err);
        }
        
        if (isAuthenticated) {
          try {
            const savedJobsResponse = await api.get('/users/saved-jobs');
            const savedJobIds = new Set(savedJobsResponse.data.map(j => j.id));
            setIsSaved(savedJobIds.has(id));
          } catch (err) {
            console.error('Error checking saved status:', err);
          }

          try {
            const applicationsResponse = await jobService.getMyApplications();
            const appliedJobIds = new Set(applicationsResponse.data.map(app => app.jobId));
            setHasApplied(appliedJobIds.has(id));
          } catch (err) {
            console.error('Error checking application status:', err);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load job details. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    setApplying(true);
    try {
      await jobService.applyToJob(id);
      
      toast({
        title: 'Application Submitted!',
        description: `Your application for ${job.title} at ${job.company?.name || 'the company'} has been submitted successfully.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
        ),
      });
      setHasApplied(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setApplying(false);
    }
  };

  const toggleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/users/saved-jobs/${id}`);
        setIsSaved(false);
        toast({
          title: 'Job Removed',
          description: 'This job has been removed from your saved jobs.',
        });
      } else {
        await api.post(`/users/saved-jobs/${id}`);
        setIsSaved(true);
        toast({
          title: 'Job Saved!',
          description: 'You can view this job later in your saved jobs.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update saved jobs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this ${job.type} position: ${job.title} at ${job.company}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard!',
        description: 'Share this job with others by pasting the link.',
      });
    }
  };

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <div className="flex items-center text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                {job.company?.name || 'Company'}
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {job.jobType === 'REMOTE' ? 'Remote' : job.location}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="text-sm">
                {job.jobType?.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {job.experienceLevel}
              </Badge>
              {job.jobType === 'REMOTE' && (
                <Badge variant="outline" className="text-sm">
                  Remote
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {isJobSeeker && (
              <>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 md:flex-none"
                  onClick={toggleSaveJob}
                  disabled={saving}
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                      {isSaved ? 'Saved' : 'Save Job'}
                    </>
                  )}
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 md:flex-none"
                  onClick={handleApply}
                  disabled={applying || hasApplied}
                  variant={hasApplied ? "secondary" : "default"}
                >
                  {applying ? (
                    'Applying...'
                  ) : hasApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
              </>
            )}
            {isRecruiter && (
              <Button 
                size="lg" 
                className="flex-1 md:flex-none"
                disabled
                title="Recruiters cannot apply for jobs"
              >
                <Send className="h-4 w-4 mr-2" />
                Apply Now (Locked)
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 whitespace-pre-wrap">{job.description}</p>
              
              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                  <ul className="space-y-2 mb-6">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          
          {job.company && (
            <Card>
              <CardHeader>
                <CardTitle>About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{job.company.description || 'No description available.'}</p>
                {job.company.website && (
                  <Button 
                    variant="outline" 
                    asChild
                    className="mt-2"
                  >
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                      Visit Company Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">1. Apply</h4>
                    <p className="text-sm text-muted-foreground">Submit your application</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-primary/50" />
                  </div>
                  <div>
                    <h4 className="font-medium">2. Review</h4>
                    <p className="text-sm text-muted-foreground">We'll review your application</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-primary/20" />
                  </div>
                  <div>
                    <h4 className="font-medium">3. Interview</h4>
                    <p className="text-sm text-muted-foreground">Schedule an interview</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Job Posted</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(job.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {job.positions > 1 ? `${job.positions} positions available` : '1 position available'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p className="font-medium">{job.jobType?.replace('_', ' ')}</p>
                </div>
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">
                      {job.salaryMin && job.salaryMax 
                        ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                        : job.salaryMin 
                        ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()}+`
                        : `${job.salaryCurrency} ${job.salaryMax.toLocaleString()}`
                      }
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {job.jobType === 'REMOTE' ? 'Remote' : job.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{job.experienceLevel} Level</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Positions</p>
                  <p className="font-medium">{job.positions || 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {techSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        
          <Card>
            <CardHeader>
              <CardTitle>Share This Job</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={shareJob}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: 'Link copied!',
                      description: 'Job link has been copied to clipboard.',
                    });
                  }}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
          

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive w-full justify-start"
            onClick={() => {
              toast({
                title: 'Report Job',
                description: 'If you believe this job posting is inappropriate or violates our terms, please report it.',
                action: (
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: 'Thank You',
                      description: 'We have received your report and will review it shortly.',
                    });
                  }}>
                    Report
                  </Button>
                ),
              });
            }}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Job
          </Button>
        </div>
      </div>

      {relatedJobs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm">{job.company?.name || 'Company'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.jobType?.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.jobType === 'REMOTE' ? 'Remote' : job.location}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {job.salaryMin && job.salaryMax 
                            ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : 'Salary not specified'
                          }
                        </span>
                        <Button variant="ghost" size="sm" className="text-primary" asChild>
                          <Link to={`/jobs/${job.id}`}>
                            View <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;

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
  XCircle
} from 'lucide-react';

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

  // Mock data - in a real app, this would be an API call
  const mockJob = {
    id: id,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2 days ago',
    deadline: '2023-12-31',
    description: 'We are looking for an experienced Frontend Developer to join our growing team. The ideal candidate will be responsible for building user interfaces and implementing features for our web applications.',
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and front-end libraries for future use',
      'Translate designs and wireframes into high-quality code',
      'Optimize components for maximum performance across devices and browsers',
      'Collaborate with product team and designers to improve usability',
      'Participate in code reviews and provide constructive feedback'
    ],
    requirements: [
      '5+ years of experience with React.js and modern JavaScript',
      'Strong proficiency in TypeScript',
      'Experience with state management libraries (Redux, Context API)',
      'Familiarity with RESTful APIs and modern front-end build pipelines',
      'Experience with testing frameworks (Jest, React Testing Library)',
      'Strong problem-solving skills and attention to detail'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      '401(k) matching',
      'Flexible work hours',
      'Remote work options',
      'Professional development budget',
      'Generous PTO policy'
    ],
    skills: ['React', 'TypeScript', 'Redux', 'GraphQL', 'Jest', 'CSS-in-JS'],
    companyDescription: 'TechCorp is a leading technology company specializing in building innovative web and mobile applications. We are a team of passionate engineers, designers, and product managers working together to solve complex problems.',
    companyWebsite: 'https://techcorp.example.com',
    applicationUrl: 'https://techcorp.example.com/careers',
    isRemote: false,
    experienceLevel: 'Senior',
    applicants: 24,
    views: 156
  };
  const mockRelatedJobs = [
    {
      id: '2',
      title: 'Frontend Engineer',
      company: 'WebSolutions',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      posted: '1 week ago',
      isRemote: true
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'Digital Innovations',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$70 - $90/hr',
      posted: '3 days ago',
      isRemote: false
    },
    {
      id: '4',
      title: 'UI/UX Developer',
      company: 'DesignHub',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      posted: '5 days ago',
      isRemote: true
    }
  ];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setJob(mockJob);
          setRelatedJobs(mockRelatedJobs);
          setLoading(false);
          const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          setIsSaved(savedJobs.includes(id));
        }, 500);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, toast]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    setApplying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Application Submitted!',
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/applications')}>
            View Applications
          </Button>
        ),
      });
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
      await new Promise(resolve => setTimeout(resolve, 500));
    
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      let updatedSavedJobs;
      
      if (isSaved) {
        updatedSavedJobs = savedJobs.filter(jobId => jobId !== id);
      } else {
        updatedSavedJobs = [...savedJobs, id];
      }
      
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      setIsSaved(!isSaved);
      
      toast({
        title: isSaved ? 'Job Removed' : 'Job Saved!',
        description: isSaved 
          ? 'This job has been removed from your saved jobs.'
          : 'You can view this job later in your saved jobs.',
      });
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
                {job.company}
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {job.isRemote ? 'Remote' : job.location}
                {job.isRemote && job.location && ` (${job.location})`}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="text-sm">
                {job.type}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {job.experienceLevel}
              </Badge>
              {job.isRemote && (
                <Badge variant="outline" className="text-sm">
                  Remote
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
              disabled={applying}
            >
              {applying ? (
                'Applying...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
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
              <p className="mb-6">{job.description}</p>
              
              <h3 className="font-semibold text-lg mb-3">Responsibilities</h3>
              <ul className="space-y-2 mb-6">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="font-semibold text-lg mb-3">Requirements</h3>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="font-semibold text-lg mb-3">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{job.companyDescription}</p>
              <Button 
                variant="outline" 
                asChild
                className="mt-2"
              >
                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">
                  Visit Company Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        
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
                <h4 className="font-medium mb-2">Application Deadline</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(job.deadline).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Apply before the deadline to be considered for this position.
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
                  <p className="font-medium">{job.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {job.isRemote ? 'Remote' : job.location}
                    {job.isRemote && job.location && ` (${job.location})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-medium">{job.posted}</p>
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
                  <p className="text-sm text-muted-foreground">Applicants</p>
                  <p className="font-medium">{job.applicants}+ Applicants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        
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
                      <p className="text-muted-foreground text-sm">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.isRemote ? 'Remote' : job.location}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium">{job.salary}</span>
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

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const { toast } = useToast();
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      posted: '2 days ago',
      description: 'We are looking for an experienced Frontend Developer to join our team...',
      skills: ['React', 'TypeScript', 'Redux', 'GraphQL'],
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Contract',
      salary: '$80 - $100/hr',
      posted: '1 week ago',
      description: 'Join our design team to create beautiful and intuitive user experiences...',
      skills: ['Figma', 'Sketch', 'UI/UX', 'Prototyping'],
    },
    {
      id: 3,
      title: 'Backend Engineer',
      company: 'DataSystems',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130,000 - $160,000',
      posted: '3 days ago',
      description: 'Looking for a Backend Engineer to develop and maintain our server infrastructure...',
      skills: ['Node.js', 'Python', 'AWS', 'Docker'],
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
      
        setTimeout(() => {
          const filteredJobs = mockJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               job.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLocation = !filters.location || 
                                 job.location.toLowerCase().includes(filters.location.toLowerCase());
            
            const matchesType = !filters.jobType || 
                             job.type.toLowerCase() === filters.jobType.toLowerCase();
            
            return matchesSearch && matchesLocation && matchesType;
          });
          
          setJobs(filteredJobs);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load jobs. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, filters, toast]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      q: searchTerm,
      ...filters,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-muted-foreground">Browse through thousands of full-time and part-time jobs near you</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  name="location"
                  placeholder="Location"
                  className="pl-10 w-full"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.posted}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button asChild>
                      <Link to={`/jobs/${job.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show page numbers with ellipsis
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}
            <Button
              variant="outline"
              onClick={() =>
                paginate(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

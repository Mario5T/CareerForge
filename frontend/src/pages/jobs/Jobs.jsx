import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, ArrowRight, Bookmark } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import jobService from '../../services/job.service';
import api from '../../services/api';
import SearchBar from '../../components/SearchBar';
import useDebounce from '../../hooks/useDebounce';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const { toast } = useToast();
  const debounceTimer = useRef(null);
  const [savedJobs, setSavedJobs] = useState(new Set());

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/users/saved-jobs');
        const savedJobIds = new Set(response.data.map(job => job.id));
        setSavedJobs(savedJobIds);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };
    fetchSavedJobs();
  }, []);

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.has(jobId)) {
        await api.delete(`/users/saved-jobs/${jobId}`);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast({ title: 'Job removed from saved jobs' });
      } else {
        await api.post(`/users/saved-jobs/${jobId}`);
        setSavedJobs(prev => new Set(prev).add(jobId));
        toast({ title: 'Job saved successfully' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update saved jobs',
        variant: 'destructive',
      });
    }
  };

  // Fetch jobs on initial load
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setInitialLoading(true);
        
        // Build query params for backend filtering
        const params = {};
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (filters.location) params.location = filters.location;
        if (filters.jobType) params.jobType = filters.jobType;
        if (filters.experience) params.experienceLevel = filters.experience;
        
        const response = await jobService.getAllJobs(params);
        setJobs(response.data || []);
        setCurrentPage(1);
        setInitialLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || error.message || 'Failed to load jobs. Please try again later.',
          variant: 'destructive',
        });
        setInitialLoading(false);
      }
    };

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamic search with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        setFetching(true);
        
        // Build query params for backend filtering
        const params = {};
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (filters.location) params.location = filters.location;
        if (filters.jobType) params.jobType = filters.jobType;
        if (filters.experience) params.experienceLevel = filters.experience;
        
        const response = await jobService.getAllJobs(params);
        setJobs(response.data || []);
        setCurrentPage(1);
        setFetching(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || error.message || 'Failed to load jobs. Please try again later.',
          variant: 'destructive',
        });
        setFetching(false);
      }
    }, 300); // 300ms debounce for faster response

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filters.location, filters.jobType, filters.experience]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setFetching(true);
  }, []);
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // Memoize pagination calculations to prevent unnecessary recalculations
  const paginationData = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    return { indexOfLastJob, indexOfFirstJob, currentJobs, totalPages };
  }, [jobs, currentPage]);

  const { currentJobs, totalPages } = paginationData;

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in-0 duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-muted-foreground">Browse through thousands of full-time and part-time jobs near you</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Job title, company, or keywords"
                className="flex-1"
              />
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="location"
                  placeholder="Location"
                  className="pl-10 w-full"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
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
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Experience Levels</option>
                <option value="ENTRY">Entry Level</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
                <option value="LEAD">Lead</option>
              </select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <Card key={job.id} className="group animate-in fade-in-0 slide-in-from-bottom-2 duration-300 hover:shadow-lg transition-all hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg transition-transform duration-300 group-hover:scale-105">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          <Link to={`/jobs/${job.id}`} className="hover:underline">
                            {job.title}
                          </Link>
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleSaveJob(job.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current text-primary' : 'text-muted-foreground'}`}
                          />
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{job.company?.name || 'Company'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.jobType?.replace('_', ' ')}
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
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requirements.slice(0, 5).map((req, index) => (
                            <Badge key={index} variant="secondary">
                              {req}
                            </Badge>
                          ))}
                          {job.requirements.length > 5 && (
                            <Badge variant="secondary">+{job.requirements.length - 5} more</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button asChild>
                      <Link to={`/jobs/${job.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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

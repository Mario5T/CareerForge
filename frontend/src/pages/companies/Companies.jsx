import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Building2, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Companies = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    size: ''
  });
  const mockCompanies = [
    {
      id: '1',
      name: 'TechCorp Inc.',
      description: 'Leading technology company specializing in web and mobile applications.',
      logo: '/placeholder-company.png',
      industry: 'Technology',
      size: '1001-5000',
      location: 'San Francisco, CA',
      rating: 4.5,
      jobs: 24,
      isHiring: true,
    },
    {
      id: '2',
      name: 'DesignHub',
      description: 'Creative design agency focused on UI/UX and branding solutions.',
      logo: '/placeholder-company.png',
      industry: 'Design',
      size: '51-200',
      location: 'New York, NY',
      rating: 4.2,
      jobs: 8,
      isHiring: true,
    },
    {
      id: '3',
      name: 'DataSystems',
      description: 'Enterprise data solutions and analytics platform provider.',
      logo: '/placeholder-company.png',
      industry: 'Data & Analytics',
      size: '201-500',
      location: 'Austin, TX',
      rating: 4.0,
      jobs: 12,
      isHiring: false,
    },
    {
      id: '4',
      name: 'CloudScale',
      description: 'Cloud infrastructure and DevOps services for modern applications.',
      logo: '/placeholder-company.png',
      industry: 'Cloud Computing',
      size: '501-1000',
      location: 'Seattle, WA',
      rating: 4.7,
      jobs: 16,
      isHiring: true,
    },
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const filteredCompanies = mockCompanies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               company.industry.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLocation = !filters.location || 
                                 company.location.toLowerCase().includes(filters.location.toLowerCase());
            
            const matchesIndustry = !filters.industry || 
                                 company.industry.toLowerCase() === filters.industry.toLowerCase();
            
            const matchesSize = !filters.size || 
                             company.size === filters.size;
            
            return matchesSearch && matchesLocation && matchesIndustry && matchesSize;
          });
          
          setCompanies(filteredCompanies);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const industries = [...new Set(mockCompanies.map(company => company.industry))];
  const companySizes = [...new Set(mockCompanies.map(company => company.size))];

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
        <h1 className="text-3xl font-bold mb-2">Top Companies</h1>
        <p className="text-muted-foreground">
          Discover companies that are hiring and find your next career opportunity
        </p>
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
                  placeholder="Search companies..."
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
                Search
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Industries</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              
              <select
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Company Sizes</option>
                {companySizes.map((size, index) => (
                  <option key={index} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    location: '',
                    industry: '',
                    size: ''
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length > 0 ? (
          companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      <Link to={`/companies/${company.id}`} className="hover:underline">
                        {company.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {company.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {company.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {company.size} employees
                  </Badge>
                  {company.isHiring && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      Hiring Now
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({company.jobs} {company.jobs === 1 ? 'job' : 'jobs'})
                    </span>
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/companies/${company.id}`}>
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <Building2 className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium mb-1">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  location: '',
                  industry: '',
                  size: ''
                });
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    
      {companies.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {companies.slice(0, 6).map((company) => (
              <Card key={`featured-${company.id}`} className="text-center p-4 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-lg inline-block mb-3">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium">{company.name}</h4>
                <p className="text-sm text-muted-foreground">{company.jobs} jobs</p>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Want to list your company?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of companies hiring the best talent on our platform. Create your company profile today and start connecting with qualified candidates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {(!user || user.role !== 'COMPANY') && (
              <Button size="lg">Post a Job</Button>
            )}
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;

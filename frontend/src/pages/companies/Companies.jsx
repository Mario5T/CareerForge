import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Building2, MapPin, Search } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import useDebounce from '../../hooks/useDebounce';
import CompanyCard from '../../components/CompanyCard';
import companyService from '../../services/company.service';

const Companies = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    size: ''
  });


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await companyService.getAllCompanies();

        if (res.success && res.data && Array.isArray(res.data.companies)) {
          setCompanies(res.data.companies);
        } else if (res.success && Array.isArray(res.data)) {

           setCompanies(res.data);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);


  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = !debouncedSearchTerm || 
        company.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesLocation = !filters.location || 
                           company.location?.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesIndustry = !filters.industry || 
                           company.industry?.toLowerCase() === filters.industry.toLowerCase();
      
      const matchesSize = !filters.size || 
                       company.companySize === filters.size; 
      
      return matchesSearch && matchesLocation && matchesIndustry && matchesSize;
    });
  }, [companies, debouncedSearchTerm, filters]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setInputValue('');
    setFilters({
      location: '',
      industry: '',
      size: ''
    });
  }, []);

 
  const industries = useMemo(() => [...new Set(companies.map(company => company.industry).filter(Boolean))], [companies]);
  const companySizes = useMemo(() => [...new Set(companies.map(company => company.companySize).filter(Boolean))], [companies]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in-0 duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Top Companies</h1>
        <p className="text-muted-foreground">
          Discover companies that are hiring and find your next career opportunity
        </p>
      </div>


      <Card className="mb-8 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search companies..."
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
                    {size.replace('SIZE_', '').replace('_', '-')} employees
                  </option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
            />
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
              onClick={handleClearFilters}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    
      {filteredCompanies.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredCompanies.slice(0, 6).map((company) => (
              <Link key={`featured-${company.id}`} to={`/companies/${company.id}`} className="block">
                <Card className="group text-center p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 hover:shadow-lg transition-all hover:-translate-y-0.5 h-full">
                  <div className="bg-primary/10 p-3 rounded-lg inline-block mb-3 transition-transform duration-300 group-hover:scale-105">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium truncate px-2">{company.name}</h4>
                  <p className="text-sm text-muted-foreground">{company._count?.jobs || 0} jobs</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;

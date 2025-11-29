import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { Building2, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import companyService from '../../services/company.service';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const COMPANY_SIZES = [
  { value: 'SIZE_1_10', label: '1-10 employees' },
  { value: 'SIZE_11_50', label: '11-50 employees' },
  { value: 'SIZE_51_200', label: '51-200 employees' },
  { value: 'SIZE_201_500', label: '201-500 employees' },
  { value: 'SIZE_501_1000', label: '501-1000 employees' },
  { value: 'SIZE_1000_PLUS', label: '1000+ employees' },
];

const CompanyProfile = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logo: '',
    industry: '',
    companySize: '',
  });

  useEffect(() => {
    if (user?.role !== 'COMPANY') {
      toast({
        title: 'Access Denied',
        description: 'Only COMPANY role users can access this page',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await companyService.getMyCompany();
        
        console.log('Company API Response:', response);
        console.log('Has company:', response.data?.hasCompany);
        console.log('Company data:', response.data?.company);
        console.log('Profile completion:', response.data?.profileCompletion);
        
        if (response.data.hasCompany && response.data.company) {
          const company = response.data.company;
          setHasCompany(true);
          setFormData({
            name: company.name || '',
            description: company.description || '',
            website: company.website || '',
            location: company.location || '',
            logo: company.logo || '',
            industry: company.industry || '',
            companySize: company.companySize || '',
          });
          console.log('Set form data:', {
            name: company.name,
            description: company.description,
            logo: company.logo,
          });
          setProfileCompletion(response.data.profileCompletion);
        } else {
          console.log('No company found for user');
          setHasCompany(false);
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          title: 'Error',
          description: 'Failed to load company data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [user?.role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let response;
      if (hasCompany) {
        response = await companyService.updateMyCompany(formData);
        toast({
          title: 'Success',
          description: 'Company profile updated successfully',
        });
      } else {
        response = await companyService.createMyCompany(formData);
        setHasCompany(true);
        toast({
          title: 'Success',
          description: 'Company profile created successfully',
        });
      }
      
      if (response.data.profileCompletion) {
        setProfileCompletion(response.data.profileCompletion);
      }

      window.dispatchEvent(new CustomEvent('companyLogoUpdated'));
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#6A38C2]" />
              Company Profile
            </h1>
            <p className="text-gray-600 mt-2">
              {hasCompany ? 'Update your company information' : 'Create your company profile to get started'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Status: {hasCompany ? '✅ Company Found' : '❌ No Company'} 
              {profileCompletion && ` • ${profileCompletion.percentage}% Complete`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Profile Completion Card */}
      {profileCompletion && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {profileCompletion.isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              Profile Completion: {profileCompletion.percentage}%
            </CardTitle>
            <CardDescription>
              {profileCompletion.isComplete 
                ? 'Your profile is complete!' 
                : `Complete ${profileCompletion.completedFields} of ${profileCompletion.totalFields} required fields`
              }
            </CardDescription>
          </CardHeader>
          {!profileCompletion.isComplete && profileCompletion.missingFields.length > 0 && (
            <CardContent>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Missing fields:</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {profileCompletion.missingFields.map((field) => (
                      <li key={field} className="capitalize">• {field.replace(/([A-Z])/g, ' $1').trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Company Form */}
      <Card>
        <CardHeader>
          <CardTitle>{hasCompany ? 'Edit Company' : 'Create Company'}</CardTitle>
          <CardDescription>
            Fill in all the fields to complete your company profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="TechCorp Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your company..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL *</Label>
              <Input
                id="logo"
                name="logo"
                type="url"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                required
              />
              {formData.logo && (
                <div className="mt-2">
                  <img 
                    src={formData.logo} 
                    alt="Company logo preview" 
                    className="w-24 h-24 object-contain border rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Technology, Healthcare, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select size...</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {hasCompany ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  hasCompany ? 'Update Company' : 'Create Company'
                )}
              </Button>
              
              {hasCompany && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;

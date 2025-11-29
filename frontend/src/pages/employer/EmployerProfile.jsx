import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { Users, AlertCircle, CheckCircle2, Loader2, RefreshCw, Building2, MapPin, Users2, Globe, Briefcase } from 'lucide-react';
import employerService from '../../services/employer.service';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const EmployerProfile = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companyLocation: '',
    companyLogo: '',
    companyIndustry: '',
    companySize: '',
  });

  const COMPANY_SIZES = [
    { value: 'SIZE_1_10', label: '1-10 employees' },
    { value: 'SIZE_11_50', label: '11-50 employees' },
    { value: 'SIZE_51_200', label: '51-200 employees' },
    { value: 'SIZE_201_500', label: '201-500 employees' },
    { value: 'SIZE_501_1000', label: '501-1000 employees' },
    { value: 'SIZE_1000_PLUS', label: '1000+ employees' },
  ];

  useEffect(() => {
    if (user?.role !== 'RECRUITER' && user?.role !== 'COMPANY') {
      toast({
        title: 'Access Denied',
        description: 'Only recruiters and company owners can access this page',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching employer profile data...');
        const response = await employerService.getMyCompany();
        console.log('📥 Fetched response:', response);

        if (response.data?.company) {
          const company = response.data.company;
          console.log('✅ Profile found:', company);
          setHasProfile(true);
          setFormData({
            title: response.data.title || '',
            department: response.data.department || '',
            companyName: company.name || '',
            companyDescription: company.description || '',
            companyWebsite: company.website || '',
            companyLocation: company.location || '',
            companyLogo: company.logo || '',
            companyIndustry: company.industry || '',
            companySize: company.companySize || '',
          });
        } else {
          console.log('⚠️ No profile found, creating new one');
          setHasProfile(false);
        }
      } catch (error) {
        console.error('❌ Error fetching employer profile:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
        });
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
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
      console.log('📤 Submitting employer profile data:', formData);

      let response;
      if (hasProfile) {
        console.log('🔄 Updating existing profile...');
        response = await employerService.updateCompanyProfile(formData);
        console.log('✅ Update response:', response);
        toast({
          title: 'Success',
          description: 'Employer profile updated successfully',
        });
      } else {
        console.log('✨ Creating new profile...');
        response = await employerService.createCompanyProfile(formData);
        console.log('✅ Create response:', response);
        setHasProfile(true);
        toast({
          title: 'Success',
          description: 'Employer profile created successfully',
        });
      }

      console.log('💾 Profile saved to database successfully!');
      console.log('📊 Response data:', response);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('❌ Error saving employer profile:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast({
        title: 'Error',
        description: error.message || 'Failed to save employer profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
              <Users className="w-8 h-8 text-primary" />
              Employer Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              {hasProfile
                ? 'Update your employer and company information'
                : 'Create your employer profile to get started'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {hasProfile ? '✅ Profile Found' : '❌ No Profile'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Role & Department Display - Only show if profile exists */}
      {hasProfile && (formData.title || formData.department) && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Users className="w-5 h-5" />
              Your Current Role
            </CardTitle>
            <CardDescription>
              Your position and department within the company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.title && (
                <div className="space-y-1">
                  <Label className="text-green-700 text-xs font-medium">Job Title</Label>
                  <p className="text-green-900 font-semibold text-lg">{formData.title}</p>
                </div>
              )}
              {formData.department && (
                <div className="space-y-1">
                  <Label className="text-green-700 text-xs font-medium">Department</Label>
                  <p className="text-green-900 font-semibold text-lg">{formData.department}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employer Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hasProfile ? 'Edit Employer Profile' : 'Create Employer Profile'}
          </CardTitle>
          <CardDescription>
            Fill in your employer details and company information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Hiring Manager, Recruiter"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Human Resources, Engineering"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Company Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="TechCorp Inc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description *</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your company..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website *</Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLocation">Location *</Label>
                  <Input
                    id="companyLocation"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Logo URL *</Label>
                <Input
                  id="companyLogo"
                  name="companyLogo"
                  type="url"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  required
                />
                {formData.companyLogo && (
                  <div className="mt-2">
                    <img
                      src={formData.companyLogo}
                      alt="Company logo preview"
                      className="w-24 h-24 object-contain border rounded"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyIndustry">Industry *</Label>
                  <Input
                    id="companyIndustry"
                    name="companyIndustry"
                    value={formData.companyIndustry}
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
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
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {hasProfile ? 'Updating...' : 'Creating...'}
                  </>
                ) : hasProfile ? (
                  'Update Profile'
                ) : (
                  'Create Profile'
                )}
              </Button>

              {hasProfile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/employer')}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <CheckCircle2 className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p>
            Your employer profile helps candidates learn more about you and your company.
            This information will be displayed on job postings and your company profile page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerProfile;

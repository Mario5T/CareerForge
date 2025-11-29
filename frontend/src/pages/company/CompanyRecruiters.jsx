import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../components/ui/use-toast';
import { 
  UserPlus, Trash2, Mail, Calendar, Briefcase, 
  Users, Loader2, CheckCircle2, AlertCircle, Search
} from 'lucide-react';
import companyService from '../../services/company.service';
import { selectCurrentUser } from '../../store/slices/auth/authSlice';

const CompanyRecruiters = () => {
  const user = useSelector(selectCurrentUser);
  const [company, setCompany] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [addingRecruiter, setAddingRecruiter] = useState(false);
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('');
  const [recruiterDepartment, setRecruiterDepartment] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

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

    fetchCompanyAndRecruiters();
  }, [user?.role]);

  const fetchCompanyAndRecruiters = async () => {
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
      setRecruiters(response.data.company.employers || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load recruiters',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecruiter = async (e) => {
    e.preventDefault();
    
    if (!recruiterEmail) {
      toast({
        title: 'Error',
        description: 'Please enter a recruiter email',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingRecruiter(true);
      
      await companyService.addEmployer(company.id, {
        email: recruiterEmail,
        title: recruiterTitle,
        department: recruiterDepartment,
      });

      toast({
        title: 'Success',
        description: 'Recruiter added successfully',
      });

      setRecruiterEmail('');
      setRecruiterTitle('');
      setRecruiterDepartment('');
      setShowAddForm(false);
      
      fetchCompanyAndRecruiters();

      window.dispatchEvent(new CustomEvent('companyDataUpdated'));
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add recruiter. Make sure the user exists with RECRUITER role.',
        variant: 'destructive',
      });
    } finally {
      setAddingRecruiter(false);
    }
  };

  const handleRemoveRecruiter = async (employerId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName} from your company? They will no longer be able to post jobs.`)) {
      return;
    }

    try {
      await companyService.removeEmployer(company.id, { userId: employerId });

      toast({
        title: 'Success',
        description: 'Recruiter removed successfully',
      });

      fetchCompanyAndRecruiters();

      window.dispatchEvent(new CustomEvent('companyDataUpdated'));
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove recruiter',
        variant: 'destructive',
      });
    }
  };

  const filteredRecruiters = recruiters.filter(emp => 
    emp.user.name.toLowerCase().includes(searchEmail.toLowerCase()) ||
    emp.user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Recruiters</h1>
            <p className="text-gray-600">
              {company?.name} • Add and manage your hiring team
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#6A38C2] hover:bg-[#5b30a6]"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add Recruiter'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Recruiters</p>
                  <p className="text-2xl font-bold">{recruiters.length}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">
                    {recruiters.filter(r => r.isActive).length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {recruiters.filter(r => !r.isActive).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Recruiter Form */}
      {showAddForm && (
        <Card className="mb-6 border-[#6A38C2]">
          <CardHeader>
            <CardTitle>Add New Recruiter</CardTitle>
            <CardDescription>
              Enter the email of a user with RECRUITER role to add them to your company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecruiter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="recruiter@example.com"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    User must have a RECRUITER role account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title (Optional)</Label>
                  <Input
                    id="title"
                    value={recruiterTitle}
                    onChange={(e) => setRecruiterTitle(e.target.value)}
                    placeholder="e.g., Senior Recruiter"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  value={recruiterDepartment}
                  onChange={(e) => setRecruiterDepartment(e.target.value)}
                  placeholder="e.g., Human Resources"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={addingRecruiter}
                  className="bg-[#6A38C2] hover:bg-[#5b30a6]"
                >
                  {addingRecruiter ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Recruiter
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {recruiters.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Recruiters List */}
      {recruiters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recruiters yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add recruiters to your team so they can help post jobs and manage applications
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#6A38C2] hover:bg-[#5b30a6]"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Recruiter
            </Button>
          </CardContent>
        </Card>
      ) : filteredRecruiters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-600">Try searching with a different name or email</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecruiters.map((employer) => (
            <Card key={employer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Recruiter Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#6A38C2] text-white flex items-center justify-center text-xl font-bold shrink-0">
                      {employer.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{employer.user.name}</h3>
                        <Badge variant={employer.isActive ? 'default' : 'secondary'}>
                          {employer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50">
                          {employer.user.role}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{employer.user.email}</span>
                        </div>
                        
                        {employer.title && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{employer.title}</span>
                            {employer.department && (
                              <span className="text-gray-400">• {employer.department}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Joined {new Date(employer.joinedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {employer._count?.jobs !== undefined && (
                          <div className="flex items-center gap-2 text-[#6A38C2] font-medium">
                            <Briefcase className="h-4 w-4" />
                            <span>{employer._count.jobs} jobs posted</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-auto w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/profiles/${employer.user.id}`)}
                      className="w-full"
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRecruiter(employer.userId, employer.user.name)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="mt-8 bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#6A38C2]" />
            How to Add Recruiters
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• The user must already have a CareerForge account with <strong>RECRUITER</strong> role</li>
            <li>• Enter their registered email address to add them to your company</li>
            <li>• Once added, they can post jobs and manage applications on behalf of your company</li>
            <li>• You can remove recruiters at any time without deleting their jobs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyRecruiters;

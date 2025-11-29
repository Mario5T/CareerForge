import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { Briefcase, DollarSign, MapPin, Users } from 'lucide-react';
import employerService from '../../services/employer.service';

const PostJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    positions: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requirements = formData.requirements
        .split('\n')
        .filter(req => req.trim() !== '');

      const jobData = {
        ...formData,
        requirements,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        positions: parseInt(formData.positions) || 1,
      };

      await employerService.createJob(jobData);

      toast({
        title: 'Success!',
        description: 'Job posted successfully.',
      });

      navigate('/employer/jobs');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
          <p className="text-muted-foreground">Fill in the details to create a new job posting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide the basic information about the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description *</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements *</label>
                <Textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Enter each requirement on a new line&#10;e.g.&#10;5+ years of React experience&#10;Strong TypeScript skills&#10;Experience with REST APIs"
                  rows={6}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">Enter each requirement on a new line</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Type *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level *</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior Level</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location *
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA or Remote"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Number of Positions
                </label>
                <Input
                  type="number"
                  name="positions"
                  value={formData.positions}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Compensation
              </CardTitle>
              <CardDescription>Specify the salary range for this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Salary</label>
                  <Input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g. 80000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Maximum Salary</label>
                  <Input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="e.g. 120000"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

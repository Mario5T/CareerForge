import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import api from '../../services/api';
import jobService from '../../services/job.service';
import { PREDEFINED_SKILLS } from '../../constants/skills';
import { X, Plus, Trash2, Edit2, Calendar, MapPin, Briefcase, FileText, Upload, Download, User, Bookmark, DollarSign } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: [],

    education: [],
    resumeOriginalName: '',
    resume: '',
    savedJobs: [],
    applications: [],
  });

  const [experienceForm, setExperienceForm] = useState({
    jobTitle: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    skillsUsed: [],
    certificate: null,
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    university: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    isPresent: false,
    grade: '',
    description: '',
    certificate: null,
  });

  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const response = await api.get('/users/profile');
          const userData = response.data;
          setProfile({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            bio: userData.bio || '',
            skills: Array.isArray(userData.skills) ? userData.skills : [],
            experience: Array.isArray(userData.experience) ? userData.experience : [],
            education: Array.isArray(userData.education) ? userData.education : [],
            resume: userData.resume || '',
            resumeOriginalName: userData.resumeOriginalName || '',
            savedJobs: [],
          });

          // Fetch saved jobs and applications only for job seekers (not employers or recruiters)
          if (user?.role !== 'COMPANY' && user?.role !== 'RECRUITER') {
            // Fetch saved jobs separately
            try {
              const savedJobsResponse = await api.get('/users/saved-jobs');
              setProfile(prev => ({
                ...prev,
                savedJobs: Array.isArray(savedJobsResponse.data) ? savedJobsResponse.data : []
              }));
            } catch (error) {
              console.error('Error fetching saved jobs:', error);
            }

            // Fetch applications
            try {
              const applicationsResponse = await jobService.getMyApplications();
              setProfile(prev => ({
                ...prev,
                applications: Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []
              }));
            } catch (error) {
              console.error('Error fetching applications:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to user data from auth
          setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: Array.isArray(user.skills) ? user.skills : [],
            experience: Array.isArray(user.experience) ? user.experience : [],
            education: Array.isArray(user.education) ? user.education : [],
          });
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...profile.skills];
    newSkills[index] = value;
    setProfile(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkillFromDropdown = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const filteredSkills = PREDEFINED_SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !profile.skills.includes(skill)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/users/profile', {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        skills: profile.skills.filter(skill => skill.trim() !== ''),
        experience: profile.experience,
        education: profile.education,
      });

      // Update profile with response data
      if (response.data && response.data.user) {
        setProfile({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          location: response.data.user.location || '',
          bio: response.data.user.bio || '',
          skills: Array.isArray(response.data.user.skills) ? response.data.user.skills : [],
          experience: Array.isArray(response.data.user.experience) ? response.data.user.experience : [],
          education: Array.isArray(response.data.user.education) ? response.data.user.education : [],
          resume: response.data.user.resume || '',
          resumeOriginalName: response.data.user.resumeOriginalName || '',
          savedJobs: Array.isArray(response.data.user.savedJobs) ? response.data.user.savedJobs : [],
        });
      }

      toast({
        title: 'Success',
        description: response.data?.message || 'Profile updated successfully!',
        variant: 'default',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExperience = () => {
    if (!experienceForm.jobTitle || !experienceForm.company || !experienceForm.startDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newExperience = {
      id: editingExperienceId || Date.now(),
      ...experienceForm,
    };

    if (editingExperienceId) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.map(exp => exp.id === editingExperienceId ? newExperience : exp),
      }));
      setEditingExperienceId(null);
    } else {
      setProfile(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience],
      }));
    }

    setExperienceForm({
      jobTitle: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      skillsUsed: [],
      certificate: null,
    });
    setShowExperienceForm(false);
    toast({
      title: 'Success',
      description: editingExperienceId ? 'Experience updated!' : 'Experience added!',
    });
  };

  const handleDeleteExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
    toast({
      title: 'Success',
      description: 'Experience deleted!',
    });
  };

  const handleEditExperience = (experience) => {
    setExperienceForm(experience);
    setEditingExperienceId(experience.id);
    setShowExperienceForm(true);
  };

  const handleAddEducation = () => {
    if (!educationForm.degree || !educationForm.university || !educationForm.startYear) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newEducation = {
      id: editingEducationId || Date.now(),
      ...educationForm,
    };

    if (editingEducationId) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.map(edu => edu.id === editingEducationId ? newEducation : edu),
      }));
      setEditingEducationId(null);
    } else {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, newEducation],
      }));
    }

    setEducationForm({
      degree: '',
      university: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      isPresent: false,
      grade: '',
      description: '',
      certificate: null,
    });
    setShowEducationForm(false);
    toast({
      title: 'Success',
      description: editingEducationId ? 'Education updated!' : 'Education added!',
    });
  };

  const handleDeleteEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
    toast({
      title: 'Success',
      description: 'Education deleted!',
    });
  };

  const handleEditEducation = (education) => {
    setEducationForm(education);
    setEditingEducationId(education.id);
    setShowEducationForm(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf' &&
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast({
        title: 'Error',
        description: 'Please upload a PDF or DOC/DOCX file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setIsLoading(true);
      const response = await api.put('/users/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(prev => ({
        ...prev,
        resume: response.data.resume,
        resumeOriginalName: response.data.resumeOriginalName
      }));

      toast({
        title: 'Success',
        description: 'Resume uploaded successfully!',
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload resume',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;

    try {
      setIsLoading(true);
      await api.delete('/users/resume');

      setProfile(prev => ({
        ...prev,
        resume: '',
        resumeOriginalName: ''
      }));

      toast({
        title: 'Success',
        description: 'Resume removed successfully!',
      });
    } catch (error) {
      console.error('Resume delete error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove resume',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsaveJob = async (e, jobId) => {
    e.stopPropagation();
    try {
      await api.delete(`/users/saved-jobs/${jobId}`);
      setProfile(prev => ({
        ...prev,
        savedJobs: prev.savedJobs.filter(job => job.id !== jobId)
      }));
      toast({
        title: 'Success',
        description: 'Job removed from saved jobs',
      });
    } catch (error) {
      console.error('Unsave job error:', error);
      toast({
        title: 'Error',
        description: 'Failed to unsave job',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm dark:bg-slate-800 overflow-hidden">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <User className="h-5 w-5" />
                  My Profile
                </button>
                {/* Only show Saved Jobs and Applied Jobs for job seekers (not employers or recruiters) */}
                {user?.role !== 'COMPANY' && user?.role !== 'RECRUITER' && (
                  <>
                    <button
                      onClick={() => setActiveTab('saved-jobs')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'saved-jobs'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <Bookmark className="h-5 w-5" />
                      Saved Jobs
                    </button>
                    <button
                      onClick={() => setActiveTab('applied-jobs')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'applied-jobs'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                      <Briefcase className="h-5 w-5" />
                      Applied Jobs
                    </button>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {activeTab === 'profile' ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your professional information</p>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Personal Information Card */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-medium">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300 font-medium">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={4}
                          className="border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                          placeholder="Tell us about yourself and your professional background..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Card */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Skills & Expertise</CardTitle>
                    <CardDescription>
                      Add skills that highlight your professional capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Display selected skills as badges */}
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700 shadow-sm"
                            >
                              <span>{skill}</span>
                              {isEditing && (
                                <button
                                  onClick={() => removeSkill(index)}
                                  className="hover:text-blue-600 cursor-pointer transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 dark:text-slate-400 text-sm">No skills added yet</p>
                        )}
                      </div>

                      {/* Skill search dropdown */}
                      {isEditing && (
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Search and add skills..."
                            value={skillSearch}
                            onChange={(e) => {
                              setSkillSearch(e.target.value);
                              setShowSkillDropdown(true);
                            }}
                            onFocus={() => setShowSkillDropdown(true)}
                            className="w-full border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                          />

                          {/* Dropdown list */}
                          {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                              {filteredSkills.slice(0, 10).map((skill) => (
                                <button
                                  key={skill}
                                  onClick={() => addSkillFromDropdown(skill)}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-300"
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {/* Work Experience Card */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">Work Experience</CardTitle>
                        <CardDescription>
                          Showcase your professional background and achievements
                        </CardDescription>
                      </div>
                      {isEditing && !showExperienceForm && (
                        <Button
                          onClick={() => setShowExperienceForm(true)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Experience
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {showExperienceForm && (
                      <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                          {editingExperienceId ? 'Edit Experience' : 'Add New Experience'}
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Job Title *</Label>
                              <Input
                                value={experienceForm.jobTitle}
                                onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })}
                                placeholder="e.g., Senior Developer"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Company Name *</Label>
                              <Input
                                value={experienceForm.company}
                                onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                placeholder="e.g., Tech Corp"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Location</Label>
                              <Input
                                value={experienceForm.location}
                                onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                                placeholder="e.g., San Francisco, CA"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Employment Type</Label>
                              <select
                                value={experienceForm.employmentType}
                                onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                              >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                                <option>Remote</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Start Date *</Label>
                              <Input
                                type="month"
                                value={experienceForm.startDate}
                                onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">End Date</Label>
                              <Input
                                type="month"
                                value={experienceForm.endDate}
                                onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                                disabled={experienceForm.currentlyWorking}
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="currentlyWorking"
                              checked={experienceForm.currentlyWorking}
                              onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : experienceForm.endDate })}
                              className="rounded border-slate-300"
                            />
                            <Label htmlFor="currentlyWorking" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                              I currently work here
                            </Label>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300 font-medium">Description</Label>
                            <Textarea
                              value={experienceForm.description}
                              onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                              className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleAddExperience}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {editingExperienceId ? 'Update Experience' : 'Add Experience'}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowExperienceForm(false);
                                setEditingExperienceId(null);
                                setExperienceForm({
                                  jobTitle: '',
                                  company: '',
                                  location: '',
                                  employmentType: 'Full-time',
                                  startDate: '',
                                  endDate: '',
                                  currentlyWorking: false,
                                  description: '',
                                  skillsUsed: [],
                                  certificate: null,
                                });
                              }}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.experience.length > 0 ? (
                      <div className="space-y-4">
                        {profile.experience.map((exp) => (
                          <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{exp.jobTitle}</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{exp.company}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                                  {exp.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {exp.location}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {exp.startDate} {exp.currentlyWorking ? '- Present' : exp.endDate ? `- ${exp.endDate}` : ''}
                                  </div>
                                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                    {exp.employmentType}
                                  </span>
                                </div>
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditExperience(exp)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteExperience(exp.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {exp.description && (
                              <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Your work experience will appear here</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add your first experience to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Education Card */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">Education</CardTitle>
                        <CardDescription>
                          Add your educational background and qualifications
                        </CardDescription>
                      </div>
                      {isEditing && !showEducationForm && (
                        <Button
                          onClick={() => setShowEducationForm(true)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Education
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {showEducationForm && (
                      <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                          {editingEducationId ? 'Edit Education' : 'Add New Education'}
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Degree *</Label>
                              <Input
                                value={educationForm.degree}
                                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                                placeholder="e.g., Bachelor of Science"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">University / College *</Label>
                              <Input
                                value={educationForm.university}
                                onChange={(e) => setEducationForm({ ...educationForm, university: e.target.value })}
                                placeholder="e.g., Stanford University"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Field of Study</Label>
                              <Input
                                value={educationForm.fieldOfStudy}
                                onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })}
                                placeholder="e.g., Computer Science"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Grade / CGPA (Optional)</Label>
                              <Input
                                value={educationForm.grade}
                                onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })}
                                placeholder="e.g., 3.8"
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">Start Year *</Label>
                              <Input
                                type="number"
                                value={educationForm.startYear}
                                onChange={(e) => setEducationForm({ ...educationForm, startYear: e.target.value })}
                                placeholder="e.g., 2020"
                                min="1900"
                                max={new Date().getFullYear()}
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-slate-700 dark:text-slate-300 font-medium">End Year</Label>
                              <Input
                                type="number"
                                value={educationForm.endYear}
                                onChange={(e) => setEducationForm({ ...educationForm, endYear: e.target.value })}
                                placeholder="e.g., 2024"
                                disabled={educationForm.isPresent}
                                min="1900"
                                max={new Date().getFullYear() + 10}
                                className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="isPresent"
                              checked={educationForm.isPresent}
                              onChange={(e) => setEducationForm({ ...educationForm, isPresent: e.target.checked, endYear: e.target.checked ? '' : educationForm.endYear })}
                              className="rounded border-slate-300"
                            />
                            <Label htmlFor="isPresent" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                              I currently study here
                            </Label>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300 font-medium">Description (Optional)</Label>
                            <Textarea
                              value={educationForm.description}
                              onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                              placeholder="Add any additional details about your education..."
                              rows={3}
                              className="border-slate-200 dark:border-slate-600 dark:bg-slate-600 dark:text-white focus:border-blue-500 focus:ring-blue-500 resize-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleAddEducation}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {editingEducationId ? 'Update Education' : 'Add Education'}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowEducationForm(false);
                                setEditingEducationId(null);
                                setEducationForm({
                                  degree: '',
                                  university: '',
                                  fieldOfStudy: '',
                                  startYear: '',
                                  endYear: '',
                                  isPresent: false,
                                  grade: '',
                                  description: '',
                                  certificate: null,
                                });
                              }}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.education.length > 0 ? (
                      <div className="space-y-4">
                        {profile.education.map((edu) => (
                          <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{edu.degree}</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{edu.university}</p>
                                {edu.fieldOfStudy && (
                                  <p className="text-slate-500 dark:text-slate-400 text-sm">{edu.fieldOfStudy}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {edu.startYear} {edu.isPresent ? '- Present' : edu.endYear ? `- ${edu.endYear}` : ''}
                                  </div>
                                  {edu.grade && (
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                                      CGPA: {edu.grade}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleEditEducation(edu)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteEducation(edu.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {edu.description && (
                              <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Your education details will appear here</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add your first education to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Resume Card */}
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                    <CardTitle className="text-xl text-slate-900 dark:text-white">Resume</CardTitle>
                    <CardDescription>
                      Upload your resume to share with employers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {profile.resume ? (
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                              <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                                {profile.resumeOriginalName || 'My Resume'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Uploaded resume
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`http://localhost:5001/${profile.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-full transition-colors"
                              title="Download Resume"
                            >
                              <Download className="h-5 w-5" />
                            </a>
                            {isEditing && (
                              <div className="flex gap-2">
                                <div className="relative">
                                  <input
                                    type="file"
                                    id="resume-update"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    disabled={isLoading}
                                  />
                                  <label
                                    htmlFor="resume-update"
                                    className={`p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-full transition-colors cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Update Resume"
                                  >
                                    <Edit2 className="h-5 w-5" />
                                  </label>
                                </div>
                                <button
                                  onClick={handleResumeDelete}
                                  disabled={isLoading}
                                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                  title="Remove Resume"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg">
                          <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                            <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                            Upload your resume
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                          {isEditing ? (
                            <div className="relative inline-block">
                              <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                disabled={isLoading}
                              />
                              <label
                                htmlFor="resume-upload"
                                className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <Plus className="h-4 w-4" />
                                Select File
                              </label>
                            </div>
                          ) : (
                            <Button
                              onClick={() => setIsEditing(true)}
                              variant="outline"
                              size="sm"
                            >
                              Edit Profile to Upload
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : activeTab === 'saved-jobs' ? (
              /* Saved Jobs Card */
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-700 dark:to-slate-700 border-b dark:border-slate-600">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Saved Jobs</CardTitle>
                  <CardDescription>
                    Jobs you have bookmarked for later
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {profile.savedJobs.length > 0 ? (
                    <div className="grid gap-4">
                      {profile.savedJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow dark:bg-slate-800 cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <div>
                                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {job.title}
                                  </h3>
                                  <p className="text-slate-600 dark:text-slate-400">{job.company?.name}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-4 w-4" />
                                      {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : 'Salary not specified'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={(e) => handleUnsaveJob(e, job.id)}
                              >
                                <Bookmark className="h-5 w-5 fill-current" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed dark:bg-slate-800">
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                          <Bookmark className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No saved jobs</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                          Jobs you save will appear here for easy access.
                        </p>
                        <Button onClick={() => navigate('/jobs')} variant="outline">
                          Browse Jobs
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ) : activeTab === 'applied-jobs' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applied Jobs</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Track the status of your applications</p>
                  </div>
                </div>

                {profile.applications && profile.applications.length > 0 ? (
                  <div className="grid gap-4">
                    {profile.applications.map((application) => (
                      <Card key={application.id} className="hover:shadow-md transition-shadow dark:bg-slate-800 cursor-pointer" onClick={() => navigate(`/jobs/${application.job.id}`)}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div>
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {application.job.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">{application.job.company?.name}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${application.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : application.status === 'REJECTED'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                              {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed dark:bg-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                        <Briefcase className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No applications yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        Start applying to jobs to see them here.
                      </p>
                      <Button onClick={() => navigate('/jobs')} variant="outline">
                        Browse Jobs
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

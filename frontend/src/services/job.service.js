import api from './api';

const jobService = {
  // Get all jobs with optional filters (public endpoint)
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get job by ID (public endpoint)
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create a new job (Recruiter/Admin only)
  createJob: async (jobData) => {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  },

  // Update job (Recruiter/Admin only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/employer/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job (Recruiter/Admin only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  },

  // Apply to a job
  applyToJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },

  // Get applications for a job (Recruiter/Admin only)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/employer/jobs/${jobId}/applicants`);
    return response.data;
  },

  // Get my jobs (for recruiters)
  getMyJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  },

  // Get company jobs
  getCompanyJobs: async () => {
    const response = await api.get('/employer/jobs/company');
    return response.data;
  },

  // Update application status (Recruiter/Admin only)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/jobs/applications/${applicationId}`, { status });
    return response.data;
  },
};

export default jobService;

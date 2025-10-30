import api from './api';

const jobService = {
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },
  createJob: async (jobData) => {
    const response = await api.post('/employer/jobs', jobData);
    return response.data;
  },
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/employer/jobs/${jobId}`, jobData);
    return response.data;
  },
  deleteJob: async (jobId) => {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  },

  applyToJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },
  getJobApplications: async (jobId) => {
    const response = await api.get(`/employer/jobs/${jobId}/applicants`);
    return response.data;
  },
  getMyJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  },
  getCompanyJobs: async () => {
    const response = await api.get('/employer/jobs/company');
    return response.data;
  },
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/jobs/applications/${applicationId}`, { status });
    return response.data;
  },
};

export default jobService;

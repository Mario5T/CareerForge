import api from './api';

export const employerService = {
  createCompanyProfile: async (companyData) => {
    try {
      const response = await api.post('/employer/company', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateCompanyProfile: async (companyData) => {
    try {
      const response = await api.put('/employer/company', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMyCompany: async () => {
    try {
      const response = await api.get('/employer/company');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await api.post('/employer/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyJobs: async () => {
    try {
      const response = await api.get('/employer/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCompanyJobs: async () => {
    try {
      const response = await api.get('/employer/jobs/company');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/employer/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/employer/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getApplicantsForJob: async (jobId) => {
    try {
      const response = await api.get(`/employer/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.patch(`/employer/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  deleteApplication: async (applicationId) => {
    try {
      const response = await api.delete(`/employer/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getDashboardStats: async () => {
    try {
      const response = await api.get('/employer/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default employerService;

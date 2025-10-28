import api from './api';

export const employerService = {
  createCompanyProfile: async (companyData) => {
    try {
      const response = await api.post('/employers/company', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateCompanyProfile: async (companyData) => {
    try {
      const response = await api.put('/employers/company', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getMyCompany: async () => {
    try {
      const response = await api.get('/employers/company');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await api.post('/employers/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyJobs: async () => {
    try {
      const response = await api.get('/employers/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCompanyJobs: async () => {
    try {
      const response = await api.get('/employers/jobs/company');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/employers/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/employers/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getApplicantsForJob: async (jobId) => {
    try {
      const response = await api.get(`/employers/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default employerService;

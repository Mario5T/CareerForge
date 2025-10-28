import api from './api';

export const companyService = {
  getAllCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getCompanyById: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createCompany: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCompany: async (companyId, companyData) => {
    try {
      const response = await api.put(`/companies/${companyId}`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCompany: async (companyId) => {
    try {
      const response = await api.delete(`/companies/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  addEmployer: async (companyId, employerData) => {
    try {
      const response = await api.post(`/companies/${companyId}/employers`, employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  removeEmployer: async (companyId, employerData) => {
    try {
      const response = await api.delete(`/companies/${companyId}/employers`, { data: employerData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getCompanyEmployers: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/employers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default companyService;

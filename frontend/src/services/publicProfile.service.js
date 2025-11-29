import api from './api';

const publicProfileService = {
  getPublicUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPublicRecruiterProfile: async (recruiterId) => {
    try {
      const response = await api.get(`/users/${recruiterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPublicCompanyProfile: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchPublicProfiles: async (query, type = 'all') => {
    try {
      const response = await api.get('/public/profiles/search', {
        params: { q: query, type }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default publicProfileService;

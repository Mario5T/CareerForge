import api from './api';

const publicProfileService = {
  // Get public user profile by ID
  getPublicUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get public recruiter profile by ID (recruiters are users with RECRUITER role)
  getPublicRecruiterProfile: async (recruiterId) => {
    try {
      const response = await api.get(`/users/${recruiterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get public company profile by ID
  getPublicCompanyProfile: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      // Company API returns data wrapped in { success: true, data: {...} }
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search public profiles (optional utility)
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

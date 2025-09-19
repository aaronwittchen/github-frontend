import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Update this with your backend URL if different
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const githubApi = {
  // Get user summary
  async getUserSummary(username: string) {
    try {
      const response = await apiClient.get(`/v1/users/${username}/summary`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
      }
      throw error;
    }
  },

  // Get random repository with optional star range
  async getRandomRepository(params?: { minStars?: number; maxStars?: number }) {
    try {
      const response = await apiClient.get('/v1/repositories/random', { 
        params: {
          min_stars: params?.minStars,
          max_stars: params?.maxStars
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch random repository');
      }
      throw error;
    }
  },
};

export default {
  githubApi,
};

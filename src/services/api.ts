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
  async getUserSummary(username: string, options?: { limit?: number }) {
    try {
      const response = await apiClient.get(`/v1/users/${username}/summary`, {
        params: { limit: options?.limit }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
      }
      throw error;
    }
  },

  // Get repository README
  async getRepositoryReadme(owner: string, repo: string) {
    try {
      console.log(`[API] Fetching README for ${owner}/${repo}`);
      const response = await apiClient.get(`/v1/repos/${owner}/${repo}/readme`);
      
      // Log response summary (without the actual content to avoid cluttering the console)
      console.log(`[API] README response received`, {
        status: response.status,
        hasContent: !!response.data?.content,
        encoding: response.data?.encoding,
        size: response.data?.size
      });
      
      // Return the data directly since we're using response interceptors
      return response.data;
    } catch (error) {
      console.error('[API] Error in getRepositoryReadme:', {
        isAxiosError: axios.isAxiosError(error),
        status: axios.isAxiosError(error) ? error.response?.status : 'N/A',
        message: axios.isAxiosError(error) ? 
          (error.response?.data?.message || error.message) : 
          'Unknown error'
      });
      
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch repository README');
      }
      throw error;
    }
  },

  // Get random repository with optional star range
  async getRandomRepository(
    params?: { minStars?: number; maxStars?: number; language?: string },
    options?: { signal?: AbortSignal }
  ) {
    try {
      const response = await apiClient.get('/v1/repositories/random', { 
        params: {
          min_stars: params?.minStars,
          max_stars: params?.maxStars,
          language: params?.language,
        },
        signal: options?.signal
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.name === 'CanceledError' || (error as any)?.code === 'ERR_CANCELED') {
          throw error; // surface cancellation for callers to handle/ignore
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch random repository');
      }
      throw error;
    }
  },
};

export default {
  githubApi,
};

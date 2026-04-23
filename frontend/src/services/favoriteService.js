import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const favoriteService = {
  getFavorites: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/favorites`, getAuthHeaders());
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Lỗi mạng' };
    }
  },

  toggleFavorite: async (symbol) => {
    try {
      const res = await axios.post(`${API_URL}/api/favorites/toggle`, { symbol }, getAuthHeaders());
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Lỗi mạng' };
    }
  },

  checkFavorite: async (symbol) => {
    try {
      const res = await axios.get(`${API_URL}/api/favorites/${symbol}`, getAuthHeaders());
      return res.data;
    } catch (error) {
      return error.response?.data || { success: false, isFavorited: false };
    }
  }
};

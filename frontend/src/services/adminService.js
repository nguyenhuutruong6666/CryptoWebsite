const API_URL = 'http://localhost:4000/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const adminService = {
  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'Lỗi kết nối máy chủ' };
    }
  }
};

import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7079';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async (token: string) => {
  try {
    const response = await apiClient.get('/api/categories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    return { error: error.response?.data?.message || 'Error fetching categories' };
  }
};

export const getUserFiles = async (token: string) => {
  try {
    const response = await apiClient.get('/api/documents/user-documents', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user files:', error.response?.data || error.message);
    return { error: error.response?.data?.message || 'Error fetching files' };
  }
};

export const getDocumentById = async (id: string, token: string) => {
  try {
    const response = await apiClient.get(`/api/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching document by id:', error.response?.data || error.message);
    return { error: error.response?.data?.message || 'Error fetching document' };
  }
};

export default apiClient;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getUserFiles = async (token: string) => {
  try {
    const response = await apiClient.get('/api/documents/user-documents', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user files:', error);
    throw error;
  }
};
export const getDocumentById = async (id: string, token: string) => {
  try {
    const response = await apiClient.get(`/api/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching document by id:', error);
    throw error;
  }
};
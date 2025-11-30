import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://voyago-backend.vercel.app/api';
const API_BASE = `${API_BASE_URL}/upload`;

export const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(`${API_BASE}/single`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.url;
};

export const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  const response = await axios.post(`${API_BASE}/multiple`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.images.map(img => img.url);
};

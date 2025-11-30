import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://depi-final-project-production.up.railway.app/api';

// Helper to get auth header
const getAuthHeader = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Dashboard
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, getAuthHeader());
  return response.data;
};

// Packages CRUD
export const getPackages = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/packages`, getAuthHeader());
  return response.data;
};

export const getPackageById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/admin/packages/${id}`, getAuthHeader());
  return response.data;
};

export const createPackage = async (packageData) => {
  const response = await axios.post(`${API_BASE_URL}/admin/packages`, packageData, getAuthHeader());
  return response.data;
};

export const updatePackage = async (id, packageData) => {
  const response = await axios.put(`${API_BASE_URL}/admin/packages/${id}`, packageData, getAuthHeader());
  return response.data;
};

export const deletePackage = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/packages/${id}`, getAuthHeader());
  return response.data;
};

// Reviews CRUD
export const getReviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/reviews`, getAuthHeader());
  return response.data;
};

export const approveReview = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/reviews/${id}/approve`, {}, getAuthHeader());
  return response.data;
};

export const rejectReview = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/reviews/${id}/reject`, {}, getAuthHeader());
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/reviews/${id}`, getAuthHeader());
  return response.data;
};

// Contacts
export const getContacts = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/contacts`, getAuthHeader());
  return response.data;
};

export const markContactReplied = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/contacts/${id}/replied`, {}, getAuthHeader());
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/contacts/${id}`, getAuthHeader());
  return response.data;
};

// Stats
export const getStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/stats`, getAuthHeader());
  return response.data;
};

export const updateStat = async (id, statData) => {
  const response = await axios.put(`${API_BASE_URL}/admin/stats/${id}`, statData, getAuthHeader());
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/users`, getAuthHeader());
  return response.data;
};

export const toggleUserAdmin = async (id) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/users/${id}/toggle-admin`, {}, getAuthHeader());
  return response.data;
};

// Services CRUD
export const getServices = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/services`, getAuthHeader());
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axios.post(`${API_BASE_URL}/admin/services`, serviceData, getAuthHeader());
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await axios.put(`${API_BASE_URL}/admin/services/${id}`, serviceData, getAuthHeader());
  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/services/${id}`, getAuthHeader());
  return response.data;
};

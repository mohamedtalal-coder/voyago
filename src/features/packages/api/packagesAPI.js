import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://depi-final-project-production.up.railway.app/api';

// Tour Packages API
export async function getTourPackages() {
  try {
    const res = await axios.get(`${API_BASE_URL}/tourPackages`);
    return res.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
}

export async function getTourPackageById(id) {
  try {
    const res = await axios.get(`${API_BASE_URL}/tourPackages/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching tour package:', error);
    throw error;
  }
}

// Services API
export async function getServices() {
  try {
    const res = await axios.get(`${API_BASE_URL}/services`);
    return res.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}







import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://depi-final-project-production.up.railway.app/api';

// Get all stats for about page
export async function getStats() {
  try {
    const res = await axios.get(`${API_BASE_URL}/stats`);
    return res.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// Update a stat (admin)
export async function updateStat(key, statData) {
  try {
    const res = await axios.put(`${API_BASE_URL}/stats/${key}`, statData);
    return res.data;
  } catch (error) {
    console.error('Error updating stat:', error);
    throw error;
  }
}

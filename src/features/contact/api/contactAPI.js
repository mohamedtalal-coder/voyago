import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://voyago-backend.vercel.app/api';

// Submit contact form
export async function submitContactForm(contactData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/contact`, contactData);
    return res.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

// Get all contact submissions (admin)
export async function getContactSubmissions() {
  try {
    const res = await axios.get(`${API_BASE_URL}/contact`);
    return res.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

// Mark contact as read (admin)
export async function markContactAsRead(contactId) {
  try {
    const res = await axios.patch(`${API_BASE_URL}/contact/${contactId}/read`);
    return res.data;
  } catch (error) {
    console.error('Error marking contact as read:', error);
    throw error;
  }
}

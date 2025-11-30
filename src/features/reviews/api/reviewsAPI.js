import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://depi-final-project-production.up.railway.app/api';

// Get all approved reviews
export async function getReviews() {
  try {
    const res = await axios.get(`${API_BASE_URL}/reviews`);
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

// Get reviews for a specific tour
export async function getReviewsByTour(tourId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/reviews/tour/${tourId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching tour reviews:', error);
    throw error;
  }
}

// Submit a new review
export async function submitReview(reviewData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/reviews`, reviewData);
    return res.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
}

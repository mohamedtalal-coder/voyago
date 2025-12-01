import axios from 'axios';
import { getImageUrl } from '../../../lib/imageUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://voyago-backend.vercel.app/api';

// Tour Packages API
export async function getTourPackages() {
  try {
    const res = await axios.get(`${API_BASE_URL}/tourPackages`);
    // Process images to ensure valid URLs
    return res.data.map(tour => ({
      ...tour,
      img: getImageUrl(tour.img, 'package'),
      subimages: tour.subimages?.map(img => getImageUrl(img, 'package')) || [],
      gallery: tour.gallery?.map(img => getImageUrl(img, 'package')) || [],
    }));
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
}

export async function getTourPackageById(id) {
  try {
    const res = await axios.get(`${API_BASE_URL}/tourPackages/${id}`);
    const tour = res.data;
    // Process images to ensure valid URLs
    return {
      ...tour,
      img: getImageUrl(tour.img, 'package'),
      subimages: tour.subimages?.map(img => getImageUrl(img, 'package')) || [],
      gallery: tour.gallery?.map(img => getImageUrl(img, 'package')) || [],
    };
  } catch (error) {
    console.error('Error fetching tour package:', error);
    throw error;
  }
}

// Services API
export async function getServices() {
  try {
    const res = await axios.get(`${API_BASE_URL}/services`);
    // Process images to ensure valid URLs
    return res.data.map(service => ({
      ...service,
      img: getImageUrl(service.img, 'service'),
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}







import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://voyago-backend.vercel.app/api';

let homeDataCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000;

export const getAllHomeData = async () => {
  try {
    if (homeDataCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return homeDataCache;
    }

    const response = await axios.get(`${API_BASE_URL}/home`);
    homeDataCache = response.data;
    cacheTimestamp = Date.now();
    
    return response.data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};

export const getOffers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/offers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

export const getPromoCodes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/promo-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    throw error;
  }
};

export const validatePromoCode = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/home/promo-codes/validate`, { code });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const getPopularPackages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/popular-packages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular packages:', error);
    throw error;
  }
};

export const getTransportServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/transport-services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transport services:', error);
    throw error;
  }
};

export const getHero = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/hero`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hero data:', error);
    throw error;
  }
};

export const getHomeStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching home stats:', error);
    throw error;
  }
};

export const clearHomeCache = () => {
  homeDataCache = null;
  cacheTimestamp = null;
};

import axios from 'axios';
import { getImageUrl } from '../../../lib/imageUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://depi-final-project-production.up.railway.app/api';

let toursCache = null;
let servicesCacheLocal = null;

const fetchTours = async () => {
  if (toursCache) return toursCache;
  try {
    const res = await axios.get(`${API_BASE_URL}/tourPackages`);
    toursCache = res.data.map(tour => ({
      ...tour,
      img: getImageUrl(tour.img, 'package')
    }));
    return toursCache;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

const fetchServicesLocal = async () => {
  if (servicesCacheLocal) return servicesCacheLocal;
  try {
    const res = await axios.get(`${API_BASE_URL}/services`);
    servicesCacheLocal = res.data;
    return servicesCacheLocal;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const clearSearchCache = () => {
  toursCache = null;
  servicesCacheLocal = null;
};

const parsePrice = (priceStr) => {
  return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
};

const parseDuration = (durationStr) => {
  return parseFloat(durationStr.replace(/[^0-9.]/g, ''));
};

const getDurationCategory = (hours) => {
  if (hours <= 4) return 'halfDay';
  if (hours <= 8) return 'fullDay';
  return 'multiDay';
};

export const searchTours = async ({ query = '', filters = {}, sortBy = 'recommended' }, t) => {
  const tours = await fetchTours();
  let results = [...tours];

  // Text search - search in title (only filter if query is not empty)
  if (query && query.trim()) {
    const searchLower = query.toLowerCase().trim();
    results = results.filter(tour => {
      const title = t ? t(tour.titleKey).toLowerCase() : tour.titleKey.toLowerCase();
      const desc = tour.desc ? tour.desc.toLowerCase() : '';
      return title.includes(searchLower) || desc.includes(searchLower);
    });
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    // For now, all items are tours. Can be extended for other categories
    if (filters.category === 'tours') {
      // Keep all tours
    } else if (filters.category === 'activities') {
      results = results.filter(tour => {
        const title = t ? t(tour.titleKey).toLowerCase() : '';
        return title.includes('tour') || title.includes('tasting');
      });
    } else if (filters.category === 'transportation') {
      results = results.filter(tour => {
        const title = t ? t(tour.titleKey).toLowerCase() : '';
        return title.includes('bike') || title.includes('coach');
      });
    }
  }

  // Filter by price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    results = results.filter(tour => {
      const price = parsePrice(tour.price);
      const minOk = filters.minPrice === undefined || price >= filters.minPrice;
      const maxOk = filters.maxPrice === undefined || price <= filters.maxPrice;
      return minOk && maxOk;
    });
  }

  // Filter by duration
  if (filters.duration && filters.duration !== 'any') {
    results = results.filter(tour => {
      const hours = parseDuration(tour.duration);
      const category = getDurationCategory(hours);
      return category === filters.duration;
    });
  }

  // Filter by rating
  if (filters.minRating) {
    results = results.filter(tour => {
      const rating = parseFloat(tour.rating);
      return rating >= filters.minRating;
    });
  }

  // Sorting
  switch (sortBy) {
    case 'priceLow':
      results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      break;
    case 'priceHigh':
      results.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      break;
    case 'rating':
      results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      break;
    case 'newest':
      results.sort((a, b) => (b.id || 0) - (a.id || 0));
      break;
    case 'recommended':
    default:
      // Keep original order for recommended
      break;
  }

  return results;
};

export const getServices = async () => {
  return await fetchServicesLocal();
};

export const getServiceBySlug = async (slug) => {
  const services = await fetchServicesLocal();
  const serviceMap = {
    'bike-rickshaw': 0,
    'guided-tours': 1,
    'bike-tour': 0,
    'tuscan-hills': 2,
    'transportation': 3,
    'wine-tours': 5,
    'coach-trips': 3,
    'luxury-cars': 4,
  };
  
  const index = serviceMap[slug];
  return index !== undefined ? services[index] : null;
};

export const getToursByService = async (serviceType, t) => {
  const tours = await fetchTours();
  const serviceKeywords = {
    'bike-rickshaw': ['bike', 'lucca'],
    'guided-tours': ['tour', 'guided'],
    'bike-tour': ['bike', 'tour'],
    'tuscan-hills': ['hills', 'tuscan', 'lucca hills'],
    'transportation': ['coach', 'pisa', 'florence'],
    'wine-tours': ['wine', 'tasting', 'tuscany'],
    'coach-trips': ['coach', 'trip'],
    'luxury-cars': ['luxury', 'siena'],
  };

  const keywords = serviceKeywords[serviceType] || [];
  
  if (keywords.length === 0) return tours;

  return tours.filter(tour => {
    const title = t ? t(tour.titleKey).toLowerCase() : tour.titleKey.toLowerCase();
    return keywords.some(keyword => title.includes(keyword));
  });
};

export const getSearchSuggestions = async (query, t) => {
  if (!query || query.length < 2) return [];
  
  const tours = await fetchTours();
  const queryLower = query.toLowerCase();
  const suggestions = [];
  
  tours.forEach(tour => {
    const title = t ? t(tour.titleKey) : tour.titleKey;
    if (title.toLowerCase().includes(queryLower)) {
      suggestions.push({
        type: 'tour',
        title,
        id: tour._id || tour.id,
      });
    }
  });
  
  return suggestions.slice(0, 5);
};

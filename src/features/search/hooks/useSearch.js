import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useDebounce from '../../../hooks/useDebounce';
import { searchTours, getSearchSuggestions } from '../api/searchAPI';

const useSearch = ({ debounceDelay = 300, initialQuery = '' } = {}) => {
  const { t, ready } = useTranslation(['packages', 'search']);

  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: 'all',
    duration: 'any',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isInitialMount = useRef(true);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, debounceDelay);

  // Perform search when debounced query or filters change
  useEffect(() => {
    // Wait for translations to be ready
    if (!ready) return;

    const performSearch = async () => {
      setIsLoading(true);
      
      try {
        // Perform the search (now async)
        const searchResults = await searchTours(
          { 
            query: debouncedQuery, 
            filters, 
            sortBy 
          }, 
          t
        );
        
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
        isInitialMount.current = false;
      }
    };

    performSearch();
  }, [debouncedQuery, filters, sortBy, t, ready]);

  // Get suggestions for autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const newSuggestions = await getSearchSuggestions(query, t);
        setSuggestions(newSuggestions);
      } else {
        setSuggestions([]);
      }
    };
    
    fetchSuggestions();
  }, [query, t]);

  // Handlers
  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
    // Show suggestions only when typing (2+ chars), hide when clearing
    if (newQuery.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      duration: 'any',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
    });
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    // Immediately show all results without waiting for debounce
    if (ready) {
      const performSearch = async () => {
        setIsLoading(true);
        try {
          const searchResults = await searchTours(
            { query: '', filters, sortBy },
            t
          );
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      performSearch();
    }
  }, [ready, filters, sortBy, t]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    // Immediately perform search without waiting for debounce
    if (ready) {
      const performSearch = async () => {
        setIsLoading(true);
        try {
          const searchResults = await searchTours(
            { query: suggestion.title, filters, sortBy },
            t
          );
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      performSearch();
    }
  }, [ready, filters, sortBy, t]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.duration !== 'any') count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    return count;
  }, [filters]);

  return {
    // State
    query,
    debouncedQuery,
    filters,
    sortBy,
    isLoading,
    results,
    suggestions,
    showSuggestions,
    activeFilterCount,
    
    // Handlers
    setQuery: handleQueryChange,
    setFilters,
    setFilter: handleFilterChange,
    setSortBy: handleSortChange,
    clearFilters,
    clearSearch,
    setShowSuggestions,
    handleSuggestionClick,
  };
};

export default useSearch;

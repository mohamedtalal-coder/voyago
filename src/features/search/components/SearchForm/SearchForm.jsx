import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './SearchForm.module.css';

const SearchForm = ({ 
  query, 
  setQuery, 
  filters, 
  setFilter, 
  sortBy, 
  setSortBy, 
  clearFilters,
  clearSearch,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleSuggestionClick,
  activeFilterCount,
  resultsCount
}) => {
  const { t } = useTranslation(['search', 'common']);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    if (clearSearch) {
      clearSearch();
    } else {
      setQuery('');
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };


  return (
    <div className={styles.searchFormContainer}>
      {/* Search Bar */}
      <div className={styles.searchBar} ref={searchRef}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t('search:searchPlaceholder')}
            className={styles.searchInput}
          />
          {query && (
            <button 
              className={styles.clearButton}
              onClick={handleClearSearch}
              type="button"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsDropdown}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <FiSearch className={styles.suggestionIcon} />
                <span>{suggestion.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle & Sort */}
      <div className={styles.controlsRow}>
        <div className={styles.leftControls}>
          <button 
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            onClick={toggleFilters}
          >
            <FiFilter />
            <span>{t('search:filters')}</span>
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {activeFilterCount > 0 && (
            <button 
              className={styles.clearFiltersBtn}
              onClick={clearFilters}
            >
              {t('search:clearFilters')}
            </button>
          )}
        </div>

        <div className={styles.rightControls}>
          <span className={styles.resultsCount}>
            {t('search:resultsFound', { count: resultsCount })}
          </span>
          
          <div className={styles.sortWrapper}>
            <label className={styles.sortLabel}>{t('search:sortBy')}:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="recommended">{t('search:sortOptions.recommended')}</option>
              <option value="priceLow">{t('search:sortOptions.priceLow')}</option>
              <option value="priceHigh">{t('search:sortOptions.priceHigh')}</option>
              <option value="rating">{t('search:sortOptions.rating')}</option>
              <option value="newest">{t('search:sortOptions.newest')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search:category')}</label>
            <select 
              value={filters.category} 
              onChange={(e) => setFilter('category', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">{t('search:categories.all')}</option>
              <option value="tours">{t('search:categories.tours')}</option>
              <option value="activities">{t('search:categories.activities')}</option>
              <option value="transportation">{t('search:categories.transportation')}</option>
              <option value="packages">{t('search:categories.packages')}</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search:duration')}</label>
            <select 
              value={filters.duration} 
              onChange={(e) => setFilter('duration', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="any">{t('search:durationOptions.any')}</option>
              <option value="halfDay">{t('search:durationOptions.halfDay')}</option>
              <option value="fullDay">{t('search:durationOptions.fullDay')}</option>
              <option value="multiDay">{t('search:durationOptions.multiDay')}</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search:priceRange')}</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder={t('search:min', 'Min')}
                value={filters.minPrice || ''}
                onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className={styles.priceInput}
              />
              <span className={styles.priceSeparator}>-</span>
              <input
                type="number"
                placeholder={t('search:max', 'Max')}
                value={filters.maxPrice || ''}
                onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className={styles.priceInput}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search:rating')}</label>
            <select 
              value={filters.minRating || ''} 
              onChange={(e) => setFilter('minRating', e.target.value ? Number(e.target.value) : undefined)}
              className={styles.filterSelect}
            >
              <option value="">{t('search:anyRating', 'Any Rating')}</option>
              <option value="4.5">{t('search:rating45', '4.5+ Stars')}</option>
              <option value="4">{t('search:rating4', '4+ Stars')}</option>
              <option value="3.5">{t('search:rating35', '3.5+ Stars')}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
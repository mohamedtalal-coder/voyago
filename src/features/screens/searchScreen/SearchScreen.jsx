import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FiCalendar, FiClock, FiUsers, FiTruck, FiX } from 'react-icons/fi';
import styles from './SearchScreen.module.css';

// Components
import SearchForm from '../../search/components/SearchForm/SearchForm';
import SearchResultCard from '../../search/components/SearchResultCard/SearchResultCard';
import Loader from '../../../components/Loader/Loader';

// Hooks
import useSearch from '../../search/hooks/useSearch';

const SearchScreen = () => {
  const { t } = useTranslation(['search', 'common', 'home']);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial query from URL params
  const initialQuery = useMemo(() => searchParams.get('q') || '', []);
  
  // Store URL params for display
  const [urlFilters, setUrlFilters] = useState(() => ({
    people: searchParams.get('people'),
    date: searchParams.get('date'),
    time: searchParams.get('time'),
    transport: searchParams.get('transport'),
    tourType: searchParams.get('tourType'),
  }));
  
  const {
    query,
    setQuery,
    filters,
    setFilter,
    sortBy,
    setSortBy,
    clearFilters,
    clearSearch,
    isLoading,
    results,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSuggestionClick,
    activeFilterCount,
  } = useSearch({ debounceDelay: 300, initialQuery });

  // Update URL filters when search params change (for back/forward navigation)
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const people = searchParams.get('people');
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const transport = searchParams.get('transport');
    const tourType = searchParams.get('tourType');
    
    // Only update query if it's different from current
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
    
    // Store URL filters for display
    setUrlFilters({
      people: people,
      date: date,
      time: time,
      transport: transport,
      tourType: tourType,
    });
  }, [searchParams]);

  // Remove a URL filter
  const removeUrlFilter = (filterKey) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterKey);
    setSearchParams(newParams);
    setUrlFilters(prev => ({ ...prev, [filterKey]: null }));
  };

  // Clear all URL filters
  const clearAllUrlFilters = () => {
    setSearchParams({});
    setUrlFilters({
      people: null,
      date: null,
      time: null,
      transport: null,
      tourType: null,
    });
    clearSearch();
    clearFilters();
  };

  // Check if any URL filters are active
  const hasUrlFilters = Object.values(urlFilters).some(v => v !== null);

  return (
    <div className={styles.searchScreen}>
      <Container className={styles.container}>
        {/* Page Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t('search:title')}</h1>
        </div>

        {/* Active Filters from Home Page */}
        {hasUrlFilters && (
          <div className={styles.activeFilters}>
            <div className={styles.filtersHeader}>
              <span className={styles.filtersLabel}>{t('search:activeFilters', 'Your search criteria')}:</span>
              <button className={styles.clearAllBtn} onClick={clearAllUrlFilters}>
                {t('search:clearAll', 'Clear All')}
              </button>
            </div>
            <div className={styles.filterTags}>
              {urlFilters.tourType && (
                <span className={styles.filterTag}>
                  {urlFilters.tourType === 'public' ? t('home:public_tours_tab', 'Public Tour') : t('home:private_tours_tab', 'Private Tour')}
                  <button onClick={() => removeUrlFilter('tourType')}><FiX /></button>
                </span>
              )}
              {urlFilters.people && (
                <span className={styles.filterTag}>
                  <FiUsers /> {urlFilters.people} {t('common:people', 'People')}
                  <button onClick={() => removeUrlFilter('people')}><FiX /></button>
                </span>
              )}
              {urlFilters.date && (
                <span className={styles.filterTag}>
                  <FiCalendar /> {urlFilters.date}
                  <button onClick={() => removeUrlFilter('date')}><FiX /></button>
                </span>
              )}
              {urlFilters.time && (
                <span className={styles.filterTag}>
                  <FiClock /> {urlFilters.time}
                  <button onClick={() => removeUrlFilter('time')}><FiX /></button>
                </span>
              )}
              {urlFilters.transport && (
                <span className={styles.filterTag}>
                  <FiTruck /> {urlFilters.transport}
                  <button onClick={() => removeUrlFilter('transport')}><FiX /></button>
                </span>
              )}
              {query && (
                <span className={styles.filterTag}>
                  {t('search:tour', 'Tour')}: {query}
                  <button onClick={() => { clearSearch(); removeUrlFilter('q'); }}><FiX /></button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search Form */}
        <SearchForm
          query={query}
          setQuery={setQuery}
          filters={filters}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          clearSearch={clearSearch}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          handleSuggestionClick={handleSuggestionClick}
          activeFilterCount={activeFilterCount}
          resultsCount={results.length}
        />

        {/* Results Section */}
        <div className={styles.resultsSection}>
          {isLoading ? (
            <div className={styles.loaderWrapper}>
              <Loader />
            </div>
          ) : results.length > 0 ? (
            <div className={styles.resultsList}>
              {results.map((tour, index) => (
                <SearchResultCard 
                  key={tour._id || tour.id} 
                  tour={tour} 
                  searchFilters={urlFilters}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>{t('search:noResults')}</h3>
              <p className={styles.noResultsMessage}>{t('search:noResultsMessage')}</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SearchScreen;
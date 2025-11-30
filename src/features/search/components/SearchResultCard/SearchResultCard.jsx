import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiTruck, 
  FiWatch, 
  FiUser, 
  FiGlobe, 
  FiDollarSign
} from 'react-icons/fi';
import styles from './SearchResultCard.module.css';

const SearchResultCard = ({ tour, searchFilters = {} }) => {
  const { t } = useTranslation(['packages', 'search', 'common']);
  const navigate = useNavigate();

  // Use search filters if provided, otherwise use defaults
  const displayDate = searchFilters.date || t('search:flexible', 'Flexible');
  const displayTime = searchFilters.time || '15:00';
  const displayPeople = searchFilters.people ? `${searchFilters.people}` : '15-30';
  const displayTransport = searchFilters.transport || t('search:transportation', 'Bus');

  const handleBookNow = () => {
    navigate('/booking', { 
      state: { 
        packageId: tour._id || tour.id,
        packageName: t(tour.titleKey),
        packagePrice: tour.price,
        packageImage: tour.img,
        selectedDate: searchFilters.date || null,
        selectedTime: searchFilters.time || null,
        numberOfPeople: searchFilters.people || null,
      } 
    });
  };

  const handleViewTour = () => {
    navigate(`/packages/${tour._id || tour.id}`);
  };

  // Extract price number
  const priceValue = tour.price.replace(/[^0-9]/g, '');

  return (
    <div className={styles.card}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        <img 
          src={tour.img} 
          alt={t(tour.titleKey)} 
          className={styles.image}
        />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <h3 className={styles.title}>{t(tour.titleKey)}</h3>
        
        {/* Details in Two Columns */}
        <div className={styles.detailsWrapper}>
          {/* Left Column */}
          <div className={styles.detailColumn}>
            <div className={styles.detailItem}>
              <FiCalendar className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('search:date', 'Date')}:</span>
              <span className={styles.detailValue}>{displayDate}</span>
            </div>
            <div className={styles.detailItem}>
              <FiClock className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('search:time', 'Time')}:</span>
              <span className={styles.detailValue}>{displayTime}</span>
            </div>
            <div className={styles.detailItem}>
              <FiUsers className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('packages:group', 'Number of group')}:</span>
              <span className={styles.detailValue}>{displayPeople}</span>
            </div>
            <div className={styles.detailItem}>
              <FiTruck className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('search:transportation', 'Transportation')}:</span>
              <span className={styles.detailValue}>{displayTransport}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.detailColumn}>
            <div className={styles.detailItem}>
              <FiWatch className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('packages:duration', 'Duration')}:</span>
              <span className={styles.detailValue}>{tour.duration}</span>
            </div>
            <div className={styles.detailItem}>
              <FiUser className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('packages:guide', 'Guide service')}:</span>
              <span className={styles.detailValue}>{t('search:included', 'Included')}</span>
            </div>
            <div className={styles.detailItem}>
              <FiGlobe className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('packages:language', 'Language')}:</span>
              <span className={styles.detailValue}>{t('packages:languagesList', 'English, Italian')}</span>
            </div>
            <div className={styles.detailItem}>
              <FiDollarSign className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('packages:fees', 'Entry Fees')}:</span>
              <span className={styles.detailValue}>{t('packages:feesIncluded', 'Included')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Actions Section */}
      <div className={styles.priceSection}>
        <div className={styles.priceWrapper}>
          <span className={styles.priceLabel}>{t('search:from', 'from')}</span>
          <span className={styles.price}>{priceValue} <span className={styles.currency}>€</span></span>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.viewButton}
            onClick={handleViewTour}
          >
            {t('search:viewTour', 'View tour')}
          </button>
          <button 
            className={styles.bookButton}
            onClick={handleBookNow}
          >
            {t('packages:bookNow', 'Book Now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
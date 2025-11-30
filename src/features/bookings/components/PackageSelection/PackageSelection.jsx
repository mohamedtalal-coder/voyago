import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useBookingStore from '../../../../store/booking/useBookingStore';
import { getTourPackages } from '../../../packages/api/packagesAPI';
import styles from './PackageSelection.module.css';
import DateTimePicker from '../../../../components/DateTimePicker/DateTimePicker';
import { getImageUrl, handleImageError } from '../../../../lib/imageUtils';

function PackageSelection({ onNext }) {
  const { t, i18n } = useTranslation(['packages', 'booking', 'common']);
  const isRTL = i18n.dir() === 'rtl';
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const packageInfo = useBookingStore((state) => state.packageInfo);
  const tickets = useBookingStore((state) => state.tickets);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTime = useBookingStore((state) => state.selectedTime);
  
  const setPackage = useBookingStore((state) => state.setPackage);
  const updateTicketCount = useBookingStore((state) => state.updateTicketCount);
  const setDateTime = useBookingStore((state) => state.setDateTime);
  const calculateTotal = useBookingStore((state) => state.calculateTotal);

  const [localDate, setLocalDate] = useState(selectedDate ? new Date(selectedDate) : null);
  const [localTime, setLocalTime] = useState(selectedTime ? new Date(`1970-01-01T${selectedTime}`) : null);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getTourPackages();
        // Fix image paths using imageUtils
        const toursWithFixedImages = data.map(tour => ({
          ...tour,
          img: getImageUrl(tour.img, 'package')
        }));
        setTours(toursWithFixedImages);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const handlePackageSelect = (tour) => {
    setPackage(tour);
  };

  const handleTicketChange = (type, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    updateTicketCount(type, newValue);
  };

  const handleSubmit = () => {
    if (!packageInfo) {
      alert(t('booking:selectPackageAlert', 'Please select a package'));
      return;
    }

    if (tickets.adult === 0 && tickets.child === 0) {
      alert(t('booking:selectTicketsAlert', 'Please select at least one adult or child ticket'));
      return;
    }

    if (!localDate || !localTime) {
      alert(t('booking:selectDateTimeAlert', 'Please select date and time'));
      return;
    }

    // Format date and time for storage
    const formattedDate = localDate.toISOString().split('T')[0];
    const formattedTime = localTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    
    setDateTime(formattedDate, formattedTime);
    onNext();
  };

  const totalPrice = calculateTotal();

  if (loading) {
    return <div className={styles.container}>{t('common:loading', 'Loading...')}</div>;
  }

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('booking:selectPackage', 'Choose Your Adventure')}</h2>
      
      <div className={styles.packages}>
        {tours.map(tour => (
          <div 
            key={tour._id}
            className={`${styles.packageCard} ${(packageInfo?._id === tour._id || packageInfo?.id === tour._id) ? styles.selected : ''}`}
            onClick={() => handlePackageSelect(tour)}
          >
            <img src={tour.img} alt={t(tour.titleKey)} className={styles.packageImage} loading="lazy" onError={(e) => handleImageError(e, 'package')} />
            <div className={styles.packageInfo}>
              <h3 className={styles.packageName}>{t(tour.titleKey)}</h3>
              <p className={styles.packageDescription}>{t(tour.desc || 'packages:defaultDescription')}</p>
              <div className={styles.packageDetails}>
                <span className={styles.duration}>{tour.duration}</span>
                <span className={styles.price}>{t('booking:from', 'From')} {tour.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packageInfo && (
        <div className={styles.selectionSection}>
          {/* Date & Time Selection */}
          <div className={styles.dateTimeSection}>
            <h3 className={styles.sectionTitle}>{t('booking:selectDateTime', 'Select Date & Time')}</h3>
            <div className={styles.dateTimeRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking:date', 'Date')}</label>
                <DateTimePicker
                  mode="date"
                  selected={localDate}
                  onChange={setLocalDate}
                  placeholder={t('booking:selectDate', 'Select date')}
                  minDate={new Date()}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('booking:time', 'Time')}</label>
                <DateTimePicker
                  mode="time"
                  selected={localTime}
                  onChange={setLocalTime}
                  placeholder={t('booking:selectTime', 'Select time')}
                  timeIntervals={30}
                />
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className={styles.ticketSelection}>
            <h3 className={styles.sectionTitle}>{t('booking:selectTickets', 'Select Tickets')}</h3>
            
            <div className={styles.ticketRow}>
              <div className={styles.ticketInfo}>
                <span className={styles.ticketType}>{t('booking:adult', 'Adult')} (18+)</span>
                <span className={styles.ticketPrice}>€{packageInfo.adultPrice?.toFixed(2)}</span>
              </div>
              <div className={styles.ticketControls}>
                <button 
                  onClick={() => handleTicketChange('adult', tickets.adult - 1)}
                  className={styles.ticketButton}
                >-</button>
                <span className={styles.ticketCount}>{tickets.adult}</span>
                <button 
                  onClick={() => handleTicketChange('adult', tickets.adult + 1)}
                  className={styles.ticketButton}
                >+</button>
              </div>
            </div>

            <div className={styles.ticketRow}>
              <div className={styles.ticketInfo}>
                <span className={styles.ticketType}>{t('booking:child', 'Child')} (6-17)</span>
                <span className={styles.ticketPrice}>€{packageInfo.childPrice?.toFixed(2)}</span>
              </div>
              <div className={styles.ticketControls}>
                <button 
                  onClick={() => handleTicketChange('child', tickets.child - 1)}
                  className={styles.ticketButton}
                >-</button>
                <span className={styles.ticketCount}>{tickets.child}</span>
                <button 
                  onClick={() => handleTicketChange('child', tickets.child + 1)}
                  className={styles.ticketButton}
                >+</button>
              </div>
            </div>

            <div className={styles.ticketRow}>
              <div className={styles.ticketInfo}>
                <span className={styles.ticketType}>{t('booking:infant', 'Infant')} (0-5)</span>
                <span className={styles.ticketPrice}>{t('booking:free', 'Free')}</span>
              </div>
              <div className={styles.ticketControls}>
                <button 
                  onClick={() => handleTicketChange('infant', tickets.infant - 1)}
                  className={styles.ticketButton}
                >-</button>
                <span className={styles.ticketCount}>{tickets.infant}</span>
                <button 
                  onClick={() => handleTicketChange('infant', tickets.infant + 1)}
                  className={styles.ticketButton}
                >+</button>
              </div>
            </div>

            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>{t('booking:total', 'Total')}:</span>
              <span className={styles.totalPrice}>€{totalPrice.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleSubmit}
              className={styles.nextButton}
              disabled={totalPrice === 0 || !localDate || !localTime}
            >
              {t('booking:continueToTraveler', 'Continue to Traveler Info')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageSelection;

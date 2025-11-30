import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useServiceBookingStore from '../../../../store/booking/useServiceBookingStore';
import styles from './ServiceSelection.module.css';
import DateTimePicker from '../../../../components/DateTimePicker/DateTimePicker';
import { FiChevronDown, FiMinus, FiPlus } from 'react-icons/fi';

// Service type options based on service slug
const serviceTypeOptions = {
  'bike-rickshaw': [
    { value: 'city', labelKey: 'bikeTypes.city' },
    { value: 'mountain', labelKey: 'bikeTypes.mountain' },
    { value: 'electric', labelKey: 'bikeTypes.electric' },
    { value: 'road', labelKey: 'bikeTypes.road' },
  ],
  'guided-tours': [
    { value: 'walking', labelKey: 'tourTypes.walking' },
    { value: 'bike', labelKey: 'tourTypes.bike' },
    { value: 'bus', labelKey: 'tourTypes.bus' },
    { value: 'private', labelKey: 'tourTypes.private' },
  ],
  'tuscan-hills': [
    { value: 'standard', labelKey: 'hillTypes.standard' },
    { value: 'premium', labelKey: 'hillTypes.premium' },
    { value: 'private', labelKey: 'hillTypes.private' },
  ],
  'transportation': [
    { value: 'shuttle', labelKey: 'transportTypes.shuttle' },
    { value: 'minibus', labelKey: 'transportTypes.minibus' },
    { value: 'coach', labelKey: 'transportTypes.coach' },
  ],
  'luxury-cars': [
    { value: 'sedan', labelKey: 'carTypes.sedan' },
    { value: 'suv', labelKey: 'carTypes.suv' },
    { value: 'limousine', labelKey: 'carTypes.limousine' },
  ],
  'wine-tours': [
    { value: 'half_day', labelKey: 'wineTypes.halfDay' },
    { value: 'full_day', labelKey: 'wineTypes.fullDay' },
    { value: 'premium', labelKey: 'wineTypes.premium' },
  ],
};

const durationOptions = [
  { value: '1 hour', labelKey: 'duration.1hour' },
  { value: '2 hours', labelKey: 'duration.2hours' },
  { value: '3 hours', labelKey: 'duration.3hours' },
  { value: 'Half day', labelKey: 'duration.halfDay' },
  { value: 'Full day', labelKey: 'duration.fullDay' },
];

function ServiceSelection({ onNext }) {
  const { t, i18n } = useTranslation(['booking', 'bikeBooking', 'packages']);
  const isRTL = i18n.dir() === 'rtl';
  
  // Get store state and actions
  const serviceInfo = useServiceBookingStore((state) => state.serviceInfo);
  const serviceType = useServiceBookingStore((state) => state.serviceType);
  const quantity = useServiceBookingStore((state) => state.quantity);
  const duration = useServiceBookingStore((state) => state.duration);
  const selectedDate = useServiceBookingStore((state) => state.selectedDate);
  const selectedTime = useServiceBookingStore((state) => state.selectedTime);
  
  const setServiceType = useServiceBookingStore((state) => state.setServiceType);
  const setQuantity = useServiceBookingStore((state) => state.setQuantity);
  const setDuration = useServiceBookingStore((state) => state.setDuration);
  const setDateTime = useServiceBookingStore((state) => state.setDateTime);
  const calculateTotal = useServiceBookingStore((state) => state.calculateTotal);

  // Local state
  const [localDate, setLocalDate] = useState(selectedDate ? new Date(selectedDate) : null);
  const [localTime, setLocalTime] = useState(selectedTime ? new Date(`1970-01-01T${selectedTime}`) : null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setTypeDropdownOpen(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available service types for current service
  const availableTypes = serviceInfo?.slug ? (serviceTypeOptions[serviceInfo.slug] || []) : [];
  const selectedTypeOption = availableTypes.find(opt => opt.value === serviceType);
  const selectedDurationOption = durationOptions.find(opt => opt.value === duration);

  const handleTypeSelect = (value) => {
    setServiceType(value);
    setTypeDropdownOpen(false);
  };

  const handleDurationSelect = (value) => {
    setDuration(value);
    setDurationDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (!serviceType) {
      alert(t('booking:selectServiceTypeAlert', 'Please select a service type'));
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

  if (!serviceInfo) {
    return (
      <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={styles.noService}>
          <h2>{t('booking:noServiceSelected', 'No Service Selected')}</h2>
          <p>{t('booking:pleaseSelectService', 'Please select a service from the services page.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('booking:configureService', 'Configure Your Service')}</h2>
      
      {/* Service Info Card */}
      <div className={styles.serviceCard}>
        {serviceInfo.img && (
          <img src={serviceInfo.img} alt={t(serviceInfo.titleKey)} className={styles.serviceImage} loading="lazy" />
        )}
        <div className={styles.serviceDetails}>
          <h3 className={styles.serviceName}>{t(serviceInfo.titleKey)}</h3>
          <p className={styles.serviceDesc}>{t(serviceInfo.descKey)}</p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className={styles.configSection}>
        {/* Service Type Selection */}
        <div className={styles.field}>
          <label className={styles.label}>{t('booking:serviceType', 'Service Type')}</label>
          <div className={styles.customDropdown} ref={typeDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownTrigger} ${serviceType ? styles.hasValue : ''}`}
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            >
              <span>
                {selectedTypeOption 
                  ? t(`bikeBooking:${selectedTypeOption.labelKey}`, selectedTypeOption.value) 
                  : t('booking:selectType', 'Select type')}
              </span>
              <FiChevronDown className={`${styles.dropdownIcon} ${typeDropdownOpen ? styles.open : ''}`} />
            </button>
            {typeDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {availableTypes.map(option => (
                  <li
                    key={option.value}
                    className={`${styles.dropdownItem} ${serviceType === option.value ? styles.selected : ''}`}
                    onClick={() => handleTypeSelect(option.value)}
                  >
                    {t(`bikeBooking:${option.labelKey}`, option.value)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Duration Selection */}
        <div className={styles.field}>
          <label className={styles.label}>{t('booking:duration', 'Duration')}</label>
          <div className={styles.customDropdown} ref={durationDropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownTrigger} ${duration ? styles.hasValue : ''}`}
              onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
            >
              <span>
                {selectedDurationOption 
                  ? t(`booking:${selectedDurationOption.labelKey}`, selectedDurationOption.value) 
                  : t('booking:selectDuration', 'Select duration')}
              </span>
              <FiChevronDown className={`${styles.dropdownIcon} ${durationDropdownOpen ? styles.open : ''}`} />
            </button>
            {durationDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {durationOptions.map(option => (
                  <li
                    key={option.value}
                    className={`${styles.dropdownItem} ${duration === option.value ? styles.selected : ''}`}
                    onClick={() => handleDurationSelect(option.value)}
                  >
                    {t(`booking:${option.labelKey}`, option.value)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date & Time Selection */}
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

        {/* Quantity Selection */}
        <div className={styles.quantitySection}>
          <label className={styles.label}>{t('booking:quantity', 'Quantity')}</label>
          <div className={styles.quantityControls}>
            <button 
              onClick={() => setQuantity(quantity - 1)}
              className={styles.quantityButton}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className={styles.quantityButton}
            >
              <FiPlus />
            </button>
          </div>
        </div>

        {/* Total & Submit */}
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{t('booking:total', 'Total')}:</span>
            <span className={styles.totalPrice}>€{totalPrice.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleSubmit}
            className={styles.nextButton}
            disabled={!serviceType || !localDate || !localTime}
          >
            {t('booking:continueToDetails', 'Continue to Your Details')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceSelection;

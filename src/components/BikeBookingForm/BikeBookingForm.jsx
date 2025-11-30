import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import styles from './BikeBookingForm.module.css';
import { motion } from 'framer-motion';
import bikeImage from '../../assets/images/Common/bike.png'; 
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import { FiChevronDown } from 'react-icons/fi';
import useServiceBookingStore from '../../store/booking/useServiceBookingStore';

const BikeBookingForm = ({ serviceSlug = 'bike-rickshaw', serviceTitleKey = 'packages:services.bike.title', serviceDescKey = 'packages:services.bike.desc', serviceImg = null }) => {
  const { t } = useTranslation('bikeBooking');
  const navigate = useNavigate();
  
  // Service booking store
  const setService = useServiceBookingStore(state => state.setService);
  const prefillFromForm = useServiceBookingStore(state => state.prefillFromForm);
  const resetBooking = useServiceBookingStore(state => state.resetBooking);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (value) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
    setDropdownOpen(false);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    
    // Reset any previous booking
    resetBooking();
    
    // Set the service info
    setService({
      slug: serviceSlug,
      titleKey: serviceTitleKey,
      descKey: serviceDescKey,
      img: serviceImg || bikeImage
    });
    
    // Pre-fill the form data
    prefillFromForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      date: selectedDate,
      time: selectedTime
    });
    
    // Navigate to service booking
    navigate("/service-booking");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const serviceTypes = [
    { value: 'city', label: t('bikeTypes.city') },
    { value: 'mountain', label: t('bikeTypes.mountain') },
    { value: 'electric', label: t('bikeTypes.electric') },
    { value: 'road', label: t('bikeTypes.road') },
  ];

  const selectedService = serviceTypes.find(s => s.value === formData.serviceType);

  return (
    <section className={styles.bookingSection}>
      <h2 className={styles.sectionTitle}>{t('form.bookNowBike', 'Book Now Bike')}</h2>
      
      <div className={styles.contentWrapper}>
        <motion.div 
          className={styles.formContainer}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.formBox}>
            <form onSubmit={handleBooking}>
              <div className={styles.formGrid}>
                {/* Name Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    className={styles.input}
                    placeholder={t('form.namePlaceholder', 'Enter your name and surname')}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.email')}</label>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    placeholder={t('form.emailPlaceholder', 'Enter your email address')}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    className={styles.input}
                    placeholder={t('form.phonePlaceholder', 'Enter your telephone number')}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Service Type Dropdown */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.service')}</label>
                  <div className={styles.customDropdown} ref={dropdownRef}>
                    <button
                      type="button"
                      className={`${styles.dropdownTrigger} ${formData.serviceType ? styles.hasValue : ''}`}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>
                        {selectedService ? selectedService.label : t('form.selectService', 'Select the service types')}
                      </span>
                      <FiChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.open : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <ul className={styles.dropdownMenu}>
                        {serviceTypes.map(option => (
                          <li
                            key={option.value}
                            className={`${styles.dropdownItem} ${formData.serviceType === option.value ? styles.selected : ''}`}
                            onClick={() => handleServiceSelect(option.value)}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Date Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.date', 'Date')}</label>
                  <DateTimePicker
                    mode="date"
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    placeholder={t('form.datePlaceholder', 'Select the date')}
                    minDate={new Date()}
                  />
                </div>

                {/* Time Field */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('form.time', 'Time')}</label>
                  <DateTimePicker
                    mode="time"
                    selected={selectedTime}
                    onChange={setSelectedTime}
                    placeholder={t('form.timePlaceholder', 'Select the time')}
                    timeIntervals={30}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className={styles.buttonWrapper}>
                <button type="submit" className={styles.submitButton}>
                  {t('form.button')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div 
          className={styles.imageContainer}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={bikeImage}
            alt="Mountain Bike"
            className={styles.bikeImage}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BikeBookingForm;

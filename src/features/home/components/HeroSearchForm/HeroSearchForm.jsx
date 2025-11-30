import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiClock, FiFlag, FiTruck, FiSearch, FiGlobe } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { FaChevronDown } from 'react-icons/fa';
import styles from './HeroSearchForm.module.css';

const peopleOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
];

const tourOptions = [
  { value: 'lucca_bike', label: 'tour_lucca_bike', searchTerm: 'Lucca Bike' },
  { value: 'book_bike', label: 'tour_book_bike', searchTerm: 'Bike' },
  { value: 'outside_lucca', label: 'tour_outside_lucca', searchTerm: 'Lucca Hills' },
  { value: 'wine_tasting', label: 'tour_wine_tasting', searchTerm: 'Wine' },
  { value: 'cinque_terre', label: 'tour_cinque_terre', searchTerm: 'Cinque Terre' },
  { value: 'siena', label: 'tour_siena', searchTerm: 'Siena' },
  { value: 'pisa_lucca', label: 'tour_pisa_lucca', searchTerm: 'Pisa' },
];

const transportationOptions = [
  { value: 'minivan_bus', label: 'trans_minivan_bus', searchTerm: 'Coach' },
  { value: 'transfers_ncc', label: 'trans_transfers_ncc', searchTerm: 'Tour' },
  { value: 'luxury_exp', label: 'trans_luxury_exp', searchTerm: 'Luxury' },
];

const CalendarMock = ({ onSelectDate, selectedDate, onClose }) => {
  const { t } = useTranslation('home');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    t('month_january'), t('month_february'), t('month_march'),
    t('month_april'), t('month_may'), t('month_june'),
    t('month_july'), t('month_august'), t('month_september'),
    t('month_october'), t('month_november'), t('month_december')
  ];

  const daysOfWeek = [
    t('day_sunday_short'), t('day_monday_short'), t('day_tuesday_short'),
    t('day_wednesday_short'), t('day_thursday_short'), t('day_friday_short'),
    t('day_saturday_short')
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleSelect = (day) => {
    const fullDate = new Date(currentYear, currentMonth, day)
      .toISOString().split('T')[0];
    onSelectDate(fullDate);
    onClose();
  };

  return (
    <div className={styles.calendarMock}>
      <div className={styles.calendarHeader}>
        <span className={styles.monthName}>
          {monthNames[currentMonth]} {currentYear}
        </span>
        <div className={styles.navButtons}>
          <span onClick={handlePrevMonth}>{'<'}</span>
          <span onClick={handleNextMonth}>{'>'}</span>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {daysOfWeek.map(d => (
          <span key={d} className={styles.dayHeader}>{d}</span>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <span key={`empty-${i}`} className={styles.calendarDay}></span>
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const fullDate = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
          const isSelected = fullDate === selectedDate;
          return (
            <span
              key={fullDate}
              className={`${styles.calendarDay} ${isSelected ? styles.selectedDay : ''}`}
              onClick={(e) => { e.stopPropagation(); handleSelect(day); }}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const TimePickerMock = ({ onSelectTime, selectedTime }) => {
  const { t } = useTranslation('home');
  const times = ['1:00 am', '2:00 am', '3:00 am', '4:00 am', '5:00 am', '6:00 am', '7:00 am'];
  return (
    <div className={styles.timePickerMock}>
      {times.map((time, index) => (
        <div
          key={index}
          className={`${styles.timeOption} ${time === selectedTime ? styles.selectedTime : ''}`}
          onClick={(e) => { e.stopPropagation(); onSelectTime(time); }}
        >
          {t(`time_${time.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`, time)}
        </div>
      ))}
    </div>
  );
};

function HeroSearchForm() {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const [tourType, setTourType] = useState('public');
  const [formData, setFormData] = useState({
    numberOfPeople: '',
    date: '',
    time: '',
    tour: '',
    transportation: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const calendarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const toggleDropdown = (field) => {
    setActiveDropdown(activeDropdown === field ? null : field);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search query from selected options
    const searchParams = new URLSearchParams();
    
    // Get search term from selected tour
    if (formData.tour) {
      const selectedTour = tourOptions.find(opt => opt.value === formData.tour);
      if (selectedTour?.searchTerm) {
        searchParams.set('q', selectedTour.searchTerm);
      }
    }
    
    // Add other filters as URL params
    if (formData.numberOfPeople) {
      searchParams.set('people', formData.numberOfPeople);
    }
    if (formData.date) {
      searchParams.set('date', formData.date);
    }
    if (formData.time) {
      searchParams.set('time', formData.time);
    }
    if (formData.transportation) {
      const selectedTransport = transportationOptions.find(opt => opt.value === formData.transportation);
      if (selectedTransport?.searchTerm) {
        searchParams.set('transport', selectedTransport.searchTerm);
      }
    }
    searchParams.set('tourType', tourType);
    
    // Navigate to search page with params
    navigate(`/search?${searchParams.toString()}`);
  };

  const getDisplayValue = (fieldName, options = []) => {
    const value = formData[fieldName];
    if (!value) return '';

    if (fieldName === 'numberOfPeople') return value;

    if (fieldName === 'date' || fieldName === 'time') return value;

    const option = options.find(opt => opt.value === value);
    return option ? t(option.label) : value;
  };

  const renderDropdown = (field, options, labelKey, placeholderKey) => (
    <div className={`${styles.formField} ${activeDropdown === field ? styles.activeField : ''}`}>
      <div className={styles.fieldHeader} onClick={() => toggleDropdown(field)}>
        {field === 'numberOfPeople' && <FiUsers className={styles.fieldIcon} />}
        {field === 'date' && <FiCalendar className={styles.fieldIcon} />}
        {field === 'time' && <FiClock className={styles.fieldIcon} />}
        {field === 'tour' && <FiFlag className={styles.fieldIcon} />}
        {field === 'transportation' && <FiTruck className={styles.fieldIcon} />}
        <span className={styles.fieldLabel}>{t(labelKey)}</span>
      </div>

      <div className={styles.inputContainer} onClick={() => toggleDropdown(field)}>
        <span className={`${styles.input} ${!formData[field] ? styles.placeholder : ''}`}>
          {getDisplayValue(field, options) || t(placeholderKey)}
        </span>
        <FaChevronDown className={`${styles.inputArrow} ${activeDropdown === field ? styles.rotated : ''}`} />
      </div>

      {activeDropdown === field && (
        <div
          className={`${styles.dropdownContent} ${field === 'date' ? styles.calendarContent : ''} ${field === 'time' ? styles.timeContent : ''}`}
          ref={field === 'date' ? calendarRef : null}
        >
          {options && options.length > 0 && field !== 'date' && field !== 'time' && (
            <div className={styles.listOptions}>
              {options.map(option => (
                <div
                  key={option.value}
                  className={styles.dropdownOption}
                  onClick={() => handleInputChange(field, option.value)}
                >
                  {field === 'numberOfPeople' ? option.label : t(option.label)}
                </div>
              ))}
            </div>
          )}

          {field === 'date' && (
            <CalendarMock
              selectedDate={formData.date}
              onSelectDate={(date) => handleInputChange('date', date)}
              onClose={() => setActiveDropdown(null)}
            />
          )}

          {field === 'time' && (
            <TimePickerMock
              selectedTime={formData.time}
              onSelectTime={(time) => handleInputChange('time', time)}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.searchFormContainer}>
      <div className={styles.tourTypeTabs}>
        <button
          className={`${styles.tab} ${tourType === 'public' ? styles.active : ''}`}
          onClick={() => setTourType('public')}
        >
          <FiGlobe className={styles.tabIcon} /> {t('public_tours_tab')}
        </button>

        <button
          className={`${styles.tab} ${tourType === 'private' ? styles.active : ''}`}
          onClick={() => setTourType('private')}
        >
          <HiUsers className={styles.tabIcon} /> {t('private_tours_tab')}
        </button>
      </div>

      <div className={styles.searchFrame}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.formFields}>
            {renderDropdown('numberOfPeople', peopleOptions, 'label_number_of_people', 'placeholder_choose_number')}
            {renderDropdown('date', [], 'label_date', 'placeholder_choose_date')}
            {renderDropdown('time', [], 'label_time', 'placeholder_choose_time')}
            {renderDropdown('tour', tourOptions, 'label_tour', 'placeholder_select_tour')}
            {renderDropdown('transportation', transportationOptions, 'label_transportation', 'placeholder_select_transportation')}
          </div>

          <button type="submit" className={styles.searchButton}>
            <FiSearch className={styles.searchIcon} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default HeroSearchForm;
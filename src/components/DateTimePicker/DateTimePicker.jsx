import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { FiCalendar, FiClock } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DateTimePicker.module.css';

// Custom input component for date picker
const CustomDateInput = forwardRef(function CustomDateInputComponent(
  { value, onClick, placeholder, icon },
  ref
) {
  const IconElement = icon;
  return (
    <div className={styles.inputWrapper} onClick={onClick} ref={ref}>
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        readOnly
      />
      <span className={styles.icon}>
        <IconElement size={18} />
      </span>
    </div>
  );
});

CustomDateInput.displayName = 'CustomDateInput';

// Date Picker Component
export const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholder = "Select date",
  minDate,
  maxDate,
  dateFormat = "dd/MM/yyyy",
  ...props 
}) => {
  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        customInput={<CustomDateInput placeholder={placeholder} icon={FiCalendar} />}
        calendarClassName={styles.calendar}
        wrapperClassName={styles.wrapper}
        popperClassName={styles.popper}
        showPopperArrow={false}
        {...props}
      />
    </div>
  );
};

// Time Picker Component
export const CustomTimePicker = ({ 
  selected, 
  onChange, 
  placeholder = "Select time",
  timeIntervals = 30,
  timeFormat = "HH:mm",
  ...props 
}) => {
  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption="Time"
        dateFormat={timeFormat}
        customInput={<CustomDateInput placeholder={placeholder} icon={FiClock} />}
        calendarClassName={styles.calendar}
        wrapperClassName={styles.wrapper}
        popperClassName={styles.popper}
        showPopperArrow={false}
        {...props}
      />
    </div>
  );
};

// Combined DateTime Picker Component
export const CustomDateTimePicker = ({ 
  selected, 
  onChange, 
  placeholder = "Select date & time",
  minDate,
  maxDate,
  timeIntervals = 30,
  dateFormat = "dd/MM/yyyy HH:mm",
  ...props 
}) => {
  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeIntervals={timeIntervals}
        timeCaption="Time"
        dateFormat={dateFormat}
        minDate={minDate}
        maxDate={maxDate}
        customInput={<CustomDateInput placeholder={placeholder} icon={FiCalendar} />}
        calendarClassName={styles.calendar}
        wrapperClassName={styles.wrapper}
        popperClassName={styles.popper}
        showPopperArrow={false}
        {...props}
      />
    </div>
  );
};

// Flexible DateTimePicker with mode support
const DateTimePicker = ({
  mode = 'date', // 'date', 'time', 'datetime'
  selected,
  onChange,
  placeholder,
  minDate,
  maxDate,
  timeIntervals = 30,
  dateFormat,
  ...props
}) => {
  // Set defaults based on mode
  const getDefaultPlaceholder = () => {
    switch (mode) {
      case 'time': return 'Select time';
      case 'datetime': return 'Select date & time';
      default: return 'Select date';
    }
  };

  const getDefaultFormat = () => {
    switch (mode) {
      case 'time': return 'HH:mm';
      case 'datetime': return 'dd/MM/yyyy HH:mm';
      default: return 'dd/MM/yyyy';
    }
  };

  const resolvedPlaceholder = placeholder || getDefaultPlaceholder();
  const resolvedFormat = dateFormat || getDefaultFormat();
  const icon = mode === 'time' ? FiClock : FiCalendar;

  const pickerProps = {
    selected,
    onChange,
    dateFormat: resolvedFormat,
    customInput: <CustomDateInput placeholder={resolvedPlaceholder} icon={icon} />,
    calendarClassName: styles.calendar,
    wrapperClassName: styles.wrapper,
    popperClassName: styles.popper,
    showPopperArrow: false,
    ...props
  };

  // Add mode-specific props
  if (mode === 'date') {
    pickerProps.minDate = minDate;
    pickerProps.maxDate = maxDate;
  } else if (mode === 'time') {
    pickerProps.showTimeSelect = true;
    pickerProps.showTimeSelectOnly = true;
    pickerProps.timeIntervals = timeIntervals;
    pickerProps.timeCaption = 'Time';
  } else if (mode === 'datetime') {
    pickerProps.showTimeSelect = true;
    pickerProps.timeIntervals = timeIntervals;
    pickerProps.timeCaption = 'Time';
    pickerProps.minDate = minDate;
    pickerProps.maxDate = maxDate;
  }

  return (
    <div className={styles.datePickerContainer}>
      <DatePicker {...pickerProps} />
    </div>
  );
};

export default DateTimePicker;

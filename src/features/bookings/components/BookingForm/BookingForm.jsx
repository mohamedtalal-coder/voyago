import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { validateTravelerForm, validateName, validatePhone, validateEmail } from '../../../../lib/validation';
import styles from './BookingForm.module.css';

// Map validation error keys to translation keys
const getTranslatedError = (error, t, fieldName) => {
  if (!error) return null;
  
  const errorMap = {
    // Name errors
    'is required': 'validation.nameRequired',
    'must be at least 2 characters': 'validation.nameTooShort',
    'must be less than 50 characters': 'validation.nameTooLong',
    'contains invalid characters': 'validation.nameInvalidChars',
    'contains invalid repeated characters': 'validation.nameRepeatedChars',
    // Phone errors
    'Phone number is required': 'validation.phoneRequired',
    'Phone number must contain digits': 'validation.phoneMustContainDigits',
    'Phone number must be at least 7 digits': 'validation.phoneTooShort',
    'Phone number cannot exceed 15 digits': 'validation.phoneTooLong',
    'Please enter a valid phone number': 'validation.phoneInvalid',
    'Phone number contains invalid characters': 'validation.phoneInvalidChars',
    // Email errors  
    'Email is required': 'validation.emailRequired',
    'Email is too short': 'validation.emailTooShort',
    'Email is too long': 'validation.emailTooLong',
    'Email must contain exactly one @ symbol': 'validation.emailInvalidAt',
    'Email username is required before @': 'validation.emailUsernameRequired',
    'Email username is too long': 'validation.emailUsernameTooLong',
    'Email cannot start or end with a dot': 'validation.emailDotError',
    'Email cannot contain consecutive dots': 'validation.emailConsecutiveDots',
    'Email domain is required after @': 'validation.emailDomainRequired',
    'Email domain is too short': 'validation.emailDomainTooShort',
    'Email domain must include a dot (e.g., .com)': 'validation.emailDomainNeedsDot',
    'Invalid email domain format': 'validation.emailDomainInvalid',
    'Email must have a valid domain extension (e.g., .com, .org)': 'validation.emailInvalidExtension',
    'Email domain extension must contain only letters': 'validation.emailExtensionLettersOnly',
    'Please enter a valid email address': 'validation.emailInvalid',
    'Email contains invalid characters': 'validation.emailInvalidChars',
    'Email cannot contain spaces': 'validation.emailNoSpaces',
    'Please use a permanent email address': 'validation.emailDisposable',
  };

  // Check for exact match first
  if (errorMap[error]) {
    return t(errorMap[error], { field: fieldName });
  }

  // Check for name field errors (which include field name)
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return t(value, { field: fieldName });
    }
  }

  // Check for email typo suggestion
  if (error.startsWith('Did you mean')) {
    const suggestion = error.match(/Did you mean (.+)\?/)?.[1];
    return t('validation.emailTypo', { suggestion });
  }

  return error;
};

function BookingForm({ data, onNext, onBack }) {
  const { t, i18n } = useTranslation('booking');
  const isRTL = i18n.dir() === 'rtl';
  
  const [formData, setFormData] = useState({
    name: data.traveler?.name || '',
    surname: data.traveler?.surname || '',
    phone: data.traveler?.phone || '',
    email: data.traveler?.email || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation on blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let result;
    let fieldName;
    switch (field) {
      case 'name':
        fieldName = t('firstName', 'First name');
        result = validateName(formData.name, fieldName);
        break;
      case 'surname':
        fieldName = t('lastName', 'Last name');
        result = validateName(formData.surname, fieldName);
        break;
      case 'phone':
        fieldName = t('phone', 'Phone');
        result = validatePhone(formData.phone);
        break;
      case 'email':
        fieldName = t('email', 'Email');
        result = validateEmail(formData.email);
        break;
      default:
        return;
    }

    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? null : getTranslatedError(result.error, t, fieldName)
    }));
  }, [formData, t]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    setTouched({ name: true, surname: true, phone: true, email: true });
    
    // Validate entire form
    const validation = validateTravelerForm(formData);
    
    if (!validation.isValid) {
      // Translate all errors
      const translatedErrors = {};
      const fieldNames = {
        name: t('firstName', 'First name'),
        surname: t('lastName', 'Last name'),
        phone: t('phone', 'Phone'),
        email: t('email', 'Email'),
      };
      for (const [field, error] of Object.entries(validation.errors)) {
        translatedErrors[field] = getTranslatedError(error, t, fieldNames[field]);
      }
      setErrors(translatedErrors);
      setIsSubmitting(false);
      
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();
      return;
    }

    // Simulate processing delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onNext({ traveler: formData });
    setIsSubmitting(false);
  };

  const getInputClassName = (field) => {
    let className = styles.input;
    if (touched[field]) {
      if (errors[field]) {
        className += ` ${styles.inputError}`;
      } else if (formData[field]?.trim()) {
        className += ` ${styles.inputSuccess}`;
      }
    }
    return className;
  };

  const canProceed =
    formData.name.trim() &&
    formData.surname.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    Object.values(errors).every(e => !e);

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('travelerTitle', 'Who shall we send these tickets to?')}</h2>

      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              {t('firstName', 'First Name')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="name"
                placeholder={t('firstNamePlaceholder', 'Enter your first name')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={getInputClassName('name')}
                autoComplete="given-name"
                maxLength={50}
              />
              {touched.name && !errors.name && formData.name.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.name && errors.name && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {t('lastName', 'Last Name')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="surname"
                placeholder={t('lastNamePlaceholder', 'Enter your last name')}
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
                onBlur={() => handleBlur('surname')}
                className={getInputClassName('surname')}
                autoComplete="family-name"
                maxLength={50}
              />
              {touched.surname && !errors.surname && formData.surname.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.surname && errors.surname && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.surname}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              {t('phone', 'Phone Number')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                name="phone"
                placeholder={t('phonePlaceholder', '+1 (555) 123-4567')}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={getInputClassName('phone')}
                autoComplete="tel"
                maxLength={20}
              />
              {touched.phone && !errors.phone && formData.phone.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.phone && errors.phone && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {t('email', 'Email Address')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder={t('emailPlaceholder', 'your@email.com')}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={getInputClassName('email')}
                autoComplete="email"
                maxLength={254}
              />
              {touched.email && !errors.email && formData.email.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.email && errors.email && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <button 
            className={styles.backButton} 
            onClick={onBack}
            type="button"
            disabled={isSubmitting}
          >
            {t('back', 'Back')}
          </button>
          <button 
            className={styles.nextButton} 
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            type="button"
          >
            {isSubmitting ? t('processing', 'Processing...') : t('continueToPayment', 'Continue to Payment')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  validatePaymentForm, 
  validateCardNumber, 
  validateExpiryDate, 
  validateCVV, 
  validateCardHolderName 
} from '../../../../lib/validation';
import Loader from '../../../../components/Loader/Loader';
import styles from './BookingPayment.module.css';

// Map validation error keys to translation keys
const getTranslatedError = (error, t, cardType) => {
  if (!error) return null;
  
  const errorMap = {
    'Card number is required': 'validation.cardNumberRequired',
    'Card number is too short': 'validation.cardNumberTooShort',
    'Card number is too long': 'validation.cardNumberTooLong',
    'Invalid card number': 'validation.invalidCard',
    'Card holder name is required': 'validation.cardHolderRequired',
    'Card holder name is too short': 'validation.cardHolderTooShort',
    'Card holder name is too long (max 26 characters)': 'validation.cardHolderTooLong',
    'Card holder name contains invalid characters': 'validation.cardHolderInvalidChars',
    'Please enter first and last name': 'validation.cardHolderNeedFullName',
    'Expiry date is required': 'validation.expiryRequired',
    'Enter expiry as MM/YY': 'validation.expiryFormat',
    'Invalid month (01-12)': 'validation.expiryInvalidMonth',
    'Card has expired': 'validation.expiryExpired',
    'Invalid expiry year': 'validation.expiryInvalidYear',
    'CVV is required': 'validation.cvvRequired',
    'CVV is too short': 'validation.cvvTooShort',
    'CVV is too long': 'validation.cvvTooLong',
  };

  // Handle dynamic CVV length error
  if (error.includes('CVV should be')) {
    const length = cardType === 'amex' ? 4 : 3;
    return t('validation.cvvWrongLength', { length });
  }

  const translationKey = errorMap[error];
  return translationKey ? t(translationKey) : error;
};

function BookingPayment({ data, onNext, onBack }) {
  const { t, i18n } = useTranslation('booking');
  const isRTL = i18n.dir() === 'rtl';
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState(null);

  // Format card number with spaces as user types
  const formatCardInput = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry as MM/YY
  const formatExpiryInput = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let result;
    switch (field) {
      case 'cardNumber':
        result = validateCardNumber(paymentData.cardNumber);
        if (result.cardType) setCardType(result.cardType);
        break;
      case 'cardHolder':
        result = validateCardHolderName(paymentData.cardHolder);
        break;
      case 'expiryDate':
        result = validateExpiryDate(paymentData.expiryDate);
        break;
      case 'cvv':
        result = validateCVV(paymentData.cvv, cardType);
        break;
      default:
        return;
    }

    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? null : getTranslatedError(result.error, t, cardType)
    }));
  }, [paymentData, cardType, t]);

  const handleChange = (field, value) => {
    let formattedValue = value;
    
    // Apply formatting based on field
    if (field === 'cardNumber') {
      formattedValue = formatCardInput(value);
      // Detect card type while typing
      const result = validateCardNumber(value);
      setCardType(result.cardType);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryInput(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'cardHolder') {
      formattedValue = value.toUpperCase();
    }

    setPaymentData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    setTouched({ cardNumber: true, cardHolder: true, expiryDate: true, cvv: true });

    // Validate entire form
    const validation = validatePaymentForm(paymentData);
    
    if (!validation.isValid) {
      // Translate all errors
      const translatedErrors = {};
      for (const [field, error] of Object.entries(validation.errors)) {
        translatedErrors[field] = getTranslatedError(error, t, validation.cardType);
      }
      setErrors(translatedErrors);
      setIsSubmitting(false);
      
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();
      return;
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onNext();
    setIsSubmitting(false);
  };

  const getInputClassName = (field) => {
    let className = styles.input;
    if (touched[field]) {
      if (errors[field]) {
        className += ` ${styles.inputError}`;
      } else if (paymentData[field]?.trim()) {
        className += ` ${styles.inputSuccess}`;
      }
    }
    return className;
  };

  const getCardTypeIcon = () => {
    const icons = {
      visa: '💳 Visa',
      mastercard: '💳 Mastercard',
      amex: '💳 Amex',
      discover: '💳 Discover',
      diners: '💳 Diners',
      jcb: '💳 JCB',
    };
    return icons[cardType] || null;
  };

  const canProceed =
    paymentData.cardNumber.trim() &&
    paymentData.cardHolder.trim() &&
    paymentData.expiryDate.trim() &&
    paymentData.cvv.trim() &&
    Object.values(errors).every(e => !e);

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('paymentTitle', 'Payment Information')}</h2>
        <div className={styles.secure}>
          <Lock size={16} />
          <span>{t('securePayment', 'Secure Payment')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label className={styles.label}>
            {t('cardNumber', 'Card Number')} <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <CreditCard size={20} className={styles.icon} />
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              onBlur={() => handleBlur('cardNumber')}
              className={`${getInputClassName('cardNumber')} ${styles.cardInput}`}
              maxLength={19}
              autoComplete="cc-number"
              inputMode="numeric"
            />
            {cardType && cardType !== 'unknown' && (
              <span className={styles.cardType}>{getCardTypeIcon()}</span>
            )}
            {touched.cardNumber && !errors.cardNumber && paymentData.cardNumber.trim() && (
              <CheckCircle size={18} className={styles.successIcon} />
            )}
          </div>
          {touched.cardNumber && errors.cardNumber && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              <span>{errors.cardNumber}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            {t('cardHolder', 'Card Holder Name')} <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="cardHolder"
              placeholder="JOHN DOE"
              value={paymentData.cardHolder}
              onChange={(e) => handleChange('cardHolder', e.target.value)}
              onBlur={() => handleBlur('cardHolder')}
              className={getInputClassName('cardHolder')}
              maxLength={26}
              autoComplete="cc-name"
            />
            {touched.cardHolder && !errors.cardHolder && paymentData.cardHolder.trim() && (
              <CheckCircle size={18} className={styles.successIcon} />
            )}
          </div>
          {touched.cardHolder && errors.cardHolder && (
            <div className={styles.errorMessage}>
              <AlertCircle size={14} />
              <span>{errors.cardHolder}</span>
            </div>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              {t('expiryDate', 'Expiry Date')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                onBlur={() => handleBlur('expiryDate')}
                className={getInputClassName('expiryDate')}
                maxLength={5}
                autoComplete="cc-exp"
                inputMode="numeric"
              />
              {touched.expiryDate && !errors.expiryDate && paymentData.expiryDate.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.expiryDate && errors.expiryDate && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.expiryDate}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {t('cvv', 'CVV')} <span className={styles.required}>*</span>
              <span className={styles.hint}>({cardType === 'amex' ? `4 ${t('digits', 'digits')}` : `3 ${t('digits', 'digits')}`})</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                name="cvv"
                placeholder={cardType === 'amex' ? '1234' : '123'}
                value={paymentData.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                onBlur={() => handleBlur('cvv')}
                className={getInputClassName('cvv')}
                maxLength={cardType === 'amex' ? 4 : 3}
                autoComplete="cc-csc"
                inputMode="numeric"
              />
              {touched.cvv && !errors.cvv && paymentData.cvv.trim() && (
                <CheckCircle size={18} className={styles.successIcon} />
              )}
            </div>
            {touched.cvv && errors.cvv && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <Lock size={16} />
          <p>{t('paymentSecure', 'Your payment information is encrypted and secure. We do not store your card details.')}</p>
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
            type="submit"
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? (
              <Loader size="small" color="white" inline message={t('processing', 'Processing...')} />
            ) : (
              t('completeBooking', 'Complete Booking')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingPayment;

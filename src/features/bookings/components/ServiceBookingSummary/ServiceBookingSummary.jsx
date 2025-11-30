import { useState } from 'react';
import { Calendar, Clock, Tag, X, Check, AlertCircle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useDiscountStore from '../../../../store/discounts/useDiscountStore';
import styles from './ServiceBookingSummary.module.css';

function ServiceBookingSummary({
  serviceInfo,
  serviceType,
  quantity,
  duration,
  date,
  time,
  totalPrice,
  onNext,
  showButton,
}) {
  const { t, i18n } = useTranslation(['booking', 'packages', 'bikeBooking']);
  const isRTL = i18n.dir() === 'rtl';
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  
  const {
    appliedDiscount,
    appliedPromoCode,
    promoCodeError,
    applyPromoCode,
    removePromoCode,
    calculateDiscountAmount,
    calculateFinalPrice,
    clearError,
  } = useDiscountStore();

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) return;
    
    const bookingData = {
      tickets: { adult: quantity, child: 0, infant: 0 },
      selectedDate: date,
    };
    
    const result = applyPromoCode(promoCode, bookingData);
    if (result.success) {
      setPromoCode('');
      setShowPromoInput(false);
    }
  };

  const handleRemovePromoCode = () => {
    const bookingData = {
      tickets: { adult: quantity, child: 0, infant: 0 },
      selectedDate: date,
    };
    removePromoCode(bookingData);
  };

  const discountAmount = calculateDiscountAmount(totalPrice);
  const finalPrice = calculateFinalPrice(totalPrice);

  // Format service type for display
  const getServiceTypeLabel = () => {
    if (!serviceType) return '';
    // Try to get translation, fallback to capitalized value
    const translationKey = `bikeBooking:bikeTypes.${serviceType}`;
    const translated = t(translationKey, { defaultValue: '' });
    if (translated && translated !== translationKey) return translated;
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('booking:serviceOverview', 'Service Overview')}</h2>

      {/* Service Info */}
      <div className={styles.serviceBox}>
        {serviceInfo?.img && (
          <img
            src={serviceInfo.img}
            alt={t(serviceInfo.titleKey)}
            className={styles.serviceImage}
          />
        )}
        <div className={styles.serviceDetails}>
          <h3 className={styles.serviceName}>{t(serviceInfo?.titleKey || '')}</h3>
          {serviceType && (
            <div className={styles.detailRow}>
              <Package size={16} />
              <span>{getServiceTypeLabel()}</span>
            </div>
          )}
          {date && (
            <div className={styles.detailRow}>
              <Calendar size={16} />
              <span>{date}</span>
            </div>
          )}
          {time && (
            <div className={styles.detailRow}>
              <Clock size={16} />
              <span>{time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details */}
      <div className={styles.bookingDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>{t('booking:quantity', 'Quantity')}</span>
          <span className={styles.detailValue}>{quantity}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>{t('booking:duration', 'Duration')}</span>
          <span className={styles.detailValue}>{duration}</span>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className={styles.promoSection}>
        {appliedPromoCode && !appliedDiscount?.isAutomatic ? (
          <div className={styles.appliedPromo}>
            <div className={styles.appliedPromoInfo}>
              <Check size={16} className={styles.promoSuccessIcon} />
              <span>{appliedPromoCode.id}: {appliedPromoCode.percentage}% {t('booking:discount.off', 'off')}</span>
            </div>
            <button 
              className={styles.removePromoBtn}
              onClick={handleRemovePromoCode}
              aria-label={t('booking:discount.remove', 'Remove promo code')}
            >
              <X size={16} />
            </button>
          </div>
        ) : appliedDiscount?.isAutomatic ? (
          <div className={styles.autoDiscount}>
            <Tag size={16} className={styles.autoDiscountIcon} />
            <span>{appliedDiscount.name}: {appliedDiscount.percentage}% {t('booking:discount.off', 'off')}</span>
          </div>
        ) : showPromoInput ? (
          <div className={styles.promoInputWrapper}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                clearError();
              }}
              placeholder={t('booking:discount.enterCode', 'Enter promo code')}
              className={styles.promoInput}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromoCode()}
            />
            <button 
              className={styles.applyPromoBtn}
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim()}
            >
              {t('booking:discount.apply', 'Apply')}
            </button>
            <button 
              className={styles.cancelPromoBtn}
              onClick={() => {
                setShowPromoInput(false);
                setPromoCode('');
                clearError();
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            className={styles.addPromoBtn}
            onClick={() => setShowPromoInput(true)}
          >
            <Tag size={16} />
            {t('booking:discount.addPromoCode', 'Add Promo Code')}
          </button>
        )}
        
        {promoCodeError && (
          <div className={styles.promoError}>
            <AlertCircle size={14} />
            <span>{promoCodeError}</span>
          </div>
        )}
      </div>

      {/* Subtotal */}
      <div className={styles.subtotalRow}>
        <span className={styles.subtotalLabel}>{t('booking:discount.subtotal', 'Subtotal')}</span>
        <span className={styles.subtotalPrice}>€{totalPrice.toFixed(2)}</span>
      </div>

      {/* Discount Row */}
      {appliedDiscount && discountAmount > 0 && (
        <div className={styles.discountRow}>
          <span className={styles.discountLabel}>
            {appliedDiscount.name} (-{appliedDiscount.percentage}%)
          </span>
          <span className={styles.discountAmount}>-€{discountAmount.toFixed(2)}</span>
        </div>
      )}

      {/* Total */}
      <div className={styles.total}>
        <span className={styles.totalLabel}>{t('booking:totalPrice', 'Total Price')}</span>
        <div className={styles.totalPriceWrapper}>
          {appliedDiscount && discountAmount > 0 && (
            <span className={styles.originalPrice}>€{totalPrice.toFixed(2)}</span>
          )}
          <span className={styles.totalPrice}>€{finalPrice.toFixed(2)}</span>
        </div>
      </div>

      {showButton && (
        <button className={styles.nextButton} onClick={onNext}>
          {t('booking:goToNextStep', 'Continue')}
        </button>
      )}
    </div>
  );
}

export default ServiceBookingSummary;

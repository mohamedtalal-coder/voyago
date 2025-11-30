import { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, X, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useDiscountStore from '../../../../store/discounts/useDiscountStore';
import styles from './BookingSummary.module.css';

function BookingSummary({
  packageInfo,
  tickets,
  date,
  time,
  totalPrice,
  onNext,
  showButton,
}) {
  const { t, i18n } = useTranslation('booking');
  const isRTL = i18n.dir() === 'rtl';
  const [promoCode, setPromoCode] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  
  const {
    appliedDiscount,
    appliedPromoCode,
    promoCodeError,
    applyPromoCode,
    removePromoCode,
    applyAutomaticDiscount,
    calculateDiscountAmount,
    calculateFinalPrice,
    clearError,
  } = useDiscountStore();

  // Check for automatic discounts when booking data changes
  useEffect(() => {
    const bookingData = {
      tickets,
      selectedDate: date,
    };
    applyAutomaticDiscount(bookingData);
  }, [tickets, date, applyAutomaticDiscount]);

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) return;
    
    const bookingData = {
      tickets,
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
      tickets,
      selectedDate: date,
    };
    removePromoCode(bookingData);
  };

  const discountAmount = calculateDiscountAmount(totalPrice);
  const finalPrice = calculateFinalPrice(totalPrice);

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={styles.title}>{t('yourTicketsOverview')}</h2>

      <div className={styles.package}>
        <img
          src={packageInfo.image}
          alt={packageInfo.name}
          className={styles.packageImage}
        />
        <div className={styles.packageInfo}>
          <h3 className={styles.packageName}>{packageInfo.name}</h3>
          {date && (
            <div className={styles.packageDetail}>
              <Calendar size={16} />
              <span>{date}</span>
            </div>
          )}
          {time && (
            <div className={styles.packageDetail}>
              <Clock size={16} />
              <span>{time}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tickets}>
        {tickets.adult > 0 && (
          <div className={styles.ticketRow}>
            <div className={styles.ticketInfo}>
              <span className={styles.ticketCount}>{tickets.adult}</span>
              <span className={styles.ticketType}>
                {t('adult')} (18+) (€{packageInfo.adultPrice.toFixed(2)})
              </span>
            </div>
            <span className={styles.ticketPrice}>
              €{(tickets.adult * packageInfo.adultPrice).toFixed(2)}
            </span>
          </div>
        )}

        {tickets.child > 0 && (
          <div className={styles.ticketRow}>
            <div className={styles.ticketInfo}>
              <span className={styles.ticketCount}>{tickets.child}</span>
              <span className={styles.ticketType}>
                {t('child')} (6-17) (€{packageInfo.childPrice.toFixed(2)})
              </span>
            </div>
            <span className={styles.ticketPrice}>
              €{(tickets.child * packageInfo.childPrice).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Promo Code Section */}
      <div className={styles.promoSection}>
        {appliedPromoCode && !appliedDiscount?.isAutomatic ? (
          <div className={styles.appliedPromo}>
            <div className={styles.appliedPromoInfo}>
              <Check size={16} className={styles.promoSuccessIcon} />
              <span>{appliedPromoCode.id}: {appliedPromoCode.percentage}% {t('discount.off', 'off')}</span>
            </div>
            <button 
              className={styles.removePromoBtn}
              onClick={handleRemovePromoCode}
              aria-label={t('discount.remove', 'Remove promo code')}
            >
              <X size={16} />
            </button>
          </div>
        ) : appliedDiscount?.isAutomatic ? (
          <div className={styles.autoDiscount}>
            <Tag size={16} className={styles.autoDiscountIcon} />
            <span>{appliedDiscount.name}: {appliedDiscount.percentage}% {t('discount.off', 'off')}</span>
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
              placeholder={t('discount.enterCode', 'Enter promo code')}
              className={styles.promoInput}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromoCode()}
            />
            <button 
              className={styles.applyPromoBtn}
              onClick={handleApplyPromoCode}
              disabled={!promoCode.trim()}
            >
              {t('discount.apply', 'Apply')}
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
            {t('discount.addPromoCode', 'Add Promo Code')}
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
        <span className={styles.subtotalLabel}>{t('discount.subtotal', 'Subtotal')}</span>
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
        <span className={styles.totalLabel}>{t('totalPrice')}</span>
        <div className={styles.totalPriceWrapper}>
          {appliedDiscount && discountAmount > 0 && (
            <span className={styles.originalPrice}>€{totalPrice.toFixed(2)}</span>
          )}
          <span className={styles.totalPrice}>€{finalPrice.toFixed(2)}</span>
        </div>
      </div>

      {showButton && (
        <button className={styles.nextButton} onClick={onNext}>
          {t('goToNextStep')}
        </button>
      )}
    </div>
  );
}

export default BookingSummary;

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useUserTicketsStore from '../../../../store/tickets/useUserTicketsStore';
import useBookingStore from '../../../../store/booking/useBookingStore';
import useDiscountStore from '../../../../store/discounts/useDiscountStore';
import styles from './BookingComplete.module.css';

function BookingComplete({ bookingDetails, onGoHome }) {
  const { t, i18n } = useTranslation('booking');
  const isRTL = i18n.dir() === 'rtl';
  const user = useAuthStore((state) => state.user);
  const addTicket = useUserTicketsStore((state) => state.addTicket);
  const { packageInfo, tickets, selectedDate, selectedTime, traveler, appliedDiscount, calculateTotal, calculateSubtotal, getDiscountAmount, resetBooking } = useBookingStore();
  const clearDiscounts = useDiscountStore((state) => state.clearDiscounts);
  
  // Ref to prevent double execution in Strict Mode
  const hasAddedTicket = useRef(false);

  // Save ticket when component mounts
  useEffect(() => {
    if (hasAddedTicket.current) return;
    
    if (user && packageInfo && bookingDetails?.refNumber) {
      hasAddedTicket.current = true;
      addTicket({
        refNumber: bookingDetails.refNumber,
        userEmail: user.email,
        userName: user.name,
        tourId: packageInfo.id,
        tourName: packageInfo.name,
        tourImage: packageInfo.image,
        tourPrice: packageInfo.price,
        date: selectedDate,
        time: selectedTime,
        tickets: tickets,
        traveler: traveler,
        total: calculateTotal(),
        subtotal: calculateSubtotal(),
        discountApplied: appliedDiscount ? {
          name: appliedDiscount.name,
          percentage: appliedDiscount.percentage,
          amount: getDiscountAmount()
        } : null,
        paymentMethod: 'card', // or get from payment step
      });
    }
  }, []);
  
  const handleGoHome = () => {
    clearDiscounts();
    resetBooking();
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = getDiscountAmount();
  const total = calculateTotal();

  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <div className={styles.iconCircle}>
            <Check size={48} strokeWidth={3} />
          </div>
        </div>

        <h1 className={styles.title}>{t('complete.title', 'Your Order is Complete!')}</h1>
        <p className={styles.message}>
          {t('complete.message', 'You will be receiving a confirmation email with order details.')}
        </p>

        {bookingDetails && (
          <div className={styles.bookingDetails}>
            <h3>{t('complete.summary', 'Booking Summary')}</h3>
            <p><strong>{t('complete.refNumber', 'Reference Number')}:</strong> {bookingDetails.refNumber}</p>
            <p><strong>{t('complete.date', 'Date')}:</strong> {bookingDetails.date}</p>
            
            {appliedDiscount && discountAmount > 0 && (
              <>
                <p><strong>{t('discount.subtotal', 'Subtotal')}:</strong> €{subtotal.toFixed(2)}</p>
                <p className={styles.discountLine}>
                  <strong>{appliedDiscount.name} (-{appliedDiscount.percentage}%):</strong> 
                  <span className={styles.discountAmount}>-€{discountAmount.toFixed(2)}</span>
                </p>
              </>
            )}
            
            <p className={styles.totalLine}>
              <strong>{t('complete.total', 'Total')}:</strong> 
              <span className={styles.totalAmount}>€{total.toFixed(2)}</span>
            </p>
            
            {appliedDiscount && discountAmount > 0 && (
              <p className={styles.savedMessage}>
                🎉 {t('discount.saved', 'You saved')} €{discountAmount.toFixed(2)}!
              </p>
            )}
          </div>
        )}

        <button className={styles.homeButton} onClick={handleGoHome}>
          {t('complete.goHome', 'Go to Home Page')}
        </button>
      </div>
    </div>
  );
}

export default BookingComplete;

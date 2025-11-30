import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Step Components from features/bookings
import BookingForm from '../../bookings/components/BookingForm/BookingForm';
import BookingSummary from '../../bookings/components/BookingSummary/BookingSummary';
import BookingPayment from '../../bookings/components/BookingPayment/BookingPayment';
import BookingComplete from '../../bookings/components/BookingComplete/BookingComplete';
import PackageSelection from '../../bookings/components/PackageSelection/PackageSelection';

// Store
import useBookingStore from '../../../store/booking/useBookingStore';

// Styles
import styles from './BookingScreen.module.css';

export default function BookingScreen() {
  const { t, i18n } = useTranslation('booking');
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';
  
  // Get state and actions from store
  const currentStep = useBookingStore((state) => state.currentStep);
  const packageInfo = useBookingStore((state) => state.packageInfo);
  const tickets = useBookingStore((state) => state.tickets);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTime = useBookingStore((state) => state.selectedTime);
  const traveler = useBookingStore((state) => state.traveler);
  const refNumber = useBookingStore((state) => state.refNumber);
  
  const nextStep = useBookingStore((state) => state.nextStep);
  const prevStep = useBookingStore((state) => state.prevStep);
  const setTraveler = useBookingStore((state) => state.setTraveler);
  const setPaymentInfo = useBookingStore((state) => state.setPaymentInfo);
  const completeBooking = useBookingStore((state) => state.completeBooking);
  const calculateTotal = useBookingStore((state) => state.calculateTotal);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  // Redirect if no package selected and not on step 1
  useEffect(() => {
    if (!packageInfo && currentStep > 1) {
      navigate('/packages');
    }
  }, [packageInfo, currentStep, navigate]);

  const handleNextStep = (data = {}) => {
    if (data.traveler) setTraveler(data.traveler);
    if (data.paymentInfo) setPaymentInfo(data.paymentInfo);
    nextStep();
  };

  const handleBackStep = () => {
    prevStep();
  };

  const handleCompleteBooking = () => {
    completeBooking();
  };

  const handleGoHome = () => {
    resetBooking();
    navigate('/');
  };

  const total = calculateTotal();

  // Build booking data object for components
  const bookingData = {
    packageInfo: packageInfo || {
      name: t('selectPackage', 'Select a Package'),
      image: "",
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0
    },
    tickets,
    date: selectedDate,
    time: selectedTime,
    traveler
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PackageSelection onNext={handleNextStep} />;

      case 2:
        return (
          <div className={styles.bookingLayout}>
            <div className={styles.formSection}>
              <BookingForm
                data={bookingData}
                onNext={handleNextStep}
                onBack={handleBackStep}
              />
            </div>

            <div className={styles.summarySection}>
              <BookingSummary
                packageInfo={bookingData.packageInfo}
                tickets={bookingData.tickets}
                date={bookingData.date}
                time={bookingData.time}
                totalPrice={total}
                showButton={false}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.bookingLayout}>
            <div className={styles.formSection}>
              <BookingPayment
                data={bookingData}
                onNext={handleCompleteBooking}
                onBack={handleBackStep}
              />
            </div>

            <div className={styles.summarySection}>
              <BookingSummary
                packageInfo={bookingData.packageInfo}
                tickets={bookingData.tickets}
                date={bookingData.date}
                time={bookingData.time}
                totalPrice={total}
                showButton={false}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <BookingComplete
            bookingDetails={{
              refNumber: refNumber || `BK-${Date.now()}`,
              date: bookingData.date,
              total: total.toFixed(2),
            }}
            onGoHome={handleGoHome}
          />
        );

      default:
        return <PackageSelection onNext={handleNextStep} />;
    }
  };

  const stepLabels = [
    t('steps.selectPackage', 'Select Package'),
    t('steps.travelerInfo', 'Traveler Info'),
    t('steps.payment', 'Payment'),
    t('steps.confirmation', 'Confirmation')
  ];

  return (
    <div className={styles.bookingWrapper} dir={isRTL ? 'rtl' : 'ltr'}>
      {currentStep < 4 && (
        <div className={styles.progressBar}>
          {stepLabels.map((label, index) => (
            <div 
              key={index}
              className={`${styles.step} ${currentStep >= index + 1 ? styles.active : ''}`}
            >
              <span>{index + 1}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      )}

      {renderStep()}
    </div>
  );
}

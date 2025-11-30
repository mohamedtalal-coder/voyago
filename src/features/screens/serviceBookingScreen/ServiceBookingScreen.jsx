import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Step Components
import ServiceSelection from '../../bookings/components/ServiceSelection/ServiceSelection';
import ServiceBookingSummary from '../../bookings/components/ServiceBookingSummary/ServiceBookingSummary';
import BookingForm from '../../bookings/components/BookingForm/BookingForm';
import BookingPayment from '../../bookings/components/BookingPayment/BookingPayment';
import BookingComplete from '../../bookings/components/BookingComplete/BookingComplete';

// Store
import useServiceBookingStore from '../../../store/booking/useServiceBookingStore';
import useUserTicketsStore from '../../../store/tickets/useUserTicketsStore';
import { useAuthStore } from '../../../store/auth/useAuthStore';

// Styles
import styles from './ServiceBookingScreen.module.css';

export default function ServiceBookingScreen() {
  const { t, i18n } = useTranslation('booking');
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';
  
  // Auth store for user email
  const user = useAuthStore((state) => state.user);
  
  // Tickets store
  const addTicket = useUserTicketsStore((state) => state.addTicket);
  
  // Get state and actions from store
  const currentStep = useServiceBookingStore((state) => state.currentStep);
  const serviceInfo = useServiceBookingStore((state) => state.serviceInfo);
  const serviceType = useServiceBookingStore((state) => state.serviceType);
  const quantity = useServiceBookingStore((state) => state.quantity);
  const duration = useServiceBookingStore((state) => state.duration);
  const selectedDate = useServiceBookingStore((state) => state.selectedDate);
  const selectedTime = useServiceBookingStore((state) => state.selectedTime);
  const customer = useServiceBookingStore((state) => state.customer);
  const refNumber = useServiceBookingStore((state) => state.refNumber);
  
  const nextStep = useServiceBookingStore((state) => state.nextStep);
  const prevStep = useServiceBookingStore((state) => state.prevStep);
  const setCustomer = useServiceBookingStore((state) => state.setCustomer);
  const setPaymentInfo = useServiceBookingStore((state) => state.setPaymentInfo);
  const completeBooking = useServiceBookingStore((state) => state.completeBooking);
  const calculateTotal = useServiceBookingStore((state) => state.calculateTotal);
  const resetBooking = useServiceBookingStore((state) => state.resetBooking);

  // Redirect if no service selected and not on step 1
  useEffect(() => {
    if (!serviceInfo && currentStep > 1) {
      navigate('/services/bike-rickshaw');
    }
  }, [serviceInfo, currentStep, navigate]);

  const handleNextStep = (data = {}) => {
    // Handle traveler data from BookingForm
    if (data.traveler) {
      setCustomer({
        name: `${data.traveler.name} ${data.traveler.surname}`,
        email: data.traveler.email,
        phone: data.traveler.phone
      });
    }
    if (data.paymentInfo) setPaymentInfo(data.paymentInfo);
    nextStep();
  };

  const handleBackStep = () => {
    prevStep();
  };

  const handleCompleteBooking = (paymentData = {}) => {
    const newRefNumber = completeBooking();
    const total = calculateTotal();
    
    // Add ticket to user's tickets
    if (user?.email || customer.email) {
      addTicket({
        refNumber: newRefNumber,
        userEmail: user?.email || customer.email,
        // Service bookings use service name instead of tour name
        tourName: serviceInfo?.titleKey || 'Service Booking',
        tourId: null, // Services don't have tour IDs
        tourImage: serviceInfo?.img,
        date: selectedDate,
        time: selectedTime,
        tickets: {
          adults: quantity,
          children: 0,
          infants: 0
        },
        traveler: {
          firstName: customer.name?.split(' ')[0] || '',
          lastName: customer.name?.split(' ').slice(1).join(' ') || '',
          email: customer.email,
          phone: customer.phone
        },
        total: total,
        paymentMethod: paymentData.paymentMethod || 'card',
        // Additional service-specific data
        bookingType: 'service',
        serviceType: serviceType,
        serviceDuration: duration,
        serviceQuantity: quantity
      });
    }
  };

  const handleGoHome = () => {
    resetBooking();
    navigate('/');
  };

  const total = calculateTotal();

  // Build booking data object for components
  const bookingData = {
    serviceInfo: serviceInfo || {
      titleKey: t('noServiceSelected', 'Select a Service'),
      img: '',
    },
    serviceType,
    quantity,
    duration,
    date: selectedDate,
    time: selectedTime,
    traveler: {
      name: customer.name?.split(' ')[0] || '',
      surname: customer.name?.split(' ').slice(1).join(' ') || '',
      email: customer.email,
      phone: customer.phone
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection onNext={handleNextStep} />;

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
              <ServiceBookingSummary
                serviceInfo={serviceInfo}
                serviceType={serviceType}
                quantity={quantity}
                duration={duration}
                date={selectedDate}
                time={selectedTime}
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
              <ServiceBookingSummary
                serviceInfo={serviceInfo}
                serviceType={serviceType}
                quantity={quantity}
                duration={duration}
                date={selectedDate}
                time={selectedTime}
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
              refNumber: refNumber || `SV-${Date.now()}`,
              date: selectedDate,
              total: total.toFixed(2),
            }}
            onGoHome={handleGoHome}
          />
        );

      default:
        return <ServiceSelection onNext={handleNextStep} />;
    }
  };

  const stepLabels = [
    t('steps.configureService', 'Configure Service'),
    t('steps.yourDetails', 'Your Details'),
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

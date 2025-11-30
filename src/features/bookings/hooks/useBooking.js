import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookingStore from '../../../store/booking/useBookingStore';

export const useBooking = () => {
  const navigate = useNavigate();
  const store = useBookingStore();

  const startBooking = useCallback((tourPackage, date = null, time = null) => {
    store.resetBooking();
    store.setPackage(tourPackage);
    if (date) store.setDateTime(date, time);
    navigate('/booking');
  }, [store, navigate]);

  const handleNextStep = useCallback((data = {}) => {
    if (data.tickets) store.setTickets(data.tickets);
    if (data.traveler) store.setTraveler(data.traveler);
    if (data.paymentInfo) store.setPaymentInfo(data.paymentInfo);
    if (data.date || data.time) store.setDateTime(data.date, data.time);
    store.nextStep();
  }, [store]);

  const handleBackStep = useCallback(() => {
    store.prevStep();
  }, [store]);

  const completeBooking = useCallback(() => {
    return store.completeBooking();
  }, [store]);

  const cancelBooking = useCallback(() => {
    store.resetBooking();
    navigate('/');
  }, [store, navigate]);

  const getBookingSummary = useCallback(() => {
    return {
      packageInfo: store.packageInfo,
      tickets: store.tickets,
      date: store.selectedDate,
      time: store.selectedTime,
      traveler: store.traveler,
      total: store.calculateTotal()
    };
  }, [store]);

  return {
    // State
    currentStep: store.currentStep,
    packageInfo: store.packageInfo,
    tickets: store.tickets,
    selectedDate: store.selectedDate,
    selectedTime: store.selectedTime,
    traveler: store.traveler,
    bookingComplete: store.bookingComplete,
    refNumber: store.refNumber,
    
    // Computed
    total: store.calculateTotal(),
    canProceed: store.canProceedFromStep(store.currentStep),
    
    // Actions
    startBooking,
    handleNextStep,
    handleBackStep,
    completeBooking,
    cancelBooking,
    getBookingSummary,
    
    // Direct store actions
    setPackage: store.setPackage,
    setTickets: store.setTickets,
    updateTicketCount: store.updateTicketCount,
    setDateTime: store.setDateTime,
    setTraveler: store.setTraveler,
    setPaymentInfo: store.setPaymentInfo,
    goToStep: store.goToStep,
    resetBooking: store.resetBooking
  };
};

export default useBooking;

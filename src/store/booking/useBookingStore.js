import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  currentStep: 1,
  packageInfo: null,
  tickets: {
    adult: 1,
    child: 0,
    infant: 0
  },
  selectedDate: null,
  selectedTime: null,
  traveler: {
    name: '',
    surname: '',
    phone: '',
    email: ''
  },
  paymentInfo: {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  },
  appliedDiscount: null,
  bookingComplete: false,
  refNumber: null
};

const useBookingStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Set package from tour data
      setPackage: (tourPackage) => set({
        packageInfo: {
          id: tourPackage.id || tourPackage._id,
          _id: tourPackage._id || tourPackage.id,
          name: tourPackage.titleKey,
          image: tourPackage.img,
          price: tourPackage.price,
          duration: tourPackage.duration,
          // Extract numeric price (e.g., "34€" -> 34)
          adultPrice: parseFloat(tourPackage.price.replace(/[^0-9.]/g, '')) || 0,
          childPrice: parseFloat(tourPackage.price.replace(/[^0-9.]/g, '')) * 0.6 || 0, // 60% of adult price
          infantPrice: 0
        }
      }),

      // Set tickets count
      setTickets: (tickets) => set({ tickets }),

      // Update individual ticket type
      updateTicketCount: (type, count) => set((state) => ({
        tickets: {
          ...state.tickets,
          [type]: Math.max(0, count)
        }
      })),

      // Set date and time
      setDateTime: (date, time) => set({ 
        selectedDate: date, 
        selectedTime: time 
      }),

      // Set traveler info
      setTraveler: (traveler) => set({ traveler }),

      // Set payment info
      setPaymentInfo: (paymentInfo) => set({ paymentInfo }),

      // Set applied discount
      setAppliedDiscount: (discount) => set({ appliedDiscount: discount }),

      // Navigation
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 4) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),
      
      goToStep: (step) => set({ currentStep: step }),

      // Calculate subtotal (before discount)
      calculateSubtotal: () => {
        const { tickets, packageInfo } = get();
        if (!packageInfo) return 0;
        return (
          tickets.adult * packageInfo.adultPrice +
          tickets.child * packageInfo.childPrice +
          tickets.infant * packageInfo.infantPrice
        );
      },

      // Calculate total price (after discount)
      calculateTotal: () => {
        const { appliedDiscount } = get();
        const subtotal = get().calculateSubtotal();
        
        if (!appliedDiscount) return subtotal;
        
        const discountAmount = (subtotal * appliedDiscount.percentage) / 100;
        return Math.max(0, subtotal - discountAmount);
      },

      // Get discount amount
      getDiscountAmount: () => {
        const { appliedDiscount } = get();
        const subtotal = get().calculateSubtotal();
        
        if (!appliedDiscount) return 0;
        
        return (subtotal * appliedDiscount.percentage) / 100;
      },

      // Complete booking
      completeBooking: () => {
        const refNumber = `BK-${Date.now()}`;
        set({ 
          bookingComplete: true, 
          refNumber,
          currentStep: 4
        });
        return refNumber;
      },

      // Reset booking state
      resetBooking: () => set(initialState),

      // Check if can proceed to next step
      canProceedFromStep: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return state.packageInfo && 
                   (state.tickets.adult > 0 || state.tickets.child > 0) &&
                   state.selectedDate && state.selectedTime;
          case 2:
            return state.traveler.name.trim() && 
                   state.traveler.surname.trim() &&
                   state.traveler.phone.trim() && 
                   state.traveler.email.trim();
          case 3:
            return state.paymentInfo.cardNumber.trim() &&
                   state.paymentInfo.cardHolder.trim() &&
                   state.paymentInfo.expiryDate.trim() &&
                   state.paymentInfo.cvv.trim();
          default:
            return true;
        }
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        // Only persist essential data, not sensitive payment info
        packageInfo: state.packageInfo,
        tickets: state.tickets,
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        traveler: state.traveler,
        appliedDiscount: state.appliedDiscount
      })
    }
  )
);

export default useBookingStore;

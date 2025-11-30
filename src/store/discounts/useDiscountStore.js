import { create } from 'zustand';

// Define available discount types and their rules
const DISCOUNT_RULES = {
  // Group discount: 25% off for 10+ people
  GROUP_DISCOUNT: {
    id: 'GROUP_DISCOUNT',
    type: 'automatic',
    name: 'Group Discount',
    description: 'Get 25% off for groups of 10 or more people',
    percentage: 25,
    minPeople: 10,
    isAutomatic: true,
  },
  // Early bird: 15% off when booking 30+ days in advance
  EARLY_BIRD: {
    id: 'EARLY_BIRD',
    type: 'automatic',
    name: 'Early Bird Special',
    description: 'Book 30 days in advance and save 15%',
    percentage: 15,
    minDaysInAdvance: 30,
    isAutomatic: true,
  },
  // Package deal: 20% off when booking 3+ tours (requires promo code)
  PACKAGE_DEAL: {
    id: 'PACKAGE_DEAL',
    type: 'code',
    name: 'Package Deal',
    description: 'Combine 3+ tours for exclusive bundle pricing',
    percentage: 20,
    code: 'BUNDLE20',
    isAutomatic: false,
  },
  // Promo codes
  PROMO_CODES: {
    'WELCOME10': {
      id: 'WELCOME10',
      type: 'code',
      name: 'Welcome Discount',
      description: 'Welcome discount for new customers',
      percentage: 10,
      isAutomatic: false,
      singleUse: true,
    },
    'SUMMER25': {
      id: 'SUMMER25',
      type: 'code',
      name: 'Summer Special',
      description: 'Summer special discount',
      percentage: 25,
      isAutomatic: false,
      validUntil: new Date('2025-09-01'),
    },
    'BUNDLE20': {
      id: 'BUNDLE20',
      type: 'code',
      name: 'Package Deal',
      description: 'Bundle discount for multiple bookings',
      percentage: 20,
      isAutomatic: false,
    },
    'FAMILY15': {
      id: 'FAMILY15',
      type: 'code',
      name: 'Family Discount',
      description: 'Family discount for bookings with children',
      percentage: 15,
      isAutomatic: false,
      requiresChild: true,
    },
    'VOYAGO30': {
      id: 'VOYAGO30',
      type: 'code',
      name: 'VIP Discount',
      description: 'Exclusive VIP discount',
      percentage: 30,
      isAutomatic: false,
    },
  },
};

const useDiscountStore = create((set, get) => ({
  // Current applied discount
  appliedDiscount: null,
  appliedPromoCode: null,
  promoCodeError: null,
  
  // Available discounts for display
  availableOffers: [
    {
      id: 'group',
      icon: 'users',
      title: 'Group Discounts',
      description: 'Get up to 25% off for groups of 10 or more people',
      discount: '25%',
      type: 'automatic',
    },
    {
      id: 'early',
      icon: 'gift',
      title: 'Early Bird Special',
      description: 'Book 30 days in advance and save 15% on any tour',
      discount: '15%',
      type: 'automatic',
    },
    {
      id: 'package',
      icon: 'percent',
      title: 'Package Deals',
      description: 'Use code BUNDLE20 for 20% off',
      discount: '20%',
      type: 'code',
      code: 'BUNDLE20',
    },
  ],

  // Check and apply automatic discounts based on booking data
  checkAutomaticDiscounts: (bookingData) => {
    const { tickets, selectedDate } = bookingData;
    const totalPeople = (tickets?.adult || 0) + (tickets?.child || 0);
    
    // Check group discount (highest priority for automatic)
    if (totalPeople >= DISCOUNT_RULES.GROUP_DISCOUNT.minPeople) {
      return {
        ...DISCOUNT_RULES.GROUP_DISCOUNT,
        appliedReason: `Group of ${totalPeople} people`,
      };
    }
    
    // Check early bird discount
    if (selectedDate) {
      const bookingDate = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      bookingDate.setHours(0, 0, 0, 0);
      
      const daysInAdvance = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysInAdvance >= DISCOUNT_RULES.EARLY_BIRD.minDaysInAdvance) {
        return {
          ...DISCOUNT_RULES.EARLY_BIRD,
          appliedReason: `Booked ${daysInAdvance} days in advance`,
        };
      }
    }
    
    return null;
  },

  // Apply automatic discounts
  applyAutomaticDiscount: (bookingData) => {
    const discount = get().checkAutomaticDiscounts(bookingData);
    
    // Only apply automatic discount if no promo code is applied
    // or if automatic discount is better
    const currentPromo = get().appliedPromoCode;
    
    if (discount && (!currentPromo || discount.percentage > currentPromo.percentage)) {
      set({ appliedDiscount: discount });
      return discount;
    }
    
    // Keep promo code if it's better
    if (currentPromo) {
      set({ appliedDiscount: currentPromo });
      return currentPromo;
    }
    
    set({ appliedDiscount: null });
    return null;
  },

  // Apply promo code
  applyPromoCode: (code, bookingData = {}) => {
    const upperCode = code.toUpperCase().trim();
    const promoCode = DISCOUNT_RULES.PROMO_CODES[upperCode];
    
    if (!promoCode) {
      set({ promoCodeError: 'Invalid promo code' });
      return { success: false, error: 'Invalid promo code' };
    }
    
    // Check if code has expired
    if (promoCode.validUntil && new Date() > promoCode.validUntil) {
      set({ promoCodeError: 'This promo code has expired' });
      return { success: false, error: 'This promo code has expired' };
    }
    
    // Check if family discount requires children
    if (promoCode.requiresChild && (!bookingData.tickets?.child || bookingData.tickets.child === 0)) {
      set({ promoCodeError: 'This code requires at least one child ticket' });
      return { success: false, error: 'This code requires at least one child ticket' };
    }
    
    // Check if automatic discount is better
    const autoDiscount = get().checkAutomaticDiscounts(bookingData);
    
    if (autoDiscount && autoDiscount.percentage > promoCode.percentage) {
      set({ 
        promoCodeError: `You already have a better discount (${autoDiscount.name}: ${autoDiscount.percentage}% off)`,
        appliedPromoCode: null,
      });
      return { 
        success: false, 
        error: `You already have a better automatic discount applied`,
        currentDiscount: autoDiscount,
      };
    }
    
    // Apply the promo code
    set({ 
      appliedPromoCode: promoCode,
      appliedDiscount: promoCode,
      promoCodeError: null,
    });
    
    return { success: true, discount: promoCode };
  },

  // Remove promo code
  removePromoCode: (bookingData = {}) => {
    set({ appliedPromoCode: null, promoCodeError: null });
    
    // Check if there's an automatic discount to apply instead
    const autoDiscount = get().checkAutomaticDiscounts(bookingData);
    set({ appliedDiscount: autoDiscount });
    
    return autoDiscount;
  },

  // Calculate discount amount
  calculateDiscountAmount: (subtotal) => {
    const { appliedDiscount } = get();
    
    if (!appliedDiscount) return 0;
    
    return (subtotal * appliedDiscount.percentage) / 100;
  },

  // Calculate final price after discount
  calculateFinalPrice: (subtotal) => {
    const discountAmount = get().calculateDiscountAmount(subtotal);
    return Math.max(0, subtotal - discountAmount);
  },

  // Get discount summary for display
  getDiscountSummary: (subtotal) => {
    const { appliedDiscount } = get();
    
    if (!appliedDiscount) {
      return null;
    }
    
    const discountAmount = get().calculateDiscountAmount(subtotal);
    const finalPrice = get().calculateFinalPrice(subtotal);
    
    return {
      name: appliedDiscount.name,
      percentage: appliedDiscount.percentage,
      reason: appliedDiscount.appliedReason || appliedDiscount.description,
      discountAmount,
      finalPrice,
      isAutomatic: appliedDiscount.isAutomatic,
    };
  },

  // Clear all discounts
  clearDiscounts: () => {
    set({ 
      appliedDiscount: null, 
      appliedPromoCode: null,
      promoCodeError: null,
    });
  },

  // Clear error
  clearError: () => {
    set({ promoCodeError: null });
  },
}));

export default useDiscountStore;

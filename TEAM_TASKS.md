# Voyago Project - Team Task Breakdown

## Project Overview
Voyago is a travel booking platform with packages, bookings, user authentication, and multi-language support (English/Arabic with RTL). The theme system (light/dark mode) and basic package display are already implemented.

---

## Person 1: Authentication & User Management

### Your Responsibilities:
- Complete authentication system (login, register, password reset)
- Build user dashboard with profile management
- Implement user bookings management
- Connect to authentication API

### Files You'll Work On:
**Authentication:**
- `src/features/auth/LoginForm.jsx` & `.module.css`
- `src/features/auth/RegisterForm.jsx` & `.module.css`
- `src/features/auth/ForgotPasswordForm.jsx` & `.module.css`
- `src/features/auth/AuthModal.jsx` & `.module.css`
- `src/features/auth/useAuth.js`
- `src/features/auth/authAPI.js`

**Dashboard:**
- `src/features/dashboard/DashboardPage.jsx` & `.module.css`
- `src/features/dashboard/UserProfile.jsx` & `.module.css`
- `src/features/dashboard/UserBookings.jsx` & `.module.css`
- `src/features/dashboard/DashboardMenu.jsx` & `.module.css`
- `src/features/dashboard/useDashboard.js`
- `src/features/dashboard/dashboardAPI.js`

**Global State:**
- `src/app/store.js` (Zustand store for auth state)

### Your Workflow:
1. **Week 1: Authentication Forms & Logic**
   - Design and implement login form with validation
   - Create register form with email/password validation
   - Build forgot password flow
   - Style forms to match theme (light/dark mode support)
   - Add RTL support for Arabic
   - Implement `useAuth` hook with login, register, logout functions
   - Connect to `authAPI.js` for backend calls
   - Add error handling and loading states
   - Store auth tokens in localStorage

2. **Week 2: Dashboard & Protected Routes**
   - Create protected route wrapper
   - Build dashboard layout with menu navigation
   - Create user profile page (view/edit)
   - Implement user bookings list component
   - Connect to `dashboardAPI.js`

3. **Week 3: Integration & Polish**
   - Integrate auth with Navbar (show user menu when logged in)
   - Add auth state to global store
   - Test all auth flows
   - Ensure theme and RTL work correctly
   - Final bug fixes and refinements

### Key Requirements:
- All forms must support theme switching
- RTL layout for Arabic
- Form validation with error messages
- Loading states during API calls
- Responsive design (mobile/desktop)

---

## Person 2: Booking System

### Your Responsibilities:
- Complete booking flow (form → payment → confirmation)
- Implement booking summary component
- Connect booking forms to API
- Handle booking state management

### Files You'll Work On:
**Booking Flow:**
- `src/features/bookings/BookingPage.jsx` & `.module.css`
- `src/features/bookings/BookingForm.jsx` & `.module.css`
- `src/features/bookings/BookingPayment.jsx` & `.module.css`
- `src/features/bookings/BookingComplete.jsx` & `.module.css`
- `src/features/bookings/BookingSummary.jsx` & `.module.css`
- `src/features/bookings/useBookings.js`
- `src/features/bookings/bookingsAPI.js`

**Shared Components:**
- `src/features/shared/components/BikeBookingForm/BikeBookingForm.jsx` (if needed)

### Your Workflow:
1. **Week 1: Booking Form & Summary**
   - Design booking form with traveler details
   - Add date pickers, guest count, special requests
   - Implement form validation
   - Style to match theme system
   - Add RTL support
   - Build booking summary component (shows package details, dates, price)

2. **Week 2: Payment & Confirmation**
   - Build payment form with card details
   - Add payment method selection (card, PayPal, etc.)
   - Implement payment validation
   - Create secure payment flow
   - Add loading states
   - Create booking confirmation page
   - Add booking ID display
   - Implement email confirmation UI

3. **Week 3: Integration & State Management**
   - Implement `useBookings` hook
   - Connect to `bookingsAPI.js`
   - Connect booking flow to package selection
   - Add booking to user's booking list
   - Test complete booking flow
   - Handle errors and edge cases

### Key Requirements:
- Multi-step form with progress indicator
- Theme support (light/dark)
- RTL layout for Arabic
- Form validation
- Responsive design
- Integration with Person 1's auth system

---

## Person 3: Packages & Details

### Your Responsibilities:
- Build package details page
- Implement package gallery
- Create package booking form
- Connect packages to API
- Enhance package display

### Files You'll Work On:
**Package Details:**
- `src/features/packages/PackageDetails.jsx` & `.module.css`
- `src/features/packages/PackageGallery.jsx` & `.module.css`
- `src/features/packages/PackageBookingForm.jsx` & `.module.css`
- `src/features/packages/usePackages.js`
- `src/features/packages/packagesAPI.js`

**Existing (Enhance):**
- `src/features/packages/PackageCard.jsx` (already done, may need tweaks)
- `src/features/packages/PackagesPage.jsx` (already done, may need tweaks)
- `src/features/packages/data.js` (replace with API data)

### Your Workflow:
1. **Week 1: Package Details & Gallery**
   - Design package details layout
   - Show package description, itinerary, inclusions
   - Add price breakdown section
   - Build image gallery component with carousel/slider
   - Implement lightbox for full-size images
   - Style with theme support and RTL
   - Add image lazy loading

2. **Week 2: Booking Form & API Setup**
   - Create inline booking form for package details page
   - Add date selection, guest count
   - Show real-time price calculation
   - Add validation
   - Implement `usePackages` hook
   - Connect to `packagesAPI.js`

3. **Week 3: Integration & Polish**
   - Replace mock data with real API calls
   - Add loading states and error handling
   - Connect to booking flow (Person 2)
   - Implement package filtering/search
   - Final refinements

### Key Requirements:
- Beautiful package details page
- Image gallery with smooth transitions
- Theme support (cards already have this)
- RTL layout
- Responsive design
- Integration with booking system (Person 2)

---

## Person 4: Search & Discovery

### Your Responsibilities:
- Build search functionality
- Complete home page components
- Implement search filters
- Create search results display

### Files You'll Work On:
**Search:**
- `src/features/search/SearchPage.jsx` & `.module.css`
- `src/features/search/SearchForm.jsx` & `.module.css`
- `src/features/search/SearchResultCard.jsx` & `.module.css`
- `src/features/search/useSearch.js`
- `src/features/search/searchAPI.js`

**Home Page Components:**
- `src/features/home/HeroSection.jsx` & `.module.css`
- `src/features/home/HeroSearchForm.jsx` & `.module.css`
- `src/features/home/PopularDestinations.jsx` & `.module.css`
- `src/features/home/PopularTransport.jsx` & `.module.css`
- `src/features/home/ExploreCategories.jsx` & `.module.css`
- `src/features/home/TravelTips.jsx` & `.module.css`
- `src/features/home/OffersCTA.jsx` & `.module.css`
- `src/features/home/HomePage.jsx` (coordinate with others)

### Your Workflow:
1. **Week 1: Search Page & Results**
   - Design search page layout
   - Build search form with filters (destination, date, price range)
   - Implement search input with debouncing
   - Add filter sidebar
   - Create search results grid/list view
   - Build `SearchResultCard` component
   - Add sorting options (price, rating, date)
   - Style with theme support

2. **Week 2: Home Page Components**
   - Complete hero section with search form
   - Build popular destinations carousel
   - Create explore categories section
   - Add travel tips section
   - Build offers CTA section

3. **Week 3: Integration & API**
   - Connect home page search to search page
   - Implement `useSearch` hook
   - Connect to `searchAPI.js`
   - Implement pagination
   - Add loading states
   - Ensure RTL support
   - Test search functionality

### Key Requirements:
- Advanced search with multiple filters
- Real-time search results
- Theme support
- RTL layout
- Responsive design
- Integration with packages (Person 3)

---

## Person 5: Content Pages & Reviews

### Your Responsibilities:
- Complete about page sections
- Build contact page with form
- Implement reviews/testimonials system
- Create review forms
- Polish static content pages

### Files You'll Work On:
**About Page:**
- `src/features/about/AboutHero.jsx` & `.module.css`
- `src/features/about/AboutStats.jsx` & `.module.css`
- `src/features/about/AboutFeatures.jsx` & `.module.css`
- `src/features/about/AboutPage.jsx` (already exists, enhance)

**Contact:**
- `src/features/contact/ContactPage.jsx` & `.module.css`
- `src/features/contact/ContactForm.jsx` & `.module.css`
- `src/features/contact/ContactInfo.jsx` & `.module.css`

**Reviews:**
- `src/features/reviews/ReviewCard.jsx` & `.module.css`
- `src/features/reviews/ReviewForm.jsx` & `.module.css`
- `src/features/reviews/useReviews.js`
- `src/features/reviews/reviewsAPI.js`

**Testimonials:**
- `src/features/shared/components/Testimonials/Testimonials.jsx` (enhance)

**Static Pages:**
- `src/features/pages/FAQ/FAQPage.jsx` & `.module.css`
- `src/features/pages/PrivacyPolicy/PrivacyPolicyPage.jsx` & `.module.css`
- `src/features/pages/TermsOfService/TermsOfServicePage.jsx` & `.module.css`

### Your Workflow:
1. **Week 1: About & Contact Pages**
   - Complete hero section
   - Build stats section (numbers, achievements)
   - Create features section
   - Add company story/content
   - Design contact page layout
   - Build contact form with validation
   - Add contact information display (address, phone, email)
   - Style with theme support

2. **Week 2: Reviews System**
   - Build review card component
   - Create review form (rating, comment)
   - Implement review display (stars, date, user)
   - Connect to `reviewsAPI.js`
   - Enhance testimonials component
   - Implement form submission for contact

3. **Week 3: Static Pages & Polish**
   - Complete FAQ page with accordion
   - Add privacy policy content
   - Add terms of service content
   - Ensure all pages have theme support
   - Test RTL layout
   - Final refinements

### Key Requirements:
- Beautiful, informative content pages
- Working contact form
- Review system with ratings
- Theme support everywhere
- RTL layout
- Responsive design

---

## Person 6: Infrastructure & Polish

### Your Responsibilities:
- Set up API integration structure
- Implement error handling
- Add loading states globally
- Create utility functions
- Set up state management
- Testing and bug fixes
- Performance optimization

### Files You'll Work On:
**API Structure:**
- `src/features/packages/packagesAPI.js`
- `src/features/bookings/bookingsAPI.js`
- `src/features/auth/authAPI.js`
- `src/features/search/searchAPI.js`
- `src/features/dashboard/dashboardAPI.js`
- `src/features/reviews/reviewsAPI.js`

**Utilities:**
- `src/features/shared/utils/formatPrice.js` (enhance)
- `src/features/shared/utils/formatDate.js` (enhance)
- `src/features/shared/utils/validateEmail.js` (enhance)
- Create new utilities as needed

**Hooks:**
- `src/features/shared/hooks/useFetch.js` (enhance)
- `src/features/shared/hooks/useDebounce.js` (enhance)

**State Management:**
- `src/app/store.js` (Zustand store setup)
- Global state for auth, cart, notifications

**Error Handling:**
- `src/features/pages/Error/ErrorPage.jsx` & `.module.css`
- `src/features/pages/NotFoundPage/NotFoundPage.jsx` (enhance)
- Error boundary component

**Translation:**
- Review and complete translation files in `public/locales/`
- Ensure all new components have translations

### Your Workflow:
1. **Week 1: API Infrastructure & State Management**
   - Set up axios instance with base URL
   - Create API utility functions
   - Implement error handling middleware
   - Add request/response interceptors
   - Set up authentication token handling
   - Set up Zustand store structure
   - Create global state slices (auth, cart, UI)

2. **Week 2: Utilities & Error Handling**
   - Enhance utility functions (formatPrice, formatDate)
   - Create validation utilities
   - Build custom hooks (useFetch, useDebounce)
   - Create error boundary component
   - Enhance error page
   - Build global loading component
   - Add toast notifications system

3. **Week 3: Integration & Polish**
   - Test all API integrations
   - Fix cross-team integration issues
   - Optimize performance (lazy loading, code splitting)
   - Complete missing translations
   - Implement error logging
   - Final polish and bug fixes

### Key Requirements:
- Clean API structure that all team members can use
- Consistent error handling
- Global loading states
- Proper state management
- Performance optimized
- All translations complete

---

## Cross-Team Dependencies

### Person 1 ↔ Person 2:
- Person 2 needs auth state from Person 1 for booking
- Person 1 needs booking data from Person 2 for user dashboard

### Person 2 ↔ Person 3:
- Person 2 needs package data from Person 3 for booking
- Person 3 needs booking integration from Person 2

### Person 3 ↔ Person 4:
- Person 4 needs package data structure from Person 3
- Person 3 may use search functionality from Person 4

### Person 5 ↔ All:
- Reviews need to connect to packages (Person 3)
- Contact form may need auth (Person 1)

### Person 6 ↔ Everyone:
- Everyone uses Person 6's API structure
- Everyone uses Person 6's utilities and state management
- Person 6 fixes integration issues between all teams

---

## Common Requirements for Everyone

### Theme Support:
- All components must work in light and dark mode
- Use CSS variables from `src/styles/globals.css`
- Test theme switching

### RTL Support:
- All layouts must work in RTL (Arabic)
- Use `i18n.dir()` for conditional styling
- Test language switching

### Responsive Design:
- Mobile-first approach
- Test on mobile (max-width: 991px) and desktop
- Use Bootstrap grid system

### Code Quality:
- Follow existing code style
- Use CSS modules for styling
- Add comments only where needed (human-like, not AI-style)
- Keep components focused and reusable

### Translation:
- All user-facing text must use `useTranslation` hook
- Add translation keys to `public/locales/en/` and `public/locales/ar/`
- Coordinate with Person 6 for translation structure

---

## Timeline: 3.5 Weeks

The project timeline is **3.5 weeks** (17.5 working days). Each person has 3 main work phases, with the final half week dedicated to integration and final polish.

## Weekly Sync Points

- **Monday Morning**: Share what you'll work on this week
- **Wednesday**: Quick check-in, share blockers
- **Friday Afternoon**: Demo what you completed, discuss integration needs
- **End of Week 3**: Final integration check
- **Week 3.5**: Final bug fixes, testing, and deployment prep

---

## Getting Started Checklist

1. Pull latest code from repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Test theme switching (already works)
5. Test language switching (already works)
6. Review your assigned files
7. Create a feature branch: `git checkout -b feature/your-name/your-feature`
8. Start coding!

---

## Notes

- The theme system is already working - don't break it!
- RTL support is implemented - test your components in Arabic
- Package cards are styled and working - use as reference
- API endpoints are not yet defined - Person 6 will set up the structure
- Use mock data initially, then connect to real API later

Good luck! 🚀


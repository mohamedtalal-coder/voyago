# Voyago - Responsive Design Implementation Guide

## Overview

This document outlines the comprehensive responsive design implementation for the Voyago travel booking website. The implementation follows mobile-first principles and uses a combination of **CSS media queries** and the custom **`useMediaQuery`** React hook for handling responsive behavior across all breakpoints.

---

## Table of Contents

1. [Breakpoint Strategy](#breakpoint-strategy)
2. [useMediaQuery Hook](#usemediaquery-hook)
3. [Components Updated](#components-updated)
4. [CSS Media Query Patterns](#css-media-query-patterns)
5. [Best Practices](#best-practices)
6. [Component-by-Component Details](#component-by-component-details)

---

## Breakpoint Strategy

We use a consistent set of breakpoints throughout the application:

| Breakpoint | Width | Device Target |
|------------|-------|---------------|
| **Large Desktop** | `> 1200px` | Large monitors |
| **Desktop** | `992px - 1200px` | Standard desktops |
| **Tablet** | `768px - 991px` | Tablets, small laptops |
| **Mobile** | `576px - 767px` | Large phones, small tablets |
| **Small Mobile** | `< 576px` | Small phones |
| **Extra Small** | `< 400px` | Very small devices |

---

## useMediaQuery Hook

### Location
```
src/hooks/useMediaQuery.js
```

### Implementation
```javascript
import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export default useMediaQuery;
```

### When to Use `useMediaQuery` vs CSS Media Queries

| Use Case | Recommended Approach |
|----------|---------------------|
| **Styling changes** (colors, sizes, spacing) | CSS Media Queries |
| **Layout adjustments** (grid columns, flex direction) | CSS Media Queries |
| **Conditional rendering** (show/hide entire components) | `useMediaQuery` |
| **Different component behavior** (slider items, hamburger logic) | `useMediaQuery` |
| **Animation changes based on screen size** | `useMediaQuery` |
| **Passing dynamic props** based on screen size | `useMediaQuery` |

---

## Components Updated

### Components Using `useMediaQuery`

| Component | File Path | Usage |
|-----------|-----------|-------|
| **Navbar** | `src/layout/Navbar/Navbar.jsx` | Mobile menu toggle, animated mobile menu |
| **Reviews** | `src/features/reviews/components/Reviews/Reviews.jsx` | Dynamic `perSlide` for Slider component |
| **AdminLayout** | `src/features/admin/components/AdminLayout/AdminLayout.jsx` | Hamburger menu, slide-in sidebar |

### CSS Modules with Responsive Updates

| Component | File Path | Responsive Features |
|-----------|-----------|---------------------|
| **Navbar** | `src/layout/Navbar/Navbar.module.css` | Full-screen mobile menu, animated links |
| **Footer** | `src/layout/Footer/Footer.module.css` | Grid collapse to single column |
| **HeroSearchForm** | `src/features/home/.../HeroSearchForm.module.css` | Vertical form on mobile, fixed dropdown |
| **Reviews** | `src/features/reviews/.../Reviews.module.css` | Responsive cards, mobile modal |
| **SpecialOffers** | `src/features/home/.../SpecialOffers.module.css` | Column layout on tablet |
| **TravelTips** | `src/features/home/.../TravelTips.module.css` | Grid from 4→2→1 columns |
| **PopularTransport** | `src/features/home/.../PopularTransport.module.css` | Responsive card grid |
| **AdminLayout** | `src/features/admin/.../AdminLayout.module.css` | Slide-in sidebar, hamburger menu |
| **AdminPackages** | `src/features/admin/.../AdminPackages.module.css` | Mobile card layout, responsive modal |
| **ServiceBookingForm** | `src/components/ServiceBookingForm/...` | Single column form, responsive image |
| **PackageDetails** | `src/features/packages/.../PackageDetails.module.css` | Responsive gallery, calendar |
| **PackageCard** | `src/features/packages/.../PackageCard.module.css` | Responsive card sizes |
| **Modal** | `src/components/Modal/Modal.module.css` | Full-width on mobile |
| **AboutHero** | `src/features/about/.../AboutHero.module.css` | Responsive typography |
| **AboutFeatures** | `src/features/about/.../AboutFeatures.module.css` | Responsive feature cards |
| **ContactForm** | `src/features/contact/.../ContactForm.module.css` | Full-width form |
| **ContactInfo** | `src/features/contact/.../ContactInfo.module.css` | Responsive contact items |
| **Dashboard** | `src/features/screens/dashboardScreen/...` | Responsive padding |
| **Slider** | `src/components/Slider/Slider.module.css` | Responsive carousel |

---

## CSS Media Query Patterns

### Standard Pattern for Component CSS Modules

```css
/* Base styles (mobile-first or desktop-first) */
.component {
  /* Default styles */
}

/* Large tablets / small desktops */
@media (max-width: 992px) {
  .component {
    /* Tablet adjustments */
  }
}

/* Tablets */
@media (max-width: 768px) {
  .component {
    /* Mobile tablet adjustments */
  }
}

/* Mobile */
@media (max-width: 576px) {
  .component {
    /* Small mobile adjustments */
  }
}

/* Very small screens */
@media (max-width: 400px) {
  .component {
    /* Extra small adjustments */
  }
}
```

### RTL Support Pattern

```css
/* Base RTL adjustments */
[dir="rtl"] .component {
  /* RTL-specific styles */
}

/* RTL responsive adjustments */
@media (max-width: 768px) {
  [dir="rtl"] .component {
    /* RTL mobile adjustments */
  }
}
```

---

## Best Practices

### 1. Mobile-First Considerations
- Start with base styles that work on all screens
- Use `max-width` media queries to override for smaller screens
- Consider touch targets (minimum 44x44px for interactive elements)

### 2. Typography Scaling
```css
/* Example from globals.css */
@media (max-width: 992px) {
  body { font-size: 14px; }
}

@media (max-width: 576px) {
  body { font-size: 13px; }
}
```

### 3. Grid Responsiveness
```css
/* Example: 4 columns → 2 columns → 1 column */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 4. Touch-Friendly Hover States
```css
/* Disable hover effects on touch devices */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-5px);
  }
}

/* Alternative: Use larger touch targets on mobile */
@media (max-width: 768px) {
  .button {
    padding: 0.875rem 1.5rem; /* Larger tap area */
    min-height: 48px;
  }
}
```

### 5. Form Input Sizing (Prevent iOS Zoom)
```css
/* Prevent zoom on iOS when focusing inputs */
@media (max-width: 576px) {
  .input {
    font-size: 16px; /* Must be 16px+ to prevent zoom */
  }
}
```

---

## Component-by-Component Details

### 1. Navbar (`Navbar.jsx` + `Navbar.module.css`)

**JavaScript Changes:**
```javascript
import useMediaQuery from '../../hooks/useMediaQuery';

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 991px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Conditionally render animated mobile menu or static desktop menu
  return isMobile ? (
    <AnimatePresence>
      {isMenuOpen && <motion.div className={styles.navCollapse}>...</motion.div>}
    </AnimatePresence>
  ) : (
    <div className={styles.navCollapse}>...</div>
  );
};
```

**CSS Changes:**
- Full-screen mobile menu with backdrop blur
- Animated slide-in navigation links
- Vertical layout for nav items on mobile

---

### 2. Reviews (`Reviews.jsx` + `Reviews.module.css`)

**JavaScript Changes:**
```javascript
import useMediaQuery from '../../../../hooks/useMediaQuery';

export default function Reviews() {
  const isMobile = useMediaQuery('(max-width: 576px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  
  const getPerSlide = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };
  
  return (
    <Slider perSlide={getPerSlide()} maxWidth="1500px">
      {reviewNodes}
    </Slider>
  );
}
```

**CSS Changes:**
- Responsive review cards
- Full-width modal on mobile
- Touch-friendly star rating

---

### 3. AdminLayout (`AdminLayout.jsx` + `AdminLayout.module.css`)

**JavaScript Changes:**
```javascript
import useMediaQuery from '../../../../hooks/useMediaQuery';

const AdminLayout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      {isMobile && (
        <button className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}
      
      {isMobile && sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isMobile && sidebarOpen ? styles.sidebarOpen : ''}`}>
        ...
      </aside>
    </div>
  );
};
```

**CSS Changes:**
```css
/* Hamburger button */
.hamburger {
  display: none;
  position: fixed;
  /* ... styling */
}

/* Mobile sidebar overlay */
.sidebarOverlay {
  display: none;
  position: fixed;
  /* ... overlay styling */
}

@media (max-width: 768px) {
  .hamburger { display: flex; }
  .sidebarOverlay { display: block; }
  
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebarOpen {
    transform: translateX(0);
  }
}
```

---

### 4. HeroSearchForm (`HeroSearchForm.module.css`)

**Key Responsive Features:**
- Desktop: Horizontal form with inline fields
- Tablet: 2x2 grid layout for form fields
- Mobile: Vertical stack, full-width fields
- Fixed bottom dropdown on mobile

```css
@media (max-width: 768px) {
  .searchForm { flex-direction: column; }
  .formFields { flex-direction: column; }
  .formField { width: 100%; min-width: 100%; }
  
  /* Fixed bottom dropdown on mobile */
  .dropdownContent {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .searchButton {
    width: 100%;
    height: 50px;
  }
}
```

---

### 5. TravelTips / PopularPackages (`TravelTips.module.css`)

**Grid Responsive Breakdown:**
```css
.packages-grid {
  grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
}

@media (max-width: 1024px) {
  .packages-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (max-width: 768px) {
  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 600px) {
  .packages-grid {
    grid-template-columns: 1fr; /* Mobile: 1 column */
  }
}
```

---

### 6. ServiceBookingForm (`ServiceBookingForm.module.css`)

**Key Responsive Features:**
- Desktop: Side-by-side form + image
- Tablet: Stacked layout (image on top)
- Mobile: Single column form grid

```css
@media (max-width: 992px) {
  .contentWrapper {
    flex-direction: column;
  }
  .imageContainer { order: -1; } /* Image moves to top */
}

@media (max-width: 768px) {
  .formGrid {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

---

### 7. Modal (`Modal.module.css`)

**Responsive Modal Sizing:**
```css
.modalContent {
  width: 90%;
  max-width: 420px;
  max-height: 90vh;
}

@media (max-width: 576px) {
  .modalContent {
    width: 95%;
    max-height: 85vh;
    padding: 1.5rem 1rem;
  }
}
```

---

## Testing Checklist

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 12/13 Pro Max (428px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro 11" (834px)
- [ ] iPad Pro 12.9" (1024px)
- [ ] Desktop 1280px
- [ ] Desktop 1920px

### Functional Testing
- [ ] Navbar hamburger menu opens/closes
- [ ] Mobile menu links work and close menu
- [ ] Form fields are usable on mobile
- [ ] Modals scroll properly on small screens
- [ ] Touch targets are large enough (44px minimum)
- [ ] No horizontal scroll on any page
- [ ] Images resize properly
- [ ] Text is readable at all sizes

### RTL Testing
- [ ] Arabic language layout mirrors correctly
- [ ] Forms align properly in RTL
- [ ] Navigation works in RTL
- [ ] Dropdowns position correctly in RTL

---

## Files Modified Summary

### JavaScript Files (useMediaQuery Integration)
1. `src/layout/Navbar/Navbar.jsx` - Mobile menu logic
2. `src/features/reviews/components/Reviews/Reviews.jsx` - Dynamic slider
3. `src/features/admin/components/AdminLayout/AdminLayout.jsx` - Hamburger sidebar

### CSS Module Files (Responsive Updates)
1. `src/layout/Navbar/Navbar.module.css`
2. `src/layout/Footer/Footer.module.css`
3. `src/features/home/components/HeroSearchForm/HeroSearchForm.module.css`
4. `src/features/home/components/SpecialOffers/SpecialOffers.module.css`
5. `src/features/home/components/TravelTips/TravelTips.module.css`
6. `src/features/home/components/PopularTransport/PopularTransport.module.css`
7. `src/features/reviews/components/Reviews/Reviews.module.css`
8. `src/features/admin/components/AdminLayout/AdminLayout.module.css`
9. `src/features/admin/components/AdminPackages/AdminPackages.module.css`
10. `src/features/packages/components/PackageDetails/PackageDetails.module.css`
11. `src/features/packages/components/PackageCard/PackageCard.module.css`
12. `src/features/about/components/AboutHero/AboutHero.module.css`
13. `src/features/about/components/AboutFeatures/AboutFeatures.module.css`
14. `src/features/contact/components/ContactForm/ContactForm.module.css`
15. `src/features/contact/components/ContactInfo/ContactInfo.module.css`
16. `src/features/screens/dashboardScreen/Dashboard.module.css`
17. `src/components/Modal/Modal.module.css`
18. `src/components/Slider/Slider.module.css`
19. `src/components/ServiceBookingForm/ServiceBookingForm.module.css`
20. `src/styles/globals.css` (base responsive typography)

---

## Conclusion

The Voyago website now features comprehensive responsive design that ensures a great user experience across all devices. The implementation uses:

1. **CSS Media Queries** for styling adjustments (the primary approach)
2. **`useMediaQuery` hook** for conditional rendering and dynamic props
3. **Consistent breakpoints** across all components
4. **RTL support** for Arabic language users
5. **Touch-friendly interactions** on mobile devices

This hybrid approach ensures optimal performance (CSS handles most responsive logic) while allowing dynamic JavaScript behavior when needed.

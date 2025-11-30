# Voyago Project Overview

## Slide 2: Project Idea

### Problem Being Solved
Travelers face fragmented booking experiences—having to visit multiple websites for tour packages, transportation (bikes, buses, cars), and travel services. This leads to wasted time, inconsistent pricing, and a frustrating planning process.

### Proposed Solution
**Voyago** is an all-in-one travel booking platform that consolidates tour packages, transportation services, and travel planning into a single, seamless experience. Users can browse destinations, book tours, rent vehicles, and manage all their travel needs from one place.

### Unique Value Proposition
- **Unified Platform**: Book tours + transportation + services in one checkout
- **Bilingual Support**: Full Arabic/English interface with RTL support
- **Real-time Availability**: Live booking system with instant confirmation
- **Admin Dashboard**: Complete business management for tour operators
- **OAuth Integration**: Google & GitHub login for frictionless onboarding

---

## Slide 3: Project Wireframe

### Key User Interfaces
| Screen | Purpose |
|--------|---------|
| **Homepage** | Hero search, featured packages, popular transport, special offers |
| **Packages Page** | Browse/filter all tour packages with pricing |
| **Package Details** | Gallery, itinerary, booking form, reviews |
| **Service Pages** | Bike/Bus/Car rental with booking forms |
| **Dashboard** | User profile, booking history, tickets management |
| **Admin Panel** | CRUD for packages, services, users, reviews, stats |

### User Journey
```
Landing → Browse Packages → View Details → Select Service → 
Book & Pay → Receive Ticket → View in Dashboard → Leave Review
```

---

## Slide 4: End Users + Features

### Primary User Personas

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| **Travelers** | Individuals/families planning trips | Easy booking, clear pricing, multilingual |
| **Business Travelers** | Professionals needing transport | Quick bike/car rental, reliable service |
| **Tour Operators (Admin)** | Business owners managing tours | Inventory management, analytics, customer data |

### Key Features by User Type

**For Travelers:**
- Search & filter packages by destination, price, duration
- Book tour packages with date selection
- Rent bikes, buses, cars with flexible scheduling
- View booking history and download tickets
- Submit reviews and ratings

**For Admins:**
- Full CRUD for packages, services, reviews
- User management with role-based access
- Contact form submissions dashboard
- Site statistics and analytics
- Approve/reject user reviews

---

## Slide 5: Data Structure

### Database Architecture
**MongoDB (Non-Relational/Document-Based)**

### Key Entities & Relationships

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Users     │────▶│    Bookings      │◀────│  Packages   │
│             │     │  (user tickets)  │     │   (tours)   │
└─────────────┘     └──────────────────┘     └─────────────┘
      │                                            │
      │             ┌──────────────────┐           │
      └────────────▶│     Reviews      │◀──────────┘
                    └──────────────────┘
                    
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Services   │     │    Contacts      │     │    Stats    │
│(bike/bus/car)│    │ (form submissions)│    │ (site data) │
└─────────────┘     └──────────────────┘     └─────────────┘
```

### Collections Schema

| Collection | Key Fields |
|------------|------------|
| **users** | name, email, password, avatar, role (user/admin), OAuth provider |
| **tourPackages** | titleKey, descriptionKey, price, duration, img, gallery, subimages, included, excluded |
| **services** | type (bike/bus/car), titleKey, price, img, features |
| **reviews** | name, comment, rating, avatar, isApproved |
| **contacts** | name, email, message, createdAt |
| **stats** | key, value, labelKey, order |

### Data Flow
1. **Frontend** → Axios HTTP requests to REST API
2. **Express.js Server** → Routes handle CRUD operations
3. **Mongoose ODM** → Validates & queries MongoDB
4. **MongoDB Atlas** → Cloud-hosted document storage
5. **Response** → JSON data returned to React frontend
6. **Zustand Store** → Client-side state management & caching

---

## Slide 6: Programming Languages + Frameworks

### Languages
| Language | Usage |
|----------|-------|
| **JavaScript (ES6+)** | Frontend & Backend |
| **CSS3** | Styling with CSS Modules |
| **HTML5** | Markup structure |

### Frontend Stack
| Technology | Purpose |
|------------|---------|
| **React 19** | UI component library |
| **Vite 7** | Build tool & dev server |
| **React Router DOM 7** | Client-side routing |
| **Zustand** | State management |
| **i18next** | Internationalization (AR/EN) |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |
| **React Bootstrap** | UI components |
| **Swiper** | Carousels/sliders |
| **Lucide React / React Icons** | Icon libraries |
| **date-fns** | Date formatting |

### Backend Stack
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM for MongoDB |
| **Passport.js** | OAuth authentication (Google, GitHub) |
| **JWT** | Token-based auth |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variables |

### Supporting Technologies
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Cloud database hosting |
| **Vite Proxy** | API proxying in development |
| **ESLint** | Code quality |
| **Terser** | Production minification |
| **Git/GitHub** | Version control |

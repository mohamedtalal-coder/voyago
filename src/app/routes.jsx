import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/Loader/Loader';

const PageWrapper = lazy(() => import('../components/PageWrapper/PageWrapper'));
const HomePage = lazy(() => import('../features/screens/homeScreen/HomeScreen'));
const AboutPage = lazy(() => import('../features/screens/aboutScreen/AboutScreen'));
const ContactPage = lazy(() => import('../features/screens/contactScreen/ContactScreen'));
const PackagesPage = lazy(() => import('../features/screens/packageScreen/PackagesScreen'));
const SearchPage = lazy(() => import('../features/screens/searchScreen/SearchScreen'));
const ServicePage = lazy(() => import('../features/screens/serviceScreen/ServiceScreen'));
const DashboardPage = lazy(() => import('../features/screens/dashboardScreen/DashboardScreen'));
const BookingScreen = lazy(() => import('../features/screens/bookingScreen/BookingScreen'));
const ServiceBookingScreen = lazy(() => import('../features/screens/serviceBookingScreen/ServiceBookingScreen'));
const AuthPage = lazy(() => import('../features/screens/authScreen/AuthScreen'));
const NotFoundPage = lazy(() => import('../features/screens/shared/NotFoundPage/NotFoundScreen'));
const ErrorPage = lazy(() => import('../features/screens/shared/Error/ErrorScreen'));
const FAQPage = lazy(() => import('../features/screens/shared/FAQ/FAQScreen'));
const PrivacyPolicyPage = lazy(() => import('../features/screens/shared/PrivacyPolicy/PrivacyPolicyScreen'));
const TermsOfServicePage = lazy(() => import('../features/screens/shared/TermsOfService/TermsOfServiceScreen'));
const PackageDetails = lazy(() => import('../features/packages/components/PackageDetails/PackageDetails'));
const AuthCallback = lazy(() => import('../features/auth/components/AuthCallback/AuthCallback'));

const AdminLayout = lazy(() => import('../features/admin/components/AdminLayout/AdminLayout'));
const AdminDashboard = lazy(() => import('../features/admin/components/AdminDashboard/AdminDashboard'));
const AdminPackages = lazy(() => import('../features/admin/components/AdminPackages/AdminPackages'));
const AdminServices = lazy(() => import('../features/admin/components/AdminServices/AdminServices'));
const AdminReviews = lazy(() => import('../features/admin/components/AdminReviews/AdminReviews'));
const AdminContacts = lazy(() => import('../features/admin/components/AdminContacts/AdminContacts'));
const AdminStats = lazy(() => import('../features/admin/components/AdminStats/AdminStats'));
const AdminUsers = lazy(() => import('../features/admin/components/AdminUsers/AdminUsers'));

const LazyPageWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>
    <PageWrapper>{children}</PageWrapper>
  </Suspense>
);

const LazyComponent = ({ Component }) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LazyComponent Component={HomePage} />} />
      <Route path="/about" element={<LazyComponent Component={AboutPage} />} />
      
      <Route path="/contact" element={<LazyPageWrapper><ContactPage /></LazyPageWrapper>} />
      <Route path="/search" element={<LazyPageWrapper><SearchPage /></LazyPageWrapper>} />
      <Route path="/packages" element={<LazyPageWrapper><PackagesPage /></LazyPageWrapper>} />
      <Route path="/packages/:id" element={<LazyPageWrapper><PackageDetails /></LazyPageWrapper>} />
      <Route path="/services/:serviceType" element={<LazyPageWrapper><ServicePage /></LazyPageWrapper>} />
      <Route path="/dashboard" element={<LazyPageWrapper><DashboardPage /></LazyPageWrapper>} />
      <Route path="/booking" element={<LazyPageWrapper><BookingScreen /></LazyPageWrapper>} />
      <Route path="/service-booking" element={<LazyPageWrapper><ServiceBookingScreen /></LazyPageWrapper>} />
      <Route path="/auth" element={<LazyPageWrapper><AuthPage /></LazyPageWrapper>} />
      <Route path="/login" element={<LazyPageWrapper><AuthPage /></LazyPageWrapper>} />
      <Route path="/faq" element={<LazyPageWrapper><FAQPage /></LazyPageWrapper>} />
      <Route path="/privacy" element={<LazyPageWrapper><PrivacyPolicyPage /></LazyPageWrapper>} />
      <Route path="/privacy-policy" element={<LazyPageWrapper><PrivacyPolicyPage /></LazyPageWrapper>} />
      <Route path="/terms" element={<LazyPageWrapper><TermsOfServicePage /></LazyPageWrapper>} />
      <Route path="/terms-of-service" element={<LazyPageWrapper><TermsOfServicePage /></LazyPageWrapper>} />
      <Route path="/error" element={<LazyPageWrapper><ErrorPage /></LazyPageWrapper>} />
      <Route path="/auth/callback" element={<LazyComponent Component={AuthCallback} />} />
      
      <Route path="/admin" element={<LazyComponent Component={AdminLayout} />}>
        <Route index element={<LazyComponent Component={AdminDashboard} />} />
        <Route path="packages" element={<LazyComponent Component={AdminPackages} />} />
        <Route path="services" element={<LazyComponent Component={AdminServices} />} />
        <Route path="reviews" element={<LazyComponent Component={AdminReviews} />} />
        <Route path="contacts" element={<LazyComponent Component={AdminContacts} />} />
        <Route path="stats" element={<LazyComponent Component={AdminStats} />} />
        <Route path="users" element={<LazyComponent Component={AdminUsers} />} />
      </Route>
      
      <Route path="*" element={<LazyPageWrapper><NotFoundPage /></LazyPageWrapper>} />
    </Routes>
  );
};

export default AppRoutes;

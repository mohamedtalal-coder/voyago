import React from 'react';
import Navbar from '../layout/Navbar/Navbar';
import Footer from '../layout/Footer/Footer';
import AppRoutes from './routes';
import './App.css';
import AuthModal from '../features/auth/components/AuthModal/AuthModal';
import { Toaster } from 'sonner';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';


function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <AuthModal />
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;
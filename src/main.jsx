import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import Loader from './components/Loader/Loader';
import './lib/i18n/i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/globals.css';

// Set theme before React renders to avoid flash of wrong theme
const initializeTheme = () => {
  const getOSTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const localTheme = localStorage.getItem('app-theme');
  const initialTheme = localTheme || getOSTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
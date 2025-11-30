import { useState, useEffect } from 'react';

const getOSTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Initialize theme before React renders to prevent flash of wrong theme
const initializeTheme = () => {
  const localTheme = localStorage.getItem('app-theme');
  const initialTheme = localTheme || getOSTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  return initialTheme;
};

const useTheme = () => {
  const [theme, setTheme] = useState(initializeTheme);

  useEffect(() => {
    // Update DOM and persist theme choice
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useTheme;
import React from 'react';
import useTheme from '../../hooks/useTheme';
import styles from './ThemeToggler.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggler} onClick={toggleTheme} aria-label="Toggle theme">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme === 'dark' ? 'moon' : 'sun'}
          className={styles.icon}
          initial={{ y: 20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggler;
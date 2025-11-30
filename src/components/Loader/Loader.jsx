import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ 
  size = 'medium', 
  color = 'primary', 
  fullScreen = false, 
  inline = false,
  message = '' 
}) => {
  const loaderClasses = [
    styles.loader,
    styles[`size-${size}`],
    styles[`color-${color}`],
    fullScreen ? styles.fullScreen : '',
    inline ? styles.inline : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={loaderClasses}>
      <div className={styles.spinner}></div>
      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
};

export default Loader;

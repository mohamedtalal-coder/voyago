import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';


const Button = ({ 
  children, 
  variant = 'primary', // Options: 'primary', 'outline'
  size = 'large',      // Options: 'large', 'small'
  className,           // For custom overrides
  ...props 
}) => {
  
  const buttonClasses = clsx(
    styles.btn,
    styles[variant],
    styles[size],
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
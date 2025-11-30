import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HeroSection.module.css';
import HeroSearchForm from '../HeroSearchForm/HeroSearchForm';

const backgrounds = [
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522506/voyago/home/dkzz5la3dv4hzff2bmdc.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522509/voyago/home/un6btafshrlkgn8qshia.jpg'
];

const HeroSection = () => {
  const { t } = useTranslation('home');
  const [currentBackground, setCurrentBackground] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.backgroundContainer}>
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className={`${styles.backgroundImage} ${
              index === currentBackground ? styles.active : ''
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{t('heroTitle', 'Enjoy in the best way!')}</h1>
        <p className={styles.heroSubtitle}>
          {t('heroSubtitle', 'Enjoy our services for your trip anytime')}
        </p>
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default HeroSection;

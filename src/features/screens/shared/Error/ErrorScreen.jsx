import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ErrorScreen.module.css';

function ErrorPage() {
  const { t } = useTranslation('static');
  
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.title}>{t('error.title')}</h1>
      <p className={styles.description}>{t('error.description')}</p>
      <Link to="/" className={styles.homeLink}>
        {t('error.backHome')}
      </Link>
    </div>
  );
}

export default ErrorPage;
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ExploreCategories.module.css';

const bannerImage = 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522477/voyago/home/rqfmexx1b9n55to5pjoc.png';

const OrganizationsBanner = () => {
  const { t, i18n } = useTranslation('home');

  const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

  return (
    <div className={styles['organizations-banner-container']} dir={isRTL ? 'rtl' : 'ltr'}>

      <img
        src={bannerImage}
        alt={t('organizations_banner_alt', 'Woman pointing to offers')}
        className={styles['traveler-image']}
      />

      <div className={styles['organizations-banner-wrapper']}>
        <motion.div
          className={styles['content-card']}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles['card-title']}>{t('organizations_banner_title', 'Get Special Offers for Organizations')}</h2>
          <p className={styles['card-description']}>
            {t(
              'organizations_banner_description',
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.'
            )}
          </p>

          <Link to="/contact" className={styles['contact-button']}>
            {t('contact_button', 'Contact Us')}
          </Link>

        </motion.div>
      </div>
    </div>
  );
};

export default OrganizationsBanner;

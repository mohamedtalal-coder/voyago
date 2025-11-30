import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShield, FiDatabase, FiLock, FiUsers, FiGlobe, FiMail, FiArrowRight } from 'react-icons/fi';
import styles from '../styles/StaticPage.module.css';
import './PrivacyPolicyScreen.module.css';

function PrivacyPolicyPage() {
  const { t } = useTranslation('static');

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('privacy.pageTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('privacy.pageSubtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.lastUpdated}>{t('privacy.lastUpdated')}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiShield /> {t('privacy.sections.introduction.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('privacy.sections.introduction.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiDatabase /> {t('privacy.sections.infoCollect.title')}
          </h2>
          <div className={styles.sectionContent}>
            <ul>
              {t('privacy.sections.infoCollect.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiLock /> {t('privacy.sections.howWeUse.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('privacy.sections.howWeUse.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiUsers /> {t('privacy.sections.infoSharing.title')}
          </h2>
          <div className={styles.sectionContent}>
            <ul>
              {t('privacy.sections.infoSharing.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiGlobe /> {t('privacy.sections.cookies.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('privacy.sections.cookies.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiShield /> {t('privacy.sections.security.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('privacy.sections.security.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('privacy.sections.rights.title')}</h2>
          <div className={styles.sectionContent}>
            <p>{t('privacy.sections.rights.content')}</p>
          </div>
        </section>

        {/* Contact Box */}
        <div className={styles.contactBox}>
          <h3>{t('privacy.contactTitle')}</h3>
          <p>{t('faq.stillHaveQuestionsDesc')}</p>
          <Link to="/contact" className={styles.contactLink}>
            <FiMail /> {t('privacy.contactUs')} <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
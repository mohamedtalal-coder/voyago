import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiCheckCircle, FiCreditCard, FiCalendar, FiShield, FiMail, FiArrowRight, FiUser } from 'react-icons/fi';
import styles from '../styles/StaticPage.module.css';
import './TermsOfServiceScreen.module.css';

function TermsOfServicePage() {
  const { t } = useTranslation('static');

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('terms.pageTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('terms.pageSubtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.lastUpdated}>{t('terms.lastUpdated')}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiFileText /> {t('terms.sections.agreement.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('terms.sections.agreement.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiCheckCircle /> {t('terms.sections.booking.title')}
          </h2>
          <div className={styles.sectionContent}>
            <ul>
              {t('terms.sections.booking.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiCreditCard /> {t('terms.sections.pricing.title')}
          </h2>
          <div className={styles.sectionContent}>
            <ul>
              {t('terms.sections.pricing.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiCalendar /> {t('terms.sections.cancellation.title')}
          </h2>
          <div className={styles.sectionContent}>
            <ul>
              {t('terms.sections.cancellation.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiUser /> {t('terms.sections.responsibilities.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('terms.sections.responsibilities.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FiShield /> {t('terms.sections.liability.title')}
          </h2>
          <div className={styles.sectionContent}>
            <p>{t('terms.sections.liability.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('terms.sections.intellectual.title')}</h2>
          <div className={styles.sectionContent}>
            <p>{t('terms.sections.intellectual.content')}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('terms.sections.changes.title')}</h2>
          <div className={styles.sectionContent}>
            <p>{t('terms.sections.changes.content')}</p>
          </div>
        </section>

        {/* Contact Box */}
        <div className={styles.contactBox}>
          <h3>{t('terms.contactTitle')}</h3>
          <p>{t('faq.stillHaveQuestionsDesc')}</p>
          <Link to="/contact" className={styles.contactLink}>
            <FiMail /> {t('terms.contactUs')} <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServicePage;
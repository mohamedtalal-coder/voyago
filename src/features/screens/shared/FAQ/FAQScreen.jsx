import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiMail, FiArrowRight } from 'react-icons/fi';
import sharedStyles from '../styles/StaticPage.module.css';
import styles from './FAQScreen.module.css';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <button 
        className={styles.faqQuestion}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {question}
        <FiChevronDown className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`} />
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>
          {answer}
        </div>
      )}
    </div>
  );
}

function FAQPage() {
  const { t } = useTranslation('static');

  const categories = ['booking', 'payment', 'tours', 'account'];

  return (
    <div className={sharedStyles.pageContainer}>
      {/* Hero Section */}
      <section className={sharedStyles.hero}>
        <div className={sharedStyles.heroContent}>
          <h1 className={sharedStyles.heroTitle}>{t('faq.pageTitle')}</h1>
          <p className={sharedStyles.heroSubtitle}>{t('faq.pageSubtitle')}</p>
        </div>
      </section>

      {/* Content */}
      <div className={sharedStyles.content}>
        {categories.map((categoryKey) => (
          <div key={categoryKey} className={styles.faqCategory}>
            <h2 className={styles.faqCategoryTitle}>
              {t(`faq.categories.${categoryKey}.title`)}
            </h2>
            <div className={styles.faqList}>
              {t(`faq.categories.${categoryKey}.questions`, { returnObjects: true }).map((item, index) => (
                <FAQItem key={index} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Contact Box */}
        <div className={sharedStyles.contactBox}>
          <h3>{t('faq.stillHaveQuestions')}</h3>
          <p>{t('faq.stillHaveQuestionsDesc')}</p>
          <Link to="/contact" className={sharedStyles.contactLink}>
            <FiMail /> {t('faq.contactSupport')} <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;
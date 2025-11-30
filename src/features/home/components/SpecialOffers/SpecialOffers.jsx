import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiGift, FiUsers, FiPercent, FiArrowRight, FiCopy, FiCheck } from 'react-icons/fi';
import styles from './SpecialOffers.module.css';

const welcomeImage = 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522518/voyago/home/atdzilz193zgjnoa4daa.png';

const SpecialOffers = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const offers = [
    {
      id: 'group',
      icon: <FiUsers size={24} />,
      title: t('offer_groups_title', 'Group Discounts'),
      description: t('offer_groups_desc', 'Automatic 25% off for groups of 10+ people'),
      discount: '25%',
      type: 'automatic',
      badge: t('offer_automatic', 'Auto-applied'),
    },
    {
      id: 'early',
      icon: <FiGift size={24} />,
      title: t('offer_early_title', 'Early Bird Special'),
      description: t('offer_early_desc', 'Book 30+ days ahead for automatic 15% savings'),
      discount: '15%',
      type: 'automatic',
      badge: t('offer_automatic', 'Auto-applied'),
    },
    {
      id: 'bundle',
      icon: <FiPercent size={24} />,
      title: t('offer_package_title', 'Bundle Discount'),
      description: t('offer_package_desc', 'Use code for 20% off your booking'),
      discount: '20%',
      type: 'code',
      code: 'BUNDLE20',
    },
  ];

  const promoCodes = [
    { code: 'WELCOME10', discount: '10%', description: t('promo_welcome', 'New customer discount') },
    { code: 'FAMILY15', discount: '15%', description: t('promo_family', 'Family bookings with kids') },
    { code: 'VOYAGO30', discount: '30%', description: t('promo_vip', 'VIP exclusive offer') },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        {/* Left Side - Image and Stats */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img src={welcomeImage} alt={t('welcome_image_alt')} className={styles.image} loading="lazy" />
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>20+</span>
              <span className={styles.statLabel}>{t('stat1_label')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>{t('stat2_label')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>{t('stat3_label')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <span className={styles.statLabel}>{t('stat4_label')}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className={styles.contentSection}>
          <span className={styles.subtitle}>{t('special_offers_subtitle', 'SPECIAL OFFERS')}</span>
          <h2 className={styles.title}>{t('special_offers_title', 'Get Special Offers for Your Next Adventure')}</h2>
          <p className={styles.description}>
            {t('special_offers_description', 'After decades of experience, we offer exclusive deals for individuals, families, and organizations. Book with us and enjoy the best prices in town!')}
          </p>

          {/* Offers Cards */}
          <div className={styles.offersGrid}>
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                className={styles.offerCard}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.offerIcon}>{offer.icon}</div>
                <div className={styles.offerContent}>
                  <div className={styles.offerHeader}>
                    <h3 className={styles.offerTitle}>{offer.title}</h3>
                    {offer.badge && (
                      <span className={styles.offerBadge}>{offer.badge}</span>
                    )}
                  </div>
                  <p className={styles.offerDescription}>{offer.description}</p>
                  {offer.code && (
                    <button 
                      className={styles.copyCodeBtn}
                      onClick={() => handleCopyCode(offer.code)}
                    >
                      <span className={styles.codeText}>{offer.code}</span>
                      {copiedCode === offer.code ? (
                        <FiCheck size={14} className={styles.copyIcon} />
                      ) : (
                        <FiCopy size={14} className={styles.copyIcon} />
                      )}
                    </button>
                  )}
                </div>
                <div className={styles.offerDiscount}>
                  <span>{t('up_to', 'Up to')}</span>
                  <strong>{offer.discount}</strong>
                  <span>{t('off', 'OFF')}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Promo Codes Section */}
          <div className={styles.promoCodesSection}>
            <h4 className={styles.promoCodesTitle}>{t('more_codes_title', 'More Promo Codes')}</h4>
            <div className={styles.promoCodesList}>
              {promoCodes.map((promo) => (
                <div key={promo.code} className={styles.promoCodeItem}>
                  <div className={styles.promoCodeInfo}>
                    <span className={styles.promoCodeValue}>{promo.code}</span>
                    <span className={styles.promoCodeDesc}>{promo.description}</span>
                  </div>
                  <div className={styles.promoCodeActions}>
                    <span className={styles.promoDiscount}>{promo.discount}</span>
                    <button 
                      className={styles.copyBtn}
                      onClick={() => handleCopyCode(promo.code)}
                      title={t('copy_code', 'Copy code')}
                    >
                      {copiedCode === promo.code ? (
                        <FiCheck size={16} />
                      ) : (
                        <FiCopy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            className={styles.ctaButton}
            onClick={() => navigate('/packages')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('book_with_discount', 'Book Now & Save')}
            <FiArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default SpecialOffers;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Card } from 'react-bootstrap';
import { FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './PackageCard.module.css';
import { motion } from 'framer-motion';
import { getImageUrl, handleImageError } from '../../../../lib/imageUtils';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, 
      duration: 0.5
    }
  })
};

const truncateWords = (text, limit) => {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
};

const PackageCard = ({ tour, index }) => {
  const { t, i18n } = useTranslation(['packages', 'common']);
  
  const tourUrl = `/packages/${tour._id}`;

  // Arrow direction changes based on language (RTL for Arabic)
  const arrow = i18n.dir() === 'rtl' ? '←' : '→';

  // Get the tour key from titleKey (e.g., "packages:tours.luccaBike.title" -> "tours.luccaBike")
  const getTourKey = () => {
    if (tour.titleKey) {
      const match = tour.titleKey.match(/packages:(tours\.[^.]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const tourKey = getTourKey();
  const shortDesc = tourKey ? t(`packages:${tourKey}.shortDesc`, tour.desc) : tour.desc;

  const imgName = tour.img.split('/').pop(); // "package1.png"
  const packageImage = getImageUrl(tour.img, 'package');

  const getTranslatedDuration = () => {
    if (!tour.duration) return '';
    const match = tour.duration.match(/^([\d.]+)\s*(.+)$/);
    if (match) {
      const [, num, unit] = match;
      const translatedUnit = t(`packages:${unit}`, unit);
      return `${num} ${translatedUnit}`;
    }
    return tour.duration;
  };

  // Translate group (handles both with and without namespace prefix)
  const getTranslatedGroup = () => {
    if (!tour.groupKey) return '';
    if (tour.groupKey.startsWith('packages:')) {
      return t(tour.groupKey);
    }
    return t(`packages:${tour.groupKey}`, tour.groupKey);
  };

  return (
    <Col 
      as={motion.div}
      lg={3} 
      md={4} 
      sm={6} 
      xs={12} 
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
    >
      <div className={styles.packageCard}>
        <div>
        <img
  variant="top"
   src={packageImage} 
  alt={t(tour.titleKey)}
  className={styles.cardImage}
  onError={(e) => handleImageError(e, 'package')}
/>
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.cardTitle}>{t(tour.titleKey)}</h2>
          <p >
            {t('packages:priceFrom')} <span className={styles.cardPrice}>{tour.price}</span>
          </p>

          <div className={styles.iconRow}>
            <span className={styles.iconItem}><FiClock /> {getTranslatedDuration()}</span>
            <span className={styles.iconItem}><FiUsers /> {getTranslatedGroup()}</span>
            {/* <span className={styles.iconItem}><FiStar /> {tour.rating}</span> */}
          </div>

          <p>{truncateWords(shortDesc, 12)}</p>

          <Link to={tourUrl} className={styles.readMore}>
            {t('common:readMore')} {arrow}
          </Link>
          

        </div>
      </div>
    </Col>
  );
};

export default PackageCard;
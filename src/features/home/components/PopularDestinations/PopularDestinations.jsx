import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { MdOutlineDateRange } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './PopularDestinations.module.css';
import Slider from '../../../../components/Slider/Slider';
import { getTourPackages } from '../../../packages/api/packagesAPI';

const cardImages = [
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522478/voyago/home/qvgcmpfh06patbvqce1j.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522479/voyago/home/b48s660oucznlyrlzasb.png',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522480/voyago/home/bvt8h9ywr2d4eyjo9el6.png',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522483/voyago/home/e2yn22wxjkcn3uhwosmo.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522486/voyago/home/ejlloat36niqv7fh6dxr.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522488/voyago/home/f0hdad2vj7sstabtxfyw.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522491/voyago/home/lvagrxawgvxijq2ka3ld.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522494/voyago/home/hmccp59retlbz7mehdme.jpg',
  'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522496/voyago/home/w2461waoxs7y5jg1o7cx.jpg'
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.1 }
  }
};

const cardItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const PopularDestinations = () => {
  const { t } = useTranslation(['home', 'packages', 'common']);
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getTourPackages();
        setTours(data);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const handleTourClick = (tourId) => {
    navigate(`/packages/${tourId}`);
  };

  // Get tour key for translations (e.g., "packages:tours.luccaBike.title" -> "tours.luccaBike")
  const getTourKey = (titleKey) => {
    if (titleKey) {
      const match = titleKey.match(/packages:(tours\.[^.]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  return (
    <motion.div
      className={styles['travel-section-container']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles['travel-header-row']}>
        <h2 className={styles['travel-section-title']}>{t('popular_destinations_title')}</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {t('common:loading', 'Loading...')}
        </div>
      ) : tours.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {t('common:noTours', 'No tours available')}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Slider
            perSlide={4}
            prevButtonClass={styles['travel-nav-button-prev']}
            nextButtonClass={styles['travel-nav-button-next']}
            navButtonClass={styles['travel-nav-button']}
            breakpoints={{
              1200: { perSlide: 4 },
              992: { perSlide: 3 },
              768: { perSlide: 2 },
              0: { perSlide: 1 }
            }}
          >
            {tours.map((tour, index) => {
              const tourKey = getTourKey(tour.titleKey);
              const shortDesc = tourKey 
                ? t(`packages:${tourKey}.shortDesc`, tour.desc) 
                : tour.desc;

              return (
                <motion.div
                  key={tour._id || index}
                  className={styles['travel-tour-card']}
                  variants={cardItemVariants}
                  whileHover={{ y: -5, boxShadow: '0 12px 25px rgba(0,0,0,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => handleTourClick(tour._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles['travel-card-image']}>
                    <img 
                      src={cardImages[index % cardImages.length]} 
                      alt={t(tour.titleKey)} 
                    />
                  </div>
                  <div className={styles['travel-card-content']}>
                    <h3 className={styles['travel-card-title']}>{t(tour.titleKey)}</h3>
                    <p className={styles['travel-card-price']}>
                      <span className={styles['travel-price-from']}>{t('packages:priceFrom', 'from')}</span> {tour.price}
                    </p>

                    <div className={styles['travel-tour-meta']}>
                      <span className={styles['travel-meta-item']}>
                        <MdOutlineDateRange className={styles['travel-meta-icon']} />
                        {tour.duration}
                      </span>
                      <span className={styles['travel-meta-item']}>
                        <FaUsers className={styles['travel-meta-icon']} />
                        {t(tour.groupKey)}
                      </span>
                    </div>

                    <p className={styles['travel-card-details']}>{shortDesc}</p>
                  </div>
                </motion.div>
              );
            })}
          </Slider>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PopularDestinations;
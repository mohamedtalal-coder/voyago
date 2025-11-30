import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import styles from './OffersCTA.module.css';

const clientImage = 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522497/voyago/home/onjkwekepw1oocwmqqf8.png';

const testimonialsData = [
  {
    id: 1,
    name: 'Lyod Gomez',
    quoteKey: 'testimonial_quote_1',
    image: clientImage
  },
  {
    id: 2,
    name: 'Emanuele Bianchi',
    quoteKey: 'testimonial_quote_2',
    image: clientImage
  },
  {
    id: 3,
    name: 'Andrea Rossi',
    quoteKey: 'testimonial_quote_3',
    image: clientImage
  },
  {
    id: 4,
    name: 'Giovanni Verdi',
    quoteKey: 'testimonial_quote_4',
    image: clientImage
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      delayChildren: 0.2
    }
  }
};

const OffersCTA = () => {
  const { t, i18n } = useTranslation('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 2;

  const isRTL = i18n.language === 'ar';

  const maxIndex = useMemo(() => testimonialsData.length - itemsPerView, []);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return maxIndex;
      }
      return prevIndex - 1;
    });
  };

  const transformPercentage = (100 / itemsPerView) * currentIndex;

  return (
    <motion.div
      className={styles['testimonials-section-container']}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={styles['header-controls']}>
        <h2 className={styles['section-title']}>{t('testimonials_title', 'Happy Customers Says')}</h2>

        <div className={styles['controls']}>
          <motion.button
            className={`${styles['travel-nav-button']} ${styles['travel-nav-button-prev']}`}
            onClick={handlePrevClick}
            disabled={isPrevDisabled}
            whileHover={{ scale: isPrevDisabled ? 1 : 1.1 }}
            whileTap={{ scale: isPrevDisabled ? 1 : 0.9 }}
          >
            <FaChevronLeft className={styles['travel-nav-icon']} />
          </motion.button>

          <motion.button
            className={`${styles['travel-nav-button']} ${styles['travel-nav-button-next']}`}
            onClick={handleNextClick}
            disabled={isNextDisabled}
            whileHover={{ scale: isNextDisabled ? 1 : 1.1 }}
            whileTap={{ scale: isNextDisabled ? 1 : 0.9 }}
          >
            <FaChevronRight className={styles['travel-nav-icon']} />
          </motion.button>
        </div>
      </div>

      <div className={styles['slider-container']}>
        <div
          className={styles['testimonials-track']}
          style={{
            transform: isRTL
              ? `translateX(${transformPercentage}%)`
              : `translateX(-${transformPercentage}%)`,
            width: `${(testimonialsData.length / itemsPerView) * 100}%`
          }}
        >
          {testimonialsData.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className={styles['testimonial-card']}
              style={{ minWidth: `calc(${100 / testimonialsData.length}% - 12.5px)` }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={styles['card-content']}>
                <FaQuoteLeft className={styles['quote-icon-top']} />

                <p className={styles['quote-text']}>
                  {t(testimonial.quoteKey)}
                </p>

                <div className={styles['client-info']}>
                  <div className={styles['client-image']} style={{ backgroundImage: `url(${testimonial.image})` }} role="img" aria-label={`Image of ${testimonial.name}`}></div>
                  <p className={styles['client-name']}>{testimonial.name}</p>
                </div>

                <FaQuoteLeft className={styles['quote-icon-bottom']} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OffersCTA;
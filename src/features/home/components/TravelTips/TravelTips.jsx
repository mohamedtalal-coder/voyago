import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaTag, FaCheck, FaCar, FaMapMarkerAlt, FaBus, FaTicketAlt } from 'react-icons/fa';
import styles from './TravelTips.module.css';
import useServiceBookingStore from '../../../../store/booking/useServiceBookingStore';

const packagesData = [
  {
    key: 'package1',
    slug: 'bike-rickshaw',
    serviceType: 'city',
    categoryKey: 'home:category_bike_rickshaw',
    titleKey: 'home:package1_title',
    price: '10',
    unit: '/day',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522499/voyago/home/j5wzoh0sbzk4xd5ea0nd.png',
    features: [
      { textKey: 'home:f1_bike_day', icon: FaCheck },
      { textKey: 'home:f2_city_app', icon: FaMobileAlt },
      { textKey: 'home:f3_discount', icon: FaTag },
      { textKey: 'home:f4_support', icon: FaCheck },
    ]
  },
  {
    key: 'package2',
    slug: 'guided-tours',
    serviceType: 'bike',
    categoryKey: 'home:category_bike_tours',
    titleKey: 'home:package2_title',
    price: '30',
    unit: '/day',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522500/voyago/home/jyumymppnq0pm9zx43qv.png',
    features: [
      { textKey: 'home:f1_mountain_bike', icon: FaCheck },
      { textKey: 'home:f2_guide', icon: FaCheck },
      { textKey: 'home:f3_water', icon: FaCheck },
      { textKey: 'home:f4_support', icon: FaCheck },
    ]
  },
  {
    key: 'package3',
    slug: 'transportation',
    serviceType: 'coach',
    categoryKey: 'home:category_bus_trips',
    titleKey: 'home:package3_title',
    price: '45',
    unit: '/day',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522501/voyago/home/iyruo63vbh6b87k1qeai.png',
    features: [
      { textKey: 'home:f1_park_ticket', icon: FaTicketAlt },
      { textKey: 'home:f2_return_bus', icon: FaBus },
      { textKey: 'home:f3_companion', icon: FaCheck },
      { textKey: 'home:f4_support', icon: FaCheck },
    ]
  },
  {
    key: 'package4',
    slug: 'luxury-cars',
    serviceType: 'sedan',
    categoryKey: 'home:category_transfer',
    titleKey: 'home:package4_title',
    price: '10',
    unit: '/day',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522515/voyago/home/ca8yxkncjtr015fmb8sf.png',
    features: [
      { textKey: 'home:f1_personal_driver', icon: FaCar },
      { textKey: 'home:f2_wherever_you_want', icon: FaMapMarkerAlt },
      { textKey: 'home:f3_best_price', icon: FaTag },
      { textKey: 'home:f4_support', icon: FaCheck },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const PopularPackages = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  
  // Service booking store
  const setService = useServiceBookingStore(state => state.setService);
  const setServiceType = useServiceBookingStore(state => state.setServiceType);
  const resetBooking = useServiceBookingStore(state => state.resetBooking);

  // Handle Book Now click - navigates to service booking form
  const handleBookNow = (pkg) => {
    // Reset any previous booking
    resetBooking();
    
    // Set the service info in the store
    setService({
      id: pkg.key,
      slug: pkg.slug,
      titleKey: pkg.titleKey || '',
      descKey: pkg.categoryKey || '',
      img: pkg.image,
    });
    
    // Set the service type (e.g., 'city', 'bike', 'coach', 'sedan')
    setServiceType(pkg.serviceType);
    
    // Navigate to service booking page
    navigate('/service-booking');
  };

  return (
    <div className={styles['packages-container-wrapper']}>
      <h2 className={styles['packages-section-title']}>{t('packages_section_title', 'The Most Popular Packages')}</h2>

      <motion.div
        className={styles['packages-grid']}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {packagesData.map((pkg) => (
          <motion.div
            key={pkg.key}
            className={styles['package-card']}
            variants={cardItemVariants}
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles['package-image-wrapper']}>
              <img src={pkg.image} alt={t(pkg.titleKey)} className={styles['package-image']} loading="lazy" />
            </div>

            <div className={styles['package-content']}>
              <span className={styles['package-category']}>{t(pkg.categoryKey)}</span>
              <div className={styles['package-price']}>
                <span className={styles['price-currency']}>€</span>
                <span className={styles['price-value']}>{pkg.price}</span>
                <span className={styles['price-unit']}>{t('per_unit_day', pkg.unit)}</span>
              </div>

              <ul className={styles['package-features-list']}>
                {pkg.features.map((feature, index) => (
                  <li key={index} className={styles['feature-item']}>
                    <feature.icon className={styles['feature-icon']} />
                    {t(feature.textKey)}
                  </li>
                ))}
              </ul>

              <button 
                className={styles['book-button']}
                onClick={() => handleBookNow(pkg)}
              >
                {t('book_now_button', 'Book Now')}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PopularPackages;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './PopularTransport.module.css';
import useServiceBookingStore from '../../../../store/booking/useServiceBookingStore';

const serviceData = [
  {
    key: 'bike_rental',
    slug: 'bike-rickshaw',
    titleKey: 'service1_title',
    descriptionKey: 'service1_description',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522511/voyago/home/gxmbxjgd8v39r3yxtdyq.png',
  },
  {
    key: 'guided_tour',
    slug: 'guided-tours',
    titleKey: 'service2_title',
    descriptionKey: 'service2_description',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522512/voyago/home/s5zbw9vwhqjir8uharbs.png',
  },
  {
    key: 'taxi_ncc',
    slug: 'transportation',
    titleKey: 'service3_title',
    descriptionKey: 'service3_description',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522515/voyago/home/ca8yxkncjtr015fmb8sf.png',
  },
  {
    key: 'bus_package',
    slug: 'luxury-cars',
    titleKey: 'service4_title',
    descriptionKey: 'service4_description',
    image: 'https://res.cloudinary.com/dczhvcc0v/image/upload/v1764522516/voyago/home/vw3kdnqnnwtne36v3hcf.png',
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
      damping: 20,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const PopularTransport = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const { setService, setServiceType, resetBooking } = useServiceBookingStore();

  const handleServiceClick = (service) => {
    resetBooking();
    setService({
      slug: service.slug,
      titleKey: service.titleKey,
      descKey: service.descriptionKey,
      img: service.image,
    });
    setServiceType(service.slug);
    navigate('/service-booking');
  };

  return (
    <motion.div
      className={styles['services-section-container']}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className={styles['services-grid']}
        variants={containerVariants}
      >
        {serviceData.map((service) => (
          <motion.div
            key={service.key}
            className={styles['service-card']}
            variants={cardItemVariants}
            whileHover={{ y: -7, boxShadow: "0 12px 20px rgba(0,0,0,0.2)" }}
            onClick={() => handleServiceClick(service)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles['service-image-wrapper']}>
              <img src={service.image} alt={t(service.titleKey)} className={styles['service-image']} loading="lazy" />
            </div>

            <div className={styles['service-content']}>
              <h3 className={styles['service-title']}>{t(service.titleKey)}</h3>
              <p className={styles['service-description']}>{t(service.descriptionKey)}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PopularTransport;
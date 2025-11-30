import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowLeft, FiCheck, FiClock, FiUsers, FiMapPin } from 'react-icons/fi';
import styles from './ServiceScreen.module.css';
import { motion } from 'framer-motion';
import ServiceBookingForm from '../../../components/ServiceBookingForm/ServiceBookingForm';
import { getImageUrl, handleImageError } from '../../../lib/imageUtils';

// Components
import PackageCard from '../../packages/components/PackageCard/PackageCard';

// API
import { getServices } from '../../packages/api/packagesAPI';
import { getToursByService } from '../../search/api/searchAPI';

// Store
import useServiceBookingStore from '../../../store/booking/useServiceBookingStore';

// Service details mapping
const serviceDetails = {
  'bike-rickshaw': {
    serviceIndex: 0,
    features: ['qualityBikes', 'flexibleHours', 'safetyEquipment', 'cityAccess'],
    highlights: ['easyRental', 'multipleLocations', 'familyFriendly', 'guidedOptions'],
  },
  'guided-tours': {
    serviceIndex: 1,
    features: ['professionalGuides', 'multiLanguage', 'smallGroups', 'customRoutes'],
    highlights: ['localExperts', 'historicalInsights', 'hiddenGems', 'flexibleSchedule'],
  },
  'bike-tour': {
    serviceIndex: 0,
    features: ['scenicRoutes', 'allSkillLevels', 'bikeProvided', 'safetyFirst'],
    highlights: ['beautifulViews', 'exerciseAndFun', 'groupDiscounts', 'memorableExperience'],
  },
  'tuscan-hills': {
    serviceIndex: 2,
    features: ['breathtakingViews', 'wineCountry', 'picnicIncluded', 'comfortableTransport'],
    highlights: ['tuscanBeauty', 'localWines', 'authenticCuisine', 'unforgettableMemories'],
  },
  'transportation': {
    serviceIndex: 3,
    features: ['comfortableCoaches', 'multipleDestinations', 'experiencedDrivers', 'onTimeService'],
    highlights: ['groupTravel', 'affordablePrices', 'doorToDoor', 'luggageIncluded'],
  },
  'wine-tours': {
    serviceIndex: 5,
    features: ['expertSommelier', 'premiumWineries', 'tastingIncluded', 'smallGroups'],
    highlights: ['regionalWines', 'vineyardVisits', 'gourmetPairings', 'learnWinemaking'],
  },
  'coach-trips': {
    serviceIndex: 3,
    features: ['comfortableSeating', 'airConditioning', 'restStops', 'tourGuide'],
    highlights: ['multipleCities', 'photoStops', 'localInsights', 'groupFun'],
  },
  'luxury-cars': {
    serviceIndex: 4,
    features: ['premiumVehicles', 'professionalChauffeur', 'privacy', 'flexibility'],
    highlights: ['vipTreatment', 'airportTransfers', 'weddingService', 'corporateEvents'],
  },
};

const ServiceScreen = () => {
  const { serviceType } = useParams();
  const { t } = useTranslation(['packages', 'footer', 'common', 'services']);
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [relatedTours, setRelatedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Service booking store
  const setService = useServiceBookingStore(state => state.setService);
  const resetBooking = useServiceBookingStore(state => state.resetBooking);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch services
        const servicesData = await getServices();
        // Fix image paths using imageUtils
        const servicesWithFixedImages = servicesData.map(s => ({
          ...s,
          img: getImageUrl(s.img, 'service')
        }));
        setServices(servicesWithFixedImages);
        
        // Fetch related tours
        const tours = await getToursByService(serviceType, t);
        setRelatedTours(tours);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [serviceType, t]);

  // Get service details
  const serviceConfig = serviceDetails[serviceType] || serviceDetails['guided-tours'];
  const service = services[serviceConfig.serviceIndex];

  // Service name mapping for footer translations
  const serviceNameMap = {
    'bike-rickshaw': 'bikeRickshaw',
    'guided-tours': 'guidedTours',
    'bike-tour': 'bikeTour',
    'tuscan-hills': 'tuscanHills',
    'transportation': 'transportation',
    'wine-tours': 'wineTours',
    'coach-trips': 'coachTrips',
    'luxury-cars': 'luxuryCars',
  };

  const serviceName = t(`footer:${serviceNameMap[serviceType]}`, t(service?.titleKey));

  // Handle Book Now click
  const handleBookNow = () => {
    resetBooking();
    setService({
      slug: serviceType,
      titleKey: service.titleKey,
      descKey: service.descKey,
      img: service.img
    });
    navigate('/service-booking');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (loading) {
    return (
      <div className={styles.notFound}>
        <Container>
          <p>{t('common:loading')}</p>
        </Container>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={styles.notFound}>
        <Container>
          <h2>{t('common:notFound', 'Service not found')}</h2>
          <Link to="/packages" className={styles.backLink}>
            <FiArrowLeft /> {t('common:backToPackages', 'Back to Packages')}
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.serviceScreen}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <img src={service.img} alt={serviceName} className={styles.heroImage} loading="eager" onError={(e) => handleImageError(e, 'service')} />
        <Container className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/packages" className={styles.backLink}>
              <FiArrowLeft /> {t('common:back', 'Back')}
            </Link>
            <h1 className={styles.heroTitle}>{serviceName}</h1>
            <p className={styles.heroDescription}>{t(service.descKey)}</p>
            <button className={styles.bookButton} onClick={handleBookNow}>
              {t('packages:bookNow', 'Book Now')}
            </button>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>{t('common:features', 'Features')}</h2>
            <Row className={styles.featuresGrid}>
              {serviceConfig.features.map((feature, index) => (
                <Col key={index} lg={3} md={6} sm={6} xs={12}>
                  <motion.div className={styles.featureCard} variants={itemVariants}>
                    <div className={styles.featureIcon}>
                      <FiCheck />
                    </div>
                    <h4 className={styles.featureTitle}>
                      {t(`services:features.${feature}`, feature.replace(/([A-Z])/g, ' $1').trim())}
                    </h4>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlightsSection}>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>{t('common:highlights', 'Why Choose Us')}</h2>
            <div className={styles.highlightsGrid}>
              {serviceConfig.highlights.map((highlight, index) => (
                <motion.div 
                  key={index} 
                  className={styles.highlightItem}
                  variants={itemVariants}
                >
                  <span className={styles.highlightNumber}>{index + 1}</span>
                  <span className={styles.highlightText}>
                    {t(`services:highlights.${highlight}`, highlight.replace(/([A-Z])/g, ' $1').trim())}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Related Tours Section */}
      {relatedTours.length > 0 && (
        <section className={styles.relatedToursSection}>
          <Container>
            <h2 className={styles.sectionTitle}>
              {t('common:relatedTours', 'Related Tours')}
            </h2>
            <Row className="g-4">
              {relatedTours.slice(0, 4).map((tour, index) => (
                <PackageCard key={tour._id || tour.id} tour={tour} index={index} />
              ))}
            </Row>
            {relatedTours.length > 4 && (
              <div className={styles.viewAllWrapper}>
                <Link to={`/search?q=${serviceName}`} className={styles.viewAllButton}>
                  {t('common:viewAll', 'View All Tours')}
                </Link>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Quick Info Section */}
      <section className={styles.quickInfoSection}>
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className={styles.infoCard}>
                <FiClock className={styles.infoIcon} />
                <h4>{t('common:availability', 'Availability')}</h4>
                <p>{t('common:dailyAvailable', 'Daily, 9:00 AM - 6:00 PM')}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.infoCard}>
                <FiUsers className={styles.infoIcon} />
                <h4>{t('common:groupSize', 'Group Size')}</h4>
                <p>{t('common:flexibleGroups', 'Private to groups of 20+')}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.infoCard}>
                <FiMapPin className={styles.infoIcon} />
                <h4>{t('common:meetingPoint', 'Meeting Point')}</h4>
                <p>{t('common:luccaCenter', 'Lucca City Center')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Booking Form */}
      <ServiceBookingForm initialServiceType={serviceType} />
    </div>
  );
};

export default ServiceScreen;

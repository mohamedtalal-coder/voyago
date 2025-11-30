import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styles from './PackageServices.module.css';
import { motion } from 'framer-motion';

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

// Service slugs mapping
const serviceSlugs = [
  'bike-rickshaw',
  'guided-tours',
  'tuscan-hills',
  'coach-trips',
  'luxury-cars',
  'wine-tours'
];

const PackageServices = ({ services }) => {
  const { t, i18n } = useTranslation(['packages', 'common']);
  
  // Arrow direction adapts to language direction
  const arrow = i18n.dir() === 'rtl' ? '←' : '→';

  return (
    <Container as="section" className="py-5">
      <h2 className="fw-bold mb-4">{t('packages:servicesTitle')}</h2>
      <Row className="g-4">
        {services.map((service, i) => (
          <Col 
            as={motion.div} 
            md={4} 
            sm={12} 
            key={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={i}
          >
            <Card className={`${styles.serviceCard} shadow-sm border-0 h-100`}>
              <Card.Img
                variant="top"
                src={service.img}
                alt={t(service.titleKey)}
                className={styles.cardImage}
              />
              <Card.Body className={styles.cardBody}>
                <Card.Title className="fw-semibold">{t(service.titleKey)}</Card.Title>
                <Card.Text>{t(service.descKey)}</Card.Text>
                <div className={styles.cardActions}>
                  <Link 
                    to={`/services/${serviceSlugs[i]}`} 
                    className={styles.readMore}
                  >
                    {t('common:readMore')} {arrow}
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PackageServices;
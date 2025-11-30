import React from "react";
import styles from "./AboutStats.module.css";
import StatsImg from "../../../../assets/images/About/feature.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutStats = () => {
  const { t, i18n } = useTranslation('about'); // Translation hook
  
  const stats = [
    { number: t('statsNumbers.yearsCount'), label: t('stats.years') },
    { number: t('statsNumbers.customersCount'), label: t('stats.customers') },
    { number: t('statsNumbers.servicesCount'), label: t('stats.services') },
    { number: t('statsNumbers.guidesCount'), label: t('stats.guides') },
  ];

  return (
    <section className={styles.statsSection} dir={i18n.dir()}> {/* Section wrapper */}
      <div className="container">
        <div className="row align-items-center">
          
          {/* Image */}
          <motion.div 
            className="col-lg-6 col-md-12 mb-4 mb-lg-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.aboutImgContainer}>
              <img src={StatsImg} alt="Lucca Cityscape" className={styles.aboutImg} loading="lazy" />
            </div>
          </motion.div>
          
          {/* Text & Stats */}
          <motion.div 
            className="col-lg-6 col-md-12 ps-lg-5"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span className={styles.sectionSubtitle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {t('welcome')}
            </motion.span>
            
            <motion.h2 className={styles.sectionTitle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              {t('aboutTitle')}
            </motion.h2>
            
            <motion.p className={styles.sectionDesc} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              {t('aboutDescription')}
            </motion.p>

            {/* Stats */}
            <div className={styles.statsRow}>
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className={styles.statItem}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
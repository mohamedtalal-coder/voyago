import React from "react";
import styles from "./AboutFeatures.module.css";
import { MapPinned, Award, UserRound, ThumbsUp } from 'lucide-react';
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutFeatures = () => {
  const { t, i18n } = useTranslation('about'); // i18n hook for translations

  // Features data with icons and translated titles
  const features = [
    { icon: MapPinned, title: t('features.completePackages') },
    { icon: Award, title: t('features.experience') },
    { icon: UserRound, title: t('features.expertGuides') },
    { icon: ThumbsUp, title: t('features.guaranteedFun') },
  ];

  // Motion container variants for staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // Motion item variants for each feature card
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className={styles.featuresSection} dir={i18n.dir()}>
      <div className="container">

        {/* Features Grid with animation */}
        <motion.div 
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon; // Save icon component
            return (
              <motion.div 
                className="col-md-6 col-lg-3" 
                key={index}
                variants={itemVariants}
              >
                <div className={styles.featureCard}>
                  <div className={styles.iconWrapper}>
                    <IconComponent size={48} /> {/* Render icon */}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutFeatures;

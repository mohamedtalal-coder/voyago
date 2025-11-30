import React from "react";
import styles from "./AboutHero.module.css";
import Button from "../../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutHero = () => {
  const { t, i18n } = useTranslation('about'); // Translation hook
  const navigate = useNavigate(); // Navigation hook
  
  return (
    <section className={styles.heroSection} dir={i18n.dir()}>
      {/* Overlay for background effect */}
      <div className={styles.heroOverlay}></div>

      {/* Content Wrapper */}
      <div className={`container ${styles.heroContent}`}>

        {/* Hero Title */}
        <motion.h1 
          className={styles.scriptTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('heroTitle')}
        </motion.h1>
        
        {/* Hero Description */}
        <motion.p 
          className={styles.heroText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('heroDescription')}
        </motion.p>
        
        {/* Button */}
        <motion.div 
          className="btn"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button 
            variant="outline" 
            size="small" 
            className={styles.heroBtn} 
            onClick={() => navigate("/packages")}
          >
            {t('viewPackages')}
          </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutHero;

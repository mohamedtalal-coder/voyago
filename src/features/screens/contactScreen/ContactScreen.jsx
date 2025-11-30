import React from "react";
import ContactInfo from "../../contact/components/ContactInfo/ContactInfo";
import ContactForm from "../../contact/components/ContactForm/ContactForm";
import map from '../../../assets/images/Contact/Contact Map.png';
import AvatarMap from '../../../assets/images/Contact/Avatar.png';
import styles from './ContactScreen.module.css';
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <>
      {/* Main Container */}
      <div 
        className="container-fluid min-vh-100 d-flex flex-column font-sans text-dark"
      >
        {/* Top Section: Contact Info & Form */}
        <div 
          className="flex-grow-1 bg-opacity-25 px-3 py-5 py-md-6 position-relative"
          style={{ zIndex: 10, background: 'rgba(11, 61, 94, 0.2)' }}
        >
          <div className="container py-4">
            <div className="row gy-5 g-xl-5 align-items-start">
              
              {/* Contact Info (Left) */}
              <motion.div 
                className="col-lg-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ContactInfo />
              </motion.div>

              {/* Contact Form (Right) */}
              <motion.div 
                className="col-lg-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ContactForm />
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Map with Marker */}
      <motion.div 
        className={styles.mapContainer}
        style={{ backgroundImage: `url(${map})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Gradient overlay on map */}
        <div className={styles.gradientOverlay}></div>

        {/* Marker on map */}
        <div className={styles.markerWrapper}>
          <motion.div 
            className="cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.8
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={AvatarMap}
              className={styles.markerImage}
              alt="Marker"
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

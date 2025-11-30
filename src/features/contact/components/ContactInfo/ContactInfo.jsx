import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from 'sonner';
import styles from './ContactInfo.module.css';
import { useTranslation } from 'react-i18next';

export default function ContactInfo() {
  const { t, i18n } = useTranslation('contact');
  
  // Copy phone number to clipboard and show toast
  const handlePhoneClick = () => {
    toast.success(t('phoneCopied') || 'Phone number copied to clipboard!');
    navigator.clipboard.writeText('+20 111 893 6100');
  };

  // Open default mail client
  const handleEmailClick = () => {
    window.location.href = 'mailto:voyagodepi@gmail.com';
  };

  return (
    <div 
      className={styles.contactInfoContainer}
      dir={i18n.dir()} // Adjust layout for RTL languages
    >
      {/* Title and Description */}
      <div>
        <h1 className={styles.title}>{t('contactTitle')}</h1>
        <p className={styles.description}>{t('contactDescription')}</p>
      </div>

      {/* Contact Info List */}
      <div className={styles.infoList}>

        {/* Location */}
        <div className={styles.infoItem}>
          <div className={styles.iconContainer}>
            <MapPin className="w-6 h-6" />
          </div>
          <span className={styles.infoText}>{t('location')}</span>
        </div>

        {/* Phone */}
        <div className={styles.infoItem}>
          <button className={styles.phoneButton} onClick={handlePhoneClick}>
            <Phone className="w-5 h-5 text-primary" />
            <span className={styles.infoText} dir="ltr">+20 111 893 6100</span>
          </button>
        </div>

        {/* Email */}
        <div className={styles.infoItem} onClick={handleEmailClick}>
          <div className={styles.iconContainer}>
            <Mail className="w-6 h-6" />
          </div>
          <span className={styles.infoText}>{t('email')}</span>
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PackageGallery.module.css";
import Slider from "../../../../components/Slider/Slider";

export default function PackageGallery({ galleryImages = [] }) {
  const { t } = useTranslation('booking');

  // Preserve previous behaviour where three identical slides were shown
  const carouselItems = [galleryImages, galleryImages, galleryImages];

  const slideNodes = carouselItems.map((item, idx) => (
    <div className={styles.galleryGrid} key={idx}>
      {item[0] && <img className={styles.bigImg} src={item[0]} alt="" loading="lazy" />}
      <div className={styles.smallColumn}>
        {item[1] && <img src={item[1]} alt="" loading="lazy" />}
        {item[2] && <img src={item[2]} alt="" loading="lazy" />}
      </div>
      {item[3] && <img className={styles.tallImg} src={item[3]} alt="" loading="lazy" />}
    </div>
  ));

  return (
    <div className={`${styles.gallerySection} container my-5`}>
      {/* Header */}
      <div className={styles.galleryHeader}>
        <h3 className={styles.galleryTitle}>{t('gallery')}</h3>
      </div>

      <Slider perSlide={1}>{slideNodes}</Slider>
    </div>
  );
}

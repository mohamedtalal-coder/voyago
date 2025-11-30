import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiClock, FiMapPin, FiFlag, FiBookOpen, FiDollarSign } from "react-icons/fi";
import PackageGallery from '../PackageGallery/PackageGallery.jsx';
import { useTranslation } from 'react-i18next';
import styles from "./PackageDetails.module.css";
import Button from '../../../../components/Button/Button'; 
import { Col, Form } from 'react-bootstrap';
import Reviews from '../../../reviews/components/Reviews/Reviews.jsx';
import useBookingStore from '../../../../store/booking/useBookingStore';
import { getTourPackageById } from '../../api/packagesAPI';
import { getImageUrl, handleImageError } from '../../../../lib/imageUtils';

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['packages', 'common']);

  const setPackage = useBookingStore((state) => state.setPackage);
  const setDateTime = useBookingStore((state) => state.setDateTime);
  const resetBooking = useBookingStore((state) => state.resetBooking);

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Get the tour key from titleKey (e.g., "packages:tours.luccaBike.title" -> "tours.luccaBike")
  const getTourKey = (titleKey) => {
    if (titleKey) {
      const match = titleKey.match(/packages:(tours\.[^.]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const pkg = await getTourPackageById(id);

        // Fix image paths using imageUtils
        if (pkg.img) pkg.img = getImageUrl(pkg.img, 'package');
        if (pkg.subimages) pkg.subimages = pkg.subimages.map(img => getImageUrl(img, 'package'));
        if (pkg.gallery) pkg.gallery = pkg.gallery.map(img => getImageUrl(img, 'package'));

        setPackageData(pkg);
        if (pkg.img) setSelectedImage(pkg.img);

      } catch (err) {
        console.error('Error fetching package:', err);
        setPackageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);


  if (loading) return <div className="container py-5">{t('common:loading')}</div>;
  if (!packageData) return <div className="container py-5">{t('common:notFound')}</div>;

  const images = [packageData.img, ...(packageData.subimages || [])];

  const tourKey = getTourKey(packageData.titleKey);
  const shortDesc = tourKey ? t(`packages:${tourKey}.shortDesc`, packageData.desc) : packageData.desc;
  const longDesc = tourKey ? t(`packages:${tourKey}.longDesc`, packageData.longDescKey) : packageData.longDescKey;

  const handleBuyNow = () => {
    resetBooking();
    setPackage(packageData);

    if (selectedDay && selectedTime) {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
      setDateTime(dateStr, selectedTime);
    }

    navigate('/booking');
  };

  return (
    <div className={`container py-5 ${styles.mainContainer}`}>
      <div className="row align-items-center">
        <div className="col-md-5">
          {selectedImage && <img src={selectedImage} alt={t(packageData.titleKey)} className={styles.mainImage} loading="lazy" onError={(e) => handleImageError(e, 'package')} />}
          <div className="d-flex gap-3 mt-3">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`${styles.thumbnail} ${selectedImage === img ? styles.thumbnailActive : styles.thumbnailInactive}`}
                onError={(e) => handleImageError(e, 'package')}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6 p-5">
          <h1 className="fw-bold mt-5" style={{ fontSize: "36px" }}>{t(packageData.titleKey)}</h1>
          <h4 className="fw-bold mt-1" style={{ color: "var(--color-primary-accent)" }}>
            {t('packages:priceFrom')} <span>{packageData.price}</span>
          </h4>
          <p className={styles.detailsText}>{shortDesc}</p>

          <label className="fw-semibold mt-2 mb-2">{t('packages:selectDate') || 'Select a date'}</label>
          <div className={styles.calendarBox}>
            <div className={styles.calendarGrid}>
              {days.map(day => (
                <div
                  key={day}
                  className={`${styles.calendarDay} ${selectedDay === day ? styles.calendarDayActive : styles.calendarDayInactive}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <Col md={6} className="p-0 mb-3">
              <label className='mb-1'>{t('packages:selectTime') || t('common:time')}</label>
              <Form.Control 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </Col>
          </div>

          <Button size="medium" onClick={handleBuyNow}>{t('common:bookNow')}</Button>
        </div>
      </div>

      <div className="mt-5">
        <h4 className={styles.sectionTitle}>{t('packages:detailsSectionTitle') || 'Details'}</h4>
        <p className={styles.detailsText}>{longDesc}</p>

        <div className="row mt-3">
          {[
            { icon: FiUsers, label: 'group', value: packageData.groupKey },
            { icon: FiClock, label: 'duration', value: packageData.duration },
            { icon: FiMapPin, label: 'areaLabel', value: packageData.areaKey || 'lucca' },
            { icon: FiFlag, label: 'guideLabel', value: 'guideIncluded' },
            { icon: FiBookOpen, label: 'languageLabel', value: 'languagesList' },
            { icon: FiDollarSign, label: 'feesLabel', value: 'feesIncluded' }
          ].map(({ icon: Icon, label, value }, idx) => {
            // Handle translation: if value already has namespace prefix, use it directly; otherwise add packages: prefix
            let displayValue;
            if (value && value.startsWith('packages:')) {
              // Already has namespace, translate directly
              displayValue = t(value);
            } else if (label === 'duration') {
              // Duration is a raw value with unit, translate the unit (handles decimals like 2.5)
              const durationMatch = value?.match(/^([\d.]+)\s*(.+)$/);
              if (durationMatch) {
                const [, num, unit] = durationMatch;
                const translatedUnit = t(`packages:${unit}`, unit);
                displayValue = `${num} ${translatedUnit}`;
              } else {
                displayValue = value;
              }
            } else {
              // Try to translate with packages namespace
              displayValue = t(`packages:${value}`, value);
            }
            
            return (
              <div key={idx} className="col-12 mb-3 d-flex align-items-center">
                <Icon size={22} style={{ color: 'var(--color-primary-accent)' }} className="me-2" />
                <span><strong>{t(`packages:${label}`)}:</strong> {displayValue}</span>
              </div>
            );
          })}
        </div>
      </div>

      <PackageGallery galleryImages={packageData.gallery || []} />
      <Reviews/>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Slider.module.css';
import { Carousel } from 'react-bootstrap';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const Slider = ({ children, perSlide = 2, maxWidth, breakpoints }) => {
  const [currentPerSlide, setCurrentPerSlide] = useState(perSlide);
  const [index, setIndex] = useState(0);

  const { i18n } = useTranslation();
  const isRTL = i18n && typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : false;

  // Handle responsive breakpoints
  const updatePerSlide = useCallback(() => {
    if (!breakpoints) {
      setCurrentPerSlide(perSlide);
      return;
    }

    const width = window.innerWidth;
    // Sort breakpoints in descending order
    const sortedBreakpoints = Object.keys(breakpoints)
      .map(Number)
      .sort((a, b) => b - a);

    for (const bp of sortedBreakpoints) {
      if (width >= bp) {
        setCurrentPerSlide(breakpoints[bp].perSlide || perSlide);
        return;
      }
    }
    setCurrentPerSlide(perSlide);
  }, [breakpoints, perSlide]);

  useEffect(() => {
    updatePerSlide();
    window.addEventListener('resize', updatePerSlide);
    return () => window.removeEventListener('resize', updatePerSlide);
  }, [updatePerSlide]);

  const items = React.Children.toArray(children || []);
  const grouped = [];
  for (let i = 0; i < items.length; i += currentPerSlide) {
    grouped.push(items.slice(i, i + currentPerSlide));
  }

  // Reset index if it exceeds new grouped length
  useEffect(() => {
    if (index >= grouped.length && grouped.length > 0) {
      setIndex(grouped.length - 1);
    }
  }, [grouped.length, index]);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);
  const handlePrev = () => setIndex((prev) => (prev === 0 ? grouped.length - 1 : prev - 1));
  const handleNext = () => setIndex((prev) => (prev === grouped.length - 1 ? 0 : prev + 1));

  const prevDisabled = grouped.length === 0 || index === 0;
  const nextDisabled = grouped.length === 0 || index === grouped.length - 1;

  // Icons stay the same direction (< for prev, > for next), only button order is swapped in RTL
  const PrevIcon = FiChevronLeft;
  const NextIcon = FiChevronRight;

  // allow callers to override the container max width via `maxWidth` prop
  const containerStyle = {};
  if (maxWidth) {
    containerStyle.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  }

  // Calculate responsive column classes based on currentPerSlide
  const getColumnClasses = () => {
    switch (currentPerSlide) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-12 col-sm-6';
      case 3:
        return 'col-12 col-sm-6 col-md-4';
      case 4:
        return 'col-12 col-sm-6 col-md-4 col-lg-3';
      default:
        const colSize = Math.max(1, Math.min(12, Math.floor(12 / currentPerSlide)));
        return `col-12 col-md-${colSize}`;
    }
  };

  return (
    <div className={styles.sliderContainer} dir={isRTL ? 'rtl' : 'ltr'} style={containerStyle}>
      <div className={styles.carouselHeader}>
        <div className={styles.carouselButtons}>
          {isRTL ? (
            <>
              <button
                className={`${styles.arrowBtn} ${nextDisabled ? styles.grayBtn : styles.blueBtn}`}
                onClick={handleNext}
                aria-label="Next"
                disabled={nextDisabled}
              >
                <NextIcon />
              </button>
              <button
                className={`${styles.arrowBtn} ${prevDisabled ? styles.grayBtn : styles.blueBtn}`}
                onClick={handlePrev}
                aria-label="Previous"
                disabled={prevDisabled}
              >
                <PrevIcon />
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.arrowBtn} ${prevDisabled ? styles.grayBtn : styles.blueBtn}`}
                onClick={handlePrev}
                aria-label="Previous"
                disabled={prevDisabled}
              >
                <PrevIcon />
              </button>
              <button
                className={`${styles.arrowBtn} ${nextDisabled ? styles.grayBtn : styles.blueBtn}`}
                onClick={handleNext}
                aria-label="Next"
                disabled={nextDisabled}
              >
                <NextIcon />
              </button>
            </>
          )}
        </div>
      </div>

      <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={false}>
        {grouped.map((group, gidx) => (
          <Carousel.Item key={gidx}>
            <div className={styles.slideRow}>
              {group.map((child, idx) => (
                <div 
                  className={styles.slideItem} 
                  key={idx} 
                  style={{ 
                    flex: `0 0 calc((100% - ${(currentPerSlide - 1) * 16}px) / ${currentPerSlide})` 
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;

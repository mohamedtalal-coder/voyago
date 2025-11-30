import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from '../../../../components/Slider/Slider';
import styles from './Reviews.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { getReviews, submitReview } from '../../api/reviewsAPI';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useMediaQuery from '../../../../hooks/useMediaQuery';

// Default avatars from assets
import Person1 from '../../../../assets/reviews/Person 1.png';
import Person2 from '../../../../assets/reviews/Person 2.jpg';
import Person3 from '../../../../assets/reviews/person 3.jpg';
import Person4 from '../../../../assets/reviews/Person 4.avif';
import Person5 from '../../../../assets/reviews/person5.jpg';

const defaultAvatars = [Person1, Person2, Person3, Person4, Person5];

export default function Reviews() {
  const { t } = useTranslation('Reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);
  
  // Responsive breakpoints for slider
  const isMobile = useMediaQuery('(max-width: 576px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  
  // Determine how many slides to show based on screen size
  const getPerSlide = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };
  
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      setError(t('fillAllFields') || 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newReview = await submitReview({
        name: formData.name,
        comment: formData.comment,
        rating: formData.rating,
        userId: user?._id,
        avatar: user?.avatar || null,
      });
      setSubmitSuccess(true);
      setFormData({ name: user?.name || '', comment: '', rating: 5 });
      
      // Add the new review to the list so user sees it immediately
      if (newReview) {
        setReviews(prev => [newReview, ...prev]);
      }
      
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('submitError') || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setError(null);
    setSubmitSuccess(false);
  };

  if (loading) {
    return <div className={styles.loading}>{t('loadingReviews') || t('common:loading', 'Loading...')}</div>;
  }

  // Build review nodes from API data
  const reviewNodes = reviews.map((review, idx) => {
    const avatar = review.avatar || defaultAvatars[idx % defaultAvatars.length];
    const fallbackAvatar = defaultAvatars[idx % defaultAvatars.length];
    return (
      <motion.div
        key={review._id || idx}
        className={styles.reviewCard}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <div className={styles.reviewHeader}>
          <motion.img
            src={avatar}
            alt={review.name}
            className={styles.avatar}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatar;
            }}
          />
          <div className={styles.reviewerInfo}>
            <h3>{review.name}</h3>
          </div>
        </div>

        <div className={styles.quoteContainer}>
          <span className={`${styles.quoteIcon} ${styles.quoteTopLeft}`}>"</span>
          <p className={styles.comment}>{review.comment}</p>
          <span className={`${styles.quoteIcon} ${styles.quoteBottomRight}`}>"</span>
        </div>
      </motion.div>
    );
  });

  return (
    <div className={styles.reviewsSection}>
      <div className={styles.reviewsHeader}>
        <h2 className={styles.sectionTitle}>{t('title') || 'What Our Customers Say'}</h2>
        <button 
          className={styles.addReviewBtn}
          onClick={() => setShowForm(true)}
        >
          + {t('addReview') || 'Add Review'}
        </button>
      </div>

      {reviews.length > 0 ? (
        <Slider perSlide={getPerSlide()} maxWidth={"1500px"}>{reviewNodes}</Slider>
      ) : (
        <p className={styles.noReviews}>{t('noReviews') || 'No reviews yet. Be the first to share your experience!'}</p>
      )}

      {/* Add Review Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={closeForm}>×</button>
              
              <h2>{t('writeReview') || 'Write a Review'}</h2>
              
              {submitSuccess ? (
                <div className={styles.successMessage}>
                  <span className={styles.successIcon}>✓</span>
                  <p>{t('reviewSubmitted') || 'Thank you! Your review has been submitted and is pending approval.'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.reviewForm}>
                  {error && <div className={styles.errorMessage}>{error}</div>}
                  
                  <div className={styles.formGroup}>
                    <label>{t('yourName') || 'Your Name'}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('enterName') || 'Enter your name'}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t('rating') || 'Rating'}</label>
                    <div className={styles.starRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.starBtn} ${star <= formData.rating ? styles.starActive : ''}`}
                          onClick={() => handleRatingChange(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t('yourReview') || 'Your Review'}</label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder={t('writeYourReview') || 'Share your experience with us...'}
                      rows={4}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? (t('submitting') || 'Submitting...') : (t('submitReview') || 'Submit Review')}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

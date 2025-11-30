import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getReviews, approveReview, rejectReview, deleteReview } from '../../api/adminAPI';
import styles from './AdminReviews.module.css';

const AdminReviews = () => {
  const { t } = useTranslation('dashboard');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      const updatedReview = await approveReview(id);
      setReviews(reviews.map(r => r._id === id ? updatedReview : r));
      setSuccess(t('admin.reviewsPage.reviewApproved'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve review');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleReject = async (id) => {
    try {
      const updatedReview = await rejectReview(id);
      setReviews(reviews.map(r => r._id === id ? updatedReview : r));
      setSuccess(t('admin.reviewsPage.reviewRejected'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject review');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.reviewsPage.confirmDeleteReview'))) return;
    
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r._id !== id));
      setSuccess(t('admin.reviewsPage.reviewDeleted'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatus = (review) => {
    if (review.isApproved === true) return 'approved';
    if (review.isApproved === false) return 'rejected';
    return 'pending';
  };

  const getStatusClass = (review) => {
    const status = getStatus(review);
    switch (status) {
      case 'approved':
        return styles.approved;
      case 'rejected':
        return styles.rejected;
      default:
        return styles.pending;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return t('admin.reviewsPage.approved');
      case 'rejected':
        return t('admin.reviewsPage.rejected');
      default:
        return t('admin.reviewsPage.pending');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewsPage}>
      <div className={styles.header}>
        <h1>{t('admin.reviewsPage.title')}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {reviews.length > 0 ? (
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => {
            const status = getStatus(review);
            return (
              <div key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h3>{review.name}</h3>
                    {review.avatar && <img src={review.avatar} alt={review.name} className={styles.avatar} loading="lazy" />}
                  </div>
                  <span className={styles.rating}>★ {review.rating}</span>
                </div>
                
                <p className={styles.reviewContent}>{review.comment || review.text}</p>
                
                <div className={styles.reviewFooter}>
                  <span className={`${styles.status} ${getStatusClass(review)}`}>
                    {getStatusLabel(status)}
                  </span>
                  <div className={styles.actions}>
                    {status !== 'approved' && (
                      <button className={styles.approveBtn} onClick={() => handleApprove(review._id)}>
                        {t('admin.approve')}
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button className={styles.rejectBtn} onClick={() => handleReject(review._id)}>
                        {t('admin.reject')}
                      </button>
                    )}
                    <button className={styles.deleteBtn} onClick={() => handleDelete(review._id)}>
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t('admin.reviewsPage.noReviews')}</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDashboardStats } from '../../api/adminAPI';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>{t('admin.dashboardPage.title')}</h1>
        <p>{t('admin.dashboardPage.welcome')}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.packages}`}>
          <h3>{t('admin.dashboardPage.totalPackages')}</h3>
          <div className={styles.value}>{stats?.totalPackages || stats?.counts?.packages || 0}</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.services}`}>
          <h3>{t('admin.dashboardPage.totalServices')}</h3>
          <div className={styles.value}>{stats?.totalServices || stats?.counts?.services || 0}</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.reviews}`}>
          <h3>{t('admin.dashboardPage.totalReviews')}</h3>
          <div className={styles.value}>{stats?.totalReviews || stats?.counts?.reviews || 0}</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.contacts}`}>
          <h3>{t('admin.dashboardPage.unreadMessages')}</h3>
          <div className={styles.value}>{stats?.unreadContacts || stats?.counts?.contacts || 0}</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.users}`}>
          <h3>{t('admin.dashboardPage.totalUsers')}</h3>
          <div className={styles.value}>{stats?.totalUsers || stats?.counts?.users || 0}</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.pending}`}>
          <h3>{t('admin.dashboardPage.pendingReviews')}</h3>
          <div className={styles.value}>{stats?.pendingReviews || 0}</div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>{t('admin.dashboardPage.recentPackages')}</h2>
        <div className={styles.recentList}>
          {stats?.recentPackages?.length > 0 ? (
            stats.recentPackages.map((pkg) => (
              <div key={pkg._id} className={styles.recentItem}>
                <span>{pkg.name}</span>
                <small>${pkg.price}</small>
              </div>
            ))
          ) : (
            <p>{t('admin.dashboardPage.noPackagesYet')}</p>
          )}
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>{t('admin.dashboardPage.recentContacts')}</h2>
        <div className={styles.recentList}>
          {stats?.recentContacts?.length > 0 ? (
            stats.recentContacts.map((contact) => (
              <div key={contact._id} className={styles.recentItem}>
                <span>{contact.name} - {contact.subject}</span>
                <small>{contact.replied ? t('admin.dashboardPage.replied') : t('admin.dashboardPage.pending')}</small>
              </div>
            ))
          ) : (
            <p>{t('admin.dashboardPage.noContactsYet')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

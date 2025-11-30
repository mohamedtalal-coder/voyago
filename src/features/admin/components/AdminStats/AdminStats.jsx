import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getStats, updateStat } from '../../api/adminAPI';
import styles from './AdminStats.module.css';

const AdminStats = () => {
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState({});

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
      const values = {};
      data.forEach((stat) => {
        values[stat._id] = stat.value;
      });
      setEditValues(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleValueChange = (id, value) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async (stat) => {
    const newValue = editValues[stat._id];
    if (newValue === stat.value) return;

    setSaving((prev) => ({ ...prev, [stat._id]: true }));
    
    try {
      await updateStat(stat._id, { value: newValue });
      setSuccess(`${stat.label} ${t('admin.statsPage.updated')}`);
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stat');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving((prev) => ({ ...prev, [stat._id]: false }));
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
    <div className={styles.statsPage}>
      <div className={styles.header}>
        <h1>{t('admin.statsPage.title')}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {stats.length > 0 ? (
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat._id} className={styles.statCard}>
              <h3>{stat.label}</h3>
              <div className={styles.statValue}>{stat.value}</div>
              <p className={styles.statLabel}>{t('admin.statsPage.currentValue')}</p>
              
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editValues[stat._id] || ''}
                  onChange={(e) => handleValueChange(stat._id, e.target.value)}
                  placeholder={t('admin.statsPage.enterNewValue')}
                />
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSave(stat)}
                  disabled={saving[stat._id] || editValues[stat._id] === stat.value}
                >
                  {saving[stat._id] ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t('admin.statsPage.noStats')}</p>
        </div>
      )}
    </div>
  );
};

export default AdminStats;

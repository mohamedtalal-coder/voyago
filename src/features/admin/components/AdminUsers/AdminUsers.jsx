import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, toggleUserAdmin } from '../../api/adminAPI';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import styles from './AdminUsers.module.css';

const AdminUsers = () => {
  const { t } = useTranslation('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [toggling, setToggling] = useState({});
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId, userName, isCurrentlyAdmin) => {
    if (userId === currentUser?._id) {
      setError(t('admin.usersPage.cantChangeOwnStatus'));
      setTimeout(() => setError(null), 3000);
      return;
    }

    const action = isCurrentlyAdmin ? t('admin.usersPage.confirmRemoveAdmin') : t('admin.usersPage.confirmMakeAdmin');
    if (!window.confirm(`${action} ${userName}?`)) return;

    setToggling((prev) => ({ ...prev, [userId]: true }));
    
    try {
      const updatedUser = await toggleUserAdmin(userId);
      setUsers(users.map(u => u._id === userId ? { ...u, isAdmin: updatedUser.isAdmin } : u));
      setSuccess(`${t('admin.usersPage.adminStatusUpdated')} ${userName}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      setTimeout(() => setError(null), 3000);
    } finally {
      setToggling((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      <div className={styles.header}>
        <h1>{t('admin.usersPage.title')}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.table}>
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>{t('admin.usersPage.name')}</th>
                <th>{t('admin.usersPage.email')}</th>
                <th>{t('admin.usersPage.role')}</th>
                <th>{t('admin.usersPage.joined')}</th>
                <th>{t('admin.usersPage.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userInfo}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className={styles.avatar} loading="lazy" />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>
                        {user.name || t('admin.usersPage.noName')}
                        {user._id === currentUser?._id && (
                          <span className={styles.currentUser}> {t('admin.usersPage.you')}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className={styles.adminBadge}>{t('admin.usersPage.admin')}</span>
                    ) : (
                      <span className={styles.userBadge}>{t('admin.usersPage.user')}</span>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {user._id !== currentUser?._id && (
                      <button
                        className={`${styles.toggleBtn} ${user.isAdmin ? styles.removeAdmin : styles.makeAdmin}`}
                        onClick={() => handleToggleAdmin(user._id, user.name || user.email, user.isAdmin)}
                        disabled={toggling[user._id]}
                      >
                        {toggling[user._id]
                          ? t('admin.updating')
                          : user.isAdmin
                          ? t('admin.removeAdmin')
                          : t('admin.makeAdmin')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>{t('admin.usersPage.noUsers')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;

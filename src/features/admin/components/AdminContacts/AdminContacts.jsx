import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContacts, markContactReplied, deleteContact } from '../../api/adminAPI';
import styles from './AdminContacts.module.css';

const AdminContacts = () => {
  const { t } = useTranslation('dashboard');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkReplied = async (id) => {
    try {
      const updatedContact = await markContactReplied(id);
      setContacts(contacts.map(c => c._id === id ? updatedContact : c));
      setSuccess(t('admin.contactsPage.markedReplied'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.contactsPage.confirmDeleteContact'))) return;
    
    try {
      await deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
      setSuccess(t('admin.contactsPage.contactDeleted'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatus = (contact) => {
    if (contact.isReplied) return 'replied';
    if (contact.isRead) return 'read';
    return 'pending';
  };

  const getStatusClass = (contact) => {
    const status = getStatus(contact);
    switch (status) {
      case 'replied':
        return styles.replied;
      case 'read':
        return styles.read;
      default:
        return styles.pending;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'replied':
        return t('admin.contactsPage.replied');
      case 'read':
        return t('admin.contactsPage.read');
      default:
        return t('admin.contactsPage.pending');
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
    <div className={styles.contactsPage}>
      <div className={styles.header}>
        <h1>{t('admin.contactsPage.title')}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {contacts.length > 0 ? (
        <div className={styles.contactsGrid}>
          {contacts.map((contact) => {
            const status = getStatus(contact);
            return (
              <div 
                key={contact._id} 
                className={`${styles.contactCard} ${status === 'pending' ? styles.unread : ''}`}
              >
                <div className={styles.contactHeader}>
                  <div className={styles.contactInfo}>
                    <h3>{contact.name}</h3>
                    <p>{contact.email}</p>
                  </div>
                  <span className={styles.date}>{formatDate(contact.createdAt)}</span>
                </div>
                
                <p className={styles.subject}>{contact.subject}</p>
                <p className={styles.message}>{contact.message}</p>
                
                <div className={styles.contactFooter}>
                  <span className={`${styles.status} ${getStatusClass(contact)}`}>
                    {getStatusLabel(status)}
                  </span>
                  <div className={styles.actions}>
                    {!contact.isReplied && (
                      <button 
                        className={styles.replyBtn} 
                        onClick={() => handleMarkReplied(contact._id)}
                      >
                        {t('admin.markReplied')}
                      </button>
                    )}
                    <button className={styles.deleteBtn} onClick={() => handleDelete(contact._id)}>
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
          <p>{t('admin.contactsPage.noContacts')}</p>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

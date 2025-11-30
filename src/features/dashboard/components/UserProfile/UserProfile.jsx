import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiUser, FiMail, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import Loader from '../../../../components/Loader/Loader';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { t } = useTranslation('dashboard');
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
      setIsEditing(true);
      setSaveError(null);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setPreviewAvatar('');
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setIsEditing(true);
    setSaveError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    setIsEditing(true);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      // Update user in store and database
      if (updateUser) {
        await updateUser({
          name: formData.name,
          avatar: formData.avatar,
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveError(error.message || 'Failed to save changes');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      avatar: user?.avatar || '',
    });
    setPreviewAvatar(user?.avatar || '');
    setIsEditing(false);
    setSaveError(null);
  };

  const getAvatarContent = () => {
    if (previewAvatar) {
      return <img src={previewAvatar} alt={formData.name} className={styles.avatarImage} loading="lazy" />;
    }
    if (formData.name) {
      return <span className={styles.avatarInitial}>{formData.name.charAt(0).toUpperCase()}</span>;
    }
    return <FiUser className={styles.avatarIcon} />;
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('profile.title', 'Profile Information')}</h2>
      
      <div className={styles.profileCard}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
            <div className={styles.avatar}>
              {getAvatarContent()}
            </div>
            <div className={styles.avatarOverlay}>
              <FiCamera size={24} />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className={styles.fileInput}
          />
          <p className={styles.avatarHint}>{t('profile.changePhoto', 'Click to change photo')}</p>
          {previewAvatar && (
            <button
              className={styles.removeAvatarBtn}
              onClick={handleRemoveAvatar}
              type="button"
            >
              <FiTrash2 size={14} />
              {t('profile.removePhoto', 'Remove photo')}
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className={styles.profileInfo}>
          {/* Error Message */}
          {saveError && (
            <div className={styles.errorMessage}>
              {saveError}
            </div>
          )}

          {/* Name Field */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FiUser size={16} />
              {t('profile.name', 'Full Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              className={styles.input}
              placeholder={t('profile.namePlaceholder', 'Enter your name')}
            />
          </div>

          {/* Email Field (read-only) */}
          <div className={styles.field}>
            <label className={styles.label}>
              <FiMail size={16} />
              {t('profile.email', 'Email Address')}
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className={`${styles.input} ${styles.inputDisabled}`}
              disabled
            />
            <p className={styles.fieldHint}>{t('profile.emailHint', 'Email cannot be changed')}</p>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={isLoading}
              >
                <FiX size={16} />
                {t('profile.cancel', 'Cancel')}
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader size="small" color="white" inline />
                ) : (
                  <>
                    <FiCheck size={16} />
                    {t('profile.saveChanges', 'Save Changes')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;

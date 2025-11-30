// src/components/Navbar/UserAccountButton.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useAppStore from '../../../../store/auth/useAppStore';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserAccountButton.module.css';

const UserAccountButton = () => {
  const { t } = useTranslation('auth');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const openAuthModal = useAppStore((s) => s.openAuthModal);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    // if not logged in, open auth modal instead
    if (!user) {
      openAuthModal && openAuthModal();
      return;
    }
    setOpen((v) => !v);
  };

  const handleLogout = () => {
    logout && logout();
    setOpen(false);
    navigate('/');
  };

  const avatarContent = () => {
    if (user?.avatar) {
      return <img src={user.avatar} alt={user.name || 'avatar'} className={styles.avatarImg} loading="eager" />;
    }
    // Show user initial or default icon
    if (user?.name) {
      return <span className={styles.avatarInitial}>{user.name.charAt(0).toUpperCase()}</span>;
    }
    return <FiUser className={styles.avatarIcon} />;
  };

  return (
    <div className={styles.container} ref={ref}>
      <button className={styles.avatarBtn} onClick={handleToggle} aria-haspopup="true" aria-expanded={open}>
        {avatarContent()}
      </button>

      {open && user && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.header}>
            <div className={styles.headerAvatar}>{avatarContent()}</div>
            <div className={styles.headerInfo}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.email}>{user.email}</div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/dashboard" className={styles.actionItem} onClick={() => setOpen(false)}>{t('userAccount.myTickets')}</Link>
            {user?.isAdmin && (
              <Link to="/admin" className={`${styles.actionItem} ${styles.adminItem}`} onClick={() => setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                {t('userAccount.adminDashboard', 'Admin Dashboard')}
              </Link>
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.logout} onClick={handleLogout}>{t('userAccount.logout')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountButton;
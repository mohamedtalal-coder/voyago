import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation('dashboard');

  // Redirect if not authenticated or not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile hamburger button */}
      {isMobile && (
        <button 
          className={styles.hamburger} 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar} />
      )}

      <aside className={`${styles.sidebar} ${isMobile && sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>{t('admin.panel', 'Admin Panel')}</h2>
          <span>{t('welcome')}, {user?.firstName || 'Admin'}</span>
        </div>
        
        <nav className={styles.navLinks}>
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/>
            </svg>
            {t('admin.dashboard', 'Dashboard')}
          </NavLink>
          
          <NavLink 
            to="/admin/packages" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>
            </svg>
            {t('admin.packages', 'Packages')}
          </NavLink>
          
          <NavLink 
            to="/admin/services" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.71 18.29l-4.42-4.42A8 8 0 1 0 16 16l4.42 4.42a1 1 0 0 0 1.41 0 1 1 0 0 0-.12-1.13zM10 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"/>
            </svg>
            {t('admin.services', 'Services')}
          </NavLink>
          
          <NavLink 
            to="/admin/reviews" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {t('admin.reviews', 'Reviews')}
          </NavLink>
          
          <NavLink 
            to="/admin/contacts" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            {t('admin.contacts', 'Contacts')}
          </NavLink>
          
          <NavLink 
            to="/admin/stats" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            {t('admin.stats', 'Stats')}
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            {t('admin.users', 'Users')}
          </NavLink>
        </nav>
        
        <div className={styles.backLink}>
          <NavLink to="/" className={styles.navLink} onClick={closeSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            {t('admin.backToSite', 'Back to Site')}
          </NavLink>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

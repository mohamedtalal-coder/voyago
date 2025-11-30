import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useAppStore from '../../../../store/auth/useAppStore';
import Loader from '../../../../components/Loader/Loader';

const AuthCallback = () => {
  const { t } = useTranslation('auth');
  const location = useLocation();
  const navigate = useNavigate();
  const setGoogleAuth = useAuthStore(state => state.setGoogleAuth);
  const closeAuthModal = useAppStore(state => state.closeAuthModal);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const avatar = params.get('avatar');
    const isAdmin = params.get('isAdmin') === 'true';
    const _id = params.get('_id');
    const error = params.get('error');

    if (error) {
      console.error("Google sign-in failed.");
      navigate('/login', { replace: true }); // Redirect to login page on failure
      return;
    }

    if (token && name && email) {
      const userData = { 
        _id,
        token, 
        name, 
        email,
        avatar: avatar ? decodeURIComponent(avatar) : null,
        isAdmin,
      };

      setGoogleAuth(userData); 
      
      closeAuthModal();
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, setGoogleAuth, closeAuthModal]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <Loader />
      <p style={{ marginTop: '20px' }}>{t('authenticatingGoogle', 'Authenticating with Google...')}</p>
    </div>
  );
};

export default AuthCallback;
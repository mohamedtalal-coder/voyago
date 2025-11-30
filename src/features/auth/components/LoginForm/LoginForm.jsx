// src/components/Auth/LoginForm.jsx

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import useAppStore from "../../../../store/auth/useAppStore";
import { useAuthStore } from "../../../../store/auth/useAuthStore";
import { validateLoginForm, validateEmail } from "../../../../lib/validation";
import Button from "../../../../components/Button/Button";
import Loader from "../../../../components/Loader/Loader";
import styles from "./LoginForm.module.css";
import sharedStyles from "../AuthModal/AuthModal.module.css";

const LoginForm = () => {
  const { t } = useTranslation("auth");
  const { openAuthModal, authError, clearAuthError } = useAppStore();
  
  // --- Form State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // ------------------

  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);

  // Clear auth error when component unmounts or user starts typing
  React.useEffect(() => {
    return () => clearAuthError();
  }, [clearAuthError]);

  // Real-time validation on blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === 'email') {
      const result = validateEmail(email);
      setErrors(prev => ({ ...prev, email: result.isValid ? null : result.error }));
    } else if (field === 'password') {
      if (!password) {
        setErrors(prev => ({ ...prev, password: t('login.passwordRequired', 'Password is required') }));
      } else if (password.length < 6) {
        setErrors(prev => ({ ...prev, password: t('login.passwordTooShort', 'Password must be at least 6 characters') }));
      } else {
        setErrors(prev => ({ ...prev, password: null }));
      }
    }
  }, [email, password, t]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate entire form
    const validation = validateLoginForm(email, password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();
      return;
    }

    if (isLoading) return;

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      setErrors({ 
        form: error.message || t('login.errorGeneric', 'Login failed. Please check your credentials.') 
      });
    }
  };

  const getInputClassName = (field) => {
    let className = sharedStyles.input;
    if (touched[field]) {
      if (errors[field]) {
        className += ` ${sharedStyles.inputError}`;
      } else if ((field === 'email' && email) || (field === 'password' && password)) {
        className += ` ${sharedStyles.inputSuccess}`;
      }
    }
    return className;
  };
  
  return (
    <form className={sharedStyles.formContainer} onSubmit={handleSubmit} noValidate>
      <h2 className={sharedStyles.title}>{t("login.title")}</h2>
      
      {authError && (
        <div className={sharedStyles.errorMessage} style={{ backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>
          <FiAlertCircle />
          {authError}
        </div>
      )}
      
      {errors.form && (
        <div className={sharedStyles.errorMessage}>
          <FiAlertCircle />
          {errors.form}
        </div>
      )}

      <div className={sharedStyles.inputGroup}>
        <label>{t("login.emailLabel")} <span className={sharedStyles.required}>*</span></label>
        <div className={sharedStyles.inputWrapper}>
          <input
            type="email"
            name="email"
            placeholder={t("login.emailPlaceholder")}
            className={getInputClassName('email')}
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
            disabled={isLoading}
            autoComplete="email"
            maxLength={254}
          />
          {touched.email && !errors.email && email && (
            <FiCheckCircle className={sharedStyles.successIcon} />
          )}
        </div>
        {touched.email && errors.email && (
          <div className={sharedStyles.fieldError}>
            <FiAlertCircle size={12} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      <div className={sharedStyles.inputGroup}>
        <label>{t("login.passwordLabel")} <span className={sharedStyles.required}>*</span></label>
        <div className={sharedStyles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("login.passwordPlaceholder")}
            className={getInputClassName('password')}
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            disabled={isLoading}
            autoComplete="current-password"
            maxLength={128}
          />
          <button
            type="button"
            className={sharedStyles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {touched.password && errors.password && (
          <div className={sharedStyles.fieldError}>
            <FiAlertCircle size={12} />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      <div
        className={styles.forgotLink}
        onClick={() => openAuthModal("forgot-password")}
      >
        {t("login.forgotPassword")}
      </div>

      <Button variant="primary" size="large" type="submit" disabled={isLoading}>
        {isLoading ? (
          <Loader size="small" color="white" inline message={t("login.loggingIn", "Logging In...")} />
        ) : (
          t("login.loginBtn")
        )}
      </Button>

      <div className={sharedStyles.divider}>{t("login.or")}</div>

      <Button
        variant="outline"
        size="large"
        type="button"
        onClick={() => {
          const API_BASE = import.meta.env.VITE_API_BASE || "https://depi-final-project-production.up.railway.app";
          window.location.href = `${API_BASE}/api/auth/google`;
        }}
      ><FcGoogle /> {t("login.googleBtn")}</Button>
      <div className={sharedStyles.footerText}>
        {t("login.noAccount")}{" "}
        <span
          className={sharedStyles.link}
          onClick={() => openAuthModal("register")}
        >
          {t("login.signUp")}
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import useAppStore from "../../../../store/auth/useAppStore";
import Button from "../../../../components/Button/Button";
import Loader from "../../../../components/Loader/Loader";
import { validateRegisterForm, validateName, validateEmail, validatePassword } from "../../../../lib/validation";
import styles from "./RegisterForm.module.css";
import sharedStyles from "../AuthModal/AuthModal.module.css";
import { useAuthStore } from "../../../../store/auth/useAuthStore";

const RegisterForm = () => {
  const { t } = useTranslation("auth");
  const { openAuthModal } = useAppStore();

  // --- Form State ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [agreed, setAgreed] = useState(false);
  // ------------------

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Calculate password strength in real-time
  const passwordStrength = useMemo(() => {
    if (!password) return { strength: 0, label: '', color: '' };
    const result = validatePassword(password);
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#dc2626', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981'];
    return {
      strength: result.strength,
      label: labels[result.strength] || labels[0],
      color: colors[result.strength] || colors[0],
      errors: result.errors
    };
  }, [password]);

  // Real-time validation on blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let result;
    switch (field) {
      case 'name':
        result = validateName(name, t('register.nameLabel', 'Name'));
        break;
      case 'email':
        result = validateEmail(email);
        break;
      case 'password':
        result = validatePassword(password);
        break;
      default:
        return;
    }

    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? null : result.error
    }));
  }, [name, email, password, t]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) setErrors(prev => ({ ...prev, name: null }));
  };

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
    setTouched({ name: true, email: true, password: true });

    // Validate entire form
    const validation = validateRegisterForm(name, email, password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.focus();
      return;
    }

    if (!agreed) {
      setErrors(prev => ({ ...prev, terms: t('register.agreeRequired', 'You must agree to the terms') }));
      return;
    }

    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (error) {
      setErrors({ form: error.message || t("register.errorGeneric", "Registration failed.") });
    }
  };

  const getInputClassName = (field) => {
    let className = sharedStyles.input;
    if (touched[field]) {
      if (errors[field]) {
        className += ` ${sharedStyles.inputError}`;
      } else if ((field === 'name' && name) || (field === 'email' && email) || (field === 'password' && password && passwordStrength.strength >= 3)) {
        className += ` ${sharedStyles.inputSuccess}`;
      }
    }
    return className;
  };

  return (
    <form className={sharedStyles.formContainer} onSubmit={handleSubmit} noValidate>
      <h2 className={sharedStyles.title}>{t("register.title")}</h2>

      {errors.form && (
        <div className={sharedStyles.errorMessage}>
          <FiAlertCircle />
          {errors.form}
        </div>
      )}

      {/* Name Input */}
      <div className={sharedStyles.inputGroup}>
        <label>{t("register.nameLabel")} <span className={sharedStyles.required}>*</span></label>
        <div className={sharedStyles.inputWrapper}>
          <input
            type="text"
            name="name"
            placeholder={t("register.namePlaceholder")}
            className={getInputClassName('name')}
            value={name}
            onChange={handleNameChange}
            onBlur={() => handleBlur('name')}
            disabled={isLoading}
            autoComplete="name"
            maxLength={50}
          />
          {touched.name && !errors.name && name && (
            <FiCheckCircle className={sharedStyles.successIcon} />
          )}
        </div>
        {touched.name && errors.name && (
          <div className={sharedStyles.fieldError}>
            <FiAlertCircle size={12} />
            <span>{errors.name}</span>
          </div>
        )}
      </div>

      {/* Email Input */}
      <div className={sharedStyles.inputGroup}>
        <label>{t("register.emailLabel")} <span className={sharedStyles.required}>*</span></label>
        <div className={sharedStyles.inputWrapper}>
          <input
            type="email"
            name="email"
            placeholder={t("register.emailPlaceholder")}
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

      {/* Password Input */}
      <div className={sharedStyles.inputGroup}>
        <label>{t("register.passwordLabel")} <span className={sharedStyles.required}>*</span></label>
        <div className={sharedStyles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("register.passwordPlaceholder")}
            className={getInputClassName('password')}
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            disabled={isLoading}
            autoComplete="new-password"
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
        
        {/* Password Strength Indicator */}
        {password && (
          <div className={styles.passwordStrength}>
            <div className={styles.strengthBar}>
              <div 
                className={styles.strengthFill} 
                style={{ 
                  width: `${(passwordStrength.strength / 5) * 100}%`,
                  backgroundColor: passwordStrength.color
                }}
              />
            </div>
            <span className={styles.strengthLabel} style={{ color: passwordStrength.color }}>
              {t(`register.strength.${passwordStrength.strength}`, passwordStrength.label)}
            </span>
          </div>
        )}
        
        {touched.password && errors.password && (
          <div className={sharedStyles.fieldError}>
            <FiAlertCircle size={12} />
            <span>{errors.password}</span>
          </div>
        )}
        
        {/* Password Requirements Hint */}
        {password && passwordStrength.strength < 3 && (
          <div className={styles.passwordHint}>
            <small>{t('register.passwordRequirements', 'Use 8+ characters with uppercase, lowercase, numbers & symbols')}</small>
          </div>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className={styles.termsWrapper}>
        <input
          type="checkbox"
          id="terms"
          className={styles.termsCheckbox}
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (errors.terms) setErrors(prev => ({ ...prev, terms: null }));
          }}
        />
        <label htmlFor="terms" className={styles.termsText}>
          {t("register.agree")}{" "}
          <a href="/terms" className={styles.termsLink} target="_blank" rel="noreferrer">
            {t("register.terms")}{" "}
          </a>
          {t("register.and")}{" "}
          <a href="/privacy" className={styles.termsLink} target="_blank" rel="noreferrer">
            {t("register.privacy")}
          </a>
        </label>
      </div>
      {errors.terms && (
        <div className={sharedStyles.fieldError}>
          <FiAlertCircle size={12} />
          <span>{errors.terms}</span>
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        type="submit"
        className={sharedStyles.submitBtn}
        disabled={!agreed || isLoading}
      >
        {isLoading ? (
          <Loader size="small" color="white" inline message={t("register.registering", "Signing Up...")} />
        ) : (
          t("register.button")
        )}
      </Button>

      <div className={sharedStyles.divider}>{t("login.or")}</div>
      <Button
        variant="outline"
        size="large"
        type="button"
        className={sharedStyles.googleBtn}
        onClick={() => {
          const API_BASE = import.meta.env.VITE_API_BASE || "https://depi-final-project-production.up.railway.app";
          window.location.href = `${API_BASE}/api/auth/google`;
        }}
        disabled={isLoading}
      >
        <FcGoogle /> {t("register.googleBtn")}
      </Button>

      <div className={sharedStyles.footerText}>
        {t("register.hasAccount")}{" "}
        <span
          className={sharedStyles.link}
          onClick={() => openAuthModal("login")}
        >
          {t("register.loginLink")}
        </span>
      </div>
    </form>
  );
};
export default RegisterForm;

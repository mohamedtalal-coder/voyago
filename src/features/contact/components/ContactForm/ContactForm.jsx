import React, { useState } from 'react';
import Button from '../../../../components/Button/Button';
import Loader from '../../../../components/Loader/Loader';
import { toast } from 'sonner';
import styles from './ContactForm.module.css';
import { useTranslation } from 'react-i18next';
import { submitContactForm } from '../../api/contactAPI';

export default function ContactForm() {
  const { t, i18n } = useTranslation('contact');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Update form state when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check that all fields are filled
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('pleaseFillAllFields') || 'Please fill in all fields');
      return;
    }
    
    // Validate email
    if (!isValidEmail(formData.email)) {
      toast.error(t('pleaseEnterValidEmail') || 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await submitContactForm(formData);
      toast.success(t('messageSentSuccess') || 'Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(t('messageSendError') || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactFormContainer} dir={i18n.dir()}>
      <form className="row" onSubmit={handleSubmit}>
        {/* Name input */}
        <div className="col-12">
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('nameLabel')}</label>
            <input 
              type="text" 
              placeholder={t('namePlaceholder')}
              className={styles.formControl}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email input */}
        <div className="col-12">
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('emailLabel')}</label>
            <input 
              type="email"
              placeholder={t('emailPlaceholder')}
              className={styles.formControl}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Message textarea */}
        <div className="col-12">
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t('messageLabel')}</label>
            <textarea
              rows="4"
              placeholder={t('messagePlaceholder')}
              className={`${styles.formControl} ${styles.textarea}`}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit button or loader */}
        <div className="col-12">
          <div className="pt-2">
            {loading ? (
              <Loader size="small" message={t('sending')} />
            ) : (
              <Button type="submit" variant="submit" size="large">
                {t('sendMessage')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

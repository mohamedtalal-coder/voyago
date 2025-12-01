import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getServices, createService, updateService, deleteService } from '../../api/adminAPI';
import { uploadSingleImage } from '../../api/uploadAPI';
import { handleImageError, PLACEHOLDER_SERVICE } from '../../../../lib/imageUtils';
import styles from './AdminServices.module.css';

const AdminServices = () => {
  const { t } = useTranslation(['dashboard', 'services', 'common', 'footer']);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titleKey: '',
    descKey: '',
    img: '',
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  // File upload handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    try {
      setUploading(true);
      const url = await uploadSingleImage(file);
      setFormData((prev) => ({ ...prev, img: url }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      fetchServices();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      titleKey: service.titleKey || '',
      descKey: service.descKey || '',
      img: service.img || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.servicesPage.confirmDeleteService'))) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titleKey: '',
      descKey: '',
      img: '',
    });
    setEditingService(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className={styles.loading}>{t('admin.loading')}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('admin.servicesPage.title')}</h1>
        <button 
          className={styles.addBtn}
          onClick={() => setShowForm(true)}
        >
          {t('admin.servicesPage.addService')}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <h2>{editingService ? t('admin.servicesPage.editService') : t('admin.servicesPage.addNewService')}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>{t('admin.servicesPage.titleKey')} *</label>
                <input
                  type="text"
                  value={formData.titleKey}
                  onChange={(e) => setFormData({ ...formData, titleKey: e.target.value })}
                  placeholder="e.g., services.carRental.title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.servicesPage.descKey')}</label>
                <input
                  type="text"
                  value={formData.descKey}
                  onChange={(e) => setFormData({ ...formData, descKey: e.target.value })}
                  placeholder="e.g., services.carRental.description"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.image')}</label>
                <div 
                  className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <p>📁 {t('admin.packagesPage.dropImage')}</p>
                </div>
                <small>{t('admin.packagesPage.orEnterUrl')}</small>
                <input
                  type="text"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  placeholder="/images/services/car-rental.jpg"
                />
              </div>

              {formData.img && (
                <div className={styles.imagePreview}>
                  <img src={formData.img} alt="Preview" loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                  <button 
                    type="button" 
                    className={styles.removeImage}
                    onClick={() => setFormData(prev => ({ ...prev, img: '' }))}
                  >
                    ×
                  </button>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                  {t('admin.cancel')}
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingService ? t('admin.update') : t('admin.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('admin.packagesPage.image')}</th>
              <th>{t('admin.servicesPage.titleKey')}</th>
              <th>{t('admin.servicesPage.descKey')}</th>
              <th>{t('admin.servicesPage.created')}</th>
              <th>{t('admin.packagesPage.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.noData}>{t('admin.servicesPage.noServices')}</td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id}>
                  <td>
                    {service.img ? (
                      <img 
                        src={service.img} 
                        alt={t(service.titleKey, { defaultValue: service.titleKey })} 
                        className={styles.thumbnail}
                        onError={(e) => handleImageError(e, 'service')}
                      />
                    ) : (
                      <span className={styles.noImage}>{t('admin.servicesPage.noImage')}</span>
                    )}
                  </td>
                  <td>{t(service.titleKey, { defaultValue: service.titleKey })}</td>
                  <td>{service.descKey ? t(service.descKey, { defaultValue: service.descKey }) : '-'}</td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => handleEdit(service)}
                      >
                        {t('admin.edit')}
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(service._id)}
                      >
                        {t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServices;

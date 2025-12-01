import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getPackages, createPackage, updatePackage, deletePackage } from '../../api/adminAPI';
import { uploadSingleImage, uploadMultipleImages } from '../../api/uploadAPI';
import { handleImageError, PLACEHOLDER_PACKAGE } from '../../../../lib/imageUtils';
import styles from './AdminPackages.module.css';

const initialFormState = {
  titleKey: '',
  desc: '',
  longDescKey: '',
  price: '',
  duration: '',
  groupKey: '',
  img: '',
  rating: '4.5',
  subimages: [],
  gallery: [],
};

const AdminPackages = () => {
  const { t } = useTranslation(['dashboard', 'packages']);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState({ main: false, sub: false, gallery: false });
  const fileInputRef = useRef(null);
  const subImagesInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const fetchPackages = async () => {
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Main image file handlers
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
    setDragOver((prev) => ({ ...prev, main: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, main: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, main: false }));
  };

  // Sub images handlers
  const handleSubImagesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    await addMultipleImages(files, 'subimages');
  };

  const handleSubImagesDrop = async (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, sub: false }));
    const files = Array.from(e.dataTransfer.files || []);
    await addMultipleImages(files, 'subimages');
  };

  const handleSubImagesDragOver = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, sub: true }));
  };

  const handleSubImagesDragLeave = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, sub: false }));
  };

  // Gallery handlers
  const handleGallerySelect = async (e) => {
    const files = Array.from(e.target.files || []);
    await addMultipleImages(files, 'gallery');
  };

  const handleGalleryDrop = async (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, gallery: false }));
    const files = Array.from(e.dataTransfer.files || []);
    await addMultipleImages(files, 'gallery');
  };

  const handleGalleryDragOver = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, gallery: true }));
  };

  const handleGalleryDragLeave = (e) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, gallery: false }));
  };

  // Add multiple images to subimages or gallery
  const addMultipleImages = async (files, field) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Please select image files');
      return;
    }
    try {
      setUploading(true);
      const urls = await uploadMultipleImages(imageFiles);
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], ...urls],
      }));
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Remove image from array
  const removeArrayImage = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      titleKey: pkg.titleKey || '',
      desc: pkg.desc || '',
      longDescKey: pkg.longDescKey || '',
      price: pkg.price || '',
      duration: pkg.duration || '',
      groupKey: pkg.groupKey || '',
      img: pkg.img || '',
      rating: pkg.rating || '4.5',
      subimages: Array.isArray(pkg.subimages) ? pkg.subimages : [],
      gallery: Array.isArray(pkg.gallery) ? pkg.gallery : [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.packagesPage.confirmDeletePackage'))) return;
    
    try {
      await deletePackage(id);
      setSuccess(t('admin.packagesPage.packageDeleted'));
      fetchPackages();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete package');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const packageData = {
        ...formData,
        subimages: formData.subimages,
        gallery: formData.gallery,
      };

      if (editingPackage) {
        await updatePackage(editingPackage._id, packageData);
        setSuccess(t('admin.packagesPage.packageUpdated'));
      } else {
        await createPackage(packageData);
        setSuccess(t('admin.packagesPage.packageCreated'));
      }

      setShowModal(false);
      fetchPackages();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
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
    <div className={styles.packagesPage}>
      <div className={styles.header}>
        <h1>{t('admin.packagesPage.title')}</h1>
        <button className={styles.addBtn} onClick={handleAdd}>
          {t('admin.packagesPage.addPackage')}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.table}>
        {packages.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>{t('admin.packagesPage.image')}</th>
                <th>{t('admin.packagesPage.titleKey')}</th>
                <th>{t('admin.packagesPage.price')}</th>
                <th>{t('admin.packagesPage.duration')}</th>
                <th>{t('admin.packagesPage.rating')}</th>
                <th>{t('admin.packagesPage.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>
                    <img 
                      src={pkg.img} 
                      alt={t(pkg.titleKey, { defaultValue: pkg.titleKey })} 
                      className={styles.thumbnail}
                      onError={(e) => handleImageError(e, 'package')}
                    />
                  </td>
                  <td>{t(pkg.titleKey, { defaultValue: pkg.titleKey })}</td>
                  <td>{pkg.price}</td>
                  <td>{pkg.duration || '-'}</td>
                  <td>★ {pkg.rating || '0'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(pkg)}>
                        {t('admin.edit')}
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(pkg._id)}>
                        {t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>{t('admin.packagesPage.noPackages')}</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{editingPackage ? t('admin.packagesPage.editPackage') : t('admin.packagesPage.addNewPackage')}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.titleKey')} *</label>
                <input
                  type="text"
                  name="titleKey"
                  value={formData.titleKey}
                  onChange={handleInputChange}
                  placeholder="e.g., packages.dubai.title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.shortDesc')}</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Brief description of the package"
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.longDescKey')}</label>
                <input
                  type="text"
                  name="longDescKey"
                  value={formData.longDescKey}
                  onChange={handleInputChange}
                  placeholder="e.g., packages.dubai.longDesc"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('admin.packagesPage.price')} *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., $299 or 299"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('admin.packagesPage.duration')}</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 Days / 4 Nights"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>{t('admin.packagesPage.groupKey')}</label>
                  <input
                    type="text"
                    name="groupKey"
                    value={formData.groupKey}
                    onChange={handleInputChange}
                    placeholder="e.g., packages.dubai.group"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('admin.packagesPage.rating')}</label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="e.g., 4.5"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.mainImage')}</label>
                <div 
                  className={`${styles.dropzone} ${dragOver.main ? styles.dragOver : ''}`}
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
                  name="img"
                  value={formData.img}
                  onChange={handleInputChange}
                  placeholder="/images/packages/dubai.jpg"
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

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.subImages')}</label>
                <div 
                  className={`${styles.dropzone} ${dragOver.sub ? styles.dragOver : ''}`}
                  onDrop={handleSubImagesDrop}
                  onDragOver={handleSubImagesDragOver}
                  onDragLeave={handleSubImagesDragLeave}
                  onClick={() => subImagesInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={subImagesInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleSubImagesSelect}
                  />
                  <p>📁 {t('admin.packagesPage.dropImages')}</p>
                </div>
                {formData.subimages.length > 0 && (
                  <div className={styles.imageGrid}>
                    {formData.subimages.map((img, index) => (
                      <div key={index} className={styles.gridImagePreview}>
                        <img src={img} alt={`Sub ${index + 1}`} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                        <button 
                          type="button" 
                          className={styles.removeImage}
                          onClick={() => removeArrayImage('subimages', index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>{t('admin.packagesPage.galleryImages')}</label>
                <div 
                  className={`${styles.dropzone} ${dragOver.gallery ? styles.dragOver : ''}`}
                  onDrop={handleGalleryDrop}
                  onDragOver={handleGalleryDragOver}
                  onDragLeave={handleGalleryDragLeave}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={galleryInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleGallerySelect}
                  />
                  <p>📁 {t('admin.packagesPage.dropImages')}</p>
                </div>
                {formData.gallery.length > 0 && (
                  <div className={styles.imageGrid}>
                    {formData.gallery.map((img, index) => (
                      <div key={index} className={styles.gridImagePreview}>
                        <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" onError={(e) => e.target.style.display = 'none'} />
                        <button 
                          type="button" 
                          className={styles.removeImage}
                          onClick={() => removeArrayImage('gallery', index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  {t('admin.cancel')}
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? t('admin.saving') : editingPackage ? t('admin.update') : t('admin.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;

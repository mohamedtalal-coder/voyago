import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiClock, FiX, FiEye, FiDownload, FiUsers, FiMapPin, FiPackage } from 'react-icons/fi';
import { useAuthStore } from '../../../../store/auth/useAuthStore';
import useUserTicketsStore from '../../../../store/tickets/useUserTicketsStore';
import { getTourPackages, getServices } from '../../../packages/api/packagesAPI';
import styles from './UserBookings.module.css';
import { getImageUrl, handleImageError } from '../../../../lib/imageUtils';

const UserBookings = () => {
  const { t } = useTranslation(['dashboard', 'packages', 'bikeBooking', 'home']);
  const user = useAuthStore((state) => state.user);
  const getUserTickets = useUserTicketsStore((state) => state.getUserTickets);
  const cancelTicket = useUserTicketsStore((state) => state.cancelTicket);
  
  const [cancelModal, setCancelModal] = useState({ open: false, ticket: null });
  const [detailsModal, setDetailsModal] = useState({ open: false, ticket: null });
  const [tours, setTours] = useState([]);
  const [services, setServices] = useState([]);
  
  // Fetch tours and services
  useEffect(() => {
    async function fetchData() {
      try {
        const [toursData, servicesData] = await Promise.all([
          getTourPackages(),
          getServices()
        ]);
        setTours(toursData);
        setServices(servicesData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);
  
  // Get tickets for current user (this also auto-updates past tickets to 'ended')
  const userTickets = user?.email ? getUserTickets(user.email) : [];

  // Get tour image from tours data
  const getTourImage = (tourId) => {
    const tour = tours.find((t) => t._id === tourId || t.id === tourId);
    if (tour?.img) {
      return getImageUrl(tour.img, 'package');
    }
    return getImageUrl(null, 'package');
  };

  // Get booking name (handles both tours and services)
  const getBookingName = (ticket) => {
    // If tourName is a translation key with namespace (e.g., 'packages:tours.luccaBike.title' or 'home:package1_title')
    if (ticket.tourName && ticket.tourName.includes(':')) {
      const translated = t(ticket.tourName);
      // If translation found (not same as key), return it
      if (translated !== ticket.tourName) {
        return translated;
      }
    }
    
    // Try with different namespaces if no namespace specified
    if (ticket.tourName && !ticket.tourName.includes(':')) {
      // Try home namespace first
      const homeTranslation = t(`home:${ticket.tourName}`);
      if (homeTranslation !== `home:${ticket.tourName}`) {
        return homeTranslation;
      }
      // Try packages namespace
      const packagesTranslation = t(`packages:${ticket.tourName}`);
      if (packagesTranslation !== `packages:${ticket.tourName}`) {
        return packagesTranslation;
      }
    }
    
    // Try to find the tour in database and get its translated title
    if (ticket.tourId) {
      const tour = tours.find(t => t._id === ticket.tourId || t.id === ticket.tourId);
      if (tour?.titleKey) {
        return t(tour.titleKey);
      }
    }
    
    // Fallback to the raw name
    return ticket.tourName || t('dashboard:tickets.unknownTour', 'Unknown Tour');
  };

  // Get service type label
  const getServiceTypeLabel = (ticket) => {
    if (!ticket.serviceType) return null;
    // Try various translation namespaces
    const translationKeys = [
      `bikeBooking:bikeTypes.${ticket.serviceType}`,
      `bikeBooking:tourTypes.${ticket.serviceType}`,
      `bikeBooking:hillTypes.${ticket.serviceType}`,
      `bikeBooking:transportTypes.${ticket.serviceType}`,
      `bikeBooking:carTypes.${ticket.serviceType}`,
      `bikeBooking:wineTypes.${ticket.serviceType}`,
    ];
    
    for (const key of translationKeys) {
      const translated = t(key, { defaultValue: '' });
      if (translated && translated !== key) return translated;
    }
    return ticket.serviceType.charAt(0).toUpperCase() + ticket.serviceType.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'paypal':
        return <span className={styles.paypalIcon}>P</span>;
      case 'visa':
      case 'card':
        return <span className={styles.visaIcon}>VISA</span>;
      case 'mastercard':
        return <span className={styles.mcIcon}>MC</span>;
      default:
        return <span className={styles.cardIcon}>💳</span>;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      upcoming: styles.statusUpcoming,
      ended: styles.statusEnded,
      cancelled: styles.statusCancelled,
    };
    
    const statusLabels = {
      upcoming: t('tickets.status.upcoming', 'Upcoming'),
      ended: t('tickets.status.ended', 'Ended'),
      cancelled: t('tickets.status.cancelled', 'Cancelled'),
    };

    return (
      <span className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleCancelClick = (ticket) => {
    setCancelModal({ open: true, ticket });
  };

  const handleConfirmCancel = () => {
    if (cancelModal.ticket) {
      cancelTicket(cancelModal.ticket.id);
    }
    setCancelModal({ open: false, ticket: null });
  };

  const handleViewDetails = (ticket) => {
    setDetailsModal({ open: true, ticket });
  };

  const handleDownloadTicket = (ticket) => {
    // Create a simple text-based ticket
    const ticketContent = `
========================================
        VOYAGO BOOKING CONFIRMATION
========================================

Reference Number: ${ticket.refNumber}

Tour: ${ticket.tourName}
Date: ${formatDate(ticket.date)}
Time: ${ticket.time}

Traveler: ${ticket.traveler?.firstName || ''} ${ticket.traveler?.lastName || ''}
Email: ${ticket.userEmail}

Tickets: 
  Adults: ${ticket.tickets?.adults || 0}
  Children: ${ticket.tickets?.children || 0}
  Infants: ${ticket.tickets?.infants || 0}

Total Paid: €${ticket.total?.toFixed(2) || '0.00'}
Payment Method: ${ticket.paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}

Booked on: ${new Date(ticket.bookedAt).toLocaleDateString()}

========================================
      Thank you for booking with us!
========================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyago-ticket-${ticket.refNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if tour date is in the past
  const isTourPast = (dateString) => {
    if (!dateString) return false;
    const tourDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tourDate < today;
  };

  // Check if cancellation is allowed (tour must be upcoming, not cancelled/ended)
  const canCancel = (ticket) => {
    if (!ticket) return false;
    if (ticket.status === 'cancelled' || ticket.status === 'ended') return false;
    
    // If no date, allow cancel
    if (!ticket.date) return true;
    
    const tourDate = new Date(ticket.date);
    if (isNaN(tourDate.getTime())) return true;
    
    const now = new Date();
    
    // Get tour date at start of day
    const tourDateStart = new Date(tourDate);
    tourDateStart.setHours(0, 0, 0, 0);
    
    // Get today at start of day
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    // Can cancel if tour is today or in the future
    return tourDateStart.getTime() >= todayStart.getTime();
  };

  return (
    <section className={styles.section}>
      <h1 className={styles.pageTitle}>{t('tickets.title', 'My Tickets')}</h1>

      <div className={styles.ticketsTable}>
        {/* Table Header */}
        <div className={styles.tableHeader}>
          <div className={styles.colTour}>{t('tickets.tourName', 'Tour Name')}</div>
          <div className={styles.colPayment}>{t('tickets.paymentMethod', 'Payment Method')}</div>
          <div className={styles.colPrice}>{t('tickets.price', 'Price')}</div>
          <div className={styles.colStatus}>{t('tickets.status.label', 'Status')}</div>
          <div className={styles.colActions}>{t('tickets.actions', 'Actions')}</div>
        </div>

        {/* Tickets List */}
        <div className={styles.ticketsList}>
          {userTickets.length > 0 ? (
            userTickets.map((ticket) => (
              <div key={ticket.id} className={`${styles.ticketRow} ${ticket.status === 'cancelled' ? styles.cancelledRow : ''}`}>
                <div className={styles.colTour}>
                  <div className={styles.tourInfo}>
                    <img
                      src={ticket.tourImage || getTourImage(ticket.tourId)}
                      alt={getBookingName(ticket)}
                      className={styles.tourImage}
                    />
                    <div className={styles.tourDetails}>
                      <h3 className={styles.tourTitle}>
                        {getBookingName(ticket)}
                      </h3>
                      {ticket.bookingType === 'service' && ticket.serviceType && (
                        <span className={styles.serviceType}>
                          <FiPackage size={12} />
                          {getServiceTypeLabel(ticket)}
                          {ticket.serviceDuration && ` • ${ticket.serviceDuration}`}
                          {ticket.serviceQuantity > 1 && ` • x${ticket.serviceQuantity}`}
                        </span>
                      )}
                      <div className={styles.tourMeta}>
                        <span className={styles.metaItem}>
                          <FiCalendar size={14} />
                          {formatDate(ticket.date)}
                        </span>
                        <span className={styles.metaItem}>
                          <FiClock size={14} />
                          {ticket.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.colPayment}>
                  <div className={styles.paymentMethod}>
                    {getPaymentIcon(ticket.paymentMethod)}
                    <span>
                      {ticket.paymentMethod === 'paypal' ? 'Paypal' : 'Credit Card'}
                    </span>
                  </div>
                </div>
                <div className={styles.colPrice}>
                  <span className={styles.price}>€{ticket.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className={styles.colStatus}>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className={styles.colActions}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleViewDetails(ticket)}
                      title={t('tickets.viewDetails', 'View Details')}
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleDownloadTicket(ticket)}
                      title={t('tickets.download', 'Download Ticket')}
                    >
                      <FiDownload size={16} />
                    </button>
                    {canCancel(ticket) && (
                      <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        onClick={() => handleCancelClick(ticket)}
                        title={t('tickets.cancel', 'Cancel Booking')}
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noTickets}>
              <p>{t('tickets.noTickets', "You don't have any tickets yet")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal.open && (
        <div className={styles.modalOverlay} onClick={() => setCancelModal({ open: false, ticket: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t('tickets.cancelModal.title', 'Cancel Booking')}</h3>
              <button
                className={styles.modalClose}
                onClick={() => setCancelModal({ open: false, ticket: null })}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{t('tickets.cancelModal.message', 'Are you sure you want to cancel this booking?')}</p>
              <div className={styles.cancelTourInfo}>
                <strong>{cancelModal.ticket?.tourName}</strong>
                <span>{formatDate(cancelModal.ticket?.date)} • {cancelModal.ticket?.time}</span>
              </div>
              <p className={styles.cancelWarning}>
                {t('tickets.cancelModal.warning', 'This action cannot be undone. Refund may take 5-7 business days.')}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={() => setCancelModal({ open: false, ticket: null })}
              >
                {t('tickets.cancelModal.keep', 'Keep Booking')}
              </button>
              <button
                className={styles.modalBtnDanger}
                onClick={handleConfirmCancel}
              >
                {t('tickets.cancelModal.confirm', 'Yes, Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {detailsModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDetailsModal({ open: false, ticket: null })}>
          <div className={`${styles.modal} ${styles.detailsModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{t('tickets.detailsModal.title', 'Booking Details')}</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDetailsModal({ open: false, ticket: null })}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsCard}>
                <img
                  src={detailsModal.ticket?.tourImage || getTourImage(detailsModal.ticket?.tourId)}
                  alt={detailsModal.ticket?.tourName}
                  className={styles.detailsImage}
                />
                <div className={styles.detailsContent}>
                  <h4>{detailsModal.ticket?.tourName}</h4>
                  {getStatusBadge(detailsModal.ticket?.status)}
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('tickets.refNumber', 'Reference')}</span>
                  <span className={styles.detailValue}>{detailsModal.ticket?.refNumber}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('tickets.date', 'Date')}</span>
                  <span className={styles.detailValue}>{formatDate(detailsModal.ticket?.date)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('tickets.time', 'Time')}</span>
                  <span className={styles.detailValue}>{detailsModal.ticket?.time}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('tickets.traveler', 'Traveler')}</span>
                  <span className={styles.detailValue}>
                    {detailsModal.ticket?.traveler?.firstName} {detailsModal.ticket?.traveler?.lastName}
                  </span>
                </div>
              </div>

              <div className={styles.ticketsSummary}>
                <h5><FiUsers size={16} /> {t('tickets.guests', 'Guests')}</h5>
                <div className={styles.guestsList}>
                  {detailsModal.ticket?.tickets?.adults > 0 && (
                    <span>Adults: {detailsModal.ticket.tickets.adults}</span>
                  )}
                  {detailsModal.ticket?.tickets?.children > 0 && (
                    <span>Children: {detailsModal.ticket.tickets.children}</span>
                  )}
                  {detailsModal.ticket?.tickets?.infants > 0 && (
                    <span>Infants: {detailsModal.ticket.tickets.infants}</span>
                  )}
                </div>
              </div>

              <div className={styles.totalSection}>
                <span>{t('tickets.totalPaid', 'Total Paid')}</span>
                <span className={styles.totalAmount}>€{detailsModal.ticket?.total?.toFixed(2)}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalBtnSecondary}
                onClick={() => handleDownloadTicket(detailsModal.ticket)}
              >
                <FiDownload size={16} />
                {t('tickets.download', 'Download')}
              </button>
              {canCancel(detailsModal.ticket) && (
                <button
                  className={styles.modalBtnDanger}
                  onClick={() => {
                    setDetailsModal({ open: false, ticket: null });
                    handleCancelClick(detailsModal.ticket);
                  }}
                >
                  <FiX size={16} />
                  {t('tickets.cancel', 'Cancel Booking')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserBookings;

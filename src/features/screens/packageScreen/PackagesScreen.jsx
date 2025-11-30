import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row } from 'react-bootstrap';

import { getTourPackages, getServices } from '../../packages/api/packagesAPI.js';
import PackageCard from '../../packages/components/PackageCard/PackageCard.jsx';
import PackageServices from '../../packages/components/PackageServices/PackageServices.jsx';
import ServiceBookingForm from '../../../components/ServiceBookingForm/ServiceBookingForm.jsx';

export default function PackagesPage() {
  const { t } = useTranslation(['packages', 'common', 'home']);
  const [tourList, setTourList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tours, services] = await Promise.all([
          getTourPackages(),
          getServices()
        ]);
        setTourList(tours);
        setServiceList(services);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <Container className="py-5">
        <h2 className="fw-bold mb-4">{t('packages:pageTitle')}</h2>

        <Row className="g-4">
          {tourList.map((tour, index) => (
            <PackageCard key={tour._id} tour={tour} index={index} />
          ))}
        </Row>
      </Container>

      {/* Services Section */}
      <PackageServices services={serviceList} />

      {/* Service Booking Form */}
      <ServiceBookingForm />
    </div>
  );
}

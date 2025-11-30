import React from "react";
import HeroSection from "../../home/components/HeroSection/HeroSection";
import PopularDestinations from "../../home/components/PopularDestinations/PopularDestinations";
import SpecialOffers from "../../home/components/SpecialOffers/SpecialOffers";
import ExploreCategories from "../../home/components/ExploreCategories/ExploreCategories";
import PopularTransport from "../../home/components/PopularTransport/PopularTransport";
import TravelTips from "../../home/components/TravelTips/TravelTips";
import BikeBookingForm from "../../../components/BikeBookingForm/BikeBookingForm.jsx";
import styles from "./HomeScreen.module.css";
import Reviews from "../../reviews/components/Reviews/Reviews.jsx";

export default function HomePage() {
  return (
    <div className={styles.HomePage}>
      <HeroSection />
      <PopularDestinations />
      <SpecialOffers />
      <ExploreCategories />
      <PopularTransport />
      <BikeBookingForm />
      <TravelTips />
      <Reviews/>
    </div>
  );
}

import React from "react";
import AboutHero from "../../about/components/AboutHero/AboutHero";
import AboutStats from "../../about/components/AboutStats/AboutStats";
import AboutFeatures from "../../about/components/AboutFeatures/AboutFeatures";
import Reviews from '../../reviews/components/Reviews/Reviews';

const AboutPage = () => {
  return (
    <div className="AboutPage">
      <AboutHero />
      <AboutStats />
      <AboutFeatures />
<br />
<br />
<br />
<br />
<br />
    <Reviews /> 
    </div>
  );
};

export default AboutPage;

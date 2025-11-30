// src/components/Footer/Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* --- Services Column --- */}
          <div className={styles.col}>
            <h5>{t("services")}</h5>
            <ul>
              <li>
                <Link to="/services/bike-rickshaw">{t("bikeRickshaw")}</Link>
              </li>
              <li>
                <Link to="/services/guided-tours">{t("guidedTours")}</Link>
              </li>
              <li>
                <Link to="/services/bike-tour">{t("bikeTour")}</Link>
              </li>
              <li>
                <Link to="/services/tuscan-hills">{t("tuscanHills")}</Link>
              </li>
              <li>
                <Link to="/services/transportation">{t("transportation")}</Link>
              </li>
              <li>
                <Link to="/services/wine-tours">{t("wineTours")}</Link>
              </li>
            </ul>
          </div>

          {/* --- Home Column --- */}
          <div className={styles.col}>
            <h5>{t("navigation")}</h5>
            <ul>
              <li>
                <Link to="/">{t("home")}</Link>
              </li>
              <li>
                <Link to="/about">{t("aboutUs")}</Link>
              </li>
              <li>
                <Link to="/packages">{t("tourPackages")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("contactUs")}</Link>
              </li>
              <li>
                <Link to="/faq">{t("faq")}</Link>
              </li>
            </ul>
          </div>

          {/* --- Help Column --- */}
          <div className={styles.col}>
            <h5>{t("help")}</h5>
            <ul>
              <li>
                <Link to="/terms">{t("termsOfUse")}</Link>
              </li>
              <li>
                <Link to="/privacy">{t("privacyPolicy")}</Link>
              </li>
              <li>
                <Link to="/faq">{t("faq")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("support")}</Link>
              </li>
            </ul>
          </div>

          {/* --- Contacts Column --- */}
          <div className={`${styles.col} ${styles.colContact}`}>
            <h5>{t("contacts")}</h5>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactIcon}>
                  <FiMapPin size={16} />
                </span>
                {t("address")}
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <FiPhone size={16} />
                </span>
                <a href="tel:+20 111 893 6100" dir="ltr">+20 111 893 6100</a>
              </li>
              <li>
                <span className={styles.contactIcon}>
                  <FiMail size={16} />
                </span>
                <a href="mailto:voyagodepi@gmail.com">{t("email")}</a>
              </li>
            </ul>
          </div>

          {/* --- Social Media Column --- */}
          <div className={styles.col}>
            <h5>{t("socialMedia")}</h5>
            <div className={styles.socials}>
              <a
                className={styles.socialBtn}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="twitter"
              >
                <FaTwitter />
              </a>
              <a
                className={styles.socialBtn}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="facebook"
              >
                <FaFacebookF />
              </a>
              <a
                className={styles.socialBtn}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.copyright}>
          <p>{t("copyright")}</p>
          <div className={styles.copyrightLinks}>
            <Link to="/privacy">{t("privacy")}</Link>
            <span>•</span>
            <Link to="/terms">{t("terms")}</Link>
            <span>•</span>
            <Link to="/faq">{t("faq")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

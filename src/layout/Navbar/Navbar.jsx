import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import logoImage from "../../assets/icons/logo.svg";
import { NavLink, Link, } from "react-router-dom";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggler from "../../components/ThemeToggler/ThemeToggler";
import { useTranslation } from "react-i18next";
import useMediaQuery from "../../hooks/useMediaQuery";
import useAppStore from "../../store/auth/useAppStore";
import { useAuthStore } from "../../store/auth/useAuthStore";
import Button from "../../components/Button/Button";
import UserAccountButton from "../../features/auth/components/UserAccountButton/UserAccountButton";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

const Navbar = () => {
  const { t, i18n } = useTranslation("navbar");
  const { openAuthModal } = useAppStore();
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("preferredLang") || "Eng"
  );

  const langRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 991px)");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLangSelect = (langCode, langLabel) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLang", langLabel);
    setSelectedLang(langLabel);
    setIsLangOpen(false);
    closeMenu();
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangOpen]);

  // Extract nav content to avoid duplication between mobile/desktop
  const navContent = (
    <>
      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.active)
            }
            onClick={closeMenu}
          >
            {({ isActive }) => (
              <>
                {" "}
                {t("home")}{" "}
                {isActive && (
                  <motion.div
                    className={styles.underline}
                    layoutId="magic-underline"
                  />
                )}{" "}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.active)
            }
            onClick={closeMenu}
          >
            {({ isActive }) => (
              <>
                {" "}
                {t("about")}{" "}
                {isActive && (
                  <motion.div
                    className={styles.underline}
                    layoutId="magic-underline"
                  />
                )}{" "}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/packages"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.active)
            }
            onClick={closeMenu}
          >
            {({ isActive }) => (
              <>
                {" "}
                {t("packages")}{" "}
                {isActive && (
                  <motion.div
                    className={styles.underline}
                    layoutId="magic-underline"
                  />
                )}{" "}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              clsx(styles.navLink, isActive && styles.active)
            }
            onClick={closeMenu}
          >
            {({ isActive }) => (
              <>
                {" "}
                {t("contact")}{" "}
                {isActive && (
                  <motion.div
                    className={styles.underline}
                    layoutId="magic-underline"
                  />
                )}{" "}
              </>
            )}
          </NavLink>
        </li>
      </ul>

      <div className={styles.navRight}>
        <div className={styles.langContainer} ref={langRef}>
          <button
            className={styles.langSwitcher}
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            {selectedLang} <span>{isLangOpen ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                className={styles.langDropdown}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <button
                  className={styles.langOption}
                  onClick={() => handleLangSelect("en", "Eng")}
                >
                  {t("langEn")}
                </button>
                <button
                  className={styles.langOption}
                  onClick={() => handleLangSelect("ar", "Ar")}
                >
                  {t("langAr")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!user ? (
          <>
            <Link
              className={styles.loginLink}
              onClick={() => {
                openAuthModal("login");
                closeMenu();
              }}
            >
              {t("login")}
            </Link>
            <Button variant="primary" size="small" onClick={() => {
                openAuthModal("register");
                closeMenu();
              }}> {t("signup")} </Button>
          </>
        ) : (
          <UserAccountButton />
        )}
        <ThemeToggler />
      </div>
    </>
  );

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoContainer} onClick={closeMenu}>
        <img src={logoImage} alt="Voyago Logo" className={styles.logoIcon} loading="eager" />
      </Link>

      <button className={styles.navbarToggler} onClick={toggleMenu}>
        {isMenuOpen ? <span>&times;</span> : <span>&#9776;</span>}
      </button>

      {isMobile ? (
        // Animated mobile menu
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={styles.navCollapse}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {navContent}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        // Static desktop menu
        <div className={styles.navCollapse}>{navContent}</div>
      )}
    </nav>
  );
};

export default Navbar;

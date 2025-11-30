import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth/useAuthStore";
import UserProfile from "../../dashboard/components/UserProfile/UserProfile";
import UserBookings from "../../dashboard/components/UserBookings/UserBookings";
import PopularDestinations from "../../home/components/PopularDestinations/PopularDestinations";
import styles from "./Dashboard.module.css";

const DashboardScreen = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Redirect if not logged in
  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardSection}>
        <UserProfile />
        <UserBookings />
      </div>
      <PopularDestinations />
    </div>
  );
};

export default DashboardScreen;

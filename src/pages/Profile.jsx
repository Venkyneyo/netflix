import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Profile.module.css";

function Profile() {
  const { currentUser, updateCurrentUserName } = useAuth();
  const [name, setName] = useState(currentUser?.fullName || "");
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.text}>No profile loaded.</p>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setMessage("Name should be at least 2 characters.");
      return;
    }
    updateCurrentUserName(trimmed);
    setMessage("Profile updated.");
    setTimeout(() => setMessage(""), 1200);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.section}>
          <h1 className={styles.title}>Your profile</h1>
          <p className={styles.subtitle}>
            Manage your account information and see your subscription details.
          </p>

          <form onSubmit={handleSave} className={styles.form}>
            <label className={styles.label}>
              <span>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </label>
            <div className={styles.row}>
              <label className={styles.label}>
                <span>Gmail</span>
                <input
                  type="text"
                  value={currentUser.email || "-"}
                  disabled
                  className={`${styles.input} ${styles.inputReadonly}`}
                />
              </label>
              <label className={styles.label}>
                <span>Phone</span>
                <input
                  type="text"
                  value={currentUser.phone || "-"}
                  disabled
                  className={`${styles.input} ${styles.inputReadonly}`}
                />
              </label>
            </div>
            <button type="submit" className={styles.saveButton}>
              Save changes
            </button>
            {message && <div className={styles.message}>{message}</div>}
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription</h2>
          <p className={styles.text}>
            CineScope is currently running in demo mode. Choose a plan below to
            see how subscription tiers could look.
          </p>
          <div className={styles.plans}>
            <div className={`${styles.plan} ${styles.planCurrent}`}>
              <h3 className={styles.planName}>Free Demo</h3>
              <p className={styles.planPrice}>₹0 / month</p>
              <ul className={styles.planFeatures}>
                <li>Stream trailers and browse catalog</li>
                <li>Single device</li>
                <li>Ads may be shown</li>
              </ul>
              <div className={styles.planBadge}>Current plan</div>
            </div>
            <div className={styles.plan}>
              <h3 className={styles.planName}>Standard</h3>
              <p className={styles.planPrice}>₹399 / month</p>
              <ul className={styles.planFeatures}>
                <li>Full HD (1080p)</li>
                <li>2 devices at the same time</li>
                <li>Ad-free experience</li>
              </ul>
            </div>
            <div className={styles.plan}>
              <h3 className={styles.planName}>Premium</h3>
              <p className={styles.planPrice}>₹649 / month</p>
              <ul className={styles.planFeatures}>
                <li>4K + HDR</li>
                <li>4 devices at the same time</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;


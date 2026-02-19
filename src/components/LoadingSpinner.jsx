import React from "react";
import styles from "./LoadingSpinner.module.css";

// Simple circular loading spinner
function LoadingSpinner() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.spinner} aria-label="Loading" />
    </div>
  );
}

export default LoadingSpinner;


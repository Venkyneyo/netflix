import React from "react";
import styles from "./ErrorMessage.module.css";

// Generic error display for API failures
function ErrorMessage({ title = "Something went wrong", message }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>
          {message || "Please try again in a moment."}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;


import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";

const isGmailOrPhone = (value) => {
  const v = (value || "").trim();
  const gmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v.toLowerCase());
  const phone = /^[6-9]\d{9}$/.test(v);
  return gmail || phone;
};

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your Gmail/phone and password.");
      return;
    }
    if (!isGmailOrPhone(identifier)) {
      setError("Enter a valid Gmail address or a valid 10-digit phone number.");
      return;
    }
    const result = login(identifier.trim(), password);
    if (result.ok) {
      navigate("/profile", { replace: true });
    } else {
      setError(result.message || "Login failed.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>CineScope</div>
        <Link className={styles.headerLink} to="/register">
          Create account
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            Sign in with your registered Gmail address or phone number.
          </p>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Gmail or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={styles.input}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoComplete="current-password"
            />
            <button type="submit" className={styles.submit}>
              Sign In
            </button>
          </form>
          <p className={styles.hint}>
            New here?{" "}
            <Link className={styles.link} to="/register">
              Create an account
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;

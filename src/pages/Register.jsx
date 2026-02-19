import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Register.module.css";

const isGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
const isPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
const isStrongPassword = (pw) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pw);

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const rules = useMemo(
    () => [
      "Full name is required",
      "Use a Gmail address (ends with @gmail.com) OR a valid 10-digit phone number",
      "Password must be 8+ chars, include uppercase, lowercase, number, and special character",
      "Confirm password must match",
    ],
    []
  );

  const validate = () => {
    const nameOk = fullName.trim().length >= 2;
    const emailVal = email.trim().toLowerCase();
    const phoneVal = phone.trim();

    const emailOk = emailVal ? isGmail(emailVal) : false;
    const phoneOk = phoneVal ? isPhone(phoneVal) : false;

    if (!nameOk) return "Please enter your full name.";
    if (!emailOk && !phoneOk)
      return "Enter a valid Gmail address or a valid 10-digit phone number.";
    if (emailVal && !emailOk)
      return "Email must be a valid Gmail address (example@gmail.com).";
    if (phoneVal && !phoneOk)
      return "Phone must be a valid 10-digit number (India format).";
    if (!isStrongPassword(password))
      return "Password must be strong (8+ chars with A-Z, a-z, number, special).";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const result = register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
    });

    if (!result.ok) {
      setError(result.message || "Registration failed.");
      return;
    }

    setSuccess("Registered successfully. Please sign in.");
    setTimeout(() => navigate("/login"), 600);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>CineScope</div>
        <Link className={styles.headerLink} to="/login">
          Sign In
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create your account</h1>

          <ul className={styles.rules}>
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              autoComplete="name"
            />

            <div className={styles.split}>
              <input
                type="email"
                placeholder="Gmail (example@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                autoComplete="email"
              />
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                autoComplete="tel"
              />
            </div>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              autoComplete="new-password"
            />

            <button type="submit" className={styles.submit}>
              Register
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link className={styles.link} to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;


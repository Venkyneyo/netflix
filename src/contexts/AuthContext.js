import React, { createContext, useContext, useEffect, useState } from "react";

const AUTH_KEY = "cinescope_auth";
const USERS_KEY = "cinescope_users";

const AuthContext = createContext(null);

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(loadUsers());
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const register = ({ fullName, email, phone, password }) => {
    const next = loadUsers();

    const normalizedEmail = email ? email.trim().toLowerCase() : "";
    const normalizedPhone = phone ? phone.trim() : "";

    const emailTaken =
      normalizedEmail &&
      next.some((u) => (u.email || "").toLowerCase() === normalizedEmail);
    const phoneTaken =
      normalizedPhone && next.some((u) => (u.phone || "") === normalizedPhone);

    if (emailTaken || phoneTaken) {
      return { ok: false, message: "Account already exists for this email/phone." };
    }

    const user = {
      id: `${Date.now()}`,
      fullName: (fullName || "").trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password, // Demo only. Do NOT store plaintext passwords in real apps.
      createdAt: new Date().toISOString(),
    };

    next.unshift(user);
    saveUsers(next);
    setUsers(next);
    return { ok: true };
  };

  const login = (identifier, password) => {
    const id = (identifier || "").trim();
    const normalizedEmail = id.toLowerCase();
    const normalizedPhone = id;

    const existingUsers = loadUsers();
    const user = existingUsers.find((u) => {
      const emailMatch =
        u.email && u.email.toLowerCase() === normalizedEmail;
      const phoneMatch = u.phone && u.phone === normalizedPhone;
      return emailMatch || phoneMatch;
    });

    if (!user) {
      return { ok: false, message: "No account found. Please register first." };
    }

    if ((user.password || "") !== password) {
      return { ok: false, message: "Incorrect password." };
    }

    localStorage.setItem(AUTH_KEY, "true");
    setIsAuthenticated(true);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

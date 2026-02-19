import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";

// Protect routes: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Root application shell with routing and shared layout
function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isAuthenticated={isAuthenticated}
                onLogout={logout}
              />
              <main style={{ paddingTop: "64px" }}>
                <Routes>
                  <Route path="/" element={<Home searchQuery={searchQuery} />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;


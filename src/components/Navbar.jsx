import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

// Top navigation bar with logo, search input, and logout
function Navbar({ searchQuery, onSearchChange, isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (sectionId === "home-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogoClick = () => {
    // Clear search when navigating home
    if (onSearchChange) {
      onSearchChange("");
    }
    navigate("/");
    scrollToSection("home-top");
  };

  const handleNavClick = (sectionId) => {
    // Always go to home first, then scroll to the requested section
    if (onSearchChange) {
      onSearchChange("");
    }
    navigate("/");
    // Give React Router a moment to render the home page
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  };

  const handleSearchChange = (event) => {
    if (onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.brand} onClick={handleLogoClick}>
        <div className={styles.logo}>CineScope</div>
      </div>
      <nav className={styles.navLinks}>
        <span
          className={styles.navLink}
          onClick={() => handleNavClick("home-top")}
        >
          Home
        </span>
        <span
          className={styles.navLink}
          onClick={() => handleNavClick("top-rated-section")}
        >
          TV Shows
        </span>
        <span
          className={styles.navLink}
          onClick={() => handleNavClick("popular-section")}
        >
          Movies
        </span>
        <span
          className={styles.navLink}
          onClick={() => handleNavClick("upcoming-section")}
        >
          New &amp; Popular
        </span>
        <span
          className={styles.navLink}
          onClick={() => handleNavClick("my-list-section")}
        >
          My List
        </span>
      </nav>
      <div className={styles.rightSide}>
        <form
          className={styles.searchForm}
          onSubmit={(e) => {
            // Prevent page reload on enter
            e.preventDefault();
          }}
        >
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            className={styles.searchInput}
          />
        </form>
        {isAuthenticated && (
          <>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            {onLogout && (
              <button
                type="button"
                className={styles.logoutButton}
                onClick={onLogout}
              >
                Sign Out
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;


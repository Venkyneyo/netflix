import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeroBanner.module.css";
import { getBackdropUrl } from "../services/api";

// Large hero section at the top of the home page
function HeroBanner({ movie }) {
  const navigate = useNavigate();

  if (!movie) {
    return null;
  }

  const yearText = (() => {
    const value = movie.release_date;
    if (!value) return "";
    const match = String(value).match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : String(value).slice(0, 4);
  })();

  const backdropStyle = {
    backgroundImage: `url(${getBackdropUrl(
      movie.backdrop_path || movie.poster_path
    )})`,
  };

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlay = () => {
    const query = encodeURIComponent(
      `${movie.title || movie.name} trailer`
    );
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} style={backdropStyle} />
      <div className={styles.gradientOverlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{movie.title || movie.name}</h1>
        <div className={styles.meta}>
          {yearText && <span>{yearText}</span>}
          {typeof movie.vote_average === "number" && (
            <span className={styles.rating}>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className={styles.overview}>
            {movie.overview.length > 260
              ? `${movie.overview.slice(0, 260)}...`
              : movie.overview}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handlePlay}
          >
            ▶ Play
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleViewDetails}
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;


import React from "react";
import styles from "./MovieCard.module.css";
import { getPosterUrl } from "../services/api";

// Individual movie poster card used inside horizontal rows
function MovieCard({ movie, onClick }) {
  const imageUrl = getPosterUrl(movie.poster_path || movie.backdrop_path);

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <div className={styles.title}>{movie.title || movie.name}</div>
    </div>
  );
}

export default MovieCard;


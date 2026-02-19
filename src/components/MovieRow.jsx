import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieRow.module.css";
import MovieCard from "./MovieCard";

// Horizontally scrollable row of movie cards
function MovieRow({ title, movies }) {
  const navigate = useNavigate();

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.scroller}>
        <div className={styles.track}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieRow;


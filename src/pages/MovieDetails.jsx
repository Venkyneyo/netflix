import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { fetchMovieDetails, getBackdropUrl, getPosterUrl } from "../services/api";
import styles from "./MovieDetails.module.css";

// Parse OMDB language string into array (e.g. "English, Hindi, Tamil" -> ["English","Hindi","Tamil"])
const parseLanguages = (str) =>
  (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Detailed page for a single movie
function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioLang, setAudioLang] = useState("");
  const [subtitleLang, setSubtitleLang] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMovieDetails(id);
        if (!isCancelled) {
          setMovie(data);
          const langs = parseLanguages(data.language);
          if (langs.length > 0) {
            setAudioLang(langs[0]);
            setSubtitleLang(langs[0]);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to load movie details.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropStyle = {
    backgroundImage: `url(${getBackdropUrl(
      movie.backdrop_path || movie.poster_path
    )})`,
  };

  const posterUrl = getPosterUrl(movie.poster_path || movie.backdrop_path);

  const handlePlay = () => {
    const query = encodeURIComponent(
      `${movie.title || movie.name} full movie`
    );
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} style={backdropStyle}>
        <div className={styles.backdropOverlay} />
      </div>

      <Link to="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.contentWrapper}>
        {posterUrl && (
          <div className={styles.posterWrapper}>
            <img
              src={posterUrl}
              alt={movie.title || movie.name}
              className={styles.poster}
            />
          </div>
        )}

        <div className={styles.details}>
          <h1 className={styles.title}>{movie.title || movie.name}</h1>

          <div className={styles.meta}>
            {movie.release_date && <span>{movie.release_date}</span>}
            {typeof movie.vote_average === "number" && (
              <span className={styles.badge}>
                Rating: {movie.vote_average.toFixed(1)} / 10
              </span>
            )}
            {movie.runtime && (
              <span className={styles.badge}>{movie.runtime} min</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.playButton}
              onClick={handlePlay}
            >
              ▶ Play
            </button>
          </div>

          {(() => {
            const langs = parseLanguages(movie.language);
            if (langs.length === 0) return null;
            return (
              <div className={styles.languageSwitch}>
                <h3 className={styles.languageTitle}>Audio & Subtitles</h3>
                <div className={styles.languageRow}>
                  <label className={styles.languageLabel}>
                    <span>Audio</span>
                    <select
                      value={audioLang}
                      onChange={(e) => setAudioLang(e.target.value)}
                      className={styles.languageSelect}
                    >
                      {langs.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.languageLabel}>
                    <span>Subtitles</span>
                    <select
                      value={subtitleLang}
                      onChange={(e) => setSubtitleLang(e.target.value)}
                      className={styles.languageSelect}
                    >
                      {langs.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            );
          })()}

          {movie.overview && (
            <p className={styles.overview}>{movie.overview}</p>
          )}

          <div className={styles.secondaryMeta}>
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <strong>Genres: </strong>
                {movie.genres.map((g) => g.name).join(", ")}
              </div>
            )}
            {movie.language && (
              <div>
                <strong>Language: </strong>
                {movie.language}
              </div>
            )}
            {movie.director && (
              <div>
                <strong>Director: </strong>
                {movie.director}
              </div>
            )}
            {movie.writer && (
              <div>
                <strong>Writer: </strong>
                {movie.writer}
              </div>
            )}
            {movie.actors && (
              <div>
                <strong>Cast: </strong>
                {movie.actors}
              </div>
            )}
            {movie.awards && movie.awards !== "N/A" && (
              <div>
                <strong>Awards: </strong>
                {movie.awards}
              </div>
            )}
            {movie.imdbVotes && (
              <div>
                <strong>IMDb Votes: </strong>
                {movie.imdbVotes}
              </div>
            )}
            {movie.boxOffice && movie.boxOffice !== "N/A" && (
              <div>
                <strong>Box Office: </strong>
                {movie.boxOffice}
              </div>
            )}
            {movie.status && (
              <div>
                <strong>Type: </strong>
                {movie.status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;


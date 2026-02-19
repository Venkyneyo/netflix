import React, { useEffect, useState } from "react";
import HeroBanner from "./HeroBanner";
import styles from "./HeroCarousel.module.css";

// Simple hero carousel that rotates between a list of featured movies
function HeroCarousel({ movies }) {
  const [index, setIndex] = useState(0);

  const items = Array.isArray(movies) ? movies.filter(Boolean) : [];

  useEffect(() => {
    if (!items.length) return undefined;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);

    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  const currentMovie = items[index];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className={styles.carousel}>
      <HeroBanner movie={currentMovie} />
      {items.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={goPrev}
            aria-label="Previous featured title"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={goNext}
            aria-label="Next featured title"
          >
            ›
          </button>
          <div className={styles.dots}>
            {items.map((item, i) => (
              <button
                key={item.id || i}
                type="button"
                className={`${styles.dot} ${
                  i === index ? styles.dotActive : ""
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroCarousel;


import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import HeroCarousel from "../components/HeroCarousel";
import MovieRow from "../components/MovieRow";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import {
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchIndianMovies,
  searchMovies,
} from "../services/api";
import styles from "./Home.module.css";

// Home page displaying hero carousel and multiple movie rows
function Home({ searchQuery }) {
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [indian, setIndian] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch for standard movie lists
  useEffect(() => {
    let isCancelled = false;

    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [upcomingData, topRatedData, popularData, indianData] =
          await Promise.all([
            fetchUpcomingMovies(),
            fetchTopRatedMovies(),
            fetchPopularMovies(),
            fetchIndianMovies(),
          ]);

        if (!isCancelled) {
          setUpcoming(upcomingData);
          setTopRated(topRatedData);
          setPopular(popularData);
          setIndian(indianData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to load movies. Please check your connection.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Dynamic search when the query changes
  useEffect(() => {
    let isCancelled = false;

    const runSearch = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        if (!isCancelled) {
          setSearchResults(results);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Search failed. Please try again.");
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    };

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [searchQuery]);

  const heroSearchMovie =
    searchResults && searchResults.length > 0 ? searchResults[0] : null;

  const featuredMovies = [
    ...(topRated || []),
    ...(popular || []),
    ...(indian || []),
  ].slice(0, 8);

  return (
    <div id="home-top" className={styles.page}>
      {heroSearchMovie ? (
        <HeroBanner movie={heroSearchMovie} />
      ) : (
        <HeroCarousel movies={featuredMovies} />
      )}

      {error && !isLoading && <ErrorMessage message={error} />}

      {(isLoading || isSearching) && <LoadingSpinner />}

      {!isLoading && !isSearching && (
        <div className={styles.rows}>
          {searchQuery && (
            <>
              <h2 className={styles.sectionTitle}>
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              {searchResults.length > 0 ? (
                <MovieRow title="" movies={searchResults} />
              ) : (
                <div className={styles.emptySearch}>
                  No movies found. Try a different search.
                </div>
              )}
            </>
          )}

          {!searchQuery && (
            <>
              <div id="upcoming-section">
                <MovieRow title="Upcoming" movies={upcoming} />
              </div>
              <div id="top-rated-section">
                <MovieRow title="Top Rated" movies={topRated} />
              </div>
              <div id="popular-section">
                <MovieRow title="Popular on Netflix" movies={popular} />
              </div>
              <div id="indian-section">
                <MovieRow title="Indian Movies" movies={indian} />
              </div>
              <section id="my-list-section">
                <h2 className={styles.sectionTitle}>My List</h2>
                <div className={styles.emptySearch}>
                  Your list is empty. This demo does not yet support saving
                  titles.
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;


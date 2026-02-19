import axios from "axios";

// Base configuration for OMDB API
const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

if (!API_KEY) {
  // Helpful runtime warning in development if the key is missing
  // eslint-disable-next-line no-console
  console.warn(
    "REACT_APP_OMDB_API_KEY is not set. Please add it to your .env file."
  );
}

const omdbClient = axios.create({
  baseURL: BASE_URL,
});

const uniqById = (items) => {
  const seen = new Set();
  const out = [];
  (items || []).forEach((item) => {
    const id = item && item.id;
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push(item);
  });
  return out;
};

// Keep only movies that have a poster/backdrop image
const onlyWithImage = (items) =>
  (items || []).filter(
    (m) =>
      m &&
      ((m.poster_path && m.poster_path !== "N/A") ||
        (m.backdrop_path && m.backdrop_path !== "N/A"))
  );

// Normalize OMDB search item into the shape used across the app
const normalizeSearchItem = (item) => ({
  id: item.imdbID,
  title: item.Title,
  name: item.Title,
  poster_path: item.Poster && item.Poster !== "N/A" ? item.Poster : "",
  backdrop_path: item.Poster && item.Poster !== "N/A" ? item.Poster : "",
  release_date: item.Year,
});

// Normalize OMDB full movie details into the shape used across the app
const normalizeDetails = (data) => ({
  id: data.imdbID,
  title: data.Title,
  name: data.Title,
  poster_path: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
  backdrop_path: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
  release_date:
    (data.Released && data.Released !== "N/A" && data.Released) || data.Year,
  vote_average:
    data.imdbRating && data.imdbRating !== "N/A"
      ? Number.parseFloat(data.imdbRating)
      : null,
  runtime:
    data.Runtime && data.Runtime !== "N/A"
      ? Number.parseInt(data.Runtime, 10)
      : null,
  overview: data.Plot && data.Plot !== "N/A" ? data.Plot : "",
  genres:
    data.Genre && data.Genre !== "N/A"
      ? data.Genre.split(",").map((g) => ({ name: g.trim() }))
      : [],
  status: data.Type ? data.Type.toUpperCase() : "",
  language: data.Language || "",
  director: data.Director || "",
  writer: data.Writer || "",
  actors: data.Actors || "",
  awards: data.Awards || "",
  imdbVotes: data.imdbVotes || "",
  boxOffice: data.BoxOffice || "",
});

// Safely build poster URL (OMDB already returns a full URL)
export const getPosterUrl = (url) =>
  url && url !== "N/A" ? url : "";

// Safely build backdrop URL (we reuse the poster as a backdrop fallback)
export const getBackdropUrl = (url) =>
  url && url !== "N/A" ? url : "";

const fetchSearchPage = async (term, { year, page = 1 } = {}) => {
  const response = await omdbClient.get("/", {
    params: {
      apikey: API_KEY,
      s: term,
      type: "movie",
      page,
      ...(year ? { y: year } : {}),
    },
  });

  const data = response.data;
  if (data.Response === "False") {
    return [];
  }

  return (data.Search || []).map(normalizeSearchItem);
};

// "Upcoming" movies – multiple recent years and pages
export const fetchUpcomingMovies = async () => {
  const years = ["2024", "2023", "2025"];
  const pages = [1, 2, 3];
  const pageResults = await Promise.all(
    years.flatMap((y) => pages.map((p) => fetchSearchPage(y, { year: y, page: p })))
  );
  return onlyWithImage(uniqById(pageResults.flat()));
};

// "Top rated" movies – award-related terms and pages
export const fetchTopRatedMovies = async () => {
  const terms = ["oscar", "academy", "best picture", "award"];
  const pages = [1, 2, 3];
  const pageResults = await Promise.all(
    terms.flatMap((t) => pages.map((p) => fetchSearchPage(t, { page: p })))
  );
  return onlyWithImage(uniqById(pageResults.flat()));
};

// "Popular" movies – franchise/brand terms and pages
export const fetchPopularMovies = async () => {
  const terms = ["marvel", "batman", "disney", "star wars", "harry potter", "avengers"];
  const pages = [1, 2, 3];
  const pageResults = await Promise.all(
    terms.flatMap((t) => pages.map((p) => fetchSearchPage(t, { page: p })))
  );
  return onlyWithImage(uniqById(pageResults.flat()));
};

// Indian movies – approximated using an India-related keyword
export const fetchIndianMovies = async () => {
  // OMDB doesn't support a true "country=India" filter for discovery.
  // So we widen coverage with multiple India-related search terms and pages.
  const terms = [
    "bollywood",
    "hindi",
    "telugu",
    "tamil",
    "malayalam",
    "kannada",
    "punjabi",
    "india",
  ];
  const pages = [1, 2, 3];

  const pageResults = await Promise.all(
    terms.flatMap((term) =>
      pages.map((page) => fetchSearchPage(term, { page }))
    )
  );

  return onlyWithImage(uniqById(pageResults.flat()));
};

// Search movies dynamically from the search bar
export const searchMovies = async (query) => {
  const response = await omdbClient.get("/", {
    params: {
      apikey: API_KEY,
      s: query,
      type: "movie",
    },
  });

  const data = response.data;

  if (data.Response === "False") {
    throw new Error(data.Error || "Search failed");
  }

  return onlyWithImage((data.Search || []).map(normalizeSearchItem));
};

// Fetch full details for a single movie by IMDb ID
export const fetchMovieDetails = async (id) => {
  const response = await omdbClient.get("/", {
    params: {
      apikey: API_KEY,
      i: id,
      plot: "full",
    },
  });

  const data = response.data;

  if (data.Response === "False") {
    throw new Error(data.Error || "Failed to fetch movie details");
  }

  return normalizeDetails(data);
};


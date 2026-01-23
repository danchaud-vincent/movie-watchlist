import { CONFIG } from '/config/main-config.js';

const STORAGE_MOVIES_KEY = 'movies';

// ----- LOCAL STORAGE FUNCTIONS -----
export function loadMovies() {
  try {
    const data = localStorage.getItem(STORAGE_MOVIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error when loading movies data:', error.message);
  }
}

export function saveMovies(movies) {
  localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(movies));
}

export function clearMovies() {
  const movies = [];
  saveMovies(movies);
}

export function getMovieByIdFromStorage(movieId) {
  // Get the movies
  const movies = loadMovies();

  return movies.find((movie) => movie.imdbID === movieId) || null;
}

export function mergeMoviesWithWatchlist(moviesOMDB, watchlist) {
  const movies = moviesOMDB.map((movie) => {
    return {
      ...movie,
      isSubscribed: watchlist.some((subscription) => {
        return subscription.imdbID === movie.imdbID;
      }),
    };
  });

  // save in localstorage
  saveMovies(movies);

  return movies;
}

// ----- API FUNCTIONS -----
export async function getMoviesWithDetailsBySearch(query) {
  try {
    const searchMovie = encodeURIComponent(query);
    const url = `https://www.omdbapi.com/?s=${searchMovie}&type=movie&apikey=${CONFIG.OMDB_API_KEY}`;
    const data = await fetchJSON(url);

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    // fetch the data with more details
    const moviesWithDetails = await fetchMoviesWithDetails(data.Search);

    return moviesWithDetails;
  } catch (err) {
    console.error(`getMoviesBySearch(${query}):`, err.message);

    return [];
  }
}

async function fetchMoviesWithDetails(moviesOMDB) {
  const moviesPromises = moviesOMDB.map((movie) => getMovieById(movie.imdbID));
  const movies = Promise.all(moviesPromises);

  return movies;
}

export async function getMovieById(movieId) {
  try {
    const url = `https://www.omdbapi.com/?i=${movieId}&type=movie&plot=full&apikey=${CONFIG.OMDB_API_KEY}`;
    const data = await fetchJSON(url);

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    return data;
  } catch (err) {
    console.error(`getMovieById(${movieId}):`, err.message);

    return null;
  }
}

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error(`Network error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error('Error :', err.message);
  }
}

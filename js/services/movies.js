import { CONFIG } from '/config/main-config.js';

const STORAGE_MOVIES_KEY = 'movies';

let movies = [];

export function loadMovies() {
  return JSON.parse(localStorage.getItem(STORAGE_MOVIES_KEY)) || [];
}

export function saveMovies(movies) {
  localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(movies));
}

export function clearMovies() {
  movies = [];
  saveMovies(movies);
}

export async function forkJoinMovies(moviesOMDB, watchlist) {}

export async function getMoviesWithDetailsBySearch(movie) {
  try {
    const searchMovieTemplate = movie.trim().replaceAll(' ', '+');

    const baseURL = `https://www.omdbapi.com/?s=${searchMovieTemplate}&type=movie&apikey=${CONFIG.OMDB_API_KEY}`;
    const response = await fetch(baseURL);
    const data = await response.json();

    if (!response.ok) {
      throw Error('Network error');
    }

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    // fetch the data with more details
    const moviesWithDetails = await fetchMoviesWithDetails(data.Search);

    return moviesWithDetails;
  } catch (err) {
    console.error(`getMoviesBySearch(${movie}):`, err.message);

    return [];
  }
}

async function fetchMoviesWithDetails(moviesOMDB) {
  const moviesPromises = moviesOMDB.map((movie) => getMovieById(movie.imdbID));
  const movies = Promise.all(moviesPromises);

  return movies;
}

async function getMovieById(movieId) {
  try {
    const baseURL = `https://www.omdbapi.com/?i=${movieId}&type=movie&plot=full&apikey=${CONFIG.OMDB_API_KEY}`;
    const response = await fetch(baseURL);
    const data = await response.json();

    if (!response.ok) {
      throw Error('Network error');
    }

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    return data;
  } catch (err) {
    console.error(`getMovieById(${movieId}):`, err.message);

    return null;
  }
}

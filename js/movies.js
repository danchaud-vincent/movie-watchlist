import { CONFIG } from '/config/main-config.js';

export async function setMoviesInformation(moviesOMDB) {
  const moviesPromises = moviesOMDB.map((movie) => getMovieById(movie.imdbID));

  const movies = Promise.all(moviesPromises);

  return movies;
}

export async function getMoviesBySearch(movie) {
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

    return data.Search;
  } catch (err) {
    console.error(`getMoviesBySearch(${movie}):`, err.message);

    return [];
  }
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

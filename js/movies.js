import { CONFIG } from '/config/main-config.js';

export async function getMoviesBySearch(movie) {
  try {
    const searchMovieTemplate = movie.trim().replaceAll(' ', '+');

    const baseURL = `https://www.omdbapi.com/?s=${searchMovieTemplate}&type=movie&apikey=${CONFIG.OMDB_API_KEY}`; //&apikey=${CONFIG.OMDB_API_KEY}
    const response = await fetch(baseURL);
    const data = await response.json();

    if (data.Response === 'False') {
      throw Error(data.Error);
    }

    return data;
  } catch (err) {
    console.error(err.message);

    return [];
  }
}

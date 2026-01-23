import { renderMovies } from '../components/renderMovies.js';
import { getMoviesWithDetailsBySearch, mergeMoviesWithWatchlist } from '../services/movies.js';
import { loadWatchlist } from '../watchlist.js';
import { loadRandomHeroImage } from '../services/unsplashAPI.js';

const searchForm = document.getElementById('form-search-movie');

// set hero background image
loadRandomHeroImage('hero');

// ------------ EVENT LISTENER ------------
searchForm.addEventListener('submit', handleMovieSearch);

async function handleMovieSearch(e) {
  e.preventDefault();

  // clear movies storage
  // clearMovies();

  // get the movie name
  const movie = e.target.search.value.trim();

  // Get the movies with all the data and get the watchlist
  const moviesOMDB = await getMoviesWithDetailsBySearch(movie);
  const watchlist = loadWatchlist();
  const moviesWithWatchlistStatus = mergeMoviesWithWatchlist(moviesOMDB, watchlist);

  // render
  renderMovies(moviesWithWatchlistStatus, 'index');
}

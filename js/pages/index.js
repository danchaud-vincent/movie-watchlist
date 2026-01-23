import { renderMovies } from '../components/renderMovies.js';
import { getMoviesWithDetailsBySearch, loadMovies, mergeMoviesWithWatchlist } from '../services/moviesService.js';
import { loadWatchlist, toggleMovieInWatchlist } from '../services/watchlistService.js';
import { loadRandomHeroImage } from '../services/unsplashService.js';

const searchForm = document.getElementById('form-search-movie');

// set hero background image
loadRandomHeroImage('hero');

// ------------ EVENT LISTENER ------------
searchForm.addEventListener('submit', handleMovieSearch);
document.addEventListener('click', handleGlobalClick);

function handleGlobalClick(e) {
  if (e.target.classList.contains('watchlist-btn')) {
    handleToggleMovieInWatchlist(e);
  }
}

function handleToggleMovieInWatchlist(e) {
  const movieContainer = e.target.closest('.movie-container');
  const movieId = movieContainer.dataset.movieId;
  const currentMovies = loadMovies();

  const movie = currentMovies.find((m) => m.imdbID === movieId);

  if (!movie) {
    return;
  }

  const updatedWatchlist = toggleMovieInWatchlist(movie);

  // render the movies updated
  const updatedMovies = mergeMoviesWithWatchlist(currentMovies, updatedWatchlist);

  // render movies
  renderMovies(updatedMovies, 'index');
}

async function handleMovieSearch(e) {
  e.preventDefault();

  // get the movie name
  const movie = e.target.search.value.trim();

  // Get the movies with all the data and get the watchlist
  const moviesOMDB = await getMoviesWithDetailsBySearch(movie);
  const watchlist = loadWatchlist();
  const moviesWithWatchlistStatus = mergeMoviesWithWatchlist(moviesOMDB, watchlist);

  // render
  renderMovies(moviesWithWatchlistStatus, 'index');
}

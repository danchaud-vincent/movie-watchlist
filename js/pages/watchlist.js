import { loadRandomHeroImage } from '../services/unsplashService.js';
import { renderMovies } from '../components/renderMovies.js';
import { loadWatchlist, toggleMovieInWatchlist } from '../services/watchlistService.js';

// set hero background image
loadRandomHeroImage('hero');

// render the watchlist
const watchlist = loadWatchlist();
renderMovies(watchlist, 'watchlist');

// ------------ EVENT LISTENER ------------
document.addEventListener('click', handleGlobalClick);

function handleGlobalClick(e) {
  if (e.target.classList.contains('watchlist-btn')) {
    handleToggleMovieInWatchlist(e);
  }
}

function handleToggleMovieInWatchlist(e) {
  const movieContainer = e.target.closest('.movie-container');
  const movieId = movieContainer.dataset.movieId;

  const currentWatchlist = loadWatchlist();

  const movie = currentWatchlist.find((m) => m.imdbID === movieId);

  if (!movie) {
    return;
  }

  const updatedWatchlist = toggleMovieInWatchlist(movie);

  // render movies
  renderMovies(updatedWatchlist, 'watchlist');
}

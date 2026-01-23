import { loadRandomHeroImage } from '../services/unsplashService.js';
import { renderMovies } from '../components/renderMovies.js';
import { loadWatchlist, toggleMovieInWatchlist } from '../services/watchlistService.js';
import { handleReadMoreClick } from '../handlers/readmoreClick.js';
import { updateMovieWatchlistUI } from '../components/updateMovieWatchlist.js';

// set hero background image
loadRandomHeroImage('hero');

// render the watchlist
const watchlist = loadWatchlist();
renderMovies(watchlist, 'watchlist');

// ------------ EVENT LISTENER ------------
document.addEventListener('click', handleGlobalClick);

function handleGlobalClick(e) {
  if (e.target.classList.contains('readmore-btn')) {
    handleReadMoreClick(e);
  }

  if (e.target.classList.contains('watchlist-btn')) {
    handleToggleMovieInWatchlist(e);
  }
}

function handleToggleMovieInWatchlist(e) {
  const movieContainer = e.target.closest('.movie-container');
  const movieId = movieContainer.dataset.movieId;

  const currentWatchlist = loadWatchlist();

  const movieData = currentWatchlist.find((m) => m.imdbID === movieId);

  if (!movieData) {
    return;
  }

  const isInWatchlist = toggleMovieInWatchlist(movieId, movieData);

  // render movies
  updateMovieWatchlistUI(movieContainer, isInWatchlist);
}

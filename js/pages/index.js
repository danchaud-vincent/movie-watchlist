import { renderMovies } from '../components/renderMovies.js';
import {
  getMoviesWithDetailsBySearch,
  loadMovies,
  mergeMoviesWithWatchlist,
  clearMovies,
} from '../services/moviesService.js';
import { loadWatchlist, toggleMovieInWatchlist, clearWatchlist } from '../services/watchlistService.js';
import { loadRandomHeroImage } from '../services/unsplashService.js';
import { handleReadMoreClick } from '../handlers/readmoreClick.js';
import { updateMovieWatchlistUI } from '../components/updateMovieWatchlist.js';

const searchForm = document.getElementById('form-search-movie');

// set hero background image

loadRandomHeroImage('hero');

// ------------ EVENT LISTENER ------------
searchForm.addEventListener('submit', handleMovieSearch);
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
  const currentMovies = loadMovies();

  const movieData = currentMovies.find((m) => m.imdbID === movieId);

  if (!movieData) {
    return;
  }

  const isInWatchlist = toggleMovieInWatchlist(movieId, movieData);

  updateMovieWatchlistUI(movieContainer, isInWatchlist);
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

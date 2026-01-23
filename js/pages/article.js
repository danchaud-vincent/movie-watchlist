import { getMovieById, loadMovies } from '../services/moviesService.js';
import { createGenresHtml, createWatchlistButton } from '../components/movieCard.js';
import { truncateTextToggle } from '../pipes/truncatePipe.js';
import { handleReadMoreClick } from '../handlers/readmoreClick.js';
import { toggleMovieInWatchlist, loadWatchlist } from '../services/watchlistService.js';
import { updateMovieWatchlistUI } from '../components/updateMovieWatchlist.js';

getMovieData();

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
  const currentMovies = loadMovies();

  const movieData = currentMovies.find((m) => m.imdbID === movieId);

  if (!movieData) {
    return;
  }

  const isInWatchlist = toggleMovieInWatchlist(movieId, movieData);

  updateMovieWatchlistUI(movieContainer, isInWatchlist);
}

// ----------- RENDER ----------------
async function getMovieData() {
  const params = new URLSearchParams(document.location.search);
  const movieId = params.get('id');

  if (!movieId) return;

  const movie = await getMovieById(movieId);

  articleData(movie);
}

function articleData(movie) {
  // set movie id in data attribute
  const movieContainer = document.getElementById('movie-container');
  movieContainer.setAttribute('data-movie-id', movie.imdbID);

  // set movie details in sections
  document.getElementById('movie-poster').src = movie.Poster;
  document.getElementById('movie-title').textContent = movie.Title;
  document.getElementById('movie-rating').textContent += movie.imdbRating;
  document.getElementById('movie-genres').innerHTML = createGenresHtml(movie.Genre);
  document.getElementById('movie-watchlist').innerHTML = createWatchlistButton(movie.isSubscribed);

  // Set movie plot and data attribute plot
  const moviePlot = document.getElementById('movie-plot');
  moviePlot.textContent = movie.Plot;
  moviePlot.setAttribute('data-fulltext', movie.Plot);

  // truncate the plot text if needed
  truncateTextToggle(document.querySelector('.movie-plot'));

  // Set watchlist button
  const watchlist = loadWatchlist();
  const isSubscribed = watchlist.some((m) => m.imdbID === movie.imdbID);
  document.getElementById('movie-watchlist').innerHTML = createWatchlistButton(isSubscribed);
}

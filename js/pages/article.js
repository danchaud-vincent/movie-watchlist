import { getMovieById } from '../services/moviesService.js';
import { createGenresHtml, createWatchlistButton } from '../components/movieCard.js';
import { truncateTextToggle } from '../pipes/truncatePipe.js';
import { handleReadMoreClick } from '../handlers/readmoreClick.js';

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

// ----------- RENDER ----------------
async function getMovieData() {
  const params = new URLSearchParams(document.location.search);
  const movieId = params.get('id');

  if (!movieId) return;

  const movie = await getMovieById(movieId);
  console.log(movie);
  articleData(movie);
}

function articleData(movie) {
  document.getElementById('movie-poster').src = movie.Poster;
  document.getElementById('movie-title').textContent = movie.Title;
  document.getElementById('movie-rating').textContent += movie.imdbRating;
  document.getElementById('movie-genres').innerHTML = createGenresHtml(movie.Genre);
  document.getElementById('movie-watchlist').innerHTML = createWatchlistButton(movie.isSubscribed);

  // Set movie plot
  const moviePlot = document.getElementById('movie-plot');
  moviePlot.textContent = movie.Plot;
  moviePlot.setAttribute('data-fulltext', movie.Plot);
  truncateTextToggle(document.querySelector('.movie-plot'));
}

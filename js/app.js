import {
  getMoviesWithDetailsBySearch,
  loadMovies,
  clearMovies,
  forkJoinMovies,
  getMovieByIdFromStorage,
  getMovieById,
} from './services/movies.js';
import { truncateTextToggle } from './pipes/truncatePipe.js';
import { toggleMovieInWatchlist, loadWatchlist } from './watchlist.js';
import { loadRandomHeroImage } from './services/unsplashAPI.js';

loadRandomHeroImage('hero');

const searchForm = document.getElementById('form-search-movie');

// ------------ EVENT LISTENER ------------
if (searchForm) {
  searchForm.addEventListener('submit', handleMovieSearch);
} else {
  const watchlist = loadWatchlist();
  console.log(watchlist);
  renderMovies(watchlist);
}

document.addEventListener('click', handleGlobalClick);

// ------------ Handle click ------------
function handleGlobalClick(e) {
  if (e.target.classList.contains('readmore-btn')) {
    handleReadMoreClick(e);
  }

  if (e.target.classList.contains('watchlist-btn')) {
    handleWatchlistClick(e);
  }
}

function handleReadMoreClick(e) {
  const moviePlotEl = e.target.closest('.movie-plot');
  truncateTextToggle(moviePlotEl, 100);
}

function handleWatchlistClick(e) {
  // get the movie container and retrieve the movie id
  const movieContainer = e.target.closest('.movie-container');
  const movieId = movieContainer.dataset.movieId;

  handleToggleMovieInWatchlist(movieId);
}

async function handleMovieSearch(e) {
  e.preventDefault();

  // clear movies storage
  clearMovies();

  // get the movie name
  const movie = e.target.search.value.trim();

  // Get the movies with all the data and get the watchlist
  const moviesOMDB = await getMoviesWithDetailsBySearch(movie);
  const watchlist = loadWatchlist();

  // render
  renderMovies(forkJoinMovies(moviesOMDB, watchlist));
}

async function handleToggleMovieInWatchlist(movieId) {
  // Get the movie data
  const movie = await getMovieById(movieId);

  if (!movie) {
    return;
  }

  // update watchlist by adding or removing the movie from the list
  const watchlist = toggleMovieInWatchlist(movie);

  if (window.location.href.includes('index.html')) {
    // load movies and update data with new watchlist
    const movies = loadMovies();
    const moviesUpdated = forkJoinMovies(movies, watchlist);

    // render movies
    renderMovies(moviesUpdated);
  } else {
    // render watchlist
    renderMovies(watchlist);
  }
}

// ------------ DOM ------------
function renderMovies(movies) {
  const container = document.getElementById('movies');

  if (!movies.length) {
    container.innerHTML = getEmptyStateHtml();
    return;
  }

  container.innerHTML = movies.map((movie) => createMovieCard(movie)).join('');

  // init plots
  document.querySelectorAll('.movie-plot').forEach((plot) => {
    truncateTextToggle(plot, 100);
  });
}

function getEmptyStateHtml() {
  return `
      <div class="warning-container">
        <img class='warning-icon' src="/assets/images/movie-icon.png" alt="movie icon">
        <p class='warning-content'>Unable to find what you're looking for. Please try another search.</p>
      </div>
    `;
}

function createMovieCard(movie) {
  return `
    <div class="movie-container" data-movie-id=${movie.imdbID}>
      <img alt="movie poster" src="${movie.Poster}">
      <div class="movie-content">
        <div class="movie-header">
          <h2>${movie.Title}</h2> 
        </div>
        <div class="movie-description">
          <p class="no-shrink">⭐ ${movie.imdbRating}</p>
          <p class="no-shrink">${movie.Runtime}</p>
        </div>
        <div class="movie-genres">
          ${createGenresHtml(movie.Genre)}
        </div>
        <button class="watchlist-btn">${createWatchlistButton(movie.isSubscribed)}</button>
        <div class="movie-plot">
          <span class="plot-text" data-truncated="false" data-fulltext="${movie.Plot}">${movie.Plot}</span>
          <button class="readmore-btn"></button>
        </div>
      </div>
    </div>
    `;
}

function createGenresHtml(genres) {
  return genres
    .trim()
    .split(',')
    .map((genre) => `<p class="genre">${genre.trim()}</p>`)
    .join('');
}

function createWatchlistButton(isSubscribed) {
  return isSubscribed ? `<i class="fa-solid fa-minus"></i> Remove` : `<i class="fa-solid fa-plus"></i> Watchlist`;
}

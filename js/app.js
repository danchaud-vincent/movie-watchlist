import {
  getMoviesWithDetailsBySearch,
  loadMovies,
  clearMovies,
  mergeMoviesWithWatchlist,
  getMovieByIdFromStorage,
} from './services/movies.js';
import { truncateTextToggle } from './pipes/truncatePipe.js';
import { toggleMovieInWatchlist, loadWatchlist, clearWatchlist } from './watchlist.js';
import { loadRandomHeroImage } from './services/unsplashAPI.js';

const PAGE_TYPES = {
  INDEX: 'index',
  WATCHLIST: 'watchlist',
};

const EMPTY_STATE_TEXT = {
  [PAGE_TYPES.INDEX]: "Unable to find what you're looking for. Please try another search.",
  [PAGE_TYPES.WATCHLIST]: 'Your watchlist is looking a little empty...',
};

loadRandomHeroImage('hero');

const searchForm = document.getElementById('form-search-movie');

// ------------ EVENT LISTENER ------------
if (searchForm) {
  searchForm.addEventListener('submit', handleMovieSearch);
} else {
  const watchlist = loadWatchlist();
  renderMovies(watchlist, PAGE_TYPES.WATCHLIST);
}

document.addEventListener('click', handleGlobalClick);

// ------------ Handle click ------------
function handleGlobalClick(e) {
  if (e.target.classList.contains('readmore-btn')) {
    handleReadMoreClick(e);
  }

  if (e.target.classList.contains('watchlist-btn')) {
    handleToggleMovieInWatchlist(e);
  }
}

function handleReadMoreClick(e) {
  const moviePlotEl = e.target.closest('.movie-plot');
  truncateTextToggle(moviePlotEl, 100);
}

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
  renderMovies(moviesWithWatchlistStatus, PAGE_TYPES.INDEX);
}

function handleToggleMovieInWatchlist(e) {
  // get the movie container and retrieve the movie id
  const movieContainer = e.target.closest('.movie-container');
  const movieId = movieContainer.dataset.movieId;

  // Get the movie data
  const movie = getMovieByIdFromStorage(movieId);

  if (!movie) {
    return;
  }

  // update watchlist by adding or removing the movie from the list
  const watchlist = toggleMovieInWatchlist(movie);

  if (window.location.href.includes('index.html')) {
    // load movies and update data with new watchlist
    const movies = loadMovies();
    const moviesWithWatchlistStatus = mergeMoviesWithWatchlist(movies, watchlist);

    // render movies
    renderMovies(moviesWithWatchlistStatus, PAGE_TYPES.INDEX);
  } else {
    // render watchlist
    renderMovies(watchlist, PAGE_TYPES.WATCHLIST);
  }
}

// ------------ DOM ------------
function renderMovies(movies, pageType = PAGE_TYPES.INDEX) {
  const container = document.getElementById('movies');

  if (!movies.length) {
    getEmptyStateHtml(pageType);
    return;
  }

  container.innerHTML = movies.map((movie) => createMovieCard(movie)).join('');

  // init plots
  document.querySelectorAll('.movie-plot').forEach((plot) => {
    truncateTextToggle(plot, 100);
  });
}

function getEmptyStateHtml(pageType) {
  const messageContainer = document.getElementById('message-container');

  messageContainer.querySelector('.message-content').textContent = EMPTY_STATE_TEXT[pageType];
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
    .split(',')
    .map((genre) => `<p class="genre">${genre}</p>`)
    .join('');
}

function createWatchlistButton(isSubscribed) {
  return isSubscribed ? `<i class="fa-solid fa-minus"></i> Remove` : `<i class="fa-solid fa-plus"></i> Watchlist`;
}

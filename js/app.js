import { CONFIG } from '/config/main-config.js';
import {
  getMoviesWithDetailsBySearch,
  loadMovies,
  saveMovies,
  clearMovies,
  forkJoinMovies,
} from './services/movies.js';
import { truncateTextToggle } from './pipes/truncatePipe.js';
import { toggleMovieInWatchlist, clearWatchlist, loadWatchlist } from './watchlist.js';

clearMovies();
clearWatchlist();
getBackgroundPhoto();

// EVENT LISTENER
document.getElementById('form-search-movie').addEventListener('submit', handleMovieSearch);

document.addEventListener('click', (e) => {
  // Event listener when readmore button triggered
  if (e.target.classList.contains('readmore-btn')) {
    const moviePlotEl = e.target.closest('.movie-plot');
    truncateTextToggle(moviePlotEl, 100);
  }

  // Event listener when click watchlist button
  if (e.target.classList.contains('watchlist-btn')) {
    const movieContainer = e.target.closest('.movie-container');
    const movieId = movieContainer.dataset.movieId;
    const movies = loadMovies();
    const movie = movies.filter((movie) => movie.imdbID === movieId)[0];

    toggleMovieInWatchlist(movie);

    const watchlist = loadWatchlist();
    const moviesUpdated = forkJoinMovies(movies, watchlist);

    // save in localstorage
    saveMovies(moviesUpdated);

    renderMovies(moviesUpdated);
  }
});

// ======== RENDER ========
function renderMovies(movies) {
  let html = '';

  if (movies.length === 0) {
    html = `
      <div class="warning-container">
        <img class='warning-icon' src="/assets/images/movie-icon.png" alt="movie icon">
        <p class='warning-content'>Unable to find what you're looking for. Please try another search.</p>
      </div>
    `;
  }

  movies.forEach((movie) => {
    let genresHtml = '';
    const genres = movie.Genre.trim().split(',');
    genres.forEach((genre) => {
      genresHtml += `<p class="genre">${genre.trim()}</p>`;
    });

    let btnWatchlist = movie.isSubscribed
      ? `<i class="fa-solid fa-minus"></i> Remove`
      : `<i class="fa-solid fa-plus"></i> Watchlist`;

    html += `
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
          ${genresHtml}
        </div>
        <button class="watchlist-btn">${btnWatchlist}</button>
        <div class="movie-plot">
          <span class="plot-text" data-truncated="false" data-fulltext="${movie.Plot}">${movie.Plot}</span>
          <button class="readmore-btn"></button>
        </div>
      </div>
    </div>
    `;
  });

  // render HTML
  document.getElementById('movies').innerHTML = html;
  document.querySelectorAll('.movie-plot').forEach((plot) => {
    truncateTextToggle(plot, 100);
  });
}

//  ========= FUNCTIONS ===================
function setHeaderPhoto(imageURL) {
  document.getElementById('hero').style.backgroundImage = ` url(${imageURL})`;
}

async function getBackgroundPhoto() {
  try {
    // get a random movie image with the unsplash API
    const baseURL = `https://api.unsplash.com/photos/random/!!!?query=movie`;

    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Client-ID ${CONFIG.UNSLPASH_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw Error('An error occured : Unsplash image not found');
    }

    const data = await response.json();
    const imageUnsplash = data.urls.regular;

    // set the background image
    // setHeaderPhoto(imageUnsplash);
  } catch (err) {
    console.log(err.message);

    // set default header image
    const defaultBackgroundImage = '/assets/images/movies-poster.jpg';
    setHeaderPhoto(defaultBackgroundImage);
  }
}

async function handleMovieSearch(e) {
  e.preventDefault();

  // get the movies with details
  const movie = e.target.search.value;
  const moviesOMDB = await getMoviesWithDetailsBySearch(movie);
  const watchlist = loadWatchlist();

  const movies = forkJoinMovies(moviesOMDB, watchlist);

  // save in localstorage
  saveMovies(movies);

  // render
  renderMovies(movies);
}

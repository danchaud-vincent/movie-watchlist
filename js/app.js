import { CONFIG } from '/config/main-config.js';
import { getMoviesBySearch, setMoviesInformation } from '/js/movies.js';
import { truncateTextToggle } from './truncatePipe.js';

getBackgroundPhoto();

// EVENT LISTENER
document.getElementById('form-search-movie').addEventListener('submit', handleMovieSearch);

document.addEventListener('click', (e) => {
  // Event listener when readmore button triggered
  if (e.target.classList.contains('readmore-btn')) {
    const moviePlotEl = e.target.closest('.movie-plot');
    truncateTextToggle(moviePlotEl, 100);
  }
});

// ======== RENDER ========

function renderMovies(movies) {
  let html = '';

  if (movies.length === 0) {
    html = "Unable to find what you're looking for. Please try another search.";
    return;
  }

  movies.forEach((movie) => {
    html += `
    <div class="movie-container">
      <img alt="movie poster" src="${movie.Poster}">
      <div class="movie-content">
        <div class="movie-header">
          <h2>${movie.Title}</h2> 
        </div>
        <div class="movie-description">
          <p class="no-shrink">⭐ ${movie.imdbRating}</p>
          <p class="no-shrink">${movie.Runtime}</p>
          <p>${movie.Genre}</p>
        </div>
        <div class="movie-plot">
          <span class="plot-text" data-truncated="false" data-fulltext="${movie.Plot}">${movie.Plot}</span>
          <button class="readmore-btn"></button>
        </div>
      </div>
    </div>
    `;
  });

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
  const movie = e.target.search.value;
  const moviesOMDB = await getMoviesBySearch(movie);
  const movies = await setMoviesInformation(moviesOMDB);

  renderMovies(movies);
}

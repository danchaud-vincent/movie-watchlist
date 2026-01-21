import { CONFIG } from '/config/main-config.js';
import { getMoviesBySearch, setMoviesInformation } from '/js/movies.js';

getBackgroundPhoto();

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

// EVENT LISTENER
document.getElementById('form-search-movie').addEventListener('submit', handleMovieSearch);

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
          <p>${movie.imdbRating}</p>
        </div>
        <div class="movie-description">
          <p>${movie.Runtime}</p>
          <p>${movie.Genre}</p>
        </div>
        <p class="movie-plot">${movie.Plot}</p>
      </div>
    </div>
    `;
  });
  console.log(html);

  document.getElementById('movies').innerHTML = html;
}

async function handleMovieSearch(e) {
  e.preventDefault();
  const movie = e.target.search.value;
  const moviesOMDB = await getMoviesBySearch(movie);
  const movies = await setMoviesInformation(moviesOMDB);

  console.log(movies);

  renderMovies(movies);
}
